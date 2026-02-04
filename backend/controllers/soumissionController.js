const SoumissionModel = require('../models/soumissionModel');

/**
 * Récupérer toutes les soumissions
 */
const getAllSoumissions = async (req, res, next) => {
    try {
        const { equipe_id, manche_id, rubrique_id } = req.query;
        
        const filters = {};
        if (equipe_id) filters.equipe_id = equipe_id;
        if (manche_id) filters.manche_id = manche_id;
        if (rubrique_id) filters.rubrique_id = rubrique_id;
        
        const soumissions = await SoumissionModel.getAll(filters);
        
        res.json({
            success: true,
            data: soumissions,
            count: soumissions.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer une soumission par ID
 */
const getSoumissionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const soumission = await SoumissionModel.getById(id);
        
        if (!soumission) {
            return res.status(404).json({
                success: false,
                message: 'Soumission non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: soumission
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Créer une nouvelle soumission
 */
const createSoumission = async (req, res, next) => {
    try {
        const {
            manche_id,
            rubrique_id,
            question_id,
            participant_id,
            reponse_texte,
            fichier_audio_url,
            temps_reponse
        } = req.body;
        
        const equipe_id = req.user.equipeId;
        
        // Vérifier si une soumission existe déjà
        if (question_id) {
            const existing = await SoumissionModel.checkExisting(
                equipe_id,
                manche_id,
                rubrique_id,
                question_id
            );
            
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Une soumission existe déjà pour cette question'
                });
            }
        }
        
        const soumission = await SoumissionModel.create({
            equipe_id,
            manche_id,
            rubrique_id,
            question_id,
            participant_id,
            reponse_texte,
            fichier_audio_url,
            temps_reponse
        });
        
        res.status(201).json({
            success: true,
            message: 'Soumission créée avec succès',
            data: soumission
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour une soumission
 */
const updateSoumission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const soumission = await SoumissionModel.update(id, data);
        
        if (!soumission) {
            return res.status(404).json({
                success: false,
                message: 'Soumission non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Soumission mise à jour',
            data: soumission
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Supprimer une soumission
 */
const deleteSoumission = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const soumission = await SoumissionModel.delete(id);
        
        if (!soumission) {
            return res.status(404).json({
                success: false,
                message: 'Soumission non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Soumission supprimée'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer les soumissions d'une équipe pour une manche
 */
const getSoumissionsByEquipeAndManche = async (req, res, next) => {
    try {
        const { equipeId, mancheId } = req.params;
        
        const soumissions = await SoumissionModel.getByEquipeAndManche(equipeId, mancheId);
        
        res.json({
            success: true,
            data: soumissions,
            count: soumissions.length
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllSoumissions,
    getSoumissionById,
    createSoumission,
    updateSoumission,
    deleteSoumission,
    getSoumissionsByEquipeAndManche
};
