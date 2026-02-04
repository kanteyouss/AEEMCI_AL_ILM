const db = require('../config/database');

/**
 * Modèle Équipe
 */
class EquipeModel {
    /**
     * Récupérer toutes les équipes avec nombre de membres
     */
    static async getAll() {
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
        return result.rows;
    }

    /**
     * Récupérer une équipe par ID avec ses membres
     */
    static async getById(id) {
        // Infos équipe
        const equipeQuery = 'SELECT * FROM equipes WHERE id = $1';
        const equipeResult = await db.query(equipeQuery, [id]);
        
        if (equipeResult.rows.length === 0) {
            return null;
        }
        
        const equipe = equipeResult.rows[0];
        
        // Membres avec rôles
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
        
        return {
            ...equipe,
            membres: membresResult.rows
        };
    }

    /**
     * Récupérer une équipe par code d'accès
     */
    static async getByCode(code_acces) {
        const query = 'SELECT * FROM equipes WHERE code_acces = $1';
        const result = await db.query(query, [code_acces]);
        return result.rows[0];
    }

    /**
     * Créer une nouvelle équipe
     */
    static async create(data) {
        const query = `
            INSERT INTO equipes (nom, signification, couleur, symbole, code_acces)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const values = [
            data.nom,
            data.signification,
            data.couleur,
            data.symbole,
            data.code_acces
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Ajouter un membre à une équipe
     */
    static async addMember(equipeId, participantId, estCapitaine = false) {
        const query = `
            INSERT INTO membres_equipe (equipe_id, participant_id, est_capitaine)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const result = await db.query(query, [equipeId, participantId, estCapitaine]);
        return result.rows[0];
    }

    /**
     * Retirer un membre d'une équipe
     */
    static async removeMember(equipeId, participantId) {
        const query = `
            DELETE FROM membres_equipe 
            WHERE equipe_id = $1 AND participant_id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [equipeId, participantId]);
        return result.rows[0];
    }

    /**
     * Définir le capitaine d'une équipe
     */
    static async setCapitaine(equipeId, participantId) {
        // Retirer l'ancien capitaine
        await db.query(
            'UPDATE membres_equipe SET est_capitaine = false WHERE equipe_id = $1',
            [equipeId]
        );
        
        // Définir le nouveau capitaine
        const query = `
            UPDATE membres_equipe 
            SET est_capitaine = true 
            WHERE equipe_id = $1 AND participant_id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [equipeId, participantId]);
        return result.rows[0];
    }

    /**
     * Définir les rôles d'un membre
     */
    static async setRoles(equipeId, participantId, roles) {
        const query = `
            UPDATE membres_equipe 
            SET 
                role_adhan = $1,
                role_coran_ouvert = $2,
                role_coran_ferme = $3,
                role_hadith = $4
            WHERE equipe_id = $5 AND participant_id = $6
            RETURNING *
        `;
        
        const values = [
            roles.role_adhan || false,
            roles.role_coran_ouvert || false,
            roles.role_coran_ferme || false,
            roles.role_hadith || false,
            equipeId,
            participantId
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Récupérer le capitaine d'une équipe
     */
    static async getCapitaine(equipeId) {
        const query = `
            SELECT p.* 
            FROM participants p
            JOIN membres_equipe me ON p.id = me.participant_id
            WHERE me.equipe_id = $1 AND me.est_capitaine = true
        `;
        
        const result = await db.query(query, [equipeId]);
        return result.rows[0];
    }
}

module.exports = EquipeModel;
