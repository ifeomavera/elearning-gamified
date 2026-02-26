// src/utils/api.js
import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'https://elearning-api-dr6r.onrender.com';

const api = axios.create({
  baseURL: `${base}/api`,        // ← This fixes the /api prefix
  timeout: 60000,
});

// Optional: auto-attach token (we’ll use it later)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;