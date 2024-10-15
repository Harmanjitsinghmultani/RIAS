import axios from 'axios';

export const getUsers = () => {
  return axios.get('/api/users', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const getFaculty = () => {
  return axios.get('/api/users/faculty', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};
