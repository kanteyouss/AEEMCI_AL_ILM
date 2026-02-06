const db = require('../config/database');

/**
 * Démarrer une session de jeu pour une manche
 */
const demarrerSession = async (req, res, next) => {
    try {
        const { manche_id } = req.body;
        const jure_id = req.user.id;
        
        // Vérifier que la manche existe et est publiée
        const mancheCheck = await db.query(
            `SELECT * FROM manches WHERE id = $1 AND statut IN ('publie', 'en_cours')`,
            [manche_id]
        );
        
        if (mancheCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Manche non trouvée ou non publiée'
            });
        }
        
        // Mettre à jour le statut de la manche
        await db.query(
            `UPDATE manches SET statut = 'en_cours' WHERE id = $1`,
            [manche_id]
        );
        
        // Récupérer les rubriques de la manche
        const rubriques = await db.query(
            `SELECT rm.*, r.nom, r.type, r.points_max, r.temps_par_question
             FROM rubriques_manche rm
             JOIN rubriques r ON rm.rubrique_id = r.id
             WHERE rm.manche_id = $1 AND rm.actif = true
             ORDER BY rm.ordre_passage`,
            [manche_id]
        );
        
        // Récupérer les équipes validées
        const equipes = await db.query(
            `SELECT e.id, e.nom, e.couleur, 
                    COUNT(me.participant_id) as nb_membres
             FROM equipes e
             LEFT JOIN membres_equipe me ON e.id = me.equipe_id
             WHERE e.code_acces IS NOT NULL
             GROUP BY e.id, e.nom, e.couleur
             HAVING COUNT(me.participant_id) > 0
             ORDER BY e.nom`
        );
        
        res.json({
            success: true,
            data: {
                manche: mancheCheck.rows[0],
                rubriques: rubriques.rows,
                equipes: equipes.rows
            }
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Générer une question aléatoire pour une rubrique
 */
const genererQuestion = async (req, res, next) => {
    try {
        const { rubrique_id, equipe_id, manche_id } = req.body;
        
        // Récupérer les questions déjà utilisées par cette équipe dans cette manche/rubrique
        const questionsUtilisees = await db.query(
            `SELECT question_id 
             FROM soumissions 
             WHERE equipe_id = $1 
             AND manche_id = $2 
             AND rubrique_id = $3
             AND question_id IS NOT NULL`,
            [equipe_id, manche_id, rubrique_id]
        );
        
        const idsUtilises = questionsUtilisees.rows.map(r => r.question_id);
        
        // Récupérer une question aléatoire non utilisée
        let query = `
            SELECT q.*, r.temps_par_question, r.nom as rubrique_nom
            FROM questions q
            JOIN rubriques r ON q.rubrique_id = r.id
            WHERE q.rubrique_id = $1
            AND q.utilise = false
        `;
        
        const params = [rubrique_id];
        
        if (idsUtilises.length > 0) {
            params.push(idsUtilises);
            query += ` AND q.id NOT IN (SELECT unnest($${params.length}::int[]))`;
        }
        
        query += ` ORDER BY RANDOM() LIMIT 1`;
        
        const result = await db.query(query, params);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucune question disponible pour cette rubrique'
            });
        }
        
        const question = result.rows[0];
        
        // Marquer la question comme utilisée
        await db.query(
            `UPDATE questions SET utilise = true WHERE id = $1`,
            [question.id]
        );
        
        // Ne pas renvoyer la réponse correcte au frontend (sécurité)
        const questionPourJury = {
            id: question.id,
            question_texte: question.question_texte,
            type: question.type,
            points: question.points,
            temps_limite: question.temps_limite || question.temps_par_question,
            reference: question.reference,
            rubrique_nom: question.rubrique_nom,
            // Options pour QCM (sans révéler la bonne réponse)
            options: question.type === 'qcm' ? {
                A: question.choix_a,
                B: question.choix_b,
                C: question.choix_c,
                D: question.choix_d
            } : null
        };
        
        res.json({
            success: true,
            data: questionPourJury
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Soumettre une réponse et calculer le score
 */
const soumettreReponse = async (req, res, next) => {
    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const {
            equipe_id,
            manche_id,
            rubrique_id,
            question_id,
            participant_id,
            reponse_donnee,
            temps_reponse,
            est_correcte // Déterminé par le jury
        } = req.body;
        
        const jure_id = req.user.id;
        
        // Récupérer la question pour les points
        const questionResult = await client.query(
            `SELECT points, reponse_correcte FROM questions WHERE id = $1`,
            [question_id]
        );
        
        if (questionResult.rows.length === 0) {
            throw new Error('Question non trouvée');
        }
        
        const question = questionResult.rows[0];
        const points_obtenus = est_correcte ? question.points : 0;
        
        // Créer la soumission
        const soumissionResult = await client.query(
            `INSERT INTO soumissions (
                equipe_id, manche_id, rubrique_id, question_id,
                participant_id, reponse_texte, temps_reponse
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
            [equipe_id, manche_id, rubrique_id, question_id, 
             participant_id, reponse_donnee, temps_reponse]
        );
        
        const soumission_id = soumissionResult.rows[0].id;
        
        // Créer l'évaluation
        await client.query(
            `INSERT INTO evaluations (
                soumission_id, equipe_id, manche_id, rubrique_id,
                jure_id, note_totale, statut
            ) VALUES ($1, $2, $3, $4, $5, $6, 'valide')`,
            [soumission_id, equipe_id, manche_id, rubrique_id,
             jure_id, points_obtenus]
        );
        
        // Mettre à jour ou créer le score consolidé
        const rubriqueInfo = await client.query(
            `SELECT points_max FROM rubriques WHERE id = $1`,
            [rubrique_id]
        );
        
        await client.query(
            `INSERT INTO scores (equipe_id, manche_id, rubrique_id, points_obtenus, points_max)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (equipe_id, manche_id, rubrique_id)
             DO UPDATE SET 
                points_obtenus = scores.points_obtenus + $4,
                date_calcul = NOW()`,
            [equipe_id, manche_id, rubrique_id, points_obtenus, rubriqueInfo.rows[0].points_max]
        );
        
        await client.query('COMMIT');
        
        // Récupérer le score total de l'équipe pour cette rubrique
        const scoreResult = await client.query(
            `SELECT points_obtenus, points_max 
             FROM scores 
             WHERE equipe_id = $1 AND manche_id = $2 AND rubrique_id = $3`,
            [equipe_id, manche_id, rubrique_id]
        );
        
        res.json({
            success: true,
            message: est_correcte ? 'Bonne réponse !' : 'Mauvaise réponse',
            data: {
                points_obtenus,
                score_rubrique: scoreResult.rows[0]
            }
        });
        
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

/**
 * Obtenir le nombre de questions restantes pour une équipe dans une rubrique
 */
const getQuestionsRestantes = async (req, res, next) => {
    try {
        const { equipe_id, manche_id, rubrique_id } = req.query;
        
        // Compter les questions déjà posées
        const questionsRepondues = await db.query(
            `SELECT COUNT(*) as count 
             FROM soumissions 
             WHERE equipe_id = $1 
             AND manche_id = $2 
             AND rubrique_id = $3`,
            [equipe_id, manche_id, rubrique_id]
        );
        
        // Récupérer le nombre total de questions pour cette rubrique
        const rubriqueInfo = await db.query(
            `SELECT 
                CASE 
                    WHEN nom = 'Culture générale' THEN 4
                    WHEN nom = 'Vie du Prophète' THEN 2
                    WHEN nom = 'Jurisprudence' THEN 2
                    WHEN nom = 'Questions sur le Coran' THEN 2
                    WHEN nom = 'Questions relais' THEN 2
                    WHEN nom = 'Hadith' THEN 1
                    ELSE 1
                END as nb_questions_max
             FROM rubriques 
             WHERE id = $1`,
            [rubrique_id]
        );
        
        const repondues = parseInt(questionsRepondues.rows[0].count);
        const total = parseInt(rubriqueInfo.rows[0].nb_questions_max);
        const restantes = total - repondues;
        
        res.json({
            success: true,
            data: {
                total,
                repondues,
                restantes,
                termine: restantes === 0
            }
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Obtenir l'état actuel de la session (progression)
 */
const getEtatSession = async (req, res, next) => {
    try {
        const { manche_id } = req.params;
        
        // Récupérer toutes les équipes et leurs scores par rubrique
        const progression = await db.query(
            `SELECT 
                e.id as equipe_id,
                e.nom as equipe_nom,
                r.id as rubrique_id,
                r.nom as rubrique_nom,
                COUNT(s.id) as questions_repondues,
                COALESCE(sc.points_obtenus, 0) as points_obtenus,
                r.points_max
             FROM equipes e
             CROSS JOIN rubriques r
             LEFT JOIN soumissions s ON e.id = s.equipe_id 
                AND s.rubrique_id = r.id 
                AND s.manche_id = $1
             LEFT JOIN scores sc ON e.id = sc.equipe_id 
                AND sc.rubrique_id = r.id 
                AND sc.manche_id = $1
             WHERE e.code_acces IS NOT NULL
             AND r.id IN (
                SELECT rubrique_id FROM rubriques_manche 
                WHERE manche_id = $1 AND actif = true
             )
             GROUP BY e.id, e.nom, r.id, r.nom, sc.points_obtenus, r.points_max
             ORDER BY r.id, e.nom`,
            [manche_id]
        );
        
        res.json({
            success: true,
            data: progression.rows
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Terminer la session et clôturer la manche
 */
const terminerSession = async (req, res, next) => {
    try {
        const { manche_id } = req.body;
        
        await db.query(
            `UPDATE manches SET statut = 'termine' WHERE id = $1`,
            [manche_id]
        );
        
        res.json({
            success: true,
            message: 'Session terminée avec succès'
        });
        
    } catch (error) {
        next(error);
    }
};

module.exports = {
    demarrerSession,
    genererQuestion,
    soumettreReponse,
    getQuestionsRestantes,
    getEtatSession,
    terminerSession
};
