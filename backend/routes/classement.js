const express = require('express');
const router = express.Router();
const classementController = require('../controllers/classementController');
const { verifyJWT } = require('../middleware/auth');

router.get('/general', verifyJWT, classementController.getClassementGeneral);
router.get('/manche/:mancheId', verifyJWT, classementController.getClassementManche);
router.get('/equipe/:equipeId', verifyJWT, classementController.getScoresEquipe);

module.exports = router;
