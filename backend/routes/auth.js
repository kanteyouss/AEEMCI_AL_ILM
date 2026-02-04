const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyJWT, isAdmin } = require('../middleware/auth');
const { validateLogin, validateEquipeLogin } = require('../middleware/validator');

/**
 * POST /api/auth/login
 * Connexion Admin ou Juré
 */
router.post('/login', validateLogin, authController.loginUser);

/**
 * POST /api/auth/login-equipe
 * Connexion Équipe (avec code d'accès)
 */
router.post('/login-equipe', validateEquipeLogin, authController.loginEquipe);

/**
 * POST /api/auth/logout
 * Déconnexion (suppression de session)
 */
router.post('/logout', verifyJWT, authController.logout);

/**
 * GET /api/auth/verify
 * Vérifier si le token est valide
 */
router.get('/verify', verifyJWT, authController.verifyAuth);

/**
 * POST /api/auth/create-user
 * Créer un utilisateur Admin ou Juré (Admin uniquement)
 */
router.post('/create-user', verifyJWT, isAdmin, authController.createUser);

module.exports = router;
