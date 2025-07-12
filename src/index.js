// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// ✅ Set body background image globally
document.body.style = `
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.75),
    rgba(255, 255, 255, 0.75)
  ), url("/dashboard-bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
