import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const getMe = () => api.get('/auth/me');

// Generate
export const generateContent = (formData) =>
  api.post('/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });

// History
export const getHistory = () => api.get('/history');
export const getHistoryItem = (id) => api.get(`/history/${id}`);
export const deleteHistoryItem = (id) => api.delete(`/history/${id}`);

export default api;
