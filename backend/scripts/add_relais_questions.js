const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const relaisQuestions = [
    // PHASE ELIMINATOIRE (Facile)
    { phase: "facile", liste: "LISTE 1", q: "Dans quelle ville est né le Prophète ﷺ ?", r: "La Mecque" },
    { phase: "facile", liste: "LISTE 1", q: "Qui est le premier calife de l’Islam ?", r: "Abou Bakr As-Siddiq" },
    { phase: "facile", liste: "LISTE 1", q: "Où se trouve la mosquée Al-Aqsa ?", r: "Jérusalem (Al-Qods)" },

    { phase: "facile", liste: "LISTE 2", q: "Combien de prophètes sont mentionnés dans le Coran ?", r: "25 prophètes" },
    { phase: "facile", liste: "LISTE 2", q: "Quel est le mois du Hajj ?", r: "Dhul-Hijja" },
    { phase: "facile", liste: "LISTE 2", q: "Combien y a-t-il de juz’ dans le Coran ?", r: "30 juz'" },

    { phase: "facile", liste: "LISTE 3", q: "Quelle sourate ne commence pas par “Bismillah” ?", r: "Sourate At-Tawbah (Le Repentir)" },
    { phase: "facile", liste: "LISTE 3", q: "Qui était le muezzin du Prophète ﷺ ?", r: "Bilal ibn Rabah" },
    { phase: "facile", liste: "LISTE 3", q: "Comment s’appelait le père du Prophète ﷺ ?", r: "Abdallah" },

    { phase: "facile", liste: "LISTE 4", q: "Qui était le premier homme à accepter l’Islam ?", r: "Abou Bakr As-Siddiq" },
    { phase: "facile", liste: "LISTE 4", q: "Qui est le troisième calife ?", r: "Othman ibn Affan" },
    { phase: "facile", liste: "LISTE 4", q: "Quelle sourate est surnommée “le cœur du Coran” ?", r: "Sourate Yassine" },

    { phase: "facile", liste: "LISTE 5", q: "Quel ange a transmis la révélation ?", r: "L'ange Jibril (Gabriel)" },
    { phase: "facile", liste: "LISTE 5", q: "Quel est le livre révélé à Moussa (Moïse) ?", r: "La Tawrat (Thora)" },
    { phase: "facile", liste: "LISTE 5", q: "Quel est le deuxième lieu saint ?", r: "La mosquée du Prophète à Médine (Masjid an-Nabawi)" },

    { phase: "facile", liste: "LISTE 6", q: "Quel prophète a reçu les Psaumes (Zabûr) ?", r: "Le prophète Daoud (David)" },
    { phase: "facile", liste: "LISTE 6", q: "Quelle nuit vaut mieux que mille mois ?", r: "Laylatul Qadr (La nuit du Destin)" },
    { phase: "facile", liste: "LISTE 6", q: "Quel prophète a construit l’arche ?", r: "Le prophète Nouh (Noé)" },

    { phase: "facile", liste: "LISTE 7", q: "Quel prophète a été avalé par un poisson ?", r: "Le prophète Younous (Jonas)" },
    { phase: "facile", liste: "LISTE 7", q: "Quel prophète a été jeté dans le feu ?", r: "Le prophète Ibrahim (Abraham)" },
    { phase: "facile", liste: "LISTE 7", q: "Combien y a-t-il de mois sacrés en Islam ?", r: "4 mois sacrés" },

    { phase: "facile", liste: "LISTE 8", q: "Dans quelle langue le Coran a-t-il été révélé ?", r: "L'Arabe" },
    { phase: "facile", liste: "LISTE 8", q: "Quelle sourate commence par “Iqra” ?", r: "Sourate Al-Alaq" },
    { phase: "facile", liste: "LISTE 8", q: "Qui était le cousin du Prophète ﷺ et aussi son gendre ?", r: "Ali ibn Abi Talib" },

    // QUART DE FINAL (Moyen)
    { phase: "moyen", liste: "LISTE 1", q: "Combien de temps a duré la révélation ?", r: "23 ans" },
    { phase: "moyen", liste: "LISTE 1", q: "Quelle est la dernière sourate dans l’ordre du mushaf ?", r: "Sourate An-Nass" },
    { phase: "moyen", liste: "LISTE 1", q: "Combien de tours autour de la Ka‘ba pendant le tawâf ?", r: "7 tours" },

    { phase: "moyen", liste: "LISTE 2", q: "Quel prophète a parlé bébé dans le berceau ?", r: "Le prophète Issa (Jésus)" },
    { phase: "moyen", liste: "LISTE 2", q: "Quel est le premier lieu saint de l’Islam ?", r: "La Kaaba (Al-Masjid al-Haram) à La Mecque" },
    { phase: "moyen", liste: "LISTE 2", q: "Où se situe le mont ‘Arafah ?", r: "Près de La Mecque (Arabie Saoudite)" },

    { phase: "moyen", liste: "LISTE 3", q: "Qui était le cousin du Prophète ﷺ et aussi son gendre ?", r: "Ali ibn Abi Talib" },
    { phase: "moyen", liste: "LISTE 3", q: "Comment s’appelait la mère du Prophète ﷺ ?", r: "Amina bint Wahb" },
    { phase: "moyen", liste: "LISTE 3", q: "Qui fut le premier Calife ?", r: "Abou Bakr As-Siddiq" }, // Fix doublon

    { phase: "moyen", liste: "LISTE 4", q: "Combien de prophètes sont mentionnés dans le Coran ?", r: "25 prophètes" },
    { phase: "moyen", liste: "LISTE 4", q: "Quel est le mois du Hajj ?", r: "Dhul-Hijja" },
    { phase: "moyen", liste: "LISTE 4", q: "Combien y a-t-il de juz’ dans le Coran ?", r: "30 juz'" },

    { phase: "moyen", liste: "LISTE 5", q: "À quel âge est décédé le prophète ﷺ ?", r: "63 ans" },
    { phase: "moyen", liste: "LISTE 5", q: "Qui est le troisième calife ?", r: "Othman ibn Affan" },
    { phase: "moyen", liste: "LISTE 5", q: "Où se trouve la mosquée Al-Aqsa ?", r: "Jérusalem (Al-Qods)" },

    { phase: "moyen", liste: "LISTE 6", q: "Qui était la première femme musulmane ?", r: "Khadija bint Khuwaylid" },
    { phase: "moyen", liste: "LISTE 6", q: "Quel était le prénom du grand-père du Prophète ﷺ ?", r: "Abdul-Muttalib" },
    { phase: "moyen", liste: "LISTE 6", q: "Quelle était la tribu du prophète ﷺ ?", r: "Les Quraish" },

    // DEMI FINAL (Difficile)
    { phase: "difficile", liste: "LISTE 1", q: "Quel prophète a été jeté dans le feu ?", r: "Ibrahim (Abraham)" },
    { phase: "difficile", liste: "LISTE 1", q: "Où se situe le mont ‘Arafah ?", r: "Près de La Mecque" },
    { phase: "difficile", liste: "LISTE 1", q: "Quelle sourate est surnommée “le cœur du Coran” ?", r: "Yassine" },

    { phase: "difficile", liste: "LISTE 2", q: "Où se trouve la mosquée Al-Aqsa ?", r: "Jérusalem (Al-Qods)" },
    { phase: "difficile", liste: "LISTE 2", q: "Quelle sourate ne commence pas par “Bismillah” ?", r: "At-Tawbah" },
    { phase: "difficile", liste: "LISTE 2", q: "Combien de temps a duré la révélation ?", r: "23 ans" },

    { phase: "difficile", liste: "LISTE 3", q: "Quel est le nom de l’ange de la mort ?", r: "Azraïl (Malak al-Mawt)" },
    { phase: "difficile", liste: "LISTE 3", q: "Quelle nuit vaut mieux que mille mois ?", r: "Laylatul Qadr" },
    { phase: "difficile", liste: "LISTE 3", q: "Quel est le premier pilier de l’Islam ?", r: "La Chahada (L'attestation de foi)" },

    { phase: "difficile", liste: "LISTE 4", q: "Combien y a-t-il de mois sacrés en Islam ?", r: "4 mois" },
    { phase: "difficile", liste: "LISTE 4", q: "Quelle bataille eut lieu durant Ramadan ?", r: "La bataille de Badr" },
    { phase: "difficile", liste: "LISTE 4", q: "Combien de tours autour de la Ka‘ba pendant le tawâf ?", r: "7 tours" },

    // FINAL (Difficile)
    { phase: "difficile", liste: "LISTE 1", q: "Qui est la première femme martyre ?", r: "Soumaya bint Khayyat" },
    { phase: "difficile", liste: "LISTE 1", q: "Quelle sourate contient deux basmalas ?", r: "Sourate An-Naml (Fourmis)" },
    { phase: "difficile", liste: "LISTE 1", q: "Quelle sourate commence par “Tabâraka” ?", r: "Sourate Al-Mulk (La Royauté)" },

    { phase: "difficile", liste: "LISTE 2", q: "Quel oncle du Prophète ﷺ s’est opposé fortement à lui ?", r: "Abou Lahab" },
    { phase: "difficile", liste: "LISTE 2", q: "Dans quelle ville le Prophète ﷺ s’est-il réfugié après le boycott ?", r: "Taïf (puis Médine)" },
    { phase: "difficile", liste: "LISTE 2", q: "Qui accompagna le Prophète ﷺ lors de l’Hégire ?", r: "Abou Bakr As-Siddiq" },

    { phase: "difficile", liste: "LISTE 3", q: "Qui a dirigé la prière pendant la maladie du Prophète ﷺ ?", r: "Abou Bakr As-Siddiq" },
    { phase: "difficile", liste: "LISTE 3", q: "Combien de versets comporte la sourate Al-Baqara ?", r: "286 versets" },
    { phase: "difficile", liste: "LISTE 3", q: "Qui était Imam Mâlik ?", r: "Fondateur de l'école malikite, auteur d'Al-Muwatta." }
];

async function addQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('📥 Insertion des nouvelles questions Relais (Rubrique ID: 8)...');
        for (const q of relaisQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points, reference)
                VALUES (8, $1, $2, 'texte_libre', $3, 10, $4)
            `, [q.q, q.r, q.phase, q.liste]);
            console.log(`✅ Ajouté [${q.liste}] : ${q.q.substring(0, 50)}...`);
        }

        await client.query('COMMIT');
        console.log('\n✨ Insertion terminée avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

addQuestions();
