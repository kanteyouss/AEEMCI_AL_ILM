const EvaluationModel = require('../models/evaluationModel');

/**
 * Récupérer toutes les évaluations
 */
const getAllEvaluations = async (req, res, next) => {
    try {
        const { jure_id, statut } = req.query;
        
        const filters = {};
        if (jure_id) filters.jure_id = jure_id;
        if (statut) filters.statut = statut;
        
        const evaluations = await EvaluationModel.getAll(filters);
        
        res.json({
            success: true,
            data: evaluations,
            count: evaluations.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer une évaluation par ID
 */
const getEvaluationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const evaluation = await EvaluationModel.getById(id);
        
        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: 'Évaluation non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: evaluation
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Créer une nouvelle évaluation
 */
const createEvaluation = async (req, res, next) => {
    try {
        const {
            soumission_id,
            note_voix,
            note_tajwid,
            note_prononciation,
            note_totale,
            commentaire
        } = req.body;
        
        const jure_id = req.user.id;
        
        // Vérifier si le juré a déjà évalué cette soumission
        const existing = await EvaluationModel.checkExisting(soumission_id, jure_id);
        
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà évalué cette soumission'
            });
        }
        
        const evaluation = await EvaluationModel.create({
            soumission_id,
            jure_id,
            note_voix,
            note_tajwid,
            note_prononciation,
            note_totale,
            commentaire
        });
        
        res.status(201).json({
            success: true,
            message: 'Évaluation créée avec succès',
            data: evaluation
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour une évaluation
 */
const updateEvaluation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const evaluation = await EvaluationModel.update(id, data);
        
        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: 'Évaluation non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Évaluation mise à jour',
            data: evaluation
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Supprimer une évaluation
 */
const deleteEvaluation = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const evaluation = await EvaluationModel.delete(id);
        
        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: 'Évaluation non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Évaluation supprimée'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer les évaluations d'une soumission
 */
const getEvaluationsBySoumission = async (req, res, next) => {
    try {
        const { soumissionId } = req.params;
        
        const evaluations = await EvaluationModel.getBySoumission(soumissionId);
        
        res.json({
            success: true,
            data: evaluations,
            count: evaluations.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer la moyenne des évaluations d'une soumission
 */
const getAverageScore = async (req, res, next) => {
    try {
        const { soumissionId } = req.params;
        
        const result = await EvaluationModel.getAverageScore(soumissionId);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEvaluations,
    getEvaluationById,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    getEvaluationsBySoumission,
    getAverageScore
};
