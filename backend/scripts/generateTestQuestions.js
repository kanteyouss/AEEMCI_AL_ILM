/**
 * Script pour générer des questions de test pour toutes les rubriques
 */

require('dotenv').config();
const db = require('../config/database');

async function generateTestQuestions() {
    try {
        console.log('🎲 Génération de questions de test...\n');

        // Récupérer toutes les rubriques
        const rubriques = await db.query('SELECT id, nom, type, description FROM rubriques ORDER BY id');

        for (const rubrique of rubriques.rows) {
            console.log(`📋 ${rubrique.nom}`);

            const questions = getQuestionsForRubrique(rubrique);

            for (const q of questions) {
                try {
                    await db.query(
                        `INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, points, difficulte)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [rubrique.id, q.enonce, q.reponse, 'qcm', q.points, q.difficulte]
                    );
                    console.log(`   ✓ ${q.enonce.substring(0, 50)}...`);
                } catch (err) {
                    if (err.code === '23505') { // Duplicate key
                        console.log(`   ⚠️ Question déjà existante: ${q.enonce.substring(0, 30)}...`);
                    } else {
                        console.error(`   ❌ Erreur: ${err.message}`);
                    }
                }
            }

            console.log('');
        }

        const count = await db.query('SELECT COUNT(*) FROM questions');
        console.log(`✅ Total de questions dans la base : ${count.rows[0].count}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

function getQuestionsForRubrique(rubrique) {
    const questions = {
        'Adhan': [
            { enonce: "Quel est le premier appel à la prière de la journée ?", reponse: "Fajr", points: 10, difficulte: 'facile' },
            { enonce: "Combien de fois répète-t-on 'Allahu Akbar' dans l'Adhan ?", reponse: "4 fois", points: 10, difficulte: 'moyen' },
            { enonce: "Quelle phrase dit-on deux fois à la fin de l'Adhan ?", reponse: "La ilaha illa Allah", points: 10, difficulte: 'facile' },
            { enonce: "Qui fut le premier muezzin de l'Islam ?", reponse: "Bilal ibn Rabah", points: 10, difficulte: 'moyen' },
            { enonce: "Que signifie 'Hayya 'ala as-salah' ?", reponse: "Venez à la prière", points: 10, difficulte: 'facile' }
        ],
        'Coran ouvert': [
            { enonce: "Quelle sourate est appelée 'le cœur du Coran' ?", reponse: "Sourate Yasin", points: 15, difficulte: 'moyen' },
            { enonce: "Combien de sourates compte Juz Amma (30ème partie) ?", reponse: "37 sourates", points: 15, difficulte: 'moyen' },
            { enonce: "Quelle est la plus courte sourate du Coran ?", reponse: "Al-Kawthar", points: 15, difficulte: 'facile' },
            { enonce: "Quelle sourate ne commence pas par Bismillah ?", reponse: "At-Tawbah", points: 15, difficulte: 'moyen' },
            { enonce: "Combien de versets compte Sourate Al-Fatiha ?", reponse: "7 versets", points: 15, difficulte: 'facile' }
        ],
        'Coran fermé': [
            { enonce: "Quelle sourate parle des gens de l'éléphant ?", reponse: "Sourate Al-Fil", points: 15, difficulte: 'moyen' },
            { enonce: "Dans quelle sourate trouve-t-on le verset du Trône (Ayat al-Kursi) ?", reponse: "Sourate Al-Baqarah", points: 15, difficulte: 'facile' },
            { enonce: "Quelle sourate a été révélée en entier d'un seul coup ?", reponse: "Al-Fatiha", points: 15, difficulte: 'moyen' },
            { enonce: "Combien de fois le nom 'Muhammad' est-il mentionné dans le Coran ?", reponse: "4 fois", points: 15, difficulte: 'difficile' },
            { enonce: "Quelle sourate est recommandée de lire le vendredi ?", reponse: "Sourate Al-Kahf", points: 15, difficulte: 'facile' }
        ],
        'Vie du Prophète': [
            { enonce: "En quelle année le Prophète (saw) est-il né ?", reponse: "570 après J.C. (Année de l'Éléphant)", points: 15, difficulte: 'moyen' },
            { enonce: "Quel âge avait le Prophète lors de sa première révélation ?", reponse: "40 ans", points: 15, difficulte: 'facile' },
            { enonce: "Comment s'appelait la première épouse du Prophète ?", reponse: "Khadija bint Khuwaylid", points: 15, difficulte: 'facile' },
            { enonce: "En quelle année a eu lieu l'Hégire ?", reponse: "622 après J.C.", points: 15, difficulte: 'moyen' },
            { enonce: "Combien d'enfants a eu le Prophète ?", reponse: "7 enfants", points: 15, difficulte: 'moyen' },
            { enonce: "Qui était la nourrice du Prophète ?", reponse: "Halima As-Sa'diyah", points: 15, difficulte: 'moyen' },
            { enonce: "Quelle bataille est appelée 'le jour du Critère' ?", reponse: "Bataille de Badr", points: 15, difficulte: 'moyen' }
        ],
        'Jurisprudence': [
            { enonce: "Combien de piliers a l'Islam ?", reponse: "5 piliers", points: 25, difficulte: 'facile' },
            { enonce: "À partir de quel âge la prière devient-elle obligatoire ?", reponse: "À la puberté", points: 25, difficulte: 'facile' },
            { enonce: "Quel est le nisab (seuil) pour la Zakat sur l'or ?", reponse: "85 grammes d'or", points: 25, difficulte: 'moyen' },
            { enonce: "Combien de rak'at compte la prière du Fajr ?", reponse: "2 rak'at", points: 25, difficulte: 'facile' },
            { enonce: "Quelles sont les conditions de validité du jeûne ?", reponse: "Islam, raison, capacité, intention, s'abstenir", points: 25, difficulte: 'moyen' },
            { enonce: "Quel pourcentage de la récolte doit-on donner en Zakat ?", reponse: "10% ou 5% selon irrigation", points: 25, difficulte: 'moyen' }
        ],
        'Culture générale': [
            { enonce: "Quelle est la plus ancienne université du monde musulman ?", reponse: "Université Al-Qarawiyyin (Fès, Maroc)", points: 25, difficulte: 'moyen' },
            { enonce: "Qui a inventé l'algèbre ?", reponse: "Al-Khwarizmi", points: 25, difficulte: 'moyen' },
            { enonce: "Quelle est la plus grande mosquée du monde ?", reponse: "Masjid al-Haram (La Mecque)", points: 25, difficulte: 'facile' },
            { enonce: "En quelle année fut construite la mosquée Al-Aqsa ?", reponse: "Vers 705-715 après J.C.", points: 25, difficulte: 'difficile' },
            { enonce: "Qui fut le premier calife de l'Islam ?", reponse: "Abou Bakr As-Siddiq", points: 25, difficulte: 'facile' },
            { enonce: "Quel savant musulman a écrit 'Le Canon de la médecine' ?", reponse: "Ibn Sina (Avicenne)", points: 25, difficulte: 'moyen' },
            { enonce: "Combien de langues compte le monde musulman ?", reponse: "Plus de 1000 langues", points: 25, difficulte: 'difficile' },
            { enonce: "Quel empire musulman a régné en Espagne ?", reponse: "Al-Andalus (Omeyyades)", points: 25, difficulte: 'facile' }
        ],
        'Hadith': [
            { enonce: "Qui est l'auteur du recueil 'Sahih Al-Bukhari' ?", reponse: "Imam Al-Bukhari", points: 20, difficulte: 'facile' },
            { enonce: "Complétez : 'Les actions ne valent que par...'", reponse: "Les intentions", points: 20, difficulte: 'facile' },
            { enonce: "Combien de hadiths contient Sahih Al-Bukhari ?", reponse: "Environ 7275 hadiths", points: 20, difficulte: 'moyen' },
            { enonce: "Qui sont les six grands compilateurs de hadiths ?", reponse: "Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah", points: 20, difficulte: 'moyen' },
            { enonce: "Quel hadith parle des cinq piliers de l'Islam ?", reponse: "Hadith de Jibril", points: 20, difficulte: 'moyen' }
        ]
    };

    return questions[rubrique.nom] || [
        { enonce: `Question test pour ${rubrique.nom} - 1`, reponse: "Réponse test 1", points: 10, difficulte: 'facile' },
        { enonce: `Question test pour ${rubrique.nom} - 2`, reponse: "Réponse test 2", points: 10, difficulte: 'moyen' },
        { enonce: `Question test pour ${rubrique.nom} - 3`, reponse: "Réponse test 3", points: 10, difficulte: 'difficile' }
    ];
}

generateTestQuestions();
