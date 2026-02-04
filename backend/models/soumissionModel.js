const db = require('../config/database');

/**
 * Modèle Soumission
 */
class SoumissionModel {
    /**
     * Récupérer toutes les soumissions
     */
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM soumissions WHERE 1=1';
        const params = [];
        
        if (filters.equipe_id) {
            params.push(filters.equipe_id);
            query += ` AND equipe_id = $${params.length}`;
        }
        
        if (filters.manche_id) {
            params.push(filters.manche_id);
            query += ` AND manche_id = $${params.length}`;
        }
        
        if (filters.rubrique_id) {
            params.push(filters.rubrique_id);
            query += ` AND rubrique_id = $${params.length}`;
        }
        
        query += ' ORDER BY date_soumission DESC';
        
        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Récupérer une soumission par ID
     */
    static async getById(id) {
        const query = `
            SELECT 
                s.*,
                e.nom AS equipe_nom,
                p.nom AS participant_nom,
                p.prenom AS participant_prenom,
                r.nom AS rubrique_nom
            FROM soumissions s
            JOIN equipes e ON s.equipe_id = e.id
            JOIN participants p ON s.participant_id = p.id
            JOIN rubriques r ON s.rubrique_id = r.id
            WHERE s.id = $1
        `;
        
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Créer une nouvelle soumission
     */
    static async create(data) {
        const query = `
            INSERT INTO soumissions (
                equipe_id, manche_id, rubrique_id, question_id,
                participant_id, reponse_texte, fichier_audio_url, temps_reponse
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const values = [
            data.equipe_id,
            data.manche_id,
            data.rubrique_id,
            data.question_id || null,
            data.participant_id,
            data.reponse_texte || null,
            data.fichier_audio_url || null,
            data.temps_reponse || null
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Mettre à jour une soumission
     */
    static async update(id, data) {
        const query = `
            UPDATE soumissions 
            SET 
                reponse_texte = COALESCE($1, reponse_texte),
                fichier_audio_url = COALESCE($2, fichier_audio_url),
                temps_reponse = COALESCE($3, temps_reponse)
            WHERE id = $4
            RETURNING *
        `;
        
        const values = [
            data.reponse_texte,
            data.fichier_audio_url,
            data.temps_reponse,
            id
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Supprimer une soumission
     */
    static async delete(id) {
        const query = 'DELETE FROM soumissions WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Récupérer les soumissions d'une équipe pour une manche
     */
    static async getByEquipeAndManche(equipeId, mancheId) {
        const query = `
            SELECT 
                s.*,
                r.nom AS rubrique_nom,
                p.nom AS participant_nom,
                p.prenom AS participant_prenom
            FROM soumissions s
            JOIN rubriques r ON s.rubrique_id = r.id
            JOIN participants p ON s.participant_id = p.id
            WHERE s.equipe_id = $1 AND s.manche_id = $2
            ORDER BY s.date_soumission DESC
        `;
        
        const result = await db.query(query, [equipeId, mancheId]);
        return result.rows;
    }

    /**
     * Vérifier si une soumission existe déjà
     */
    static async checkExisting(equipeId, mancheId, rubriqueId, questionId) {
        const query = `
            SELECT * FROM soumissions 
            WHERE equipe_id = $1 AND manche_id = $2 
            AND rubrique_id = $3 AND question_id = $4
        `;
        
        const result = await db.query(query, [equipeId, mancheId, rubriqueId, questionId]);
        return result.rows[0];
    }
}

module.exports = SoumissionModel;
