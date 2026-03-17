import axios from 'axios';

// On détermine l'URL de manière ultra-stricte
const getBaseURL = () => {
  // 1. Priorité absolue à la variable d'environnement Vite
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. Si on est sur Vercel (PROD) mais que la variable manque, on force l'URL Render
  if (import.meta.env.PROD) {
    return 'https://betna-backend.onrender.com/api';
  }

  // 3. Uniquement en local (dev), on utilise localhost
  return 'http://localhost:5000/api';
};

const API_URL = getBaseURL();

// Log de contrôle pour toi dans la console F12
console.log("🚀 Tentative de connexion API sur :", API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// --- L'INTERCEPTEUR ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('betna_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;