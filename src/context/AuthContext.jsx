// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Récupère les données supplémentaires (rôle, nom, etc.) dans Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        // 💡 AMÉLIORATION : Vérifie si le document existe avant de merger
        if (docSnap.exists()) {
          setUser({ ...currentUser, ...docSnap.data() });
        } else {
          setUser({ ...currentUser }); // Auth sans document Firestore
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 💡 MODIFICATION : Paramètre subscription sécurisé
  const register = async (email, password, role, fullName, phone, subscription = { actif: false, stripeId: null }) => {
    // 1. Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Créer le document utilisateur dans Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullName: fullName,
      email: email,
      phone: phone,
      role: role, // 'client' ou 'proprietaire'
      // 💡 AMÉLIORATION : Ajout du statut par défaut
      status: 'actif',
      // Sauvegarde de la structure d'abonnement
      abonnement: subscription,
      createdAt: new Date()
    });
    return userCredential;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);