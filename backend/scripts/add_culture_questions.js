const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const cultureQuestions = [
    // ISLAM (10 questions)
    { q: "Quelles sont les deux fêtes majeures en Islam ?", r: "L'Aïd el-Fitr et l'Aïd el-Adha (Tabaski)." },
    { q: "Comment s'appelle l'unité de mesure pour la Zakat Al-Fitr ?", r: "Le Sâ' (équivalent à environ 2.5 - 3 kg)." },
    { q: "Quelle est la traduction française du mot 'Allah' ?", r: "Dieu (L'Unique)." },
    { q: "Comment appelle-t-on le sermon du Vendredi ?", r: "La Khoutba." },
    { q: "Quel est le jour saint de la semaine pour les musulmans ?", r: "Le Vendredi (Yawm al-Jumu'ah)." },
    { q: "Comment s'appelle l'appel à la prière ?", r: "L'Adhan." },
    { q: "Dans quelle direction les musulmans prient-ils ?", r: "Vers la Qibla (La Kaaba à La Mecque)." },
    { q: "Quel livre a été révélé au prophète Issa (Jésus) ?", r: "L'Injil (L'Évangile)." },
    { q: "Combien de noms attributs d'Allah sont traditionnellement mentionnés ?", r: "99 noms." },
    { q: "Qu'est-ce que le 'Halal' ?", r: "Ce qui est permis ou licite en Islam." },

    // CÔTE D'IVOIRE & MATH (40 questions)
    { q: "Quelle est la capitale politique de la Côte d'Ivoire ?", r: "Yamoussoukro." },
    { q: "Quelle est la capitale économique de la Côte d'Ivoire ?", r: "Abidjan." },
    { q: "Qui est le premier président de la République de Côte d'Ivoire ?", r: "Félix Houphouët-Boigny." },
    { q: "Quelle est la date de l'indépendance de la Côte d'Ivoire ?", r: "7 août 1960." },
    { q: "Quelles sont les couleurs du drapeau ivoirien ?", r: "Orange, Blanc, Vert." },
    { q: "Quelle est la devise de la Côte d'Ivoire ?", r: "Union - Discipline - Travail." },
    { q: "Quel est l'animal emblème de la Côte d'Ivoire ?", r: "L'Éléphant." },
    { q: "Comment s'appelle l'hymne national de la Côte d'Ivoire ?", r: "L'Abidjanaise." },
    { q: "Quel est le plus long fleuve de Côte d'Ivoire ?", r: "Le Bandama." },
    { q: "Combien de pays sont frontaliers de la Côte d'Ivoire ?", r: "5 (Libéria, Guinée, Mali, Burkina Faso, Ghana)." },
    { q: "Qui est l'actuel président de la Côte d'Ivoire (2026) ?", r: "Alassane Ouattara." },
    { q: "Comment appelle-t-on les habitants de Bouaké ?", r: "Les Bouakois." },
    { q: "Quel est le principal produit d'exportation de la Côte d'Ivoire ?", r: "Le Cacao." },
    { q: "Dans quelle zone monétaire se situe la Côte d'Ivoire ?", r: "La zone Franc CFA (UEMOA)." },
    { q: "Quel grand pont relie Riviera et Marcory à Abidjan ?", r: "Le pont Henri Konan Bédié (3ème pont)." },
    { q: "Quel est le point culminant de la Côte d'Ivoire ?", r: "Le Mont Nimba." },
    { q: "Quel est le nom du port autonome d'Abidjan ?", r: "Le Port Autonome d'Abidjan (PAA)." },
    { q: "Quelle ville ivoirienne est surnommée 'La cité du Poro' ?", r: "Korhogo." },
    { q: "Quel célèbre sculpteur ivoirien a réalisé des œuvres pour la Basilique ?", r: "Christian Lattier (ou artistes locaux de renom)." },
    { q: "Combien de régions compte la Côte d'Ivoire ?", r: "31 régions." },

    // CALCUL RAPIDE & MATH
    { q: "Calcul : 15 x 4 ?", r: "60" },
    { q: "Calcul : 125 + 75 ?", r: "200" },
    { q: "Calcul : Le tiers de 90 ?", r: "30" },
    { q: "Calcul : 8 x 7 ?", r: "56" },
    { q: "Calcul : 1000 - 350 ?", r: "650" },
    { q: "Calcul : 14 x 2 + 10 ?", r: "38" },
    { q: "Calcul : 25% de 200 ?", r: "50" },
    { q: "Calcul : 9 x 9 ?", r: "81" },
    { q: "Calcul : 150 divisé par 5 ?", r: "30" },
    { q: "Calcul : 11 x 11 ?", r: "121" },
    { q: "Calcul : 45 + 55 + 23 ?", r: "123" },
    { q: "Calcul : La moitié de 150 ?", r: "75" },
    { q: "Calcul : 12 x 5 ?", r: "60" },
    { q: "Calcul : 7 x 9 ?", r: "63" },
    { q: "Calcul : 200 ÷ 4 ?", r: "50" },
    { q: "Calcul : 100 x 0,5 ?", r: "50" },
    { q: "Calcul : 17 + 18 ?", r: "35" },
    { q: "Calcul : 6 x 8 ?", r: "48" },
    { q: "Calcul : 500 - 125 ?", r: "375" },
    { q: "Calcul : 10 x 10 x 10 ?", r: "1000" }
];

async function addCultureQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('📥 Insertion de 50 questions de Culture Générale (Rubrique ID: 6)...');
        for (const q of cultureQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points)
                VALUES (6, $1, $2, 'texte_libre', 'moyen', 25)
            `, [q.q, q.r]);
        }

        await client.query('COMMIT');
        console.log('\n✨ 50 questions de Culture Générale ajoutées avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

addCultureQuestions();
