import React, { useState } from 'react';

function Quiz({ lines }) {
  const [quiz, setQuiz] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    setQuiz('');

    try {
      const response = await fetch('http://localhost:5000/generate_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines })
      });

      const data = await response.json();

      if (data.quiz) {
        setQuiz(data.quiz);
      } else {
        setError('No quiz returned from server.');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError('Failed to generate quiz.');
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <button onClick={generateQuiz} style={{
        background: '#80d8ff',
        color: '#000',
        border: 'none',
        padding: '10px 20px',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Generate Quiz
      </button>

      {loading && <p style={{ color: '#ccc', marginTop: '10px' }}>Generating quiz...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {quiz && (
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          marginTop: '20px',
          borderRadius: '10px',
          color: '#fff',
          whiteSpace: 'pre-line'
        }}>
          <h3 style={{ color: '#00e5ff' }}>Quiz:</h3>
          {quiz}
        </div>
      )}
    </div>
  );
}

export default Quiz;
