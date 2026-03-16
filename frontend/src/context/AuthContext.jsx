import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL de ton API (à mettre dans un .env plus tard)
  const API_URL = "http://localhost:5000/api/auth";

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
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      // Stockage local pour la persistence
      localStorage.setItem('betna_token', data.token);
      localStorage.setItem('betna_user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // --- ACTION : Inscription ---
  const register = async (email, password, role, fullName, phone, subscription) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          role, 
          fullName, 
          phone,
          subscription // Transmis directement à MongoDB
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Stockage local
      localStorage.setItem('betna_token', data.token);
      localStorage.setItem('betna_user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
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