const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Middleware supplémentaire pour vérifier le rôle admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
  }
  next();
};

// Appliquer 'auth' ET 'isAdmin' sur toutes les routes ci-dessous
router.use(auth, isAdmin);

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/biens/:id/validate', adminController.validateBien);
router.get('/stats', adminController.getStats);

module.exports = router;