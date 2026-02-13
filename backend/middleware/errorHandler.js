/**
 * Middleware de gestion centralisée des erreurs
 */
const errorHandler = (err, req, res, next) => {
    // Log de l'erreur
    console.error('\n❌ ================ ERREUR ================');
    console.error(' Route:', req.method, req.path);
    console.error('⚠️  Message:', err.message);
    console.error('🔍 Stack:', err.stack);
    console.error('==========================================\n');

    // Erreurs PostgreSQL
    if (err.code) {
        switch (err.code) {
            case '23505': // Violation de contrainte unique
                return res.status(409).json({
                    success: false,
                    message: 'Cette valeur existe déjà dans la base de données',
                    error: 'Duplicate entry'
                });

            case '23503': // Violation de clé étrangère
                return res.status(400).json({
                    success: false,
                    message: 'Référence invalide à un enregistrement inexistant',
                    error: 'Foreign key violation'
                });

            case '23502': // Violation NOT NULL
                return res.status(400).json({
                    success: false,
                    message: 'Champ obligatoire manquant',
                    error: 'NOT NULL violation'
                });

            case '22P02': // Format de données invalide
                return res.status(400).json({
                    success: false,
                    message: 'Format de données invalide',
                    error: 'Invalid input syntax'
                });
        }
    }

    // Erreurs JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide',
            error: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Session expirée, veuillez vous reconnecter',
            error: 'Token expired'
        });
    }

    // Erreur de validation
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation des données',
            errors: err.errors
        });
    }

    // Erreur personnalisée avec statut HTTP
    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            error: err.error || 'Custom error'
        });
    }

    // Erreur générique (500)
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Une erreur interne s\'est produite'
            : err.message,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.stack
    });
};

/**
 * Middleware pour les routes non trouvées (404)
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route non trouvée : ${req.method} ${req.path}`,
        error: 'Not Found'
    });
};

module.exports = errorHandler;
module.exports.notFoundHandler = notFoundHandler;
