import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically attach the saved JWT token to every request, if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meditrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
