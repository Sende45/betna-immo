const express = require('express');
const router = express.Router();
const { getMesFavoris } = require('../controllers/favorisController');
const auth = require('../middleware/auth'); // Vérifie bien le nom de ton middleware

router.get('/mes-favoris', auth, getMesFavoris);

module.exports = router;