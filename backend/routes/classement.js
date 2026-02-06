const express = require('express');
const router = express.Router();
const classementController = require('../controllers/classementController');
const { verifyJWT } = require('../middleware/auth');

// Routes publiques (pour affichage admin et public)
router.get('/manche/:mancheId', classementController.getClassementManche);
router.get('/etape/:etape', classementController.getClassementEtape);

// Routes nécessitant authentification
router.get('/general', verifyJWT, classementController.getClassementGeneral);
router.get('/equipe/:equipeId', verifyJWT, classementController.getScoresEquipe);

module.exports = router;
