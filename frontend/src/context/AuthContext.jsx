import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ACTION : Déconnexion (définie en haut pour être utilisée partout) ---
  const logout = useCallback(() => {
    localStorage.removeItem('betna_token');
    localStorage.removeItem('betna_user');
    setUser(null);
    // On peut forcer un rechargement ou une redirection si nécessaire
  }, []);

  // --- EFFET : Vérification de la session au démarrage ---
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('betna_user');
      const token = localStorage.getItem('betna_token');

      if (savedUser && token) {
        try {
          // Optionnel : Tu peux créer une route /auth/me côté backend 
          // pour vérifier si le token est toujours valide en BDD
          // const res = await api.get('/auth/me');
          // setUser(res.data.user);
          
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Session expirée ou invalide");
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [logout]);

  // --- ACTION : Connexion ---
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('betna_token', token);
      localStorage.setItem('betna_user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Erreur de connexion";
    }
  };

  // --- ACTION : Inscription ---
  const register = async (email, password, role, fullName, phone, subscription) => {
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        role, 
        fullName, 
        phone,
        subscription 
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('betna_token', token);
      localStorage.setItem('betna_user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Erreur lors de l'inscription";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {/* On ne bloque pas l'affichage des enfants ici si on veut gérer 
          le loader au niveau de App.jsx pour une meilleure UX 
      */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};