const db = require('../config/database');
const { sendTeamAccessCode } = require('../config/email');

/**
 * Récupérer toutes les équipes
 */
const getAllEquipes = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                e.*,
                COUNT(DISTINCT me.participant_id) as nb_membres
            FROM equipes e
            LEFT JOIN membres_equipe me ON e.id = me.equipe_id
            GROUP BY e.id
            ORDER BY e.nom
        `;
        
        const result = await db.query(query);
        
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer une équipe par ID avec ses membres
 */
const getEquipeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Récupérer les infos de l'équipe
        const equipeQuery = `
            SELECT * FROM equipes WHERE id = $1
        `;
        const equipeResult = await db.query(equipeQuery, [id]);
        
        if (equipeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Équipe non trouvée'
            });
        }
        
        const equipe = equipeResult.rows[0];
        
        // Récupérer les membres avec leurs rôles
        const membresQuery = `
            SELECT 
                p.id,
                p.nom,
                p.prenom,
                p.email,
                p.telephone,
                p.etablissement,
                p.photo_url,
                me.est_capitaine,
                me.role_adhan,
                me.role_coran_ouvert,
                me.role_coran_ferme,
                me.role_hadith
            FROM participants p
            JOIN membres_equipe me ON p.id = me.participant_id
            WHERE me.equipe_id = $1
            ORDER BY me.est_capitaine DESC, p.nom
        `;
        
        const membresResult = await db.query(membresQuery, [id]);
        
        res.json({
            success: true,
            data: {
                ...equipe,
                membres: membresResult.rows
            }
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Créer une nouvelle équipe (Admin uniquement)
 */
const createEquipe = async (req, res, next) => {
    try {
        const { nom, signification, couleur, symbole, code_acces } = req.body;
        
        const query = `
            INSERT INTO equipes (nom, signification, couleur, symbole, code_acces)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const result = await db.query(query, [nom, signification, couleur, symbole, code_acces]);
        
        res.status(201).json({
            success: true,
            message: 'Équipe créée avec succès',
            data: result.rows[0]
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Ajouter un membre à une équipe
 */
const addMember = async (req, res, next) => {
    try {
        const { id } = req.params; // equipe_id
        const { participant_id, est_capitaine } = req.body;
        
        // Vérifier que le participant existe
        const participantCheck = await db.query(
            'SELECT * FROM participants WHERE id = $1',
            [participant_id]
        );
        
        if (participantCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Participant non trouvé'
            });
        }
        
        // Ajouter le membre
        const query = `
            INSERT INTO membres_equipe (equipe_id, participant_id, est_capitaine)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const result = await db.query(query, [id, participant_id, est_capitaine || false]);
        
        res.status(201).json({
            success: true,
            message: 'Membre ajouté à l\'équipe',
            data: result.rows[0]
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Retirer un membre d'une équipe
 */
const removeMember = async (req, res, next) => {
    try {
        const { id, participantId } = req.params;
        
        const query = `
            DELETE FROM membres_equipe 
            WHERE equipe_id = $1 AND participant_id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [id, participantId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Membre non trouvé dans cette équipe'
            });
        }
        
        res.json({
            success: true,
            message: 'Membre retiré de l\'équipe'
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Définir le capitaine d'une équipe
 */
const setCapitaine = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { participant_id } = req.body;
        
        // Débuter une transaction
        await db.query('BEGIN');
        
        // Retirer tous les capitaines de l'équipe
        await db.query(
            'UPDATE membres_equipe SET est_capitaine = false WHERE equipe_id = $1',
            [id]
        );
        
        // Définir le nouveau capitaine
        const result = await db.query(
            `UPDATE membres_equipe 
             SET est_capitaine = true 
             WHERE equipe_id = $1 AND participant_id = $2
             RETURNING *`,
            [id, participant_id]
        );
        
        if (result.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Membre non trouvé dans cette équipe'
            });
        }
        
        await db.query('COMMIT');
        
        res.json({
            success: true,
            message: 'Capitaine défini avec succès',
            data: result.rows[0]
        });
        
    } catch (error) {
        await db.query('ROLLBACK');
        next(error);
    }
};

/**
 * Définir les rôles des membres (Adhan, Coran, Hadith)
 */
const setRoles = async (req, res, next) => {
    try {
        const { id, participantId } = req.params;
        const { role_adhan, role_coran_ouvert, role_coran_ferme, role_hadith } = req.body;
        
        const query = `
            UPDATE membres_equipe
            SET 
                role_adhan = COALESCE($3, role_adhan),
                role_coran_ouvert = COALESCE($4, role_coran_ouvert),
                role_coran_ferme = COALESCE($5, role_coran_ferme),
                role_hadith = COALESCE($6, role_hadith)
            WHERE equipe_id = $1 AND participant_id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [
            id, 
            participantId, 
            role_adhan, 
            role_coran_ouvert, 
            role_coran_ferme, 
            role_hadith
        ]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Membre non trouvé dans cette équipe'
            });
        }
        
        res.json({
            success: true,
            message: 'Rôles mis à jour',
            data: result.rows[0]
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Envoyer le code d'accès au capitaine par email
 */
const sendAccessCode = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Récupérer l'équipe
        const equipeQuery = 'SELECT * FROM equipes WHERE id = $1';
        const equipeResult = await db.query(equipeQuery, [id]);
        
        if (equipeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Équipe non trouvée'
            });
        }
        
        const equipe = equipeResult.rows[0];
        
        // Récupérer le capitaine
        const capitaineQuery = `
            SELECT p.* 
            FROM participants p
            JOIN membres_equipe me ON p.id = me.participant_id
            WHERE me.equipe_id = $1 AND me.est_capitaine = true
        `;
        
        const capitaineResult = await db.query(capitaineQuery, [id]);
        
        if (capitaineResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Aucun capitaine défini pour cette équipe'
            });
        }
        
        const capitaine = capitaineResult.rows[0];
        
        // Envoyer l'email
        const emailResult = await sendTeamAccessCode(equipe, capitaine);
        
        if (emailResult.success) {
            res.json({
                success: true,
                message: `Code d'accès envoyé à ${capitaine.email}`
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'envoi de l\'email',
                error: emailResult.error
            });
        }
        
    } catch (error) {
        next(error);
    }
};

/**
 * Valider et générer les codes pour toutes les équipes
 */
const validateAllEquipes = async (req, res, next) => {
    const client = await db.pool.connect();
    
    try {
        const { equipes } = req.body;
        
        if (!equipes || !Array.isArray(equipes)) {
            return res.status(400).json({
                success: false,
                message: 'Format de données invalide'
            });
        }
        
        await client.query('BEGIN');
        
        const results = [];
        
        for (const equipeData of equipes) {
            const { equipe_id, membres, capitaine_id } = equipeData;
            
            // Vérifier que l'équipe a des membres
            if (!membres || membres.length === 0) {
                continue;
            }
            
            // Vérifier que le capitaine est défini
            if (!capitaine_id) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: `L'équipe ${equipe_id} n'a pas de capitaine`
                });
            }
            
            // Vérifier que le capitaine fait partie des membres
            if (!membres.includes(capitaine_id)) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: `Le capitaine doit faire partie de l'équipe ${equipe_id}`
                });
            }
            
            // Supprimer les anciennes associations
            await client.query(
                'DELETE FROM membres_equipe WHERE equipe_id = $1',
                [equipe_id]
            );
            
            // Ajouter les nouveaux membres
            for (const participantId of membres) {
                const estCapitaine = participantId === capitaine_id;
                
                await client.query(
                    `INSERT INTO membres_equipe (equipe_id, participant_id, est_capitaine) 
                     VALUES ($1, $2, $3)`,
                    [equipe_id, participantId, estCapitaine]
                );
            }
            
            // Générer un code d'accès unique si non existant
            const equipeQuery = await client.query(
                'SELECT * FROM equipes WHERE id = $1',
                [equipe_id]
            );
            
            let code = equipeQuery.rows[0].code_acces;
            
            if (!code) {
                // Générer un code aléatoire de 6 caractères
                code = Math.random().toString(36).substring(2, 8).toUpperCase();
                
                // Vérifier l'unicité du code
                let isUnique = false;
                let attempts = 0;
                
                while (!isUnique && attempts < 10) {
                    const checkCode = await client.query(
                        'SELECT id FROM equipes WHERE code_acces = $1 AND id != $2',
                        [code, equipe_id]
                    );
                    
                    if (checkCode.rows.length === 0) {
                        isUnique = true;
                    } else {
                        code = Math.random().toString(36).substring(2, 8).toUpperCase();
                        attempts++;
                    }
                }
                
                // Mettre à jour l'équipe avec le code
                await client.query(
                    'UPDATE equipes SET code_acces = $1 WHERE id = $2',
                    [code, equipe_id]
                );
            }
            
            results.push({
                equipe_id,
                code_acces: code,
                nb_membres: membres.length
            });
        }
        
        await client.query('COMMIT');
        
        res.json({
            success: true,
            message: 'Équipes validées avec succès',
            data: results
        });
        
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

module.exports = {
    getAllEquipes,
    getEquipeById,
    createEquipe,
    addMember,
    removeMember,
    setCapitaine,
    setRoles,
    sendAccessCode,
    validateAllEquipes
};
