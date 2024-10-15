import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'faculty') {
      navigate('/faculty');
    } else if (user.role === 'student') {
      navigate('/student');
    }
  }, [user, navigate]);

  return <div>Loading...</div>;
};

export default Dashboard;
