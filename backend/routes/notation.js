const express = require('express');
const router = express.Router();
const notationController = require('../controllers/notationController');
const { verifyJWT } = require('../middleware/auth');

/**
 * @route GET /api/notation/sessions
 * @desc Récupérer les sessions de notation disponibles (depuis calendrier)
 * @query date, manche_id, rubrique_id (optionnels)
 * @access Public (lecture seule)
 */
router.get('/sessions', notationController.getSessionsNotation);

/**
 * @route GET /api/notation/equipes/:manche_id
 * @desc Récupérer les équipes éligibles pour notation
 * @access Public (lecture seule)
 */
router.get('/equipes/:manche_id', notationController.getEquipesEligibles);

/**
 * @route GET /api/notation/check
 * @desc Vérifier si une notation existe déjà
 * @query equipe_id, manche_id, rubrique_id
 * @access Public (lecture seule)
 */
router.get('/check', notationController.checkNotationExistante);

/**
 * @route GET /api/notation/manche/:manche_id
 * @desc Récupérer toutes les notations d'une manche (pour affichage admin)
 * @access Public (lecture seule)
 * IMPORTANT: Doit être AVANT router.use(verifyJWT) et AVANT /:equipe_id/:manche_id/:rubrique_id
 */
router.get('/manche/:manche_id', notationController.getNotationsManche);

/**
 * @route POST /api/notation
 * @desc Créer ou mettre à jour une notation
 * @body { equipe_id, manche_id, rubrique_id, session_id, criteres, note_totale, commentaire }
 */
router.post('/', notationController.saveNotation);

// Routes nécessitant authentification
router.use(verifyJWT);

/**
 * @route GET /api/notation/:equipe_id/:manche_id/:rubrique_id
 * @desc Récupérer une notation spécifique
 */
router.get('/:equipe_id/:manche_id/:rubrique_id', notationController.getNotation);

/**
 * @route GET /api/notation/classement/:manche_id
 * @desc Calculer le classement d'une phase
 */
router.get('/classement/:manche_id', notationController.getClassementPhase);

module.exports = router;
