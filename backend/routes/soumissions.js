const express = require('express');
const router = express.Router();
const soumissionController = require('../controllers/soumissionController');
const { verifyJWT, isEquipe, isAdmin } = require('../middleware/auth');

/**
 * GET /api/soumissions
 * Récupérer toutes les soumissions
 */
router.get('/', verifyJWT, soumissionController.getAllSoumissions);

/**
 * GET /api/soumissions/:id
 * Récupérer une soumission par ID
 */
router.get('/:id', verifyJWT, soumissionController.getSoumissionById);

/**
 * POST /api/soumissions
 * Créer une nouvelle soumission (Équipe uniquement)
 */
router.post('/', verifyJWT, isEquipe, soumissionController.createSoumission);

/**
 * PUT /api/soumissions/:id
 * Mettre à jour une soumission
 */
router.put('/:id', verifyJWT, isEquipe, soumissionController.updateSoumission);

/**
 * DELETE /api/soumissions/:id
 * Supprimer une soumission (Admin uniquement)
 */
router.delete('/:id', verifyJWT, isAdmin, soumissionController.deleteSoumission);

/**
 * GET /api/soumissions/equipe/:equipeId/manche/:mancheId
 * Récupérer les soumissions d'une équipe pour une manche
 */
router.get('/equipe/:equipeId/manche/:mancheId', verifyJWT, soumissionController.getSoumissionsByEquipeAndManche);

module.exports = router;
