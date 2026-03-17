const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Inscription (Register)
exports.register = async (req, res) => {
  try {
    // 1. On récupère TOUTES les données, y compris subscription envoyée par le frontend
    const { email, password, fullName, phone, role, subscription } = req.body;

    // 2. Vérification d'existence
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Cet email est déjà utilisé." });

    // 3. Création de l'utilisateur
    // Le hachage est auto via le middleware .pre('save') du modèle
    user = new User({ 
      email, 
      password, 
      fullName, 
      phone, 
      role,
      // On s'assure qu'un objet par défaut existe si subscription est absent
      subscription: subscription || { plan: 'aucun', actif: false }
    });
    
    await user.save();

    // 4. Vérification de sécurité du Secret JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET est manquant dans les variables d'environnement Render.");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } 
    });

  } catch (err) {
    // 🔥 MODIF DEBUG : Log complet pour Render
    console.error("❌ ERREUR REGISTER BACKEND:", err);

    // Renvoie l'erreur précise au Frontend pour qu'on puisse la lire dans F12
    res.status(500).json({ 
      message: "Erreur lors de l'inscription",
      error: err.message 
    });
  }
};

// ✅ Connexion (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Identifiants invalides." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Identifiants invalides." });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET est manquant sur le serveur.");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error("❌ ERREUR LOGIN BACKEND:", err);
    res.status(500).json({ 
      message: "Erreur lors de la connexion",
      error: err.message 
    });
  }
};

// ✅ Profil actuel (Get Me)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};