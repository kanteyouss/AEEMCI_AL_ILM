/**
 * Script de test pour vérifier l'endpoint public des équipes validées
 * Vérifie que les équipes avec 0 membre sont bien retournées
 */

const db = require('../config/database');

async function testPublicAPI() {
    try {
        console.log('\n🧪 === TEST PUBLIC API ===\n');
        
        // Requête identique à celle de getValidatedEquipes
        const query = `
            SELECT 
                e.id,
                e.nom,
                e.code_acces,
                COUNT(me.participant_id) FILTER (WHERE me.participant_id IS NOT NULL) as nb_membres,
                json_agg(
                    json_build_object(
                        'id', p.id,
                        'prenom', p.prenom,
                        'nom', p.nom,
                        'etablissement', p.etablissement,
                        'est_capitaine', me.est_capitaine
                    ) ORDER BY me.est_capitaine DESC, p.prenom
                ) FILTER (WHERE p.id IS NOT NULL) as membres
            FROM equipes e
            LEFT JOIN membres_equipe me ON e.id = me.equipe_id
            LEFT JOIN participants p ON me.participant_id = p.id
            WHERE e.code_acces IS NOT NULL
            GROUP BY e.id
            ORDER BY e.nom
        `;
        
        const result = await db.query(query);
        
        console.log(`📊 Nombre total d'équipes validées: ${result.rows.length}\n`);
        
        result.rows.forEach(eq => {
            const nbMembres = parseInt(eq.nb_membres);
            const symbole = nbMembres === 0 ? '⚠️' : nbMembres > 0 ? '✅' : '❌';
            
            console.log(`${symbole} ${eq.nom.padEnd(20)} | ${nbMembres} membre(s) | Code: ${eq.code_acces || 'N/A'}`);
            
            if (eq.membres && eq.membres.length > 0) {
                eq.membres.forEach(m => {
                    if (m && m.id) {
                        const cap = m.est_capitaine ? '👑' : '  ';
                        console.log(`   ${cap} ${m.prenom} ${m.nom}`);
                    }
                });
            }
        });
        
        // Vérifier spécifiquement AL-FURQAN
        const alFurqan = result.rows.find(eq => eq.nom === 'AL-FURQAN');
        
        console.log('\n🔍 VÉRIFICATION AL-FURQAN:');
        if (alFurqan) {
            console.log(`   ✅ Équipe trouvée dans les résultats`);
            console.log(`   - Nombre de membres: ${alFurqan.nb_membres}`);
            console.log(`   - Code d'accès: ${alFurqan.code_acces}`);
            console.log(`   - Membres:`, alFurqan.membres);
            
            if (parseInt(alFurqan.nb_membres) === 0) {
                console.log(`   ✅ SUCCÈS: AL-FURQAN a bien 0 membre (bug corrigé)`);
            } else {
                console.log(`   ⚠️  AL-FURQAN a ${alFurqan.nb_membres} membre(s)`);
            }
        } else {
            console.log(`   ❌ AL-FURQAN non trouvée (pas de code d'accès?)`);
        }
        
        console.log('\n=== FIN TEST ===\n');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        process.exit(0);
    }
}

testPublicAPI();
