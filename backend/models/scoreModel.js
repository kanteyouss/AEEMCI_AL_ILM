const db = require('../config/database');

/**
 * Modèle Score
 */
class ScoreModel {
    /**
     * Récupérer tous les scores
     */
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM scores WHERE 1=1';
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
        
        query += ' ORDER BY date_calcul DESC';
        
        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Récupérer un score par ID
     */
    static async getById(id) {
        const query = `
            SELECT 
                s.*,
                e.nom AS equipe_nom,
                m.nom AS manche_nom,
                r.nom AS rubrique_nom
            FROM scores s
            JOIN equipes e ON s.equipe_id = e.id
            JOIN manches m ON s.manche_id = m.id
            JOIN rubriques r ON s.rubrique_id = r.id
            WHERE s.id = $1
        `;
        
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Créer ou mettre à jour un score
     */
    static async upsert(data) {
        const query = `
            INSERT INTO scores (equipe_id, manche_id, rubrique_id, points_obtenus, points_max)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (equipe_id, manche_id, rubrique_id)
            DO UPDATE SET 
                points_obtenus = EXCLUDED.points_obtenus,
                date_calcul = CURRENT_TIMESTAMP
            RETURNING *
        `;
        
        const values = [
            data.equipe_id,
            data.manche_id,
            data.rubrique_id,
            data.points_obtenus,
            data.points_max
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Récupérer le score total d'une équipe
     */
    static async getTotalByEquipe(equipeId) {
        const query = `
            SELECT 
                e.id,
                e.nom,
                e.couleur,
                e.symbole,
                COALESCE(SUM(s.points_obtenus), 0) AS points_totaux,
                COALESCE(SUM(s.points_max), 0) AS points_max_possibles,
                COUNT(DISTINCT s.manche_id) AS nb_manches
            FROM equipes e
            LEFT JOIN scores s ON e.id = s.equipe_id
            WHERE e.id = $1
            GROUP BY e.id, e.nom, e.couleur, e.symbole
        `;
        
        const result = await db.query(query, [equipeId]);
        return result.rows[0];
    }

    /**
     * Récupérer les scores d'une manche
     */
    static async getByManche(mancheId) {
        const query = `
            SELECT 
                e.id AS equipe_id,
                e.nom AS equipe_nom,
                e.couleur,
                r.nom AS rubrique_nom,
                s.points_obtenus,
                s.points_max
            FROM scores s
            JOIN equipes e ON s.equipe_id = e.id
            JOIN rubriques r ON s.rubrique_id = r.id
            WHERE s.manche_id = $1
            ORDER BY e.nom, r.nom
        `;
        
        const result = await db.query(query, [mancheId]);
        return result.rows;
    }

    /**
     * Récupérer le classement général
     */
    static async getClassementGeneral() {
        const query = `
            SELECT 
                e.id,
                e.nom AS equipe,
                e.couleur,
                e.symbole,
                COALESCE(SUM(s.points_obtenus), 0) AS points_totaux,
                COUNT(DISTINCT s.manche_id) AS nb_manches_jouees,
                RANK() OVER (ORDER BY COALESCE(SUM(s.points_obtenus), 0) DESC) AS rang
            FROM equipes e
            LEFT JOIN scores s ON e.id = s.equipe_id
            GROUP BY e.id, e.nom, e.couleur, e.symbole
            ORDER BY points_totaux DESC
        `;
        
        const result = await db.query(query);
        return result.rows;
    }

    /**
     * Supprimer un score
     */
    static async delete(id) {
        const query = 'DELETE FROM scores WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Calculer automatiquement un score basé sur les évaluations
     */
    static async calculateFromEvaluations(equipeId, mancheId, rubriqueId) {
        const query = `
            SELECT 
                AVG(ev.note_totale) as moyenne_notes,
                r.points_max
            FROM soumissions s
            JOIN evaluations ev ON s.id = ev.soumission_id
            JOIN rubriques r ON s.rubrique_id = r.id
            WHERE s.equipe_id = $1 
            AND s.manche_id = $2 
            AND s.rubrique_id = $3
            AND ev.statut = 'valide'
            GROUP BY r.points_max
        `;
        
        const result = await db.query(query, [equipeId, mancheId, rubriqueId]);
        return result.rows[0];
    }
}

module.exports = ScoreModel;
