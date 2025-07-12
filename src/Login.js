import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem('quiz_user_token', data.token);
      localStorage.setItem('quiz_user_role', data.role);
      navigate(data.role === 'teacher' ? '/teacher' : '/student');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} style={formStyle}>
      <h2 style={headingStyle}>Login to QuizForge</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
      <button type="submit" style={buttonStyle}>Log In</button>
    </form>
  );
}

const formStyle = {
  maxWidth: '400px',
  margin: 'auto',
  padding: '2rem',
  marginTop: '5rem',
  background: '#1c1c1c',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #333',
  borderRadius: '6px',
  background: '#2e2e2e',
  color: '#fff',
};

const buttonStyle = {
  background: '#00e5ff',
  color: '#000',
  fontWeight: 'bold',
  padding: '10px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const headingStyle = { textAlign: 'center', color: '#00e5ff' };

export default Login;
