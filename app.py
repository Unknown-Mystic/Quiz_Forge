from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import os
import uuid
import json
from datetime import datetime
import re
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from pdf2image import convert_from_bytes

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# Constants
USERS_FILE = 'users.json'
LOG_FILE = 'student_quiz_logs.json'
MODEL_PATH = "C:/Users/gowri/Desktop/intel/lmqg_t5_qg_ae_model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

for file in [USERS_FILE, LOG_FILE]:
    if not os.path.exists(file):
        with open(file, 'w') as f:
            json.dump([] if file == LOG_FILE else {}, f)

def clean_text(text):
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        line = line.strip()
        if not line or len(line) < 5:
            continue
        if any(kw in line.lower() for kw in ['vedantu', 'class xi', 'class xii', 'www.', '.com', 'image:', 'chapter']):
            continue
        line = re.sub(r'[^\w\s.,!?-]', '', line)
        cleaned.append(line)
    return " ".join(cleaned)

def generate_qna(context, num_questions=10):
    prompt_q = f"generate question: {context}"
    input_ids_q = tokenizer(prompt_q, return_tensors="pt", truncation=True, max_length=512).input_ids

    output_ids_q = model.generate(
        input_ids_q,
        max_length=128,
        num_return_sequences=num_questions,
        num_beams=num_questions,
        early_stopping=True
    )

    questions = [tokenizer.decode(out, skip_special_tokens=True).strip() for out in output_ids_q]

    results = []
    for q in questions:
        try:
            answer = qa_pipeline(question=q, context=context)['answer']
            if not answer or answer.lower() == q.lower() or answer.strip() == '':
                answer = "Answer not available"
        except:
            answer = "Answer not available"
        results.append({"question": q, "answer": answer})

    return results

def load_users():
    with open(USERS_FILE) as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username, password, role, code = data.get('username'), data.get('password'), data.get('role'), data.get('code')
    if not all([username, password, role]):
        return jsonify({'error': 'Missing fields'}), 400
    if role == 'teacher' and code != "QuizGen":
        return jsonify({'error': 'Invalid teacher signup code'}), 403
    users = load_users()
    if username in users:
        return jsonify({'error': 'User already exists'}), 400
    users[username] = {'password': password, 'role': role}
    save_users(users)
    return jsonify({'success': True, 'token': str(uuid.uuid4()), 'role': role})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    users = load_users()
    user = users.get(username)
    if user and user['password'] == password:
        return jsonify({'success': True, 'token': str(uuid.uuid4()), 'role': user['role']})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/upload', methods=['POST'])
def upload():
    student_name = request.form.get('name', 'Unknown')
    student_id = request.form.get('id', str(uuid.uuid4())[:8])
    subject = request.form.get('subject', 'Unknown')

    try:
        file = request.files.get('pdf') or request.files.get('image') or next(iter(request.files.values()), None)
        if not file:
            return jsonify({'error': 'No file provided'}), 400

        filename = file.filename.lower()
        raw_text = ""

        if filename.endswith('.pdf'):
            images = convert_from_bytes(file.read())
            for page in images:
                raw_text += pytesseract.image_to_string(page) + "\n"
        elif filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
            img = Image.open(file.stream)
            raw_text = pytesseract.image_to_string(img)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        cleaned = clean_text(raw_text)
        questions = generate_qna(cleaned)

        log_entry = {
            'student_name': student_name,
            'student_id': student_id,
            'subject': subject,
            'timestamp': datetime.now().isoformat(),
            'marks': len(questions),
            'questions': questions
        }

        with open(LOG_FILE, 'r+', encoding='utf-8') as f:
            data = json.load(f)
            data.append(log_entry)
            f.seek(0)
            json.dump(data, f, indent=2, ensure_ascii=False)

        return jsonify({'questions': questions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    student_answers = data.get('studentAnswers', [])
    correct_answers = data.get('correctAnswers', [])

    def normalize(t): return re.sub(r'\W+', '', t.strip().lower())
    score = sum(normalize(s) == normalize(c) for s, c in zip(student_answers, correct_answers))
    return jsonify({'score': score})

@app.route('/student_quizzes', methods=['GET'])
def student_quizzes():
    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            logs = json.load(f)
        return jsonify({'quizzes': logs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            logs = json.load(f)
        leaderboard = {}
        for entry in logs:
            name = entry['student_name']
            leaderboard[name] = leaderboard.get(name, 0) + entry['marks']
        sorted_board = sorted(leaderboard.items(), key=lambda x: x[1], reverse=True)
        return jsonify({'leaderboard': sorted_board})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/leaderboard/<subject>', methods=['GET'])
def subject_leaderboard(subject):
    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            logs = json.load(f)
        leaderboard = {}
        for entry in logs:
            if entry.get('subject') == subject:
                name = entry['student_name']
                leaderboard[name] = leaderboard.get(name, 0) + entry['marks']
        sorted_board = sorted(leaderboard.items(), key=lambda x: x[1], reverse=True)
        return jsonify({'leaderboard': sorted_board})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
