const express = require('express');
const router = express.Router();
const equipeController = require('../controllers/equipeController');
const { verifyJWT, isAdmin, isOwnEquipe } = require('../middleware/auth');
const { validateEquipe, validateId } = require('../middleware/validator');

/**
 * GET /api/equipes
 * Récupérer toutes les équipes
 */
router.get('/', verifyJWT, equipeController.getAllEquipes);

/**
 * GET /api/equipes/:id
 * Récupérer une équipe par ID avec ses membres
 */
router.get('/:id', verifyJWT, isOwnEquipe, validateId, equipeController.getEquipeById);

/**
 * POST /api/equipes
 * Créer une nouvelle équipe (Admin uniquement)
 */
router.post('/', verifyJWT, isAdmin, validateEquipe, equipeController.createEquipe);

/**
 * POST /api/equipes/:id/membres
 * Ajouter un membre à une équipe (Admin uniquement)
 */
router.post('/:id/membres', verifyJWT, isAdmin, validateId, equipeController.addMember);

/**
 * DELETE /api/equipes/:id/membres/:participantId
 * Retirer un membre d'une équipe (Admin uniquement)
 */
router.delete('/:id/membres/:participantId', verifyJWT, isAdmin, equipeController.removeMember);

/**
 * PUT /api/equipes/:id/capitaine
 * Définir le capitaine d'une équipe (Admin uniquement)
 */
router.put('/:id/capitaine', verifyJWT, isAdmin, validateId, equipeController.setCapitaine);

/**
 * PUT /api/equipes/:id/membres/:participantId/roles
 * Définir les rôles d'un membre (Capitaine ou Admin)
 */
router.put('/:id/membres/:participantId/roles', verifyJWT, equipeController.setRoles);

/**
 * POST /api/equipes/:id/send-code
 * Envoyer le code d'accès au capitaine par email (Admin uniquement)
 */
router.post('/:id/send-code', verifyJWT, isAdmin, validateId, equipeController.sendAccessCode);

/**
 * POST /api/equipes/validate
 * Valider et générer les codes pour toutes les équipes (Admin uniquement)
 */
router.post('/validate', verifyJWT, isAdmin, equipeController.validateAllEquipes);

/**
 * GET /api/equipes/public/validated
 * Récupérer les équipes validées pour affichage public (sans auth)
 */
router.get('/public/validated', equipeController.getValidatedEquipes);

/**
 * GET /api/equipes/public/:nom/membres
 * Récupérer les membres d'une équipe par son nom (sans auth)
 */
router.get('/public/:nom/membres', equipeController.getEquipeMembres);

module.exports = router;
