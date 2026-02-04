const db = require('../config/database');

/**
 * Modèle Rubrique
 */
class RubriqueModel {
    /**
     * Récupérer toutes les rubriques
     */
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM rubriques WHERE 1=1';
        const params = [];
        
        if (filters.type) {
            params.push(filters.type);
            query += ` AND type = $${params.length}`;
        }
        
        query += ' ORDER BY nom';
        
        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Récupérer une rubrique par ID
     */
    static async getById(id) {
        const query = 'SELECT * FROM rubriques WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Créer une nouvelle rubrique
     */
    static async create(data) {
        const query = `
            INSERT INTO rubriques (
                nom, type, points_max, temps_par_question, 
                description, criteres_evaluation
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            data.nom,
            data.type,
            data.points_max,
            data.temps_par_question || null,
            data.description || null,
            data.criteres_evaluation || null
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Mettre à jour une rubrique
     */
    static async update(id, data) {
        const query = `
            UPDATE rubriques 
            SET 
                nom = COALESCE($1, nom),
                type = COALESCE($2, type),
                points_max = COALESCE($3, points_max),
                temps_par_question = COALESCE($4, temps_par_question),
                description = COALESCE($5, description),
                criteres_evaluation = COALESCE($6, criteres_evaluation)
            WHERE id = $7
            RETURNING *
        `;
        
        const values = [
            data.nom,
            data.type,
            data.points_max,
            data.temps_par_question,
            data.description,
            data.criteres_evaluation,
            id
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Supprimer une rubrique
     */
    static async delete(id) {
        const query = 'DELETE FROM rubriques WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = RubriqueModel;
