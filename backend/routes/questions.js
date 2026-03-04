const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyJWT, isAdmin } = require('../middleware/auth');
const { validateQuestion } = require('../middleware/validator');

/**
 * GET /api/questions
 * Récupérer toutes les questions
 */
router.get('/', questionController.getAllQuestions);

/**
 * GET /api/questions/random
 * Récupérer UNE question aléatoire (SANS JWT - pour notation)
 */
router.get('/random', questionController.getRandomQuestion);

/**
 * GET /api/questions/:id
 * Récupérer une question par ID
 */
router.get('/:id', questionController.getQuestionById);

/**
 * POST /api/questions
 * Créer une nouvelle question
 */
router.post('/', validateQuestion, questionController.createQuestion);

/**
 * PUT /api/questions/:id
 * Mettre à jour une question
 */
router.put('/:id', questionController.updateQuestion);

/**
 * DELETE /api/questions/:id
 * Supprimer une question
 */
router.delete('/:id', questionController.deleteQuestion);

/**
 * PUT /api/questions/:id/mark-used
 * Marquer une question comme utilisée
 */
router.put('/:id/mark-used', questionController.markQuestionAsUsed);

/**
 * GET /api/questions/rubrique/:rubriqueId/random
 * Récupérer des questions aléatoires non utilisées
 */
router.get('/rubrique/:rubriqueId/random', verifyJWT, questionController.getRandomUnusedQuestions);

/**
 * POST /api/questions/reset-usage
 * Réinitialiser l'utilisation de toutes les questions
 */
router.post('/reset-usage', questionController.resetQuestionsUsage);

module.exports = router;
