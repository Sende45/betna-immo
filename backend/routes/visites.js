const express = require('express');
const router = express.Router();
const { getMesVisites } = require('../controllers/visiteController');
const auth = require('../middleware/auth');

router.get('/mes-visites', auth, getMesVisites);

module.exports = router;