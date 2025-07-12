// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, roleRequired }) {
  const token = localStorage.getItem('quiz_user_token');
  const role = localStorage.getItem('quiz_user_role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
