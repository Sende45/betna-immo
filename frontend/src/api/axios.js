import axios from 'axios';

// On extrait l'URL et on la nettoie pour éviter les doubles slashes ou les erreurs de build
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 🔍 Ce log apparaîtra dans ta console navigateur (F12) pour confirmer l'URL en prod
if (import.meta.env.PROD) {
  console.log("🌐 Betna-Immo connecté au serveur :", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
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