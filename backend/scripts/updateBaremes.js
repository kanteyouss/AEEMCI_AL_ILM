/**
 * Script pour mettre à jour les barèmes des rubriques selon le document officiel
 */

require('dotenv').config();
const db = require('../config/database');

async function updateBaremes() {
    try {
        console.log('🔄 Mise à jour des barèmes des rubriques...\n');

        // 1. Adhan (Azan)
        await db.query(`
            UPDATE rubriques 
            SET 
                points_max = 10,
                temps_par_question = 180,
                criteres_evaluation = '{"voix": 3, "prononciation": 7}'::jsonb,
                description = '1 participant par équipe - 1 question - 3 min max'
            WHERE nom = 'Adhan'
        `);
        console.log('✅ Adhan: 10 pts (Voix: 3, Prononciation: 7) - 1 question de 3 min');

        // 2. Coran ouvert (Juz Amma)
        await db.query(`
            UPDATE rubriques 
            SET 
                points_max = 15,
                temps_par_question = NULL,
                criteres_evaluation = '{"voix": 5, "prononciation": 10}'::jsonb,
                description = 'Lecture d''une partie imposée (Juz Amma) - 1 question'
            WHERE nom = 'Coran ouvert'
        `);
        console.log('✅ Coran ouvert: 15 pts (Voix: 5, Prononciation: 10) - 1 question');

        // 3. Coran fermé (Sabi)
        await db.query(`
            UPDATE rubriques 
            SET 
                points_max = 15,
                temps_par_question = NULL,
                criteres_evaluation = '{"voix": 5, "prononciation": 10}'::jsonb,
                description = 'Lecture sans consultation (Sabi) - 1 question'
            WHERE nom = 'Coran fermé'
        `);
        console.log('✅ Coran fermé: 15 pts (Voix: 5, Prononciation: 10) - 1 question');

        // 5. Vie du Prophète
        await db.query(`
            UPDATE rubriques 
            SET 
                points_max = 30,
                temps_par_question = 15,
                criteres_evaluation = '{"exactitude": 15}'::jsonb,
                description = '2 questions - 15 pts par bonne réponse - 15 sec/question'
            WHERE nom = 'Vie du Prophète'
        `);
        console.log('✅ Vie du Prophète: 30 pts (15 pts/question) - 2 questions de 15 sec');

        // 6. Jurisprudence
        await db.query(`
            UPDATE rubriques 
            SET 
                points_max = 50,
                temps_par_question = 15,
                criteres_evaluation = '{"exactitude": 25}'::jsonb,
                description = '2 questions - 25 pts par bonne réponse - 15 sec/question'
            WHERE nom = 'Jurisprudence'
        `);
        console.log('✅ Jurisprudence: 50 pts (25 pts/question) - 2 questions de 15 sec');

        // 7. Culture générale
        await db.query(`
            UPDATE rubriques 
            SET 
                points_max = 100,
                temps_par_question = 15,
                criteres_evaluation = '{"exactitude": 25}'::jsonb,
                description = '4 questions - 25 pts par bonne réponse - 15 sec/question'
            WHERE nom = 'Culture générale'
        `);
        console.log('✅ Culture générale: 100 pts (25 pts/question) - 4 questions de 15 sec');

        // 8. Hadith
        await db.query(`
            UPDATE rubriques 
            SET 
                points_max = 20,
                temps_par_question = 20,
                criteres_evaluation = '{"exactitude": 20}'::jsonb,
                description = '1 question - 20 pts par bonne réponse - 20 sec'
            WHERE nom = 'Hadith'
        `);
        console.log('✅ Hadith: 20 pts (20 pts/question) - 1 question de 20 sec');

        // 9. Questions relais (pas dans le barème officiel, on garde les valeurs)
        console.log('⏭️  Questions relais: conservé tel quel');

        // Afficher le récapitulatif
        const rubriques = await db.query(`
            SELECT 
                nom,
                points_max,
                temps_par_question,
                criteres_evaluation,
                description
            FROM rubriques
            ORDER BY id
        `);

        console.log('\n📊 RÉCAPITULATIF DES BARÈMES:');
        console.log('='.repeat(80));

        rubriques.rows.forEach(r => {
            const criteres = Object.entries(r.criteres_evaluation || {})
                .map(([k, v]) => `${k}: ${v} pts`)
                .join(', ');

            console.log(`\n📋 ${r.nom}`);
            console.log(`   • Total: ${r.points_max} pts`);
            console.log(`   • Questions: ${r.nombre_questions}`);
            console.log(`   • Temps: ${r.temps_par_question ? r.temps_par_question + ' sec' : 'N/A'}`);
            console.log(`   • Critères: ${criteres}`);
            if (r.description) {
                console.log(`   • Description: ${r.description}`);
            }
        });

        console.log('\n' + '='.repeat(80));
        console.log('✅ Mise à jour terminée');

        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

updateBaremes();
