const db = require('../config/database');

/**
 * Modèle Manche
 */
class MancheModel {
    /**
     * Récupérer toutes les manches
     */
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM manches WHERE 1=1';
        const params = [];
        
        if (filters.type) {
            params.push(filters.type);
            query += ` AND type = $${params.length}`;
        }
        
        if (filters.statut) {
            params.push(filters.statut);
            query += ` AND statut = $${params.length}`;
        }
        
        query += ' ORDER BY date_manche DESC, heure_debut DESC';
        
        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Récupérer une manche par ID avec ses rubriques
     */
    static async getById(id) {
        // Infos manche
        const mancheQuery = 'SELECT * FROM manches WHERE id = $1';
        const mancheResult = await db.query(mancheQuery, [id]);
        
        if (mancheResult.rows.length === 0) {
            return null;
        }
        
        const manche = mancheResult.rows[0];
        
        // Rubriques associées
        const rubriquesQuery = `
            SELECT 
                r.*,
                rm.ordre_passage,
                rm.actif
            FROM rubriques r
            JOIN rubriques_manche rm ON r.id = rm.rubrique_id
            WHERE rm.manche_id = $1
            ORDER BY rm.ordre_passage
        `;
        
        const rubriquesResult = await db.query(rubriquesQuery, [id]);
        
        return {
            ...manche,
            rubriques: rubriquesResult.rows
        };
    }

    /**
     * Créer une nouvelle manche
     */
    static async create(data) {
        const query = `
            INSERT INTO manches (nom, type, date_manche, heure_debut, heure_fin, description)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            data.nom,
            data.type,
            data.date_manche,
            data.heure_debut || null,
            data.heure_fin || null,
            data.description || null
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Mettre à jour le statut d'une manche
     */
    static async updateStatut(id, statut) {
        const query = `
            UPDATE manches 
            SET statut = $1
            WHERE id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [statut, id]);
        return result.rows[0];
    }

    /**
     * Ajouter une rubrique à une manche
     */
    static async addRubrique(mancheId, rubriqueId, ordrePassage) {
        const query = `
            INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const result = await db.query(query, [mancheId, rubriqueId, ordrePassage]);
        return result.rows[0];
    }

    /**
     * Retirer une rubrique d'une manche
     */
    static async removeRubrique(mancheId, rubriqueId) {
        const query = `
            DELETE FROM rubriques_manche 
            WHERE manche_id = $1 AND rubrique_id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [mancheId, rubriqueId]);
        return result.rows[0];
    }

    /**
     * Récupérer les manches publiées
     */
    static async getPublished() {
        const query = `
            SELECT * FROM manches 
            WHERE statut IN ('publie', 'en_cours', 'termine')
            ORDER BY date_manche DESC
        `;
        
        const result = await db.query(query);
        return result.rows;
    }
}

module.exports = MancheModel;
