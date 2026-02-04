const QuestionModel = require('../models/questionModel');

/**
 * Récupérer toutes les questions
 */
const getAllQuestions = async (req, res, next) => {
    try {
        const { rubrique_id, type, difficulte, utilise } = req.query;
        
        const filters = {};
        if (rubrique_id) filters.rubrique_id = rubrique_id;
        if (type) filters.type = type;
        if (difficulte) filters.difficulte = difficulte;
        if (utilise !== undefined) filters.utilise = utilise === 'true';
        
        const questions = await QuestionModel.getAll(filters);
        
        res.json({
            success: true,
            data: questions,
            count: questions.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer une question par ID
 */
const getQuestionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const question = await QuestionModel.getById(id);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Créer une nouvelle question
 */
const createQuestion = async (req, res, next) => {
    try {
        const data = req.body;
        
        const question = await QuestionModel.create(data);
        
        res.status(201).json({
            success: true,
            message: 'Question créée avec succès',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour une question
 */
const updateQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const question = await QuestionModel.update(id, data);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Question mise à jour',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Supprimer une question
 */
const deleteQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const question = await QuestionModel.delete(id);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Question supprimée'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Marquer une question comme utilisée
 */
const markQuestionAsUsed = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const question = await QuestionModel.markAsUsed(id);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Question marquée comme utilisée',
            data: question
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer des questions aléatoires non utilisées
 */
const getRandomUnusedQuestions = async (req, res, next) => {
    try {
        const { rubriqueId } = req.params;
        const { limit = 10 } = req.query;
        
        const questions = await QuestionModel.getRandomUnused(rubriqueId, parseInt(limit));
        
        res.json({
            success: true,
            data: questions,
            count: questions.length
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    markQuestionAsUsed,
    getRandomUnusedQuestions
};
