/**
 * Script pour associer automatiquement les rubriques aux manches
 * Crée les entrées dans rubriques_manche pour permettre la notation
 */

require('dotenv').config();
const db = require('../config/database');

async function associerRubriquesAuxManches() {
    try {
        console.log('🔄 Association des rubriques aux manches...');
        
        // 1. Récupérer toutes les manches
        const manchesResult = await db.query(`
            SELECT id, nom, type 
            FROM manches 
            ORDER BY id
        `);
        
        const manches = manchesResult.rows;
        console.log(`✅ ${manches.length} manche(s) trouvée(s)`);
        
        if (manches.length === 0) {
            console.log('⚠️ Aucune manche trouvée. Créez d\'abord des manches.');
            process.exit(0);
        }
        
        // 2. Récupérer toutes les rubriques
        const rubriquesResult = await db.query(`
            SELECT id, nom, type 
            FROM rubriques 
            ORDER BY id
        `);
        
        const rubriques = rubriquesResult.rows;
        console.log(`✅ ${rubriques.length} rubrique(s) trouvée(s)`);
        
        if (rubriques.length === 0) {
            console.log('⚠️ Aucune rubrique trouvée. Créez d\'abord des rubriques.');
            process.exit(0);
        }
        
        // 3. Vérifier les associations existantes
        const existingResult = await db.query(`
            SELECT manche_id, rubrique_id 
            FROM rubriques_manche
        `);
        
        const existing = existingResult.rows;
        console.log(`ℹ️ ${existing.length} association(s) existante(s)`);
        
        // 4. Créer les associations manquantes
        let created = 0;
        let skipped = 0;
        
        for (const manche of manches) {
            console.log(`\n📋 Manche: ${manche.nom} (ID: ${manche.id})`);
            
            for (let i = 0; i < rubriques.length; i++) {
                const rubrique = rubriques[i];
                
                // Vérifier si l'association existe déjà
                const alreadyExists = existing.some(
                    e => e.manche_id === manche.id && e.rubrique_id === rubrique.id
                );
                
                if (alreadyExists) {
                    console.log(`   ⏭️ ${rubrique.nom} - Déjà associée`);
                    skipped++;
                    continue;
                }
                
                // Créer l'association
                try {
                    await db.query(`
                        INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage, actif)
                        VALUES ($1, $2, $3, true)
                        ON CONFLICT (manche_id, rubrique_id) DO NOTHING
                    `, [manche.id, rubrique.id, i + 1]);
                    
                    console.log(`   ✅ ${rubrique.nom} - Associée (ordre: ${i + 1})`);
                    created++;
                } catch (error) {
                    console.error(`   ❌ Erreur pour ${rubrique.nom}:`, error.message);
                }
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ ASSOCIATION TERMINÉE');
        console.log(`   • ${created} nouvelle(s) association(s) créée(s)`);
        console.log(`   • ${skipped} association(s) existante(s) ignorée(s)`);
        console.log('='.repeat(50));
        
        // 5. Afficher un récapitulatif
        const finalResult = await db.query(`
            SELECT 
                m.nom as manche_nom,
                COUNT(rm.id) as nb_rubriques
            FROM manches m
            LEFT JOIN rubriques_manche rm ON m.id = rm.manche_id
            GROUP BY m.id, m.nom
            ORDER BY m.id
        `);
        
        console.log('\n📊 RÉCAPITULATIF PAR MANCHE:');
        finalResult.rows.forEach(row => {
            console.log(`   • ${row.manche_nom}: ${row.nb_rubriques} rubrique(s)`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ ERREUR:', error);
        process.exit(1);
    }
}

// Exécution
associerRubriquesAuxManches();
