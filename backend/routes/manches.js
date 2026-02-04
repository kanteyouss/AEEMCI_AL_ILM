const express = require('express');
const router = express.Router();
const mancheController = require('../controllers/mancheController');
const { verifyJWT, isAdmin } = require('../middleware/auth');
const { validateManche } = require('../middleware/validator');

// Route publique pour consulter les manches (utilisée par le calendrier public)
router.get('/', mancheController.getAllManches);
router.get('/:id', mancheController.getMancheById);

// Routes protégées (admin uniquement)
router.post('/', verifyJWT, isAdmin, validateManche, mancheController.createManche);
router.put('/:id', verifyJWT, isAdmin, validateManche, mancheController.updateManche);
router.put('/:id/statut', verifyJWT, isAdmin, mancheController.updateStatut);
router.delete('/:id', verifyJWT, isAdmin, mancheController.deleteManche);

module.exports = router;

