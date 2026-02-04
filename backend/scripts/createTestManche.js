/**
 * Script pour créer une manche de test avec rubriques
 */

const db = require('../config/database');

async function createTestManche() {
    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');
        
        console.log('🎯 Création de la manche de test...');
        
        // Créer la manche
        const mancheResult = await client.query(`
            INSERT INTO manches (nom, type, numero, date_manche, heure_debut, heure_fin, description, statut)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [
            'Phase Préliminaire - Jour 1',
            'preliminaire',
            1,
            '2026-02-20', // 20 février 2026
            '19:00',
            '21:00',
            'Manche 1 - Phase Préliminaire',
            'publie'
        ]);
        
        const manche = mancheResult.rows[0];
        console.log('✅ Manche créée:', manche);
        
        // Récupérer toutes les rubriques
        const rubriquesResult = await client.query('SELECT id, nom FROM rubriques ORDER BY id');
        const rubriques = rubriquesResult.rows;
        
        console.log(`📋 ${rubriques.length} rubriques trouvées`);
        
        // Associer les 3 premières rubriques à la manche
        const rubriquesToAdd = rubriques.slice(0, 3);
        
        for (let i = 0; i < rubriquesToAdd.length; i++) {
            await client.query(`
                INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage, actif)
                VALUES ($1, $2, $3, $4)
            `, [manche.id, rubriquesToAdd[i].id, i + 1, true]);
            
            console.log(`  ✓ Rubrique "${rubriquesToAdd[i].nom}" associée`);
        }
        
        await client.query('COMMIT');
        
        console.log('\n✅ Manche de test créée avec succès !');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📌 ID: ${manche.id}`);
        console.log(`📛 Nom: ${manche.nom}`);
        console.log(`🏷️  Type: ${manche.type}`);
        console.log(`🔢 Numéro: ${manche.numero}`);
        console.log(`📅 Date: ${manche.date_manche}`);
        console.log(`🕐 Horaire: ${manche.heure_debut} - ${manche.heure_fin}`);
        console.log(`📊 Statut: ${manche.statut}`);
        console.log(`📋 Rubriques: ${rubriquesToAdd.length}`);
        rubriquesToAdd.forEach((r, i) => {
            console.log(`   ${i + 1}. ${r.nom}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        process.exit(0);
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur lors de la création de la manche:', error);
        process.exit(1);
    } finally {
        client.release();
    }
}

createTestManche();
