const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const csvParser = require('csv-parse/sync');
const db = require('../config/database');

/**
 * POST /api/upload/participants
 * Import CSV de participants
 */
router.post('/participants', upload.single('file'), handleMulterError, async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier CSV fourni'
            });
        }

        console.log('📥 Import CSV participants:', req.file.originalname);

        // Lire le contenu du fichier CSV
        const csvContent = req.file.buffer.toString('utf-8');

        // Parser le CSV
        const records = csvParser.parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            delimiter: ',',
            trim: true
        });

        console.log('📊 Nombre de lignes:', records.length);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Insérer chaque participant
        for (const [index, record] of records.entries()) {
            try {
                // Validation des champs requis
                if (!record.nom || !record.prenom || !record.telephone || !record.etablissement) {
                    throw new Error('Champs requis manquants (nom, prenom, telephone, etablissement)');
                }

                // Vérifier que l'établissement est valide
                if (!['ESATIC', 'EMSP'].includes(record.etablissement.toUpperCase())) {
                    throw new Error('Établissement invalide (doit être ESATIC ou EMSP)');
                }

                // Insérer le participant
                await db.query(
                    `INSERT INTO participants 
                    (nom, prenom, email, telephone, etablissement, niveau_coranique, connaissance_hadiths, memorisation_sourate)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (telephone) DO NOTHING`,
                    [
                        record.nom,
                        record.prenom,
                        record.email || null,
                        record.telephone,
                        record.etablissement.toUpperCase(),
                        record.niveau_coranique || null,
                        record.connaissance_hadiths || null,
                        record.memorisation_sourate || null
                    ]
                );

                successCount++;

            } catch (error) {
                errorCount++;
                errors.push({
                    ligne: index + 2, // +2 car index commence à 0 et il y a l'en-tête
                    donnees: record,
                    erreur: error.message
                });
                console.error(`❌ Erreur ligne ${index + 2}:`, error.message);
            }
        }

        console.log(`✅ Import terminé: ${successCount} succès, ${errorCount} erreurs`);

        res.json({
            success: true,
            message: `Import terminé: ${successCount} participant(s) importé(s)`,
            data: {
                success: successCount,
                errors: errorCount,
                details: errorCount > 0 ? errors : undefined
            }
        });

    } catch (error) {
        console.error('❌ Erreur import CSV:', error);
        next(error);
    }
});

/**
 * POST /api/upload/audio
 * Upload d'un fichier audio (Adhan, Coran, Hadith)
 */
router.post('/audio', upload.single('audioFile'), handleMulterError, (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Aucun fichier fourni'
        });
    }

    const fileUrl = `/uploads/${req.body.type || 'autres'}/${req.file.filename}`;

    res.json({
        success: true,
        message: 'Fichier uploadé avec succès',
        data: {
            filename: req.file.filename,
            url: fileUrl,
            size: req.file.size
        }
    });
});

module.exports = router;
