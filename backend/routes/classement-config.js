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
 * Mettre à jour une configuration (Admin uniquement)
 */
router.put('/', verifyJWT, isAdmin, classementConfigController.updateConfig);

/**
 * PUT /api/classement-config/batch
 * Mettre à jour plusieurs configurations (Admin uniquement)
 */
router.put('/batch', verifyJWT, isAdmin, classementConfigController.updateMultipleConfig);

/**
 * POST /api/classement-config/publier
 * Publier le classement (Admin uniquement)
 */
router.post('/publier', verifyJWT, isAdmin, classementConfigController.publierClassement);

/**
 * POST /api/classement-config/depublier
 * Dépublier le classement (Admin uniquement)
 */
router.post('/depublier', verifyJWT, isAdmin, classementConfigController.depublierClassement);

module.exports = router;
