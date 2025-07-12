import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const navigate = useNavigate();

  const username = localStorage.getItem('quiz_username') || 'User';

  useEffect(() => {
    const token = localStorage.getItem('quiz_user_token');
    const role = localStorage.getItem('quiz_user_role');
    if (!token || role !== 'teacher') {
      navigate('/login');
    }

    fetchQuizzes();
    fetchLeaderboard();
  }, [navigate]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/student_quizzes');
      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const url = selectedSubject
        ? `http://127.0.0.1:5000/leaderboard/${selectedSubject}`
        : 'http://127.0.0.1:5000/leaderboard';

      const response = await fetch(url);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedSubject]);

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome, {username}</h2>

      <div style={{ ...styles.box, marginBottom: '30px' }}>
        <label style={{ fontWeight: 'bold' }}>Filter Leaderboard by Subject: </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">All Subjects</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Computer Science">Computer Science</option>
        </select>
      </div>

      <div style={styles.box}>
        <h2>Leaderboard</h2>
        <ol>
          {leaderboard.map(([name, score], index) => (
            <li key={index}>
              {name}: {score} pts
            </li>
          ))}
        </ol>
      </div>

      <div style={styles.box}>
        <h2>All Student Quizzes</h2>
        {quizzes.length === 0 && <p>No quizzes submitted yet.</p>}
        {quizzes.map((quiz, idx) => (
          <div key={idx} style={styles.card}>
            <p><strong>Name:</strong> {quiz.student_name}</p>
            <p><strong>ID:</strong> {quiz.student_id}</p>
            <p><strong>Subject:</strong> {quiz.subject}</p>
            <p><strong>Score:</strong> {quiz.marks}</p>
            <p><strong>Date:</strong> {new Date(quiz.timestamp).toLocaleString()}</p>
            <details>
              <summary style={{ cursor: 'pointer' }}>View Questions</summary>
              <ul>
                {quiz.questions.map((q, i) => (
                  <li key={i}>
                    <strong>Q{i + 1}:</strong> {q.question} <br />
                    <strong>Answer:</strong> {q.answer}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 40,
    minHeight: '100vh',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/dashboard-bg.jpg")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    color: '#fff',
  },
  dropdown: {
    padding: '8px',
    borderRadius: '5px',
    marginLeft: '10px',
    fontSize: '16px',
    background: '#1e1e1e',
    color: '#fff',
    border: '1px solid #666'
  },
  box: {
    background: 'rgba(0, 0, 0, 0.55)',
    padding: '25px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '30px',
    backdropFilter: 'blur(4px)'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    color: '#fff',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
  }
};

export default TeacherDashboard;
