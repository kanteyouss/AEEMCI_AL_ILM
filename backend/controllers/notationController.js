const db = require('../config/database');

/**
 * Récupérer les sessions de notation disponibles (depuis calendrier)
 */
const getSessionsNotation = async (req, res, next) => {
    try {
        const { date, manche_id, rubrique_id } = req.query;

        let query = `
            SELECT 
                rm.id as session_id,
                m.id as manche_id,
                m.nom as manche_nom,
                m.type as phase,
                m.date_manche,
                m.statut as manche_statut,
                r.id as rubrique_id,
                r.nom as rubrique_nom,
                r.type as rubrique_type,
                r.points_max,
                r.temps_par_question,
                r.mode_affichage,
                r.description,
                r.criteres_evaluation
            FROM rubriques_manche rm
            JOIN manches m ON rm.manche_id = m.id
            JOIN rubriques r ON rm.rubrique_id = r.id
            WHERE rm.actif = true
        `;

        const params = [];

        if (date) {
            params.push(date);
            query += ` AND m.date_manche = $${params.length}`;
        }

        if (manche_id) {
            params.push(manche_id);
            query += ` AND m.id = $${params.length}`;
        }

        if (rubrique_id) {
            params.push(rubrique_id);
            query += ` AND r.id = $${params.length}`;
        }

        query += ' ORDER BY m.date_manche DESC, rm.ordre_passage';

        const result = await db.query(query, params);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer les équipes éligibles pour une session
 */
const getEquipesEligibles = async (req, res, next) => {
    try {
        const { manche_id } = req.params;

        // Récupérer SEULEMENT les équipes sélectionnées pour cette manche via equipes_manche
        const query = `
            SELECT 
                e.id,
                e.nom,
                e.couleur,
                COUNT(me.participant_id) as nb_membres,
                json_agg(
                    json_build_object(
                        'id', p.id,
                        'nom', p.nom,
                        'prenom', p.prenom,
                        'est_capitaine', me.est_capitaine
                    )
                ) FILTER (WHERE me.participant_id IS NOT NULL) as membres
            FROM equipes e
            INNER JOIN equipes_manche em ON e.id = em.equipe_id
            LEFT JOIN membres_equipe me ON e.id = me.equipe_id
            LEFT JOIN participants p ON me.participant_id = p.id
            WHERE em.manche_id = $1 
              AND e.code_acces IS NOT NULL
            GROUP BY e.id, e.nom, e.couleur
            HAVING COUNT(me.participant_id) > 0
            ORDER BY e.nom
        `;

        const result = await db.query(query, [manche_id]);

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
 * Vérifier si une notation existe déjà
 */
const checkNotationExistante = async (req, res, next) => {
    try {
        const { equipe_id, manche_id, rubrique_id } = req.query;

        const query = `
            SELECT id, note_totale, date_evaluation
            FROM evaluations
            WHERE equipe_id = $1 
            AND manche_id = $2 
            AND rubrique_id = $3
            LIMIT 1
        `;

        const result = await db.query(query, [equipe_id, manche_id, rubrique_id]);

        res.json({
            success: true,
            existe: result.rows.length > 0,
            notation: result.rows[0] || null
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Créer ou mettre à jour une notation
 */
const saveNotation = async (req, res, next) => {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        const {
            equipe_id,
            manche_id,
            rubrique_id,
            session_id,
            criteres,
            note_totale,
            commentaire
        } = req.body;

        console.log('📦 Données reçues:', { equipe_id, manche_id, rubrique_id, session_id, note_totale });

        // Fallback dynamique si pas de token
        let jure_id;
        if (req.user) {
            jure_id = req.user.id;
        } else {
            const adminUser = await client.query("SELECT id FROM utilisateurs ORDER BY id LIMIT 1");
            if (adminUser.rows.length > 0) {
                jure_id = adminUser.rows[0].id;
                console.log(`⚠️ Mode sans token : Utilisation de l'ID ${jure_id} comme juré.`);
            } else {
                throw new Error("Aucun utilisateur trouvé pour noter.");
            }
        }


        // 1. Vérifier que la session existe et est active
        const sessionCheck = await client.query(
            `SELECT rm.*, m.statut, r.points_max
             FROM rubriques_manche rm
             JOIN manches m ON rm.manche_id = m.id
             JOIN rubriques r ON rm.rubrique_id = r.id
             WHERE rm.id = $1 AND rm.actif = true`,
            [session_id]
        );

        console.log(`🔍 Sessions trouvées: ${sessionCheck.rows.length}`, sessionCheck.rows.length > 0 ? sessionCheck.rows[0] : 'aucune');

        if (sessionCheck.rows.length === 0) {
            throw new Error('Session de notation non trouvée ou inactive');
        }

        const mancheStatut = sessionCheck.rows[0].statut;
        // if (mancheStatut === 'brouillon') {
        //     throw new Error('Cette manche n\'est pas encore publiée');
        // }

        // 2. Vérifier si une notation existe déjà
        const existingCheck = await client.query(
            `SELECT id FROM evaluations 
             WHERE equipe_id = $1 AND manche_id = $2 AND rubrique_id = $3`,
            [equipe_id, manche_id, rubrique_id]
        );

        // Plafonner la note au score max autorisé
        const pointsMax = sessionCheck.rows[0].points_max;
        const notePlafonnee = Math.min(note_totale, pointsMax);

        if (existingCheck.rows.length > 0) {
            // Mise à jour
            const updateResult = await client.query(
                `UPDATE evaluations 
                 SET criteres_notes = $1,
                     note_totale = $2,
                     commentaire = $3,
                     jure_id = $4,
                     date_evaluation = NOW(),
                     statut = 'valide'
                 WHERE id = $5
                 RETURNING id`,
                [JSON.stringify(criteres), notePlafonnee, commentaire, jure_id, existingCheck.rows[0].id]
            );
            evaluationId = updateResult.rows[0].id;

        } else {
            // Création
            const insertResult = await client.query(
                `INSERT INTO evaluations (
                    equipe_id, manche_id, rubrique_id, session_id,
                    criteres_notes, note_totale, commentaire, jure_id, statut
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'valide')
                RETURNING id`,
                [equipe_id, manche_id, rubrique_id, session_id,
                    JSON.stringify(criteres), notePlafonnee, commentaire, jure_id]
            );
            evaluationId = insertResult.rows[0].id;
        }

        // 3. Mettre à jour ou créer le score consolidé
        await client.query(
            `INSERT INTO scores (equipe_id, manche_id, rubrique_id, points_obtenus, points_max)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (equipe_id, manche_id, rubrique_id)
             DO UPDATE SET 
                points_obtenus = $4,
                date_calcul = NOW()`,
            [equipe_id, manche_id, rubrique_id, notePlafonnee, pointsMax]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Notation enregistrée avec succès',
            data: { id: evaluationId }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

/**
 * Récupérer une notation spécifique
 */
const getNotation = async (req, res, next) => {
    try {
        const { equipe_id, manche_id, rubrique_id } = req.params;

        const query = `
            SELECT 
                e.*,
                eq.nom as equipe_nom,
                m.nom as manche_nom,
                m.type as phase,
                r.nom as rubrique_nom,
                r.criteres_evaluation,
                u.nom as jure_nom,
                u.prenom as jure_prenom
            FROM evaluations e
            JOIN equipes eq ON e.equipe_id = eq.id
            JOIN manches m ON e.manche_id = m.id
            JOIN rubriques r ON e.rubrique_id = r.id
            LEFT JOIN utilisateurs u ON e.jure_id = u.id
            WHERE e.equipe_id = $1 
            AND e.manche_id = $2 
            AND e.rubrique_id = $3
        `;

        const result = await db.query(query, [equipe_id, manche_id, rubrique_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notation non trouvée'
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
 * Récupérer toutes les notations d'une manche
 */
const getNotationsManche = async (req, res, next) => {
    try {
        const { manche_id } = req.params;

        const query = `
            SELECT 
                e.id,
                e.equipe_id,
                eq.nom as equipe_nom,
                e.rubrique_id,
                r.nom as rubrique_nom,
                e.note_totale,
                r.points_max,
                e.date_evaluation,
                e.statut,
                u.nom as jure_nom,
                u.prenom as jure_prenom
            FROM evaluations e
            JOIN equipes eq ON e.equipe_id = eq.id
            JOIN rubriques r ON e.rubrique_id = r.id
            LEFT JOIN utilisateurs u ON e.jure_id = u.id
            WHERE e.manche_id = $1
            ORDER BY eq.nom, r.nom
        `;

        const result = await db.query(query, [manche_id]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Calculer le classement d'une phase
 */
const getClassementPhase = async (req, res, next) => {
    try {
        const { manche_id } = req.params;

        const query = `
            SELECT 
                e.id as equipe_id,
                e.nom as equipe_nom,
                e.couleur,
                SUM(s.points_obtenus) as total_points,
                SUM(s.points_max) as total_possible,
                ROUND((SUM(s.points_obtenus)::decimal / NULLIF(SUM(s.points_max), 0) * 100), 2) as pourcentage,
                COUNT(s.id) as nb_rubriques_notees
            FROM equipes e
            LEFT JOIN scores s ON e.id = s.equipe_id AND s.manche_id = $1
            WHERE e.code_acces IS NOT NULL
            GROUP BY e.id, e.nom, e.couleur
            HAVING SUM(s.points_obtenus) IS NOT NULL
            ORDER BY total_points DESC, pourcentage DESC
        `;

        const result = await db.query(query, [manche_id]);

        // Ajouter les rangs
        const classement = result.rows.map((equipe, index) => ({
            rang: index + 1,
            ...equipe
        }));

        res.json({
            success: true,
            data: classement
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSessionsNotation,
    getEquipesEligibles,
    checkNotationExistante,
    saveNotation,
    getNotation,
    getNotationsManche,
    getClassementPhase
};
