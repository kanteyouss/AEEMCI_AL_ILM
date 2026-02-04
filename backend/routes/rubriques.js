const express = require('express');
const router = express.Router();
const rubriqueController = require('../controllers/rubriqueController');
const { verifyJWT, isAdmin } = require('../middleware/auth');

/**
 * GET /api/rubriques
 * Récupérer toutes les rubriques
 */
router.get('/', verifyJWT, rubriqueController.getAllRubriques);

/**
 * GET /api/rubriques/:id
 * Récupérer une rubrique par ID
 */
router.get('/:id', verifyJWT, rubriqueController.getRubriqueById);

/**
 * POST /api/rubriques
 * Créer une nouvelle rubrique (Admin uniquement)
 */
router.post('/', verifyJWT, isAdmin, rubriqueController.createRubrique);

/**
 * PUT /api/rubriques/:id
 * Mettre à jour une rubrique (Admin uniquement)
 */
router.put('/:id', verifyJWT, isAdmin, rubriqueController.updateRubrique);

/**
 * DELETE /api/rubriques/:id
 * Supprimer une rubrique (Admin uniquement)
 */
router.delete('/:id', verifyJWT, isAdmin, rubriqueController.deleteRubrique);

module.exports = router;
