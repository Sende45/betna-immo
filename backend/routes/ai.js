const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Ces routes seront préfixées par /api/ai dans app.js
router.post('/chat', aiController.chatImmobilier);      // URL: /api/ai/chat
router.post('/analyze', aiController.analyzeDescription); // URL: /api/ai/analyze

module.exports = router;