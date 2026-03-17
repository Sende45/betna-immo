import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios'; // ✅ On importe notre instance Axios configurée

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- EFFET : Vérification de la session au démarrage ---
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('betna_user');
      const token = localStorage.getItem('betna_token');

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // --- ACTION : Connexion ---
  const login = async (email, password) => {
    try {
      // ✅ On utilise 'api' au lieu de 'fetch'. Plus besoin de l'URL complète.
      const response = await api.post('/auth/login', { email, password });
      
      const data = response.data;

      // Stockage local pour la persistence
      localStorage.setItem('betna_token', data.token);
      localStorage.setItem('betna_user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      // Axios remonte les erreurs du backend dans error.response.data
      throw error.response?.data?.message || error.message || "Erreur de connexion";
    }
  };

  // --- ACTION : Inscription ---
  const register = async (email, password, role, fullName, phone, subscription) => {
    try {
      // ✅ Utilisation de l'instance 'api'
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        role, 
        fullName, 
        phone,
        subscription 
      });

      const data = response.data;

      // Stockage local
      localStorage.setItem('betna_token', data.token);
      localStorage.setItem('betna_user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Erreur lors de l'inscription";
    }
  };

  // --- ACTION : Déconnexion ---
  const logout = () => {
    localStorage.removeItem('betna_token');
    localStorage.removeItem('betna_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);