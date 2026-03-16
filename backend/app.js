require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Connexion MongoDB Atlas ---
// On place la connexion ici pour s'assurer que l'app est liée à la DB dès le chargement
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch(err => console.error("❌ Erreur de connexion MongoDB:", err));

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/biens', require('./routes/biens'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));
// Ajout de la route admin si tu la crées plus tard
// app.use('/api/admin', require('./routes/admin'));

// Route de base pour tester si l'API répond
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API Betna Immo 🏡" });
});

module.exports = app;