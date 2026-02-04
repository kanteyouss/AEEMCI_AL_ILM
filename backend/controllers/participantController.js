const db = require('../config/database');
const { sendWelcomeEmail } = require('../config/email');
const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Récupérer tous les participants
 */
const getAllParticipants = async (req, res, next) => {
    try {
        const { etablissement, disponibilite } = req.query;
        
        let query = 'SELECT * FROM participants WHERE 1=1';
        const params = [];
        
        if (etablissement) {
            params.push(etablissement);
            query += ` AND etablissement = $${params.length}`;
        }
        
        if (disponibilite !== undefined) {
            params.push(disponibilite === 'true');
            query += ` AND disponibilite = $${params.length}`;
        }
        
        query += ' ORDER BY nom, prenom';
        
        const result = await db.query(query, params);
        
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
 * Récupérer un participant par ID
 */
const getParticipantById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                p.*,
                e.id AS equipe_id,
                e.nom AS equipe_nom,
                e.couleur AS equipe_couleur,
                me.est_capitaine
            FROM participants p
            LEFT JOIN membres_equipe me ON p.id = me.participant_id
            LEFT JOIN equipes e ON me.equipe_id = e.id
            WHERE p.id = $1
        `;
        
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Participant non trouvé'
            });
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Créer un nouveau participant
 */
const createParticipant = async (req, res, next) => {
    try {
        const {
            nom,
            prenom,
            email,
            telephone,
            etablissement,
            niveau_coranique,
            connaissance_hadiths,
            memorisation_sourate
        } = req.body;
        
        const query = `
            INSERT INTO participants (
                nom, prenom, email, telephone, etablissement,
                niveau_coranique, connaissance_hadiths, memorisation_sourate
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const result = await db.query(query, [
            nom,
            prenom,
            email || null,
            telephone,
            etablissement,
            niveau_coranique || null,
            connaissance_hadiths || null,
            memorisation_sourate || null
        ]);
        
        const participant = result.rows[0];
        
        // Envoyer email de bienvenue si email fourni
        if (email) {
            await sendWelcomeEmail(participant);
        }
        
        res.status(201).json({
            success: true,
            message: 'Participant inscrit avec succès',
            data: participant
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour un participant
 */
const updateParticipant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            nom,
            prenom,
            email,
            telephone,
            etablissement,
            niveau_coranique,
            connaissance_hadiths,
            memorisation_sourate,
            disponibilite
        } = req.body;
        
        const query = `
            UPDATE participants
            SET 
                nom = COALESCE($2, nom),
                prenom = COALESCE($3, prenom),
                email = COALESCE($4, email),
                telephone = COALESCE($5, telephone),
                etablissement = COALESCE($6, etablissement),
                niveau_coranique = COALESCE($7, niveau_coranique),
                connaissance_hadiths = COALESCE($8, connaissance_hadiths),
                memorisation_sourate = COALESCE($9, memorisation_sourate),
                disponibilite = COALESCE($10, disponibilite)
            WHERE id = $1
            RETURNING *
        `;
        
        const result = await db.query(query, [
            id,
            nom,
            prenom,
            email,
            telephone,
            etablissement,
            niveau_coranique,
            connaissance_hadiths,
            memorisation_sourate,
            disponibilite
        ]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Participant non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Participant mis à jour',
            data: result.rows[0]
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Supprimer un participant
 */
const deleteParticipant = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const result = await db.query(
            'DELETE FROM participants WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Participant non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Participant supprimé'
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Importer des participants depuis un fichier CSV (Google Forms)
 */
const importCSV = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier CSV fourni'
            });
        }
        
        // Lire le fichier CSV
        const fileContent = await fs.readFile(req.file.path, 'utf-8');
        
        // Parser le CSV
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        
        const created = [];
        const errors = [];
        
        // Insérer chaque participant
        for (const record of records) {
            try {
                const query = `
                    INSERT INTO participants (
                        nom, prenom, email, telephone, etablissement,
                        niveau_coranique, connaissance_hadiths, memorisation_sourate
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING *
                `;
                
                const result = await db.query(query, [
                    record.nom || record.Nom,
                    record.prenom || record['Prénom'],
                    record.email || record.Email || null,
                    record.telephone || record['Téléphone'],
                    record.etablissement || record['Établissement'],
                    record.niveau_coranique || null,
                    record.connaissance_hadiths || null,
                    record.memorisation_sourate || null
                ]);
                
                created.push(result.rows[0]);
                
                // Envoyer email si disponible
                if (result.rows[0].email) {
                    await sendWelcomeEmail(result.rows[0]);
                }
                
            } catch (error) {
                errors.push({
                    record,
                    error: error.message
                });
            }
        }
        
        // Supprimer le fichier temporaire
        await fs.unlink(req.file.path);
        
        res.json({
            success: true,
            message: `${created.length} participants importés avec succès`,
            data: {
                created: created.length,
                errors: errors.length,
                errorDetails: errors
            }
        });
        
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    importCSV
};
