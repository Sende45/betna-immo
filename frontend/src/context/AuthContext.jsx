import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Loader2 } from 'lucide-react'; // Ajouté pour la sécurité

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('betna_token');
    localStorage.removeItem('betna_user');
    setUser(null);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('betna_user');
      const token = localStorage.getItem('betna_token');

      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Session expirée");
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [logout]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('betna_token', token);
      localStorage.setItem('betna_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || "Erreur de connexion";
    }
  };

  const register = async (email, password, role, fullName, phone, subscription) => {
    try {
      const response = await api.post('/auth/register', { 
        email, password, role, fullName, phone, subscription 
      });
      const { token, user: userData } = response.data;
      localStorage.setItem('betna_token', token);
      localStorage.setItem('betna_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || "Erreur lors de l'inscription";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {/* Ici on peut ajouter un loader global si nécessaire */}
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};