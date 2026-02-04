const db = require('../config/database');

/**
 * Modèle Participant
 */
class ParticipantModel {
    /**
     * Récupérer tous les participants avec filtres optionnels
     */
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM participants WHERE 1=1';
        const params = [];
        
        if (filters.etablissement) {
            params.push(filters.etablissement);
            query += ` AND etablissement = $${params.length}`;
        }
        
        if (filters.disponibilite !== undefined) {
            params.push(filters.disponibilite);
            query += ` AND disponibilite = $${params.length}`;
        }
        
        query += ' ORDER BY nom, prenom';
        
        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Récupérer un participant par ID avec son équipe
     */
    static async getById(id) {
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
        return result.rows[0];
    }

    /**
     * Créer un nouveau participant
     */
    static async create(data) {
        const query = `
            INSERT INTO participants (
                nom, prenom, email, telephone, etablissement,
                niveau_coranique, connaissance_hadiths, memorisation_sourate
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const values = [
            data.nom,
            data.prenom,
            data.email || null,
            data.telephone,
            data.etablissement,
            data.niveau_coranique || null,
            data.connaissance_hadiths || null,
            data.memorisation_sourate || null
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Mettre à jour un participant
     */
    static async update(id, data) {
        const query = `
            UPDATE participants 
            SET 
                nom = COALESCE($1, nom),
                prenom = COALESCE($2, prenom),
                email = COALESCE($3, email),
                telephone = COALESCE($4, telephone),
                etablissement = COALESCE($5, etablissement),
                disponibilite = COALESCE($6, disponibilite),
                photo_url = COALESCE($7, photo_url)
            WHERE id = $8
            RETURNING *
        `;
        
        const values = [
            data.nom,
            data.prenom,
            data.email,
            data.telephone,
            data.etablissement,
            data.disponibilite,
            data.photo_url,
            id
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Supprimer un participant
     */
    static async delete(id) {
        const query = 'DELETE FROM participants WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Vérifier si un email ou téléphone existe déjà
     */
    static async checkExisting(email, telephone, excludeId = null) {
        let query = 'SELECT * FROM participants WHERE (email = $1 OR telephone = $2)';
        const params = [email, telephone];
        
        if (excludeId) {
            params.push(excludeId);
            query += ` AND id != $${params.length}`;
        }
        
        const result = await db.query(query, params);
        return result.rows[0];
    }

    /**
     * Récupérer les participants sans équipe
     */
    static async getWithoutTeam() {
        const query = `
            SELECT p.* 
            FROM participants p
            LEFT JOIN membres_equipe me ON p.id = me.participant_id
            WHERE me.id IS NULL AND p.disponibilite = true
            ORDER BY p.nom, p.prenom
        `;
        
        const result = await db.query(query);
        return result.rows;
    }
}

module.exports = ParticipantModel;
