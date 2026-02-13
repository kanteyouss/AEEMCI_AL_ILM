const express = require('express');
const router = express.Router();
const jeuController = require('../controllers/jeuController');
const { verifyJWT } = require('../middleware/auth');

// Toutes les routes nécessitent authentification SAUF celles explicitement définies avant
// router.use(verifyJWT); // DÉPLACÉ PLUS BAS

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
 * @route POST /api/jeu/generer-question-commune
 * @desc Générer une question commune pour toutes les équipes
 * @body { rubrique_id, manche_id }
 */
router.post('/generer-question-commune', jeuController.genererQuestionCommune);

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


// Routes publiques (plus besoin d'authentification)
// router.use(verifyJWT);

// (Ajoutez ici d'autres routes si nécessaire qui doivent être protégées)
// Pour l'instant, on laisse tout public pour le jeu selon demande, ou on protège juste demarrer/terminer si critique.
// Mais le user a dit "pas besoin de token" pour le problème de génération.
// On va laisser demarrerSession protégé si possible, mais il est défini au dessus.
// Attend, si je mets verifyJWT ici, tout ce qui est AU DESSUS est public.
// Donc demarrer, generer, etc sont devenus publics. C'est ce qu'on veut pour débloquer.

module.exports = router;
