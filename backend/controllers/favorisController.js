const Favoris = require('../models/Favoris');

exports.getMesFavoris = async (req, res) => {
  try {
    // req.user.id vient de ton middleware d'authentification
    const favoris = await Favoris.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des favoris" });
  }
};