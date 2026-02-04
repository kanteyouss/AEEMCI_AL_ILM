const ScoreModel = require('../models/scoreModel');

/**
 * Récupérer tous les scores
 */
const getAllScores = async (req, res, next) => {
    try {
        const { equipe_id, manche_id, rubrique_id } = req.query;
        
        const filters = {};
        if (equipe_id) filters.equipe_id = equipe_id;
        if (manche_id) filters.manche_id = manche_id;
        if (rubrique_id) filters.rubrique_id = rubrique_id;
        
        const scores = await ScoreModel.getAll(filters);
        
        res.json({
            success: true,
            data: scores,
            count: scores.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer un score par ID
 */
const getScoreById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const score = await ScoreModel.getById(id);
        
        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Score non trouvé'
            });
        }
        
        res.json({
            success: true,
            data: score
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Créer ou mettre à jour un score
 */
const upsertScore = async (req, res, next) => {
    try {
        const { equipe_id, manche_id, rubrique_id, points_obtenus, points_max } = req.body;
        
        const score = await ScoreModel.upsert({
            equipe_id,
            manche_id,
            rubrique_id,
            points_obtenus,
            points_max
        });
        
        res.status(201).json({
            success: true,
            message: 'Score enregistré avec succès',
            data: score
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer le score total d'une équipe
 */
const getTotalByEquipe = async (req, res, next) => {
    try {
        const { equipeId } = req.params;
        
        const score = await ScoreModel.getTotalByEquipe(equipeId);
        
        res.json({
            success: true,
            data: score
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer les scores d'une manche
 */
const getScoresByManche = async (req, res, next) => {
    try {
        const { mancheId } = req.params;
        
        const scores = await ScoreModel.getByManche(mancheId);
        
        res.json({
            success: true,
            data: scores,
            count: scores.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Supprimer un score
 */
const deleteScore = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const score = await ScoreModel.delete(id);
        
        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Score non trouvé'
            });
        }
        
        res.json({
            success: true,
            message: 'Score supprimé'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Calculer automatiquement un score basé sur les évaluations
 */
const calculateFromEvaluations = async (req, res, next) => {
    try {
        const { equipeId, mancheId, rubriqueId } = req.params;
        
        const result = await ScoreModel.calculateFromEvaluations(
            equipeId,
            mancheId,
            rubriqueId
        );
        
        if (!result || !result.moyenne_notes) {
            return res.status(404).json({
                success: false,
                message: 'Aucune évaluation trouvée pour calculer le score'
            });
        }
        
        // Enregistrer le score calculé
        const score = await ScoreModel.upsert({
            equipe_id: equipeId,
            manche_id: mancheId,
            rubrique_id: rubriqueId,
            points_obtenus: Math.round(result.moyenne_notes),
            points_max: result.points_max
        });
        
        res.json({
            success: true,
            message: 'Score calculé et enregistré',
            data: score
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllScores,
    getScoreById,
    upsertScore,
    getTotalByEquipe,
    getScoresByManche,
    deleteScore,
    calculateFromEvaluations
};
