# 🧠 QuizForge

**QuizForge** is an AI-powered quiz generator built using Flask (backend) and React (frontend). Upload notes or scanned PDFs/images, and QuizForge will generate high-quality quiz questions using machine learning models — ideal for **students** and **teachers**.

---

## 🚀 Features

- ✍️ Upload PDF or image files (notes, books, etc.)
- 🧠 Automatically generates quiz questions using AI
- 📸 OCR support using Tesseract for scanned documents
- 🔐 Student & Teacher login with role-based dashboards
- ✅ Instant quiz evaluation and scoring
- 🏆 Leaderboard by subject
- 🎨 Clean, responsive UI with dark background

---

## 📦 Tech Stack

| Layer     | Technology                                      |
|-----------|--------------------------------------------------|
| Frontend  | React.js, HTML/CSS                              |
| Backend   | Flask, Python, Transformers (HuggingFace)       |
| AI Models | `lmqg/t5-base-squad-qg-ae`, `distilbert-base-cased-distilled-squad` |
| OCR       | Tesseract OCR                                   |
| Storage   | Local JSON (prototype stage)                    |

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Unknown-Mystic/Quiz_Forge.git
cd Quiz_Forge
2️⃣ Set Up Python Virtual Environment (Backend)
bash
Copy
Edit
python -m venv venv
venv\Scripts\activate           # For Windows
# OR
source venv/bin/activate        # For macOS/Linux

pip install -r requirements.txt
3️⃣ (Optional) Download the Question Generation Model
Only required if models/lmqg_t5_qg_ae_model/ folder is not present.

Create and run a file named download_model.py with this code:

python
Copy
Edit
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_name = "lmqg/t5-base-squad-qg-ae"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

local_path = "models/lmqg_t5_qg_ae_model"
tokenizer.save_pretrained(local_path)
model.save_pretrained(local_path)
✅ Your folder structure should now look like:

arduino
Copy
Edit
models/
└── lmqg_t5_qg_ae_model/
    ├── config.json
    ├── tokenizer_config.json
    ├── pytorch_model.bin
    └── ...
4️⃣ Start the Flask Backend Server
bash
Copy
Edit
python app.py
This will start the backend server at:

cpp
Copy
Edit
http://127.0.0.1:5000
5️⃣ Start the React Frontend
bash
Copy
Edit
cd src
npm install
npm start
