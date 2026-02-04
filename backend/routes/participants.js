const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const { verifyJWT, isAdmin } = require('../middleware/auth');
const { validateParticipant, validateId } = require('../middleware/validator');
const { upload, handleMulterError } = require('../middleware/upload');

/**
 * GET /api/participants
 * Récupérer tous les participants (avec filtres optionnels)
 */
router.get('/', verifyJWT, isAdmin, participantController.getAllParticipants);

/**
 * GET /api/participants/:id
 * Récupérer un participant par ID
 */
router.get('/:id', verifyJWT, validateId, participantController.getParticipantById);

/**
 * POST /api/participants
 * Créer un nouveau participant
 */
router.post('/', validateParticipant, participantController.createParticipant);

/**
 * PUT /api/participants/:id
 * Mettre à jour un participant
 */
router.put('/:id', verifyJWT, isAdmin, validateId, participantController.updateParticipant);

/**
 * DELETE /api/participants/:id
 * Supprimer un participant
 */
router.delete('/:id', verifyJWT, isAdmin, validateId, participantController.deleteParticipant);

/**
 * POST /api/participants/import-csv
 * Importer des participants depuis un CSV (Google Forms)
 */
router.post(
    '/import-csv',
    verifyJWT,
    isAdmin,
    upload.single('csvFile'),
    handleMulterError,
    participantController.importCSV
);

module.exports = router;
