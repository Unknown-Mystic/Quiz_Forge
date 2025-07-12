import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CirclesWithBar } from 'react-loader-spinner';
import './App.css';

function StudentDashboard() {
  const username = localStorage.getItem('quiz_username') || 'User';
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('quiz_user_token');
    const role = localStorage.getItem('quiz_user_role');
    if (!token || role !== 'student') {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !subject) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('subject', subject);
    formData.append('name', username);
    formData.append('id', localStorage.getItem('quiz_user_token') || 'unknown');

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const rawQs = Array.isArray(data.questions) ? data.questions.slice(0, 10) : [];
      setQuestions(rawQs);
      setAnswers(Array(rawQs.length).fill(''));
      setSubmitted(false);
      setScore(null);
    } catch (error) {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleEvaluate = async () => {
    try {
      const payload = {
        studentAnswers: answers,
        correctAnswers: questions.map((q) => q.answer || ''),
      };

      const response = await fetch('http://127.0.0.1:5000/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setScore(result.score);
      setSubmitted(true);
    } catch (err) {}
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome, {username}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={styles.dropdown}
          >
            <option value="">Select Subject</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            style={styles.fileInput}
          />
          <button type="submit" style={styles.generateBtn}>
            Generate Quiz
          </button>
        </form>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CirclesWithBar height="100" width="100" color="#00e5ff" visible={true} />
          </div>
        ) : (
          questions.length > 0 && (
            <div style={styles.section}>
              <h2 style={{ textAlign: 'center' }}>Generated Questions</h2>
              {questions.map((q, i) => (
                <div key={i} style={styles.quizCard}>
                  <p><strong>Q{i + 1}:</strong> {q.question}</p>
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={answers[i] || ''}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    style={styles.answerInput}
                  />
                  {submitted && (
                    <p style={styles.correctAnswer}>
                      <strong>Correct Answer:</strong> {q.answer || '[Not Available]'}
                    </p>
                  )}
                </div>
              ))}
              {!submitted && (
                <button onClick={handleEvaluate} style={styles.submitBtn}>
                  Submit Answers
                </button>
              )}
              {submitted && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ textAlign: 'center' }}>
                    You scored: {score} / {questions.length}
                  </h3>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 10px',
    color: '#fff',
    minHeight: '100vh',
    backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url("/assets/dashboard-bg.jpg")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  wrapper: {
    maxWidth: '800px',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.4)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px'
  },
  dropdown: {
    padding: '10px',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #888'
  },
  fileInput: {
    padding: '10px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #888',
    borderRadius: '5px'
  },
  generateBtn: {
    backgroundColor: '#00e5ff',
    color: '#000',
    fontWeight: 'bold',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    alignSelf: 'center'
  },
  section: {
    marginTop: '20px'
  },
  quizCard: {
    background: 'rgba(30, 30, 30, 0.85)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  answerInput: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  correctAnswer: {
    marginTop: '10px',
    color: '#00ff99'
  },
  submitBtn: {
    backgroundColor: '#00ff99',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    marginTop: '20px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

export default StudentDashboard;
