const Bien = require('../models/Bien');

// ✅ Récupérer tous les biens (Public)
exports.getBiens = async (req, res) => {
  try {
    const { type, verified } = req.query;
    let query = {};
    if (type && type !== 'tout') query.typeSejour = type;
    if (verified === 'true') query.status = 'Vérifié';

    const biens = await Bien.find(query).sort({ createdAt: -1 });
    res.json(biens);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des biens" });
  }
};

// ✅ Récupérer les annonces du proprio connecté (Privé)
exports.getMesAnnonces = async (req, res) => {
  try {
    const biens = await Bien.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(biens);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de vos annonces" });
  }
};

// ✅ Récupérer un bien par son ID (Public)
exports.getBienById = async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id);
    if (!bien) return res.status(404).json({ message: "Bien non trouvé" });
    res.json(bien);
  } catch (err) {
    res.status(500).json({ message: "ID invalide" });
  }
};

// ✅ Créer un bien (Privé)
exports.createBien = async (req, res) => {
  try {
    const nouveauBien = new Bien({
      ...req.body,
      owner: req.user.id,
      status: "En attente"
    });
    const saved = await nouveauBien.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création de l'annonce" });
  }
};

// ✅ Modifier un bien (Privé)
exports.updateBien = async (req, res) => {
  try {
    let bien = await Bien.findById(req.params.id);
    if (!bien) return res.status(404).json({ message: "Bien non trouvé" });

    if (bien.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    bien = await Bien.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, status: "En attente", updatedAt: Date.now() }, 
      { new: true }
    );
    res.json(bien);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// ✅ Supprimer un bien (Privé)
exports.deleteBien = async (req, res) => {
  try {
    const bien = await Bien.findById(req.params.id);
    if (!bien) return res.status(404).json({ message: "Bien non trouvé" });

    if (bien.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Action non autorisée" });
    }

    await bien.deleteOne();
    res.json({ message: "Annonce supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};