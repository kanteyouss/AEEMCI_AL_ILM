/**
 * Script pour ajouter la colonne numero à la table manches
 */

const db = require('../config/database');

async function addNumeroColumn() {
    try {
        console.log('🔧 Ajout de la colonne numero à la table manches...');
        
        // Ajouter la colonne
        await db.query(`
            ALTER TABLE manches 
            ADD COLUMN IF NOT EXISTS numero INTEGER
        `);
        console.log('✅ Colonne numero ajoutée');
        
        // Ajouter l'index
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_manches_numero ON manches(numero)
        `);
        console.log('✅ Index créé sur numero');
        
        // Ajouter la contrainte d'unicité
        try {
            await db.query(`
                ALTER TABLE manches 
                ADD CONSTRAINT unique_manche_numero UNIQUE (numero)
            `);
            console.log('✅ Contrainte d\'unicité ajoutée');
        } catch (error) {
            if (error.code === '42P07') {
                console.log('⚠️  Contrainte d\'unicité existe déjà');
            } else {
                throw error;
            }
        }
        
        console.log('✅ Migration terminée avec succès');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

addNumeroColumn();
