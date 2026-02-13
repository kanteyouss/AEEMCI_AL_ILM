const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { verifyJWT, isJury, isAdmin } = require('../middleware/auth');
const { validateEvaluation } = require('../middleware/validator');

/**
 * GET /api/evaluations
 * Récupérer toutes les évaluations
 */
router.get('/', evaluationController.getAllEvaluations);

/**
 * GET /api/evaluations/:id
 * Récupérer une évaluation par ID
 */
router.get('/:id', evaluationController.getEvaluationById);

/**
 * POST /api/evaluations
 * Créer une nouvelle évaluation
 */
router.post('/', validateEvaluation, evaluationController.createEvaluation);

/**
 * PUT /api/evaluations/:id
 * Mettre à jour une évaluation
 */
router.put('/:id', evaluationController.updateEvaluation);

/**
 * DELETE /api/evaluations/:id
 * Supprimer une évaluation
 */
router.delete('/:id', evaluationController.deleteEvaluation);

/**
 * GET /api/evaluations/soumission/:soumissionId
 * Récupérer les évaluations d'une soumission
 */
router.get('/soumission/:soumissionId', evaluationController.getEvaluationsBySoumission);

/**
 * GET /api/evaluations/soumission/:soumissionId/average
 * Récupérer la moyenne des évaluations d'une soumission
 */
router.get('/soumission/:soumissionId/average', evaluationController.getAverageScore);

module.exports = router;
