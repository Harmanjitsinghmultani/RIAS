import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Function to register a user
export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Function to login a user
export const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);  // Ensure your backend has this endpoint
};
