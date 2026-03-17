require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// --- 1. Configuration du CORS ---
app.use(cors({
  origin: [
    "https://betna-immo.vercel.app", 
    "http://localhost:5173",          
    /\.vercel\.app$/                  
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- 2. Connexion MongoDB Atlas (Version robuste) ---
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Évite d'attendre indéfiniment si l'IP est bloquée
})
  .then(() => console.log("✅ Connexion MongoDB réussie !"))
  .catch(err => {
    console.error("❌ ERREUR MONGODB :");
    console.error("Message :", err.message);
  });

// --- 3. Routes API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/biens', require('./routes/biens'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.json({ message: "API Betna Immo opérationnelle 🏡" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// --- 4. Lancement sur Render ---
// On force l'écoute sur 0.0.0.0 pour l'accessibilité externe
const PORT = process.env.PORT || 5000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur Betna démarré sur le port ${PORT}`);
});

module.exports = app;