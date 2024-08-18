import axios from 'axios';

// const API_URL = 'http://localhost:8000';  // Update this if your backend is on a different port
const API_URL = 'http://13.71.103.227/';  // Update this if your backend is on a different port

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;