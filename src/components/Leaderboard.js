// src/Leaderboard.js
import React, { useEffect, useState } from 'react';

const SUBJECTS = ['Physics', 'Chemistry', 'Biology', 'Computer Science'];

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [subject, setSubject] = useState('');

  const fetchLeaderboard = async (subject = '') => {
    try {
      const url = subject
        ? `http://127.0.0.1:5000/leaderboard/${subject}`
        : 'http://127.0.0.1:5000/leaderboard';
      const res = await fetch(url);
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('❌ Failed to fetch leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleSubjectChange = (e) => {
    const selected = e.target.value;
    setSubject(selected);
    fetchLeaderboard(selected);
  };

  return (
    <div style={styles.container}>
      <h1>📊 Leaderboard</h1>

      <select value={subject} onChange={handleSubjectChange} style={styles.dropdown}>
        <option value="">General Leaderboard</option>
        {SUBJECTS.map((subj) => (
          <option key={subj} value={subj}>
            {subj}
          </option>
        ))}
      </select>

      <div style={styles.leaderboardBox}>
        {leaderboard.length === 0 ? (
          <p>No data available.</p>
        ) : (
          leaderboard.map(([name, score], index) => (
            <div key={index} style={styles.entry}>
              <strong>{index + 1}. {name}</strong> — {score} marks
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    color: '#fff',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
  },
  dropdown: {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '30px',
    fontSize: '16px',
  },
  leaderboardBox: {
    backgroundColor: '#1c1c1c',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  entry: {
    backgroundColor: '#2a2a2a',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '10px',
  },
};

export default Leaderboard;
