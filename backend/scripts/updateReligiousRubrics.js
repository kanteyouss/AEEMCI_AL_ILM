/**
 * Script pour mettre à jour les questions et descriptions des rubriques religieuses :
 * - Adhan (Normal/Fajr)
 * - Coran ouvert (Sourates 78-114)
 * - Coran fermé (Sourates 87-114)
 */

require('dotenv').config();
const db = require('../config/database');

const RELIGIOUS_DATA = {
    rubriques: [
        {
            id: 1,
            description: "Récitation de l'Adhan (normal ou Fajr). 1 participant par équipe. 3 min max pour l'exécution. 1 question = 10 pts."
        },
        {
            id: 2,
            description: "Lecture d'une partie imposée du Juz Amma (sourates 78 à 114). Voix: 5 pts, Prononciation: 10 pts. 1 question = 15 pts."
        },
        {
            id: 3,
            description: "Récitation de mémoire (sourates 87 à 114). Voix: 5 pts, Prononciation: 10 pts. 1 question = 15 pts."
        }
    ],
    questions: [
        // Adhan (ID 1)
        { rid: 1, q: "Réciter l'Adhan (Version Normale)", r: "Exécution complète de l'Adhan de base." },
        { rid: 1, q: "Réciter l'Adhan (Version Fajr)", r: "Exécution incluant 'As-salatu khayrun minan-nawm' après le second 'Hayya 'alal-falah'." },
        { rid: 1, q: "Réciter l'Adhan (Version Normale)", r: "Exécution complète de l'Adhan de base." },
        { rid: 1, q: "Réciter l'Adhan (Version Fajr)", r: "Exécution incluant 'As-salatu khayrun minan-nawm'." },
        { rid: 1, q: "Réciter l'Adhan (Version Normale)", r: "Exécution complète." },
        { rid: 1, q: "Réciter l'Adhan (Version Fajr)", r: "Exécution complète Fajr." },

        // Coran ouvert (ID 2 - 78 à 114)
        { rid: 2, q: "Lire la Sourate An-Naba (78) - Versets 1 à 16", r: "Lecture fluide avec respect des règles de Tajwid." },
        { rid: 2, q: "Lire la Sourate An-Nazi'at (79) - Versets 1 à 14", r: "Lecture fluide." },
        { rid: 2, q: "Lire la Sourate 'Abasa (80) - Versets 1 à 16", r: "Lecture fluide." },
        { rid: 2, q: "Lire la Sourate At-Takwir (81) - Versets 1 à 14", r: "Lecture fluide." },
        { rid: 2, q: "Lire la Sourate Al-Infitar (82) - Versets 1 à 19", r: "Lecture fluide." },
        { rid: 2, q: "Lire la Sourate Al-Mutaffifin (83) - Versets 1 à 12", r: "Lecture fluide." },

        // Coran fermé (ID 3 - 87 à 114)
        { rid: 3, q: "Réciter de mémoire la Sourate Al-A'la (87)", r: "Récitation exacte sans erreurs de mémorisation." },
        { rid: 3, q: "Réciter de mémoire la Sourate Al-Ghashiyah (88)", r: "Récitation exacte." },
        { rid: 3, q: "Réciter de mémoire la Sourate Al-Balad (90)", r: "Récitation exacte." },
        { rid: 3, q: "Réciter de mémoire la Sourate Ach-Chams (91)", r: "Récitation exacte." },
        { rid: 3, q: "Réciter de mémoire la Sourate Ad-Duha (93)", r: "Récitation exacte." },
        { rid: 3, q: "Réciter de mémoire la Sourate Al-Alak (96)", r: "Récitation exacte." }
    ]
};

async function updateReligiousRubrics() {
    try {
        console.log('🔄 Mise à jour des rubriques religieuses (Adhan, Coran)...');

        // 1. Mise à jour des descriptions de rubriques (IDs 1, 2, 3)
        for (const rub of RELIGIOUS_DATA.rubriques) {
            await db.query(
                'UPDATE rubriques SET description = $1 WHERE id = $2',
                [rub.description, rub.id]
            );
            console.log(`📝 Description de la rubrique ID ${rub.id} mise à jour.`);
        }

        // 2. Nettoyage des anciennes questions pour ces rubriques
        await db.query('DELETE FROM questions WHERE rubrique_id IN (1, 2, 3)');
        console.log('🗑️ Anciennes questions Adhan/Coran supprimées.');

        // 3. Insertion des nouvelles questions
        for (const question of RELIGIOUS_DATA.questions) {
            await db.query(
                `INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, points, difficulte, type)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    question.rid,
                    question.q,
                    question.r,
                    question.rid === 1 ? 10 : 15, // Points selon barème
                    'moyen',
                    'texte_libre'
                ]
            );
        }
        console.log(`✅ ${RELIGIOUS_DATA.questions.length} nouvelles questions insérées.`);

        console.log('\n✨ Mise à jour religieuse terminée avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour :', error);
        process.exit(1);
    }
}

updateReligiousRubrics();
