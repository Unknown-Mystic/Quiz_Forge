// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import PrivateRoute from './components/PrivateRoute';
import Leaderboard from './components/Leaderboard';

// ✅ Import the image directly
import backgroundImage from './assets/dashboard-bg.jpg';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/teacher" element={
        <PrivateRoute roleRequired="teacher">
          <TeacherDashboard />
        </PrivateRoute>
      } />
      <Route path="/student" element={
        <PrivateRoute roleRequired="student">
          <StudentDashboard />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
