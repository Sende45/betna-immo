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

/**
 * ATTENTION WEBHOOK : 
 * La route webhook doit être placée AVANT express.json() 
 * car Stripe a besoin du corps de la requête "raw" (brut) pour vérifier la signature.
 */
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  // Cette route sera gérée dans ton controller de paiement plus tard
  next();
});

// Pour toutes les autres routes, on utilise le JSON classique
app.use(express.json());

// --- 2. Connexion MongoDB Atlas ---
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 
})
  .then(() => console.log("✅ Connexion MongoDB réussie !"))
  .catch(err => {
    console.error("❌ ERREUR MONGODB :", err.message);
  });

// --- 3. Routes API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/biens', require('./routes/biens'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

// ✅ AJOUT DE LA ROUTE DE PAIEMENT STRIPE
// Assure-toi que le nom du fichier dans /routes est bien 'paymentRoutes'
app.use('/api/payments', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
  res.json({ message: "API Betna Immo opérationnelle 🏡" });
});

// Middleware 404 pour les routes inexistantes
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée sur le serveur Betna" });
});

// --- 4. Lancement sur Render ---
const PORT = process.env.PORT || 5000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur Betna démarré sur le port ${PORT}`);
});

module.exports = app;