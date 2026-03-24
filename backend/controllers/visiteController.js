const Visite = require('../models/Visite');

exports.getMesVisites = async (req, res) => {
  try {
    const visites = await Visite.find({ user: req.user.id }).sort({ visitDate: 1 });
    res.json(visites);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des visites" });
  }
};