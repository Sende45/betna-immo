require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// --- 1. Configuration du CORS (Indispensable pour Vercel) ---
app.use(cors({
  origin: [
    "https://betna-immo.vercel.app", // ✅ Ton URL de prod
    "http://localhost:5173",          // ✅ Ton local pour le dév
    /\.vercel\.app$/                  // ✅ Autorise toutes les previews Vercel
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- 2. Connexion MongoDB Atlas ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch(err => console.error("❌ Erreur de connexion MongoDB:", err));

// --- 3. Routes API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/biens', require('./routes/biens'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

// Route de base
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API Betna Immo 🏡" });
});

// --- 4. Gestion des erreurs 404 pour l'API ---
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée sur le serveur" });
});

// --- 5. Lancement du serveur (Adapté à Render) ---
const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;