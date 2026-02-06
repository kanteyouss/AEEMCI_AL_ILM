require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function addConfigs() {
    const configs = [
        { cle: 'afficher_phase_preliminaire', valeur: 'true', type: 'boolean', description: 'Afficher l\'onglet Phase Préliminaire' },
        { cle: 'afficher_phase_quart', valeur: 'true', type: 'boolean', description: 'Afficher l\'onglet Quart de Finale' },
        { cle: 'afficher_phase_demi', valeur: 'true', type: 'boolean', description: 'Afficher l\'onglet Demi-Finale' },
        { cle: 'afficher_phase_finale', valeur: 'true', type: 'boolean', description: 'Afficher l\'onglet Finale' }
    ];

    for (const config of configs) {
        try {
            await db.query(`
                INSERT INTO classement_config (cle, valeur, type, description)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (cle) DO NOTHING
            `, [config.cle, config.valeur, config.type, config.description]);
            console.log(`✅ Config ${config.cle} traitée`);
        } catch (e) {
            console.error(`❌ Erreur pour ${config.cle}:`, e);
        }
    }
    process.exit();
}

addConfigs();