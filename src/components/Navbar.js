import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('quiz_user_role');
  const username = localStorage.getItem('quiz_user_token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav style={{ background: '#333', color: '#fff', padding: '10px' }}>
      <span style={{ fontWeight: 'bold' }}>QuizForge</span>
      {username && (
        <>
          <span style={{ marginLeft: '20px' }}>Hello, {username} ({role})</span>
          <button onClick={handleLogout} style={{ float: 'right' }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
