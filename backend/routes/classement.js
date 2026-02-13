const express = require('express');
const router = express.Router();
const classementController = require('../controllers/classementController');
const { verifyJWT } = require('../middleware/auth');

// Routes publiques (pour affichage admin et public)
router.get('/', classementController.getClassementGeneral);
router.get('/manche/:mancheId', classementController.getClassementManche);
router.get('/etape/:etape', classementController.getClassementEtape);
router.get('/general', classementController.getClassementGeneral);

// Routes nécessitant authentification (plus maintenant)
router.get('/equipe/:equipeId', classementController.getScoresEquipe);

module.exports = router;
