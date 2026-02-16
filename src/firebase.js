// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// 👇 Importer Auth, Firestore et Functions
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

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

// ✅ Initialiser Firebase (UNE SEULE FOIS dans tout le projet)
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialiser les services liés à CETTE app
const auth = getAuth(app);
const db = getFirestore(app);

// ⭐ LA LIGNE QUI RÉPARE TON BUG STRIPE
const functions = getFunctions(app, "us-central1");

// ✅ EXPORTER pour les utiliser ailleurs
export { app, analytics, auth, db, functions };
