const express = require('express');
const router = express.Router();
const mancheController = require('../controllers/mancheController');
const { verifyJWT, isAdmin } = require('../middleware/auth');
const { validateManche } = require('../middleware/validator');

// Route publique pour consulter les manches (utilisée par le calendrier public)
router.get('/par-etape', mancheController.getManchesParEtape);
router.get('/', mancheController.getAllManches);
router.get('/:id', mancheController.getMancheById);

// Routes (publiques désormais)
router.post('/', validateManche, mancheController.createManche);
router.put('/:id', validateManche, mancheController.updateManche);
router.put('/:id/statut', mancheController.updateStatut);
router.delete('/:id', mancheController.deleteManche);

module.exports = router;

