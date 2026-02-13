const db = require('../config/database');

/**
 * Récupérer toutes les manches
 */
const getAllManches = async (req, res, next) => {
    try {
        const { type, statut, etape } = req.query;

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

        if (etape) {
            params.push(etape);
            query += ` AND etape = $${params.length}`;
        }

        query += ' ORDER BY numero, date_manche, heure_debut';

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

            const equipesResult = await db.query(
                `SELECT e.id, e.nom, e.couleur, e.symbole
                 FROM equipes e
                 INNER JOIN equipes_manche em ON e.id = em.equipe_id
                 WHERE em.manche_id = $1
                 ORDER BY e.nom`,
                [manche.id]
            );

            return {
                ...manche,
                rubriques: rubriquesResult.rows,
                equipes: equipesResult.rows
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
        const { nom, type, date_manche, heure_debut, heure_fin, description, rubriques, equipes, note_bas_page, numero } = req.body;


        const client = await db.pool.connect();

        try {
            await client.query('BEGIN');

            // Validation des champs obligatoires
            if (!nom || !type || !date_manche) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: "Le nom, le type et la date sont obligatoires."
                });
            }

            // Vérifier si une manche existe déjà avec ce nom et cette date
            const existingManche = await client.query(
                'SELECT id FROM manches WHERE nom = $1 AND date_manche = $2',
                [nom, date_manche]
            );

            if (existingManche.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    success: false,
                    message: "Une manche avec ce nom existe déjà pour cette date."
                });
            }

            // Créer la manche (Statut par défaut 'publie' pour simplifier)
            const mancheQuery = `
                INSERT INTO manches (nom, type, date_manche, heure_debut, heure_fin, description, etape, note_bas_page, statut, numero)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'publie', $9)
                RETURNING *
            `;

            // Utiliser le type comme etape par défaut
            const mancheResult = await client.query(mancheQuery, [
                nom, type, date_manche, heure_debut, heure_fin, description, type, note_bas_page, numero
            ]);

            const manche = mancheResult.rows[0];

            // Associer les rubriques si fournies
            if (rubriques && Array.isArray(rubriques)) {
                for (let i = 0; i < rubriques.length; i++) {
                    const rubriqueId = parseInt(rubriques[i]);
                    await client.query(
                        'INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage) VALUES ($1, $2, $3)',
                        [manche.id, rubriqueId, i + 1]
                    );
                }
            }

            // Associer les équipes si fournies
            if (equipes && Array.isArray(equipes)) {
                for (const equipeId of equipes) {
                    await client.query(
                        'INSERT INTO equipes_manche (manche_id, equipe_id) VALUES ($1, $2)',
                        [manche.id, equipeId]
                    );
                }
            }

            await client.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Manche créée avec succès',
                data: manche
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

        // Charger les équipes associées
        const equipesResult = await db.query(
            `SELECT e.id, e.nom, e.couleur, e.symbole
             FROM equipes e
             INNER JOIN equipes_manche em ON e.id = em.equipe_id
             WHERE em.manche_id = $1
             ORDER BY e.nom`,
            [id]
        );

        res.json({
            success: true,
            data: {
                ...manche,
                rubriques: rubriquesResult.rows,
                equipes: equipesResult.rows
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
        const { nom, type, date_manche, heure_debut, heure_fin, description, rubriques, equipes, note_bas_page, numero } = req.body;

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
            const updatedNoteBasPage = note_bas_page !== undefined ? note_bas_page : current.note_bas_page;
            const updatedNumero = numero !== undefined ? numero : current.numero;

            // Mettre à jour la manche
            const mancheQuery = `
                UPDATE manches 
                SET nom = $1, type = $2, date_manche = $3, 
                    heure_debut = $4, heure_fin = $5, description = $6, note_bas_page = $7, numero = $8
                WHERE id = $9
                RETURNING *
            `;

            const mancheResult = await client.query(mancheQuery, [
                updatedNom, updatedType, updatedDateManche,
                updatedHeureDebut, updatedHeureFin, updatedDescription, updatedNoteBasPage, updatedNumero, id
            ]);

            const manche = mancheResult.rows[0];

            // Mettre à jour les rubriques associées SEULEMENT si le paramètre est fourni
            if (rubriques !== undefined && Array.isArray(rubriques)) {
                // 1. Récupérer les associations existantes pour mise à jour intelligente (évite de casser les FK)
                const existingRelResult = await client.query(
                    'SELECT id, rubrique_id FROM rubriques_manche WHERE manche_id = $1',
                    [id]
                );
                const existingRelMap = new Map(); // rubrique_id -> id (pk de rubriques_manche)
                existingRelResult.rows.forEach(row => existingRelMap.set(row.rubrique_id, row.id));

                // 2. Parcourir la nouvelle liste
                for (let i = 0; i < rubriques.length; i++) {
                    const rubriqueId = parseInt(rubriques[i]);
                    const ordrePassage = i + 1;

                    if (existingRelMap.has(rubriqueId)) {
                        // La relation existe déjà : on met à jour l'ordre et on s'assure qu'elle est active
                        await client.query(
                            'UPDATE rubriques_manche SET ordre_passage = $1, actif = true WHERE id = $2',
                            [ordrePassage, existingRelMap.get(rubriqueId)]
                        );
                        // On retire de la map pour savoir ce qui reste à supprimer à la fin
                        existingRelMap.delete(rubriqueId);
                    } else {
                        // Nouvelle relation : on vérifie et on insère
                        const checkRubrique = await client.query('SELECT 1 FROM rubriques WHERE id = $1', [rubriqueId]);
                        if (checkRubrique.rowCount > 0) {
                            await client.query(
                                `INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage, actif)
                                VALUES ($1, $2, $3, true)`,
                                [id, rubriqueId, ordrePassage]
                            );
                        } else {
                            console.warn(`Tentative d'association d'une rubrique inexistante (ID: ${rubriqueId}) à la manche ${id}`);
                        }
                    }
                }

                // 3. Gérer les relations restantes (celles qui ont été décochées)
                for (const [rubriqueId, pkId] of existingRelMap) {
                    try {
                        // Essayer de supprimer proprement
                        await client.query('DELETE FROM rubriques_manche WHERE id = $1', [pkId]);
                    } catch (err) {
                        // Si contrainte de clé étrangère (ex: évaluations existantes), on désactive seulement (soft delete)
                        if (err.code === '23503') {
                            console.warn(`Impossible de supprimer rubriques_manche ID ${pkId} car référencé ailleurs. Passage à actif=false.`);
                            await client.query('UPDATE rubriques_manche SET actif = false WHERE id = $1', [pkId]);
                        } else {
                            throw err; // Relancer les autres erreurs
                        }
                    }
                }
            }

            // Mettre à jour les équipes associées SEULEMENT si le paramètre est fourni
            if (equipes !== undefined && Array.isArray(equipes)) {
                // Supprimer les anciennes associations
                await client.query(
                    'DELETE FROM equipes_manche WHERE manche_id = $1',
                    [id]
                );

                // Créer les nouvelles associations
                for (const equipeId of equipes) {
                    // Vérifier si l'équipe existe avant d'insérer (pour éviter 23503)
                    const checkEquipe = await client.query('SELECT 1 FROM equipes WHERE id = $1', [equipeId]);
                    if (checkEquipe.rowCount > 0) {
                        await client.query(
                            `INSERT INTO equipes_manche (manche_id, equipe_id)
                            VALUES ($1, $2)
                            ON CONFLICT (manche_id, equipe_id) DO NOTHING`,
                            [id, equipeId]
                        );
                    } else {
                        console.warn(`Tentative d'association d'une équipe inexistante (ID: ${equipeId}) à la manche ${id}`);
                    }
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

            // Récupérer les équipes associées
            const equipesAssociees = await client.query(
                `SELECT e.id, e.nom, e.couleur, e.symbole
                 FROM equipes e
                 INNER JOIN equipes_manche em ON e.id = em.equipe_id
                 WHERE em.manche_id = $1
                 ORDER BY e.nom`,
                [id]
            );

            res.json({
                success: true,
                message: 'Manche mise à jour avec succès',
                data: {
                    ...manche,
                    rubriques: rubriquesAssociees.rows,
                    equipes: equipesAssociees.rows
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

            // 1. Supprimer les évaluations associées (car elles pointent vers rubriques_manche via session_id)
            await client.query(
                'DELETE FROM evaluations WHERE manche_id = $1',
                [id]
            );

            // 2. Supprimer les scores associés
            await client.query(
                'DELETE FROM scores WHERE manche_id = $1',
                [id]
            );

            // 3. Supprimer les soumissions associées
            await client.query(
                'DELETE FROM soumissions WHERE manche_id = $1',
                [id]
            );

            // 4. Supprimer les associations avec les équipes
            await client.query(
                'DELETE FROM equipes_manche WHERE manche_id = $1',
                [id]
            );

            // 5. Supprimer les associations avec les rubriques
            await client.query(
                'DELETE FROM rubriques_manche WHERE manche_id = $1',
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

/**
 * Récupérer les manches groupées par étape
 */
const getManchesParEtape = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT 
                m.*,
                COUNT(DISTINCT s.equipe_id) as nombre_equipes,
                COUNT(DISTINCT rm.rubrique_id) as nombre_rubriques,
                COUNT(DISTINCT e.id) as nombre_notations
            FROM manches m
            LEFT JOIN scores s ON m.id = s.manche_id
            LEFT JOIN rubriques_manche rm ON m.id = rm.manche_id
            LEFT JOIN evaluations e ON m.id = e.manche_id
            GROUP BY m.id
            ORDER BY m.numero
        `);

        // Grouper par étape
        const etapes = {
            preliminaire: { nom: 'Phase Préliminaire', manches: [] },
            quart: { nom: 'Quart de Finale', manches: [] },
            demi: { nom: 'Demi-Finale', manches: [] },
            finale: { nom: 'Finale', manches: [] }
        };

        result.rows.forEach(manche => {
            const etape = manche.etape || 'preliminaire';
            if (etapes[etape]) {
                etapes[etape].manches.push(manche);
            }
        });

        // Filtrer les étapes vides
        const etapesAvecManches = Object.entries(etapes)
            .filter(([key, value]) => value.manches.length > 0)
            .map(([key, value]) => ({ code: key, ...value }));

        res.json({
            success: true,
            data: etapesAvecManches
        });

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
    deleteManche,
    getManchesParEtape
};
