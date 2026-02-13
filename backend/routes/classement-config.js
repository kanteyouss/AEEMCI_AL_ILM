const express = require('express');
const router = express.Router();
const classementConfigController = require('../controllers/classementConfigController');
const { verifyJWT, isAdmin } = require('../middleware/auth');

/**
 * GET /api/classement-config
 * Récupérer toutes les configurations (public)
 */
router.get('/', classementConfigController.getAllConfig);

/**
 * PUT /api/classement-config
 * Mettre à jour une configuration (Public temporairement)
 */
router.put('/', classementConfigController.updateConfig);

/**
 * PUT /api/classement-config/batch
 * Mettre à jour plusieurs configurations (Public temporairement)
 */
router.put('/batch', classementConfigController.updateMultipleConfig);

/**
 * POST /api/classement-config/publier
 * Publier le classement (Public temporairement)
 */
router.post('/publier', classementConfigController.publierClassement);

/**
 * POST /api/classement-config/depublier
 * Dépublier le classement (Public temporairement)
 */
router.post('/depublier', classementConfigController.depublierClassement);

module.exports = router;
