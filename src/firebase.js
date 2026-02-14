// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 👇 1. Importer Auth et Firestore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMJv9D2D0U90l_ilixnVt08gouuEsOpQk",
  authDomain: "betna-immo-app.firebaseapp.com",
  projectId: "betna-immo-app",
  storageBucket: "betna-immo-app.firebasestorage.app",
  messagingSenderId: "1066049019360",
  appId: "1:1066049019360:web:2fa44cdaaa199b8b669f85",
  measurementId: "G-JHL58FKP3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 👇 2. Initialiser et EXPORTER Auth et Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);