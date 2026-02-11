const db = require('../config/database');

/**
 * Récupérer le classement général ou filtré
 */
const getClassementGeneral = async (req, res, next) => {
    try {
        const { manche_id, rubrique_id, etape } = req.query;

        let query = `
            SELECT 
                e.id,
                e.nom AS nom_equipe,
                e.couleur,
                e.symbole,
                COALESCE(sub.score_total, 0) AS score_total,
                COALESCE(sub.nombre_manches, 0) AS nombre_manches,
                (SELECT COUNT(*) FROM membres_equipe WHERE equipe_id = e.id) AS nombre_participants,
                RANK() OVER (ORDER BY COALESCE(sub.score_total, 0) DESC, COALESCE(sub.nombre_manches, 0) DESC) AS rang
            FROM equipes e
            LEFT JOIN (
                SELECT 
                    s.equipe_id,
                    SUM(s.points_obtenus) AS score_total,
                    COUNT(DISTINCT s.manche_id) AS nombre_manches
                FROM scores s
                LEFT JOIN manches m ON s.manche_id = m.id
                WHERE 1=1
        `;

        const params = [];
        const conditions = [];

        // Filtre par manche
        if (manche_id) {
            params.push(manche_id);
            conditions.push(`s.manche_id = $${params.length}`);
        }

        // Filtre par rubrique
        if (rubrique_id) {
            params.push(rubrique_id);
            conditions.push(`s.rubrique_id = $${params.length}`);
        }

        // Filtre par étape
        if (etape) {
            params.push(etape);
            conditions.push(`m.etape = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        query += `
                GROUP BY s.equipe_id
            ) sub ON e.id = sub.equipe_id
            ORDER BY score_total DESC, nombre_manches DESC
        `;

        const result = await db.query(query, params);

        res.json({
            success: true,
            classement: result.rows
        });

    } catch (error) {
        console.error('Erreur classement:', error);
        next(error);
    }
};

/**
 * Récupérer le classement pour une manche spécifique
 */
const getClassementManche = async (req, res, next) => {
    try {
        const { mancheId } = req.params;

        // Récupérer les infos de la manche
        const mancheQuery = 'SELECT * FROM manches WHERE id = $1';
        const mancheResult = await db.query(mancheQuery, [mancheId]);
        const manche = mancheResult.rows[0];

        const query = `
            WITH EquipeScores AS (
                SELECT 
                    s.equipe_id,
                    jsonb_object_agg(r.nom, s.points_obtenus) as details,
                    SUM(s.points_obtenus) as total
                FROM scores s
                JOIN rubriques r ON s.rubrique_id = r.id
                WHERE s.manche_id = $1
                GROUP BY s.equipe_id
            )
            SELECT 
                e.id,
                e.nom AS nom_equipe,
                e.couleur,
                e.symbole,
                COALESCE(es.total, 0) AS score_total,
                es.details AS details_rubriques,
                RANK() OVER (ORDER BY COALESCE(es.total, 0) DESC) AS rang
            FROM equipes e
            LEFT JOIN EquipeScores es ON e.id = es.equipe_id
            WHERE e.id IN (
                SELECT DISTINCT equipe_id FROM equipes_manche WHERE manche_id = $1
                UNION
                SELECT DISTINCT equipe_id FROM scores WHERE manche_id = $1
            )
            ORDER BY score_total DESC
        `;

        // Récupérer les points max des rubriques de cette manche spécifique
        const rubriquesQuery = `
            SELECT r.nom, r.points_max
            FROM rubriques r
            JOIN rubriques_manche rm ON r.id = rm.rubrique_id
            WHERE rm.manche_id = $1
        `;

        const [result, rubriquesResult] = await Promise.all([
            db.query(query, [mancheId]),
            db.query(rubriquesQuery, [mancheId])
        ]);

        res.json({
            success: true,
            classement: result.rows,
            rubriques: rubriquesResult.rows,
            manche: manche // Inclut note_bas_page
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer les scores détaillés d'une équipe
 */
const getScoresEquipe = async (req, res, next) => {
    try {
        const { equipeId } = req.params;

        const query = `
            SELECT 
                s.*,
                m.nom AS manche_nom,
                m.date_manche,
                r.nom AS rubrique_nom
            FROM scores s
            JOIN manches m ON s.manche_id = m.id
            JOIN rubriques r ON s.rubrique_id = r.id
            WHERE s.equipe_id = $1
            ORDER BY m.date_manche, r.nom
        `;

        const result = await db.query(query, [equipeId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer le classement par étape (cumulé des manches de l'étape)
 */
const getClassementEtape = async (req, res, next) => {
    try {
        const { etape } = req.params; // 'preliminaire', 'quart', 'demi', 'finale'

        // Récupérer les IDs des manches de cette étape
        const manchesResult = await db.query(
            'SELECT id FROM manches WHERE etape = $1 ORDER BY numero',
            [etape]
        );

        if (manchesResult.rows.length === 0) {
            return res.json({
                success: true,
                etape,
                classement: [],
                message: 'Aucune manche pour cette étape'
            });
        }

        const mancheIds = manchesResult.rows.map(m => m.id);

        // Calculer le classement cumulé pour cette étape avec détails par rubrique
        const query = `
            WITH EquipeRubriques AS (
                SELECT 
                    s.equipe_id, 
                    r.nom, 
                    SUM(s.points_obtenus) as score
                FROM scores s
                JOIN rubriques r ON s.rubrique_id = r.id
                WHERE s.manche_id = ANY($1)
                GROUP BY s.equipe_id, r.nom
            ),
            EquipeDetails AS (
                SELECT 
                    equipe_id,
                    SUM(score) as total,
                    jsonb_object_agg(nom, score) as details
                FROM EquipeRubriques
                GROUP BY equipe_id
            )
            SELECT 
                e.id,
                e.nom AS nom_equipe,
                e.couleur,
                e.symbole,
                COALESCE(ed.total, 0) AS score_total,
                ed.details AS details_rubriques,
                (SELECT COUNT(*) FROM membres_equipe WHERE equipe_id = e.id) AS nombre_participants,
                RANK() OVER (ORDER BY COALESCE(ed.total, 0) DESC) AS rang
            FROM equipes e
            LEFT JOIN EquipeDetails ed ON e.id = ed.equipe_id
            WHERE e.id IN (
                SELECT DISTINCT equipe_id FROM equipes_manche WHERE manche_id = ANY($1)
                UNION
                SELECT DISTINCT equipe_id FROM scores WHERE manche_id = ANY($1)
            )
            ORDER BY score_total DESC
        `;

        const result = await db.query(query, [mancheIds]);

        // Récupérer les points max par rubrique pour cette étape
        // On prend le max des points_max (car c'est le même pour une rubrique donnée)
        // On évite de sommer car les équipes ne participent généralement qu'à une seule manche de la phase
        const rubriquesQuery = `
            SELECT r.nom, r.points_max
            FROM rubriques r
            JOIN rubriques_manche rm ON r.id = rm.rubrique_id
            WHERE rm.manche_id = ANY($1)
            GROUP BY r.nom, r.points_max
        `;
        const rubriquesResult = await db.query(rubriquesQuery, [mancheIds]);

        // Calculer le total possible (somme des points max des rubriques * nombre d'occurences si nécessaire, 
        // mais ici on simplifie en prenant la somme des points max distincts présents, 
        // attention si une rubrique revient plusieurs fois dans des manches différentes elle pourrait compter double ?)
        // Pour l'instant on envoie juste la map des points max.

        res.json({
            success: true,
            etape,
            manches: manchesResult.rows,
            classement: result.rows,
            rubriques: rubriquesResult.rows
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getClassementGeneral,
    getClassementManche,
    getScoresEquipe,
    getClassementEtape
};
