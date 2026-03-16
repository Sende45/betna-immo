const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

// Profil (Sécurisé par le middleware auth)
router.get('/me', auth, authController.getMe);

module.exports = router;