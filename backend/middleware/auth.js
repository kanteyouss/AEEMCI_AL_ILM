const { verifyToken, extractToken } = require('../config/jwt');
const db = require('../config/database');

/**
 * Middleware : Vérifier le token JWT
 */
const verifyJWT = async (req, res, next) => {
    try {
        const token = extractToken(req);
        
        // Logs désactivés en production (trop verbeux)
        // console.log('🔐 Vérification JWT:');
        // console.log('   Token présent:', !!token);
        
        if (!token) {
            // console.log('❌ Pas de token');
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification manquant'
            });
        }
        
        // Décoder le token
        const decoded = verifyToken(token);
        console.log('   Token décodé:', decoded);
        
        // Vérifier si la session existe en base
        const sessionQuery = `
            SELECT * FROM sessions 
            WHERE token = $1 
            AND date_expiration > NOW()
        `;
        
        const sessionResult = await db.query(sessionQuery, [token]);
        
        if (sessionResult.rows.length === 0) {
            console.log('❌ Session expirée ou invalide');
            return res.status(401).json({
                success: false,
                message: 'Session expirée ou invalide'
            });
        }
        
        console.log('✅ Session valide');
        
        // Ajouter les infos utilisateur à la requête
        req.user = decoded;
        req.sessionId = sessionResult.rows[0].id;
        
        next();
    } catch (error) {
        console.log('❌ Erreur JWT:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token invalide',
            error: error.message
        });
    }
};

/**
 * Middleware : Vérifier que l'utilisateur est Admin
 */
const isAdmin = (req, res, next) => {
    console.log('🔍 Vérification isAdmin:');
    console.log('   req.user:', req.user);
    console.log('   req.user.role:', req.user?.role);
    
    if (!req.user || req.user.role !== 'admin') {
        console.log('❌ Accès refusé - Non admin');
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux administrateurs'
        });
    }
    
    console.log('✅ Utilisateur admin confirmé');
    next();
};

/**
 * Middleware : Vérifier que l'utilisateur est Juré
 */
const isJury = (req, res, next) => {
    if (!req.user || (req.user.role !== 'jure' && req.user.role !== 'admin')) {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé au jury'
        });
    }
    next();
};

/**
 * Middleware : Vérifier que l'utilisateur est Équipe
 */
const isEquipe = (req, res, next) => {
    if (!req.user || req.user.type !== 'equipe') {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux équipes'
        });
    }
    next();
};

/**
 * Middleware : Vérifier que l'équipe accède à ses propres données
 */
const isOwnEquipe = (req, res, next) => {
    const equipeIdFromParams = parseInt(req.params.equipeId || req.params.id);
    const equipeIdFromUser = req.user.equipeId;
    
    if (req.user.role === 'admin' || req.user.role === 'jure') {
        // Admin et jury peuvent accéder à toutes les équipes
        return next();
    }
    
    if (req.user.type !== 'equipe') {
        return res.status(403).json({
            success: false,
            message: 'Accès non autorisé'
        });
    }
    
    if (equipeIdFromParams && equipeIdFromParams !== equipeIdFromUser) {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé : vous ne pouvez consulter que les données de votre équipe'
        });
    }
    
    next();
};

/**
 * Middleware : Logger l'action dans la table logs
 */
const logAction = (action) => {
    return async (req, res, next) => {
        try {
            const utilisateurId = req.user?.id || null;
            const ipAddress = req.ip || req.connection.remoteAddress;
            const details = {
                method: req.method,
                path: req.path,
                params: req.params,
                query: req.query,
                body: req.body
            };
            
            await db.query(
                `INSERT INTO logs (utilisateur_id, action, details, ip_address) 
                 VALUES ($1, $2, $3, $4)`,
                [utilisateurId, action, JSON.stringify(details), ipAddress]
            );
        } catch (error) {
            console.error('Erreur lors du logging:', error);
        }
        
        next();
    };
};

module.exports = {
    verifyJWT,
    isAdmin,
    isJury,
    isEquipe,
    isOwnEquipe,
    logAction
};
