const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { verifyJWT, isJury, isAdmin } = require('../middleware/auth');
const { validateEvaluation } = require('../middleware/validator');

/**
 * GET /api/evaluations
 * Récupérer toutes les évaluations
 */
router.get('/', verifyJWT, evaluationController.getAllEvaluations);

/**
 * GET /api/evaluations/:id
 * Récupérer une évaluation par ID
 */
router.get('/:id', verifyJWT, evaluationController.getEvaluationById);

/**
 * POST /api/evaluations
 * Créer une nouvelle évaluation (Juré ou Admin)
 */
router.post('/', verifyJWT, isJury, validateEvaluation, evaluationController.createEvaluation);

/**
 * PUT /api/evaluations/:id
 * Mettre à jour une évaluation
 */
router.put('/:id', verifyJWT, isJury, evaluationController.updateEvaluation);

/**
 * DELETE /api/evaluations/:id
 * Supprimer une évaluation (Admin uniquement)
 */
router.delete('/:id', verifyJWT, isAdmin, evaluationController.deleteEvaluation);

/**
 * GET /api/evaluations/soumission/:soumissionId
 * Récupérer les évaluations d'une soumission
 */
router.get('/soumission/:soumissionId', verifyJWT, evaluationController.getEvaluationsBySoumission);

/**
 * GET /api/evaluations/soumission/:soumissionId/average
 * Récupérer la moyenne des évaluations d'une soumission
 */
router.get('/soumission/:soumissionId/average', verifyJWT, evaluationController.getAverageScore);

module.exports = router;
