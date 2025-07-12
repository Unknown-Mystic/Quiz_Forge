import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const payload = { username, password, role };
    if (role === 'teacher') {
      payload.code = code;
    }

    const res = await fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      alert('Signup successful. You can log in now.');
      navigate('/login');
    } else {
      alert(data.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup} style={formStyle}>
      <h2 style={headingStyle}>Signup for QuizForge</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
      <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      {role === 'teacher' && (
        <input type="text" placeholder="Enter Secret Code" value={code} onChange={(e) => setCode(e.target.value)} style={inputStyle} required />
      )}
      <button type="submit" style={buttonStyle}>Sign Up</button>
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

export default Signup;
