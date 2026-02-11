/**
 * Générer des questions de test pour toutes les rubriques
 */

require('dotenv').config();
const { Client } = require('pg');

const questionsData = [
    // Adhan (1 question)
    { rubrique: 'Adhan', question: 'Récitez l\'Adhan complet', reponse_correcte: 'Allahu Akbar...', points: 10, difficulte: 'moyen' },

    // Coran ouvert (1 question)
    { rubrique: 'Coran ouvert', question: 'Récitez Sourate Al-Fatiha', reponse_correcte: 'Bismillah...', points: 15, difficulte: 'facile' },

    // Coran fermé (1 question)  
    { rubrique: 'Coran fermé', question: 'Récitez Sourate Al-Ikhlas', reponse_correcte: 'Qul huwa Allahu ahad...', points: 15, difficulte: 'moyen' },


    // Vie du Prophète (10 questions)
    { rubrique: 'Vie du Prophète', question: 'En quelle année est né le Prophète Muhammad (PSL) ?', reponse_correcte: '570 après J.C. (Année de l\'Éléphant)', points: 15, difficulte: 'moyen' },
    { rubrique: 'Vie du Prophète', question: 'Comment s\'appelait la mère du Prophète ?', reponse_correcte: 'Amina bint Wahb', points: 15, difficulte: 'facile' },
    { rubrique: 'Vie du Prophète', question: 'Quel âge avait le Prophète lors de la première révélation ?', reponse_correcte: '40 ans', points: 15, difficulte: 'facile' },
    { rubrique: 'Vie du Prophète', question: 'Comment s\'appelait la première épouse du Prophète ?', reponse_correcte: 'Khadija bint Khuwaylid', points: 15, difficulte: 'facile' },
    { rubrique: 'Vie du Prophète', question: 'En quelle année a eu lieu l\'Hégire ?', reponse_correcte: '622 après J.C.', points: 15, difficulte: 'moyen' },
    { rubrique: 'Vie du Prophète', question: 'Quelle était la profession du Prophète avant la révélation ?', reponse_correcte: 'Commerçant', points: 15, difficulte: 'facile' },
    { rubrique: 'Vie du Prophète', question: 'Combien d\'enfants a eu le Prophète ?', reponse_correcte: '7 enfants (3 garçons, 4 filles)', points: 15, difficulte: 'moyen' },
    { rubrique: 'Vie du Prophète', question: 'Qui était le premier homme à embrasser l\'Islam ?', reponse_correcte: 'Abu Bakr As-Siddiq', points: 15, difficulte: 'facile' },
    { rubrique: 'Vie du Prophète', question: 'Dans quelle grotte le Prophète recevait-il la révélation ?', reponse_correcte: 'Grotte de Hira', points: 15, difficulte: 'facile' },
    { rubrique: 'Vie du Prophète', question: 'Quelle bataille est appelée "la bataille décisive" ?', reponse_correcte: 'Bataille de Badr', points: 15, difficulte: 'moyen' },

    // Jurisprudence (10 questions)
    { rubrique: 'Jurisprudence', question: 'Combien de prières obligatoires par jour ?', reponse_correcte: '5 prières', points: 25, difficulte: 'facile' },
    { rubrique: 'Jurisprudence', question: 'Quel est le premier pilier de l\'Islam ?', reponse_correcte: 'La Shahada (attestation de foi)', points: 25, difficulte: 'facile' },
    { rubrique: 'Jurisprudence', question: 'Combien de Rakaates compte la prière du Fajr ?', reponse_correcte: '2 Rakaates', points: 25, difficulte: 'facile' },
    { rubrique: 'Jurisprudence', question: 'Quel est le pourcentage de la Zakat sur l\'argent ?', reponse_correcte: '2.5%', points: 25, difficulte: 'moyen' },
    { rubrique: 'Jurisprudence', question: 'Combien de jours dure le jeûne du Ramadan ?', reponse_correcte: '29 ou 30 jours', points: 25, difficulte: 'facile' },
    { rubrique: 'Jurisprudence', question: 'Quelles sont les ablutions majeures appelées ?', reponse_correcte: 'Ghusl', points: 25, difficulte: 'facile' },
    { rubrique: 'Jurisprudence', question: 'Combien de tours autour de la Kaaba lors du Tawaf ?', reponse_correcte: '7 tours', points: 25, difficulte: 'facile' },
    { rubrique: 'Jurisprudence', question: 'Quel est le mois du pèlerinage (Hajj) ?', reponse_correcte: 'Dhul Hijja', points: 25, difficulte: 'moyen' },
    { rubrique: 'Jurisprudence', question: 'Combien de Rakaates compte la prière du Dhuhr ?', reponse_correcte: '4 Rakaates', points: 25, difficulte: 'facile' },
    { rubrique: 'Jurisprudence', question: 'Quelle prière n\'a pas de Sunna avant ?', reponse_correcte: 'Prière du Asr', points: 25, difficulte: 'moyen' },

    // Culture générale (20 questions)
    { rubrique: 'Culture générale', question: 'Combien de prophètes sont mentionnés dans le Coran ?', reponse_correcte: '25 prophètes', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Quelle est la ville sainte de l\'Islam ?', reponse_correcte: 'La Mecque', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Qui était le dernier des prophètes ?', reponse_correcte: 'Muhammad (PSL)', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Combien d\'anges portent le Trône d\'Allah ?', reponse_correcte: '8 anges', points: 25, difficulte: 'difficile' },
    { rubrique: 'Culture générale', question: 'Quel est le premier mois du calendrier islamique ?', reponse_correcte: 'Muharram', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Quel ange apportait la révélation au Prophète ?', reponse_correcte: 'Jibril (Gabriel)', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Combien de livres saints sont mentionnés dans le Coran ?', reponse_correcte: '4 livres (Torah, Zabur, Injil, Coran)', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Quel prophète a construit la Kaaba ?', reponse_correcte: 'Ibrahim et Ismaïl', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Quelle est la nuit la plus sacrée du Ramadan ?', reponse_correcte: 'Laylat al-Qadr', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Combien de fois par jour doit-on prier au minimum ?', reponse_correcte: '5 fois', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Quel prophète a été avalé par un poisson ?', reponse_correcte: 'Jonas (Yunus)', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Quelle mosquée est la troisième la plus sacrée ?', reponse_correcte: 'Mosquée Al-Aqsa', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Qui était le père du Prophète Muhammad ?', reponse_correcte: 'Abdullah', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Combien de piliers compte l\'Islam ?', reponse_correcte: '5 piliers', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Quel est le jour de rassemblement (Jumu\'a) ?', reponse_correcte: 'Vendredi', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Quelle sourate est récitée dans chaque Rakaat ?', reponse_correcte: 'Al-Fatiha', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Quel ange sonnera la trompette le Jour du Jugement ?', reponse_correcte: 'Israfil', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Combien de califes bien guidés (Rashidun) y a-t-il eu ?', reponse_correcte: '4 califes', points: 25, difficulte: 'moyen' },
    { rubrique: 'Culture générale', question: 'Quelle est la langue originale du Coran ?', reponse_correcte: 'L\'arabe', points: 25, difficulte: 'facile' },
    { rubrique: 'Culture générale', question: 'Quel mois suit le Ramadan ?', reponse_correcte: 'Shawwal', points: 25, difficulte: 'moyen' },

    // Hadith (10 questions)
    { rubrique: 'Hadith', question: 'Complétez: "Les actes ne valent que par..."', reponse_correcte: 'les intentions', points: 20, difficulte: 'facile' },
    { rubrique: 'Hadith', question: 'Qui est le compilateur du Sahih Al-Bukhari ?', reponse_correcte: 'Imam Al-Bukhari', points: 20, difficulte: 'moyen' },
    { rubrique: 'Hadith', question: 'Combien de hadiths compte Sahih Muslim ?', reponse_correcte: 'Environ 7500 hadiths', points: 20, difficulte: 'difficile' },
    { rubrique: 'Hadith', question: 'Que signifie "Hadith Qudsi" ?', reponse_correcte: 'Parole d\'Allah rapportée par le Prophète', points: 20, difficulte: 'moyen' },
    { rubrique: 'Hadith', question: 'Quels sont les deux recueils les plus authentiques ?', reponse_correcte: 'Sahih Al-Bukhari et Sahih Muslim', points: 20, difficulte: 'moyen' },
    { rubrique: 'Hadith', question: 'Complétez: "Le meilleur d\'entre vous est celui qui..."', reponse_correcte: 'apprend le Coran et l\'enseigne', points: 20, difficulte: 'facile' },
    { rubrique: 'Hadith', question: 'Que dit le Prophète sur le sourire ?', reponse_correcte: 'Le sourire est une aumône', points: 20, difficulte: 'facile' },
    { rubrique: 'Hadith', question: 'Combien de fois le Prophète recommande-t-il de se brosser les dents ?', reponse_correcte: 'Avant chaque prière', points: 20, difficulte: 'moyen' },
    { rubrique: 'Hadith', question: 'Quel est le meilleur jour de la semaine selon un hadith ?', reponse_correcte: 'Le vendredi', points: 20, difficulte: 'facile' },
    { rubrique: 'Hadith', question: 'Que dit le Prophète sur la propreté ?', reponse_correcte: 'La propreté fait partie de la foi', points: 20, difficulte: 'facile' }
];

async function generateQuestions() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();
        console.log('✅ Connexion établie');

        // Récupérer les IDs des rubriques
        const rubriquesResult = await client.query('SELECT id, nom FROM rubriques');
        const rubriquesMap = new Map();
        rubriquesResult.rows.forEach(r => rubriquesMap.set(r.nom, r.id));

        console.log(`📋 Rubriques trouvées: ${rubriquesMap.size}`);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const q of questionsData) {
            const rubriqueId = rubriquesMap.get(q.rubrique);

            if (!rubriqueId) {
                console.log(`⚠️  Rubrique "${q.rubrique}" non trouvée, question ignorée`);
                skippedCount++;
                continue;
            }

            try {
                await client.query(
                    `INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, points, difficulte, type)
                     VALUES ($1, $2, $3, $4, $5, 'qcm')`,
                    [rubriqueId, q.question, q.reponse_correcte, q.points, q.difficulte]
                );
                insertedCount++;
                console.log(`✅ Question ajoutée: ${q.question.substring(0, 50)}...`);
            } catch (err) {
                if (err.code === '23505') {
                    // Doublon ignoré
                    skippedCount++;
                } else {
                    console.error(`❌ Erreur pour "${q.question}":`, err.message);
                }
            }
        }

        console.log(`\n📊 RÉSUMÉ:`);
        console.log(`   ✅ ${insertedCount} questions insérées`);
        console.log(`   ⏭️  ${skippedCount} questions ignorées (doublons ou rubrique manquante)`);

        // Afficher le compte par rubrique
        const countResult = await client.query(`
            SELECT r.nom, COUNT(q.id) as nb_questions
            FROM rubriques r
            LEFT JOIN questions q ON r.id = q.rubrique_id
            GROUP BY r.nom
            ORDER BY r.nom
        `);

        console.log(`\n📈 QUESTIONS PAR RUBRIQUE:`);
        countResult.rows.forEach(row => {
            console.log(`   ${row.nom}: ${row.nb_questions} questions`);
        });

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await client.end();
        console.log('\n✅ Connexion fermée');
    }
}

generateQuestions();
