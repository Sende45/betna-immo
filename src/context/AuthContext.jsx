import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase'; // 👈 Assurez-vous que le chemin est correct
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 Écoute les changements d'état de connexion de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Récupère les données supplémentaires (rôle, nom, etc.) dans Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setUser({ ...currentUser, ...docSnap.data() });
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

  // 💡 MODIFICATION : Ajout du paramètre subscription
  const register = async (email, password, role, fullName, phone, subscription) => {
    // 1. Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Créer le document utilisateur dans Firestore avec son rôle
    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullName: fullName,
      email: email,
      phone: phone,
      role: role, // 'client' ou 'proprietaire'
      // 💡 NOUVEAU : Sauvegarde de la structure d'abonnement
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