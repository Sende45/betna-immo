const User = require('../models/User');
const Bien = require('../models/Bien');

// ✅ Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des membres" });
  }
};

// ✅ Changer le statut d'un utilisateur (Bloquer/Débloquer)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'actif' ou 'bloqué'
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la modification du statut" });
  }
};

// ✅ Valider un bien (Passer de 'En attente' à 'Vérifié')
exports.validateBien = async (req, res) => {
  try {
    const bien = await Bien.findByIdAndUpdate(
      req.params.id, 
      { status: 'Vérifié' }, 
      { new: true }
    );
    res.json(bien);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la validation du bien" });
  }
};

// ✅ Statistiques globales pour le Dashboard Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBiens = await Bien.countDocuments();
    const pendingBiens = await Bien.countDocuments({ status: 'En attente' });
    
    res.json({ totalUsers, totalBiens, pendingBiens });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du calcul des statistiques" });
  }
};