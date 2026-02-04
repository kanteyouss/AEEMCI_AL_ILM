require('dotenv').config();
const { pool } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script pour initialiser les données de base (seeds)
 * Exécute les fichiers SQL dans database/seeds/
 */

const SEEDS_DIR = path.join(__dirname, '../../database/seeds');

async function runSeedFile(filePath) {
    try {
        console.log(`📄 Exécution de ${path.basename(filePath)}...`);
        
        const sql = await fs.readFile(filePath, 'utf8');
        await pool.query(sql);
        
        console.log(`✅ ${path.basename(filePath)} exécuté avec succès`);
    } catch (error) {
        console.error(`❌ Erreur lors de l'exécution de ${path.basename(filePath)}:`, error.message);
        throw error;
    }
}

async function seedDatabase() {
    try {
        console.log('🌱 Début du seeding de la base de données...\n');
        
        // Lire tous les fichiers SQL dans le dossier seeds
        const files = await fs.readdir(SEEDS_DIR);
        const sqlFiles = files
            .filter(file => file.endsWith('.sql'))
            .sort(); // Trier par ordre alphabétique (01_, 02_, etc.)
        
        if (sqlFiles.length === 0) {
            console.log('⚠️  Aucun fichier seed trouvé dans', SEEDS_DIR);
            return;
        }
        
        console.log(`📦 ${sqlFiles.length} fichier(s) seed trouvé(s):\n`);
        
        // Exécuter chaque fichier seed dans l'ordre
        for (const file of sqlFiles) {
            const filePath = path.join(SEEDS_DIR, file);
            await runSeedFile(filePath);
        }
        
        console.log('\n✅ Seeding terminé avec succès !');
        console.log('🕌 JEU CONCOURS AL ILM 2026 - AEEMCI');
        console.log('"Pour une identité islamique !"\n');
        
    } catch (error) {
        console.error('\n❌ Erreur fatale lors du seeding:', error.message);
        process.exit(1);
    } finally {
        // Fermer la connexion
        await pool.end();
    }
}

// Exécuter le seeding
seedDatabase();
