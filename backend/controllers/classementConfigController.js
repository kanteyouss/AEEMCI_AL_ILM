const db = require('../config/database');

/**
 * Récupérer toutes les configurations
 */
const getAllConfig = async (req, res, next) => {
    try {
        const result = await db.query(
            'SELECT * FROM classement_config ORDER BY cle'
        );
        
        // Convertir en objet clé-valeur
        const config = {};
        result.rows.forEach(row => {
            let value = row.valeur;
            
            // Convertir selon le type
            if (row.type === 'boolean') {
                value = value === 'true';
            } else if (row.type === 'number') {
                value = parseInt(value) || 0;
            }
            
            config[row.cle] = value;
        });
        
        res.json({
            success: true,
            data: config
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour une configuration
 */
const updateConfig = async (req, res, next) => {
    try {
        const { cle, valeur } = req.body;
        
        const result = await db.query(
            `UPDATE classement_config 
             SET valeur = $1
             WHERE cle = $2
             RETURNING *`,
            [String(valeur), cle]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Configuration non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Configuration mise à jour',
            data: result.rows[0]
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour plusieurs configurations
 */
const updateMultipleConfig = async (req, res, next) => {
    try {
        const configs = req.body; // Directement l'objet { cle1: valeur1, cle2: valeur2, ... }
        
        if (!configs || typeof configs !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Format invalide. Envoyez un objet avec les configurations.'
            });
        }
        
        const client = await db.pool.connect();
        
        try {
            await client.query('BEGIN');
            
            for (const [cle, valeur] of Object.entries(configs)) {
                await client.query(
                    `UPDATE classement_config 
                     SET valeur = $1
                     WHERE cle = $2`,
                    [String(valeur), cle]
                );
            }
            
            await client.query('COMMIT');
            
            res.json({
                success: true,
                message: `${Object.keys(configs).length} configuration(s) mise(s) à jour`
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        next(error);
    }
};

/**
 * Publier le classement
 */
const publierClassement = async (req, res, next) => {
    try {
        const client = await db.pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Mettre à jour le statut de publication
            await client.query(
                `UPDATE classement_config 
                 SET valeur = 'true'
                 WHERE cle = 'classement_publie'`
            );
            
            // Enregistrer la date de publication
            await client.query(
                `UPDATE classement_config 
                 SET valeur = $1
                 WHERE cle = 'derniere_publication'`,
                [new Date().toISOString()]
            );
            
            await client.query('COMMIT');
            
            res.json({
                success: true,
                message: 'Classement publié avec succès'
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        next(error);
    }
};

/**
 * Dépublier le classement
 */
const depublierClassement = async (req, res, next) => {
    try {
        await db.query(
            `UPDATE classement_config 
             SET valeur = 'false'
             WHERE cle = 'classement_publie'`
        );
        
        res.json({
            success: true,
            message: 'Classement dépublié'
        });
        
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllConfig,
    updateConfig,
    updateMultipleConfig,
    publierClassement,
    depublierClassement
};
