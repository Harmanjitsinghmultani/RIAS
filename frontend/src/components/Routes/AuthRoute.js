import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    if (role === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    } else if (role === 'faculty') {
      return <Navigate to="/faculty-dashboard" />;
    } else if (role === 'student') {
      return <Navigate to="/student-dashboard" />;
    } else if (role === 'class-teacher') {
      return <Navigate to="/class-teacher" />;
    }
    
  }

  return element;
};

export default AuthRoute;
