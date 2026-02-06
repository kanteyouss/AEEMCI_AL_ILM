/**
 * Script pour créer la table equipes_manche
 */

const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const client = await db.pool.connect();
    
    try {
        console.log('🚀 Début de la migration: Création de la table equipes_manche...');
        
        const migrationSQL = fs.readFileSync(
            path.join(__dirname, '..', '..', 'database', 'migrations', '003_add_equipes_manche.sql'),
            'utf8'
        );
        
        await client.query(migrationSQL);
        
        console.log('✅ Migration terminée avec succès !');
        console.log('📋 Table equipes_manche créée');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        client.release();
    }
}

runMigration();
