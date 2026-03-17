const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController'); // Vérifie bien le chemin !

// Vérification de sécurité : si aiController.chatImmobilier est undefined, on le saura au build
if (!aiController.chatImmobilier) {
    console.error("ERREUR : chatImmobilier est undefined dans le contrôleur !");
}

router.post('/chat', aiController.chatImmobilier);
router.post('/analyze', aiController.analyzeDescription);

module.exports = router;