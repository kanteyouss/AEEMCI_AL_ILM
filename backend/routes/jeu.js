const express = require('express');
const router = express.Router();
const jeuController = require('../controllers/jeuController');
const { verifyJWT } = require('../middleware/auth');

// Toutes les routes nécessitent authentification
router.use(verifyJWT);

/**
 * @route POST /api/jeu/demarrer
 * @desc Démarrer une session de jeu
 * @body { manche_id }
 */
router.post('/demarrer', jeuController.demarrerSession);

/**
 * @route POST /api/jeu/generer-question
 * @desc Générer une question aléatoire
 * @body { rubrique_id, equipe_id, manche_id }
 */
router.post('/generer-question', jeuController.genererQuestion);

/**
 * @route POST /api/jeu/soumettre-reponse
 * @desc Soumettre une réponse et calculer le score
 * @body { equipe_id, manche_id, rubrique_id, question_id, participant_id, reponse_donnee, temps_reponse, est_correcte }
 */
router.post('/soumettre-reponse', jeuController.soumettreReponse);

/**
 * @route GET /api/jeu/questions-restantes
 * @desc Nombre de questions restantes
 * @query equipe_id, manche_id, rubrique_id
 */
router.get('/questions-restantes', jeuController.getQuestionsRestantes);

/**
 * @route GET /api/jeu/etat/:manche_id
 * @desc État actuel de la session (progression)
 */
router.get('/etat/:manche_id', jeuController.getEtatSession);

/**
 * @route POST /api/jeu/terminer
 * @desc Terminer la session
 * @body { manche_id }
 */
router.post('/terminer', jeuController.terminerSession);

module.exports = router;
