import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{
      height: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      {/* ✅ Using logo from public folder */}
      <img 
        src="/logo.png" 
        alt="QuizForge Logo" 
        style={{ 
          width: 120,
          height: 120,
          marginBottom: 20,
          borderRadius: '20px',       
          objectFit: 'cover',     
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'  
       }} 
     />

      
      <h1 style={{ marginBottom: 40, fontSize: '3rem' }}>Welcome to QuizForge</h1>

      <div style={{ display: 'flex', gap: 20 }}>
        <Link to="/login">
          <button style={buttonStyle}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={buttonStyle}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: '#00e5ff',
  border: 'none',
  padding: '12px 30px',
  borderRadius: '8px',
  fontWeight: 'bold',
  color: '#000',
  fontSize: '16px',
  cursor: 'pointer',
  transition: '0.3s',
};

export default Home;
