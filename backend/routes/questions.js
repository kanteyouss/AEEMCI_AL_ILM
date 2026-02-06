const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyJWT, isAdmin } = require('../middleware/auth');
const { validateQuestion } = require('../middleware/validator');

/**
 * GET /api/questions
 * Récupérer toutes les questions
 */
router.get('/', verifyJWT, questionController.getAllQuestions);

/**
 * GET /api/questions/random
 * Récupérer UNE question aléatoire (SANS JWT - pour notation)
 */
router.get('/random', questionController.getRandomQuestion);

/**
 * GET /api/questions/:id
 * Récupérer une question par ID
 */
router.get('/:id', verifyJWT, questionController.getQuestionById);

/**
 * POST /api/questions
 * Créer une nouvelle question (Admin uniquement)
 */
router.post('/', verifyJWT, isAdmin, validateQuestion, questionController.createQuestion);

/**
 * PUT /api/questions/:id
 * Mettre à jour une question (Admin uniquement)
 */
router.put('/:id', verifyJWT, isAdmin, questionController.updateQuestion);

/**
 * DELETE /api/questions/:id
 * Supprimer une question (Admin uniquement)
 */
router.delete('/:id', verifyJWT, isAdmin, questionController.deleteQuestion);

/**
 * PUT /api/questions/:id/mark-used
 * Marquer une question comme utilisée
 */
router.put('/:id/mark-used', verifyJWT, isAdmin, questionController.markQuestionAsUsed);

/**
 * GET /api/questions/rubrique/:rubriqueId/random
 * Récupérer des questions aléatoires non utilisées
 */
router.get('/rubrique/:rubriqueId/random', verifyJWT, questionController.getRandomUnusedQuestions);

module.exports = router;
