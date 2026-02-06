require('dotenv').config();
const db = require('../config/database');

async function cleanup() {
    try {
        console.log('\n🧹 === NETTOYAGE DES ÉQUIPES ===\n');
        
        // 1. Afficher toutes les équipes avec code_acces
        console.log('📋 Équipes avec code_acces:');
        const equipesResult = await db.query(`
            SELECT id, nom, code_acces 
            FROM equipes 
            WHERE code_acces IS NOT NULL
            ORDER BY nom
        `);
        console.table(equipesResult.rows);
        
        // 2. Afficher tous les membres
        console.log('\n👥 Membres actuels:');
        const membresResult = await db.query(`
            SELECT me.equipe_id, e.nom as equipe, me.participant_id, 
                   p.prenom, p.nom as participant_nom, me.est_capitaine
            FROM membres_equipe me
            JOIN equipes e ON me.equipe_id = e.id
            JOIN participants p ON me.participant_id = p.id
            ORDER BY e.nom, p.prenom
        `);
        console.table(membresResult.rows);
        
        // 3. Compter les membres par équipe
        console.log('\n📊 Comptage par équipe:');
        const countResult = await db.query(`
            SELECT e.id, e.nom, e.code_acces, 
                   COUNT(me.participant_id) as nb_membres
            FROM equipes e
            LEFT JOIN membres_equipe me ON e.id = me.equipe_id
            WHERE e.code_acces IS NOT NULL
            GROUP BY e.id
            ORDER BY e.nom
        `);
        console.table(countResult.rows);
        
        // 4. Réinitialiser les équipes vides
        console.log('\n🔄 Réinitialisation des équipes vides...');
        const resetResult = await db.query(`
            UPDATE equipes e
            SET code_acces = NULL
            WHERE e.code_acces IS NOT NULL
            AND NOT EXISTS (
                SELECT 1 FROM membres_equipe me 
                WHERE me.equipe_id = e.id
            )
            RETURNING id, nom
        `);
        
        if (resetResult.rows.length > 0) {
            console.log('✅ Équipes réinitialisées:');
            console.table(resetResult.rows);
        } else {
            console.log('ℹ️  Aucune équipe vide à réinitialiser');
        }
        
        // 5. Vérification finale
        console.log('\n📊 État final - Équipes validées:');
        const finalResult = await db.query(`
            SELECT 
                e.id,
                e.nom,
                e.code_acces,
                COUNT(DISTINCT me.participant_id) as nb_membres
            FROM equipes e
            LEFT JOIN membres_equipe me ON e.id = me.equipe_id
            WHERE e.code_acces IS NOT NULL
            GROUP BY e.id
            HAVING COUNT(DISTINCT me.participant_id) > 0
            ORDER BY e.nom
        `);
        console.table(finalResult.rows);
        
        console.log('\n✅ Nettoyage terminé!\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

cleanup();
