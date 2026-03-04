const db = require('../config/database');

/**
 * Modèle Question
 */
class QuestionModel {
    /**
     * Récupérer toutes les questions
     */
    static async getAll(filters = {}) {
        let query = 'SELECT * FROM questions WHERE 1=1';
        const params = [];

        if (filters.rubrique_id) {
            params.push(filters.rubrique_id);
            query += ` AND rubrique_id = $${params.length}`;
        }

        if (filters.type) {
            params.push(filters.type);
            query += ` AND type = $${params.length}`;
        }

        if (filters.difficulte) {
            params.push(filters.difficulte);
            query += ` AND difficulte = $${params.length}`;
        }

        if (filters.utilise !== undefined) {
            params.push(filters.utilise);
            query += ` AND utilise = $${params.length}`;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Récupérer une question par ID
     */
    static async getById(id) {
        const query = 'SELECT * FROM questions WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Créer une nouvelle question
     */
    static async create(data) {
        const query = `
            INSERT INTO questions (
                rubrique_id, question_texte, reponse_correcte, type,
                choix_a, choix_b, choix_c, choix_d,
                difficulte, points, reference
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

        const values = [
            data.rubrique_id,
            data.question_texte,
            data.reponse_correcte || null,
            data.type,
            data.choix_a || null,
            data.choix_b || null,
            data.choix_c || null,
            data.choix_d || null,
            data.difficulte || 'moyen',
            data.points || 1,
            data.reference || null
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Mettre à jour une question
     */
    static async update(id, data) {
        const query = `
            UPDATE questions 
            SET 
                question_texte = COALESCE($1, question_texte),
                reponse_correcte = COALESCE($2, reponse_correcte),
                type = COALESCE($3, type),
                choix_a = COALESCE($4, choix_a),
                choix_b = COALESCE($5, choix_b),
                choix_c = COALESCE($6, choix_c),
                choix_d = COALESCE($7, choix_d),
                difficulte = COALESCE($8, difficulte),
                points = COALESCE($9, points),
                reference = COALESCE($10, reference)
            WHERE id = $11
            RETURNING *
        `;

        const values = [
            data.question_texte,
            data.reponse_correcte,
            data.type,
            data.choix_a,
            data.choix_b,
            data.choix_c,
            data.choix_d,
            data.difficulte,
            data.points,
            data.reference,
            id
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    /**
     * Marquer une question comme utilisée
     */
    static async markAsUsed(id) {
        const query = 'UPDATE questions SET utilise = true WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Supprimer une question
     */
    static async delete(id) {
        const query = 'DELETE FROM questions WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Récupérer des questions aléatoires non utilisées
     */
    static async getRandomUnused(rubriqueId, limit = 10, excludeIds = []) {
        let query = `
            SELECT q.*, r.nom as rubrique_nom, r.temps_par_question
            FROM questions q
            JOIN rubriques r ON q.rubrique_id = r.id
            WHERE q.rubrique_id = $1 AND q.utilise = false
        `;

        const params = [rubriqueId];

        if (excludeIds && excludeIds.length > 0) {
            params.push(excludeIds);
            query += ` AND q.id NOT IN (SELECT unnest($${params.length}::int[]))`;
        }

        query += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Réinitialiser le statut 'utilise' de toutes les questions (ou pour une rubrique spécifique)
     */
    static async resetUsage(rubriqueId = null, excludeIds = []) {
        let query = 'UPDATE questions SET utilise = false WHERE utilise = true';
        const params = [];

        if (rubriqueId) {
            params.push(rubriqueId);
            query += ` AND rubrique_id = $${params.length}`;
        }

        if (excludeIds && excludeIds.length > 0) {
            params.push(excludeIds);
            query += ` AND id NOT IN (SELECT unnest($${params.length}::int[]))`;
        }

        query += ' RETURNING id';
        const result = await db.query(query, params);
        return result.rowCount;
    }

    /**
     * Récupérer des questions aléatoires avec réinitialisation automatique si épuisement
     */
    static async getRandomWithAutoReset(rubriqueId, limit = 1, excludeIds = []) {
        // 1. Tenter de récupérer des questions non utilisées
        let questions = await this.getRandomUnused(rubriqueId, limit, excludeIds);

        // 2. Si aucune question n'est trouvée, réinitialiser la rubrique et réessayer
        if (questions.length === 0) {
            console.log(`♻️ Épuisement des questions pour la rubrique ${rubriqueId}. Réinitialisation automatique...`);
            // On réinitialise, mais on garde 'utilise = true' pour les questions déjà posées dans CETTE session (excludeIds)
            await this.resetUsage(rubriqueId, excludeIds);
            questions = await this.getRandomUnused(rubriqueId, limit, excludeIds);
        }

        return questions;
    }
}

module.exports = QuestionModel;
