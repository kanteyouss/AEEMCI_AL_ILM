const db = require('../config/database');

/**
 * Modèle Évaluation
 */
class EvaluationModel {
    /**
     * Récupérer toutes les évaluations
     */
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM evaluations WHERE 1=1';
        const params = [];
        
        if (filters.jure_id) {
            params.push(filters.jure_id);
            query += ` AND jure_id = $${params.length}`;
        }
        
        if (filters.statut) {
            params.push(filters.statut);
            query += ` AND statut = $${params.length}`;
        }
        
        query += ' ORDER BY date_evaluation DESC';
        
        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Récupérer une évaluation par ID
     */
    static async getById(id) {
        const query = `
            SELECT 
                e.*,
                u.nom AS jure_nom,
                u.prenom AS jure_prenom,
                s.equipe_id,
                s.rubrique_id
            FROM evaluations e
            LEFT JOIN utilisateurs u ON e.jure_id = u.id
            JOIN soumissions s ON e.soumission_id = s.id
            WHERE e.id = $1
        `;
        
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Créer une nouvelle évaluation
     */
    static async create(data) {
        const query = `
            INSERT INTO evaluations (
                soumission_id, jure_id, 
                note_voix, note_tajwid, note_prononciation, 
                note_totale, commentaire
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const values = [
            data.soumission_id,
            data.jure_id,
            data.note_voix || null,
            data.note_tajwid || null,
            data.note_prononciation || null,
            data.note_totale,
            data.commentaire || null
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Mettre à jour une évaluation
     */
    static async update(id, data) {
        const query = `
            UPDATE evaluations 
            SET 
                note_voix = COALESCE($1, note_voix),
                note_tajwid = COALESCE($2, note_tajwid),
                note_prononciation = COALESCE($3, note_prononciation),
                note_totale = COALESCE($4, note_totale),
                commentaire = COALESCE($5, commentaire),
                statut = COALESCE($6, statut)
            WHERE id = $7
            RETURNING *
        `;
        
        const values = [
            data.note_voix,
            data.note_tajwid,
            data.note_prononciation,
            data.note_totale,
            data.commentaire,
            data.statut,
            id
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Supprimer une évaluation
     */
    static async delete(id) {
        const query = 'DELETE FROM evaluations WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Récupérer les évaluations d'une soumission
     */
    static async getBySoumission(soumissionId) {
        const query = `
            SELECT 
                e.*,
                u.nom AS jure_nom,
                u.prenom AS jure_prenom
            FROM evaluations e
            LEFT JOIN utilisateurs u ON e.jure_id = u.id
            WHERE e.soumission_id = $1
            ORDER BY e.date_evaluation DESC
        `;
        
        const result = await db.query(query, [soumissionId]);
        return result.rows;
    }

    /**
     * Vérifier si un juré a déjà évalué une soumission
     */
    static async checkExisting(soumissionId, jureId) {
        const query = `
            SELECT * FROM evaluations 
            WHERE soumission_id = $1 AND jure_id = $2
        `;
        
        const result = await db.query(query, [soumissionId, jureId]);
        return result.rows[0];
    }

    /**
     * Calculer la moyenne des évaluations pour une soumission
     */
    static async getAverageScore(soumissionId) {
        const query = `
            SELECT 
                AVG(note_totale) as moyenne,
                COUNT(*) as nb_evaluations
            FROM evaluations 
            WHERE soumission_id = $1 AND statut = 'valide'
        `;
        
        const result = await db.query(query, [soumissionId]);
        return result.rows[0];
    }
}

module.exports = EvaluationModel;
