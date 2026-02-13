const express = require('express');
const router = express.Router();
const rubriqueController = require('../controllers/rubriqueController');
const { verifyJWT, isAdmin } = require('../middleware/auth');

/**
 * GET /api/rubriques
 * Récupérer toutes les rubriques
 */
router.get('/', rubriqueController.getAllRubriques);

/**
 * GET /api/rubriques/:id
 * Récupérer une rubrique par ID
 */
router.get('/:id', rubriqueController.getRubriqueById);

/**
 * POST /api/rubriques
 * Créer une nouvelle rubrique
 */
router.post('/', rubriqueController.createRubrique);

/**
 * PUT /api/rubriques/:id
 * Mettre à jour une rubrique
 */
router.put('/:id', rubriqueController.updateRubrique);

/**
 * DELETE /api/rubriques/:id
 * Supprimer une rubrique
 */
router.delete('/:id', rubriqueController.deleteRubrique);

module.exports = router;
