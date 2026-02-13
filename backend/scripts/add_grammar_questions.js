const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const logicQuestions = [
    // CONJUGAISON (15 questions)
    { q: "Conjugue le verbe 'être' au passé simple, 1ère personne du singulier.", r: "Je fus." },
    { q: "Comment s'appelle le mode qui exprime un souhait ou une incertitude ?", r: "Le subjonctif." },
    { q: "Quel est le participe passé du verbe 'croître' ?", r: "Crû (avec un accent circonflexe)." },
    { q: "Quel est le futur simple de 'savoir' à la 1ère personne du pluriel ?", r: "Nous saurons." },
    { q: "Conjugue 'aller' à l'impératif présent, 2ème personne du singulier.", r: "Va." },
    { q: "Quel auxiliaire utilise-t-on pour le verbe 'apparaître' au passé composé ?", r: "Être (ou Avoir selon le sens, mais Être est privilégié)." },
    { q: "À quel temps appartient la terminaison '-âmes' au passé simple ?", r: "1ère personne du pluriel (Nous)." },
    { q: "Comment s'écrit le verbe 'mourir' au futur simple (1ère pers. sing.) ?", r: "Je mourrai (avec deux 'r')." },
    { q: "Quelle est la terminaison de la 2ème personne du singulier au présent de l'indicatif pour le verbe 'pouvoir' ?", r: "x (Tu peux)." },
    { q: "Quel est le participe présent du verbe 'craindre' ?", r: "Craignant." },
    { q: "Conjugue 'finir' au passé simple, 3ème personne du pluriel.", r: "Ils finirent." },
    { q: "Quel est le mode du verbe dans la phrase : 'Fais tes devoirs !' ?", r: "L'Impératif." },
    { q: "À quel temps correspond 'J'eus mangé' ?", r: "Le passé antérieur." },
    { q: "Conditionnel présent de 'voir', 1ère personne du singulier ?", r: "Je verrais." },
    { q: "Passé simple de 'haïr', 3ème personne du singulier ?", r: "Il haït (avec un tréma sur le i)." },

    // LITTÉRATURE & PHILOSOPHIE (5 questions)
    { q: "Quel est le titre du célèbre ouvrage de Bernard Dadié souvent étudié en Côte d'Ivoire ?", r: "Climbié." },
    { q: "Qui est l'auteur du chef-d'œuvre littéraire 'Le monde s'effondre' ?", r: "Chinua Achebe." },
    { q: "Quel grand écrivain ivoirien a écrit 'Les Soleils des indépendances' ?", r: "Ahmadou Kourouma." },
    { q: "Qui est l'auteur de la célèbre citation philosophique : 'Je pense, donc je suis' ?", r: "René Descartes." },
    { q: "À quel philosophe de l'Antiquité attribue-t-on la maxime : 'Connais-toi toi-même' ?", r: "Socrate (inscrit au fronton du temple de Delphes)." }
];

async function addLogicQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('📥 Insertion de 20 questions de Conjugaison/Littérature (Rubrique ID: 6)...');
        for (const q of logicQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points)
                VALUES (6, $1, $2, 'texte_libre', 'difficile', 25)
            `, [q.q, q.r]);
        }

        await client.query('COMMIT');
        console.log('\n✨ Questions de français et philo ajoutées avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

addLogicQuestions();
