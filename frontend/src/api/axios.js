import axios from 'axios';

const api = axios.create({
  // ✅ Utilise la variable d'env Vercel en priorité, sinon localhost pour ton PC
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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