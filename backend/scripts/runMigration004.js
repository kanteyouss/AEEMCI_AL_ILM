const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('🔄 Exécution de la migration 004...');
        
        const migrationPath = path.join(__dirname, '../../database/migrations/004_add_classement_config.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        await client.query(sql);
        
        console.log('✅ Migration 004 exécutée avec succès !');
        
        // Vérifier les données insérées
        const result = await client.query('SELECT * FROM classement_config ORDER BY cle');
        console.log('\n📊 Configuration créée:');
        result.rows.forEach(row => {
            console.log(`  - ${row.cle}: ${row.valeur} (${row.type})`);
        });
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
