require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function addEliminationConfig() {
    try {
        await db.query(`
            INSERT INTO classement_config (cle, valeur, type, description)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (cle) DO NOTHING
        `, [
            'equipes_eliminees',
            '[]',
            'string',
            'Liste des noms d\'équipes éliminées (Format JSON array)'
        ]);
        console.log(`✅ Config equipes_eliminees ajoutée`);
    } catch (e) {
        console.error(`❌ Erreur:`, e);
    }
    process.exit();
}

addEliminationConfig();
