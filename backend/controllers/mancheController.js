const db = require('../config/database');

/**
 * Récupérer toutes les manches
 */
const getAllManches = async (req, res, next) => {
    try {
        const { type, statut } = req.query;
        
        let query = 'SELECT * FROM manches WHERE 1=1';
        const params = [];
        
        if (type) {
            params.push(type);
            query += ` AND type = $${params.length}`;
        }
        
        if (statut) {
            params.push(statut);
            query += ` AND statut = $${params.length}`;
        }
        
        query += ' ORDER BY date_manche, heure_debut';
        
        const result = await db.query(query, params);
        
        // Charger les rubriques pour chaque manche
        const manches = await Promise.all(result.rows.map(async (manche) => {
            const rubriquesResult = await db.query(
                `SELECT r.*, rm.ordre_passage 
                 FROM rubriques r
                 INNER JOIN rubriques_manche rm ON r.id = rm.rubrique_id
                 WHERE rm.manche_id = $1 AND rm.actif = true
                 ORDER BY rm.ordre_passage`,
                [manche.id]
            );
            
            return {
                ...manche,
                rubriques: rubriquesResult.rows
            };
        }));
        
        res.json({
            success: true,
            data: manches,
            count: manches.length
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Créer une nouvelle manche
 */
const createManche = async (req, res, next) => {
    try {
        const { nom, type, numero, date_manche, heure_debut, heure_fin, description, rubriques } = req.body;
        
        // Démarrer une transaction
        const client = await db.pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Créer la manche
            const mancheQuery = `
                INSERT INTO manches (nom, type, numero, date_manche, heure_debut, heure_fin, description, statut)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'publie')
                RETURNING *
            `;
            
            const mancheResult = await client.query(mancheQuery, [
                nom, type, numero, date_manche, heure_debut, heure_fin, description
            ]);
            
            const manche = mancheResult.rows[0];
            
            // Associer les rubriques si fournies
            if (rubriques && Array.isArray(rubriques) && rubriques.length > 0) {
                for (let i = 0; i < rubriques.length; i++) {
                    const rubriqueId = rubriques[i];
                    const ordrePassage = i + 1;
                    
                    await client.query(
                        `INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage, actif)
                         VALUES ($1, $2, $3, true)`,
                        [manche.id, rubriqueId, ordrePassage]
                    );
                }
            }
            
            await client.query('COMMIT');
            
            // Récupérer les rubriques associées pour la réponse
            const rubriquesAssociees = await client.query(
                `SELECT r.* FROM rubriques r
                 INNER JOIN rubriques_manche rm ON r.id = rm.rubrique_id
                 WHERE rm.manche_id = $1
                 ORDER BY rm.ordre_passage`,
                [manche.id]
            );
            
            res.status(201).json({
                success: true,
                message: 'Manche créée avec succès',
                data: {
                    ...manche,
                    rubriques: rubriquesAssociees.rows
                }
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour le statut d'une manche
 */
const updateStatut = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;
        
        const result = await db.query(
            'UPDATE manches SET statut = $1 WHERE id = $2 RETURNING *',
            [statut, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Manche non trouvée'
            });
        }
        
        res.json({
            success: true,
            message: 'Statut mis à jour',
            data: result.rows[0]
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Récupérer une manche par ID
 */
const getMancheById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const mancheResult = await db.query(
            'SELECT * FROM manches WHERE id = $1',
            [id]
        );
        
        if (mancheResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Manche non trouvée'
            });
        }
        
        const manche = mancheResult.rows[0];
        
        // Charger les rubriques associées
        const rubriquesResult = await db.query(
            `SELECT r.*, rm.ordre_passage 
             FROM rubriques r
             INNER JOIN rubriques_manche rm ON r.id = rm.rubrique_id
             WHERE rm.manche_id = $1 AND rm.actif = true
             ORDER BY rm.ordre_passage`,
            [id]
        );
        
        res.json({
            success: true,
            data: {
                ...manche,
                rubriques: rubriquesResult.rows
            }
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Mettre à jour une manche complète
 */
const updateManche = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nom, type, date_manche, heure_debut, heure_fin, description, rubriques } = req.body;
        
        const client = await db.pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Récupérer la manche existante pour garder les valeurs non modifiées
            const existingManche = await client.query(
                'SELECT * FROM manches WHERE id = $1',
                [id]
            );
            
            if (existingManche.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'Manche non trouvée'
                });
            }
            
            const current = existingManche.rows[0];
            
            // Utiliser les nouvelles valeurs ou conserver les anciennes
            const updatedNom = nom !== undefined ? nom : current.nom;
            const updatedType = type !== undefined ? type : current.type;
            const updatedDateManche = date_manche !== undefined ? date_manche : current.date_manche;
            const updatedHeureDebut = heure_debut !== undefined ? heure_debut : current.heure_debut;
            const updatedHeureFin = heure_fin !== undefined ? heure_fin : current.heure_fin;
            const updatedDescription = description !== undefined ? description : current.description;
            
            // Mettre à jour la manche (sans modifier le numero qui est un identifiant fixe)
            const mancheQuery = `
                UPDATE manches 
                SET nom = $1, type = $2, date_manche = $3, 
                    heure_debut = $4, heure_fin = $5, description = $6
                WHERE id = $7
                RETURNING *
            `;
            
            const mancheResult = await client.query(mancheQuery, [
                updatedNom, updatedType, updatedDateManche, 
                updatedHeureDebut, updatedHeureFin, updatedDescription, id
            ]);
            
            const manche = mancheResult.rows[0];
            
            // Mettre à jour les rubriques associées SEULEMENT si le paramètre est fourni
            if (rubriques !== undefined && Array.isArray(rubriques)) {
                // Supprimer les anciennes associations
                await client.query(
                    'DELETE FROM rubriques_manche WHERE manche_id = $1',
                    [id]
                );
                
                // Créer les nouvelles associations
                for (let i = 0; i < rubriques.length; i++) {
                    const rubriqueId = rubriques[i];
                    const ordrePassage = i + 1;
                    
                    await client.query(
                        `INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage, actif)
                         VALUES ($1, $2, $3, true)`,
                        [id, rubriqueId, ordrePassage]
                    );
                }
            }
            
            await client.query('COMMIT');
            
            // Récupérer les rubriques associées pour la réponse
            const rubriquesAssociees = await client.query(
                `SELECT r.* FROM rubriques r
                 INNER JOIN rubriques_manche rm ON r.id = rm.rubrique_id
                 WHERE rm.manche_id = $1
                 ORDER BY rm.ordre_passage`,
                [id]
            );
            
            res.json({
                success: true,
                message: 'Manche mise à jour avec succès',
                data: {
                    ...manche,
                    rubriques: rubriquesAssociees.rows
                }
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        next(error);
    }
};

/**
 * Supprimer une manche
 */
const deleteManche = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const client = await db.pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Vérifier que la manche existe
            const mancheCheck = await client.query(
                'SELECT * FROM manches WHERE id = $1',
                [id]
            );
            
            if (mancheCheck.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: 'Manche non trouvée'
                });
            }
            
            // Supprimer les associations avec les rubriques
            await client.query(
                'DELETE FROM rubriques_manche WHERE manche_id = $1',
                [id]
            );
            
            // Supprimer les scores associés (si la table existe)
            await client.query(
                'DELETE FROM scores WHERE manche_id = $1',
                [id]
            );
            
            // Supprimer les soumissions associées (si la table existe)
            await client.query(
                'DELETE FROM soumissions WHERE manche_id = $1',
                [id]
            );
            
            // Supprimer la manche
            await client.query(
                'DELETE FROM manches WHERE id = $1',
                [id]
            );
            
            await client.query('COMMIT');
            
            res.json({
                success: true,
                message: 'Manche supprimée avec succès'
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllManches,
    getMancheById,
    createManche,
    updateManche,
    updateStatut,
    deleteManche
};
