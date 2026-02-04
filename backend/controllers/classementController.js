const db = require('../config/database');

/**
 * Récupérer le classement général ou filtré
 */
const getClassementGeneral = async (req, res, next) => {
    try {
        const { manche_id, rubrique_id } = req.query;
        
        let query = `
            SELECT 
                e.id,
                e.nom AS nom_equipe,
                e.couleur,
                e.symbole,
                COALESCE(SUM(s.points_obtenus), 0) AS score_total,
                COUNT(DISTINCT s.manche_id) AS nombre_manches,
                COUNT(DISTINCT p.id) AS nombre_participants,
                RANK() OVER (ORDER BY COALESCE(SUM(s.points_obtenus), 0) DESC) AS rang
            FROM equipes e
            LEFT JOIN scores s ON e.id = s.equipe_id
            LEFT JOIN participants p ON e.id = p.equipe_id
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
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += `
            GROUP BY e.id, e.nom, e.couleur, e.symbole
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
        
        const query = `
            SELECT 
                e.id,
                e.nom AS equipe,
                e.couleur,
                e.symbole,
                SUM(s.points_obtenus) AS points_totaux,
                RANK() OVER (ORDER BY SUM(s.points_obtenus) DESC) AS rang
            FROM equipes e
            LEFT JOIN scores s ON e.id = s.equipe_id AND s.manche_id = $1
            GROUP BY e.id, e.nom, e.couleur, e.symbole
            ORDER BY points_totaux DESC
        `;
        
        const result = await db.query(query, [mancheId]);
        
        res.json({
            success: true,
            data: result.rows
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

module.exports = {
    getClassementGeneral,
    getClassementManche,
    getScoresEquipe
};
