const express = require('express');
const router = express.Router();
const soumissionController = require('../controllers/soumissionController');
const { verifyJWT, isEquipe, isAdmin } = require('../middleware/auth');

/**
 * GET /api/soumissions
 * Récupérer toutes les soumissions
 */
router.get('/', soumissionController.getAllSoumissions);

/**
 * GET /api/soumissions/:id
 * Récupérer une soumission par ID
 */
router.get('/:id', soumissionController.getSoumissionById);

/**
 * POST /api/soumissions
 * Créer une nouvelle soumission
 */
router.post('/', soumissionController.createSoumission);

/**
 * PUT /api/soumissions/:id
 * Mettre à jour une soumission
 */
router.put('/:id', soumissionController.updateSoumission);

/**
 * DELETE /api/soumissions/:id
 * Supprimer une soumission
 */
router.delete('/:id', soumissionController.deleteSoumission);

/**
 * GET /api/soumissions/equipe/:equipeId/manche/:mancheId
 * Récupérer les soumissions d'une équipe pour une manche
 */
router.get('/equipe/:equipeId/manche/:mancheId', soumissionController.getSoumissionsByEquipeAndManche);

module.exports = router;
