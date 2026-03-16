import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// --- L'INTERCEPTEUR : La magie automatique ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('betna_token');
    if (token) {
      // Injecte automatiquement le token dans le header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;