const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Route pour créer la session (Privée)
router.post('/create-checkout-session', auth, paymentController.createCheckoutSession);

// La route Webhook (Public, gérée avec express.raw dans app.js)
// router.post('/webhook', ...); 

module.exports = router;