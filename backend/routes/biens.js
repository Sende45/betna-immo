const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bienController = require('../controllers/bienController');

// --- ROUTES PRIVÉES (Nécessitent Token) ---
router.get('/mes-annonces', auth, bienController.getMesAnnonces);
router.post('/', auth, bienController.createBien);
router.put('/:id', auth, bienController.updateBien);
router.delete('/:id', auth, bienController.deleteBien);

// --- ROUTES PUBLIQUES ---
router.get('/', bienController.getBiens);
router.get('/:id', bienController.getBienById);

module.exports = router;