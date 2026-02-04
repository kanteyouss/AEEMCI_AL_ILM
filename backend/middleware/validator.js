const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware pour vérifier les résultats de validation
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Erreurs de validation',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    
    next();
};

/**
 * Règles de validation pour l'inscription d'un participant
 */
const validateParticipant = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    
    body('prenom')
        .trim()
        .notEmpty().withMessage('Le prénom est requis')
        .isLength({ min: 2, max: 100 }).withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
    
    body('email')
        .optional()
        .isEmail().withMessage('Email invalide')
        .normalizeEmail(),
    
    body('telephone')
        .trim()
        .notEmpty().withMessage('Le téléphone est requis')
        .matches(/^[0-9]{8,15}$/).withMessage('Numéro de téléphone invalide'),
    
    body('etablissement')
        .trim()
        .notEmpty().withMessage('L\'établissement est requis')
        .isIn(['ESATIC', 'EMSP']).withMessage('Établissement doit être ESATIC ou EMSP'),
    
    body('niveau_coranique')
        .optional()
        .isIn(['ne_sais_pas', 'debute', 'lis_aisement']).withMessage('Niveau coranique invalide'),
    
    validate
];

/**
 * Règles de validation pour la création d'une équipe
 */
const validateEquipe = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom de l\'équipe est requis')
        .isLength({ min: 3, max: 100 }).withMessage('Le nom doit contenir entre 3 et 100 caractères'),
    
    body('code_acces')
        .trim()
        .notEmpty().withMessage('Le code d\'accès est requis')
        .isLength({ min: 6, max: 50 }).withMessage('Le code d\'accès doit contenir entre 6 et 50 caractères'),
    
    validate
];

/**
 * Règles de validation pour la création d'une manche
 */
const validateManche = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom de la manche est requis'),
    
    body('type')
        .trim()
        .notEmpty().withMessage('Le type de manche est requis')
        .isIn(['preliminaire', 'quart', 'demi', 'finale']).withMessage('Type de manche invalide'),
    
    body('date_manche')
        .notEmpty().withMessage('La date est requise')
        .isISO8601().withMessage('Format de date invalide'),
    
    validate
];

/**
 * Règles de validation pour la création d'une question
 */
const validateQuestion = [
    body('rubrique_id')
        .isInt({ min: 1 }).withMessage('ID de rubrique invalide'),
    
    body('question_texte')
        .trim()
        .notEmpty().withMessage('Le texte de la question est requis'),
    
    body('type')
        .isIn(['qcm', 'texte_libre']).withMessage('Type de question invalide'),
    
    body('points')
        .isInt({ min: 1 }).withMessage('Les points doivent être un entier positif'),
    
    validate
];

/**
 * Règles de validation pour une évaluation
 */
const validateEvaluation = [
    body('soumission_id')
        .isInt({ min: 1 }).withMessage('ID de soumission invalide'),
    
    body('note_totale')
        .isInt({ min: 0 }).withMessage('La note totale doit être un entier positif'),
    
    validate
];

/**
 * Règles de validation pour ID en paramètre
 */
const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID invalide'),
    
    validate
];

/**
 * Règles de validation pour connexion Admin/Jury
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('Email invalide'),
    
    body('password')
        .notEmpty().withMessage('Le mot de passe est requis'),
    
    validate
];

/**
 * Règles de validation pour connexion Équipe
 */
const validateEquipeLogin = [
    body('code_acces')
        .trim()
        .notEmpty().withMessage('Le code d\'accès est requis'),
    
    validate
];

module.exports = {
    validate,
    validateParticipant,
    validateEquipe,
    validateManche,
    validateQuestion,
    validateEvaluation,
    validateId,
    validateLogin,
    validateEquipeLogin
};
