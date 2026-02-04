const RubriqueModel = require('../models/rubriqueModel');

/**
 * Récupérer toutes les rubriques
 */
const getAllRubriques = async (req, res, next) => {
    try {
        const { type } = req.query;
        
        const filters = {};
        if (type) filters.type = type;
        
        const rubriques = await RubriqueModel.getAll(filters);
        
        res.json({
            success: true,
            data: rubriques,
            count: rubriques.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer une rubrique par ID
 */
const getRubriqueById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const rubrique = await RubriqueModel.getById(id);
        
        if (!rubrique) {
            return res.status(404).json({
                success: false,
                message: 'Rubrique non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: rubrique
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Créer une nouvelle rubrique
 */
const createRubrique = async (req, res, next) => {
    try {
        const data = req.body;
        
        const rubrique = await RubriqueModel.create(data);
        
        res.status(201).json({
            success: true,
            message: 'Rubrique créée avec succès',
            data: rubrique
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour une rubrique
 */
const updateRubrique = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const rubrique = await RubriqueModel.update(id, data);
        
        if (!rubrique) {
            return res.status(404).json({
                success: false,
                message: 'Rubrique non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Rubrique mise à jour',
            data: rubrique
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Supprimer une rubrique
 */
const deleteRubrique = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const rubrique = await RubriqueModel.delete(id);
        
        if (!rubrique) {
            return res.status(404).json({
                success: false,
                message: 'Rubrique non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Rubrique supprimée'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllRubriques,
    getRubriqueById,
    createRubrique,
    updateRubrique,
    deleteRubrique
};
