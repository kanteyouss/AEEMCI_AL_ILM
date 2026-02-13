const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { verifyJWT, isAdmin } = require('../middleware/auth');

/**
 * GET /api/scores
 * Récupérer tous les scores
 */
router.get('/', scoreController.getAllScores);

/**
 * GET /api/scores/:id
 * Récupérer un score par ID
 */
router.get('/:id', scoreController.getScoreById);

/**
 * POST /api/scores
 * Créer ou mettre à jour un score
 */
router.post('/', scoreController.upsertScore);

/**
 * GET /api/scores/equipe/:equipeId
 * Récupérer le score total d'une équipe
 */
router.get('/equipe/:equipeId', scoreController.getTotalByEquipe);

/**
 * GET /api/scores/manche/:mancheId
 * Récupérer les scores d'une manche
 */
router.get('/manche/:mancheId', scoreController.getScoresByManche);

/**
 * DELETE /api/scores/:id
 * Supprimer un score
 */
router.delete('/:id', scoreController.deleteScore);

/**
 * POST /api/scores/calculate/:equipeId/:mancheId/:rubriqueId
 * Calculer automatiquement un score basé sur les évaluations
 */
router.post('/calculate/:equipeId/:mancheId/:rubriqueId', scoreController.calculateFromEvaluations);

module.exports = router;
