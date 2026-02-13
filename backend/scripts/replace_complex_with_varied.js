const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const newVariedQuestions = [
    // RELIGION (5 questions)
    { q: "Combien de prophètes sont mentionnés dans le Coran ?", r: "25 prophètes" },
    { q: "Qui était le dernier des prophètes ?", r: "Le Prophète Muhammad ﷺ" },
    { q: "Quel ange apportait la révélation au Prophète ?", r: "Jibril (Gabriel)" },
    { q: "Quel prophète a construit la Kaaba ?", r: "Ibrahim (Abraham) et son fils Ismaïl" },
    { q: "Qui était le père du Prophète Muhammad ﷺ ?", r: "Abdallah ibn Abd al-Muttalib" },

    // CONJUGAISON (5 questions)
    { q: "Conjugue 'venir' au futur simple, 3ème personne du pluriel.", r: "Ils viendront" },
    { q: "Quel est l'infinitif du verbe 'je cours' ?", r: "Courir" },
    { q: "Conjugue 'prendre' au passé composé, 1ère personne du singulier.", r: "J'ai pris" },
    { q: "Quel est le participe passé de 'boire' ?", r: "Bu" },
    { q: "Conjugue 'faire' au présent de l'indicatif, 2ème personne du pluriel.", r: "Vous faites" },

    // NOMS FÉMININS D'ANIMAUX (5 questions)
    { q: "Comment appelle-t-on la femelle du lion ?", r: "La lionne" },
    { q: "Comment appelle-t-on la femelle du cheval ?", r: "La jument" },
    { q: "Comment appelle-t-on la femelle du mouton ?", r: "La brebis" },
    { q: "Comment appelle-t-on la femelle du canard ?", r: "La cane" },
    { q: "Comment appelle-t-on la femelle de l'éléphant ?", r: "L'éléphante" },

    // GENTILÉS IVOIRIENS (6 questions)
    { q: "Comment appelle-t-on les habitants de San-Pédro ?", r: "Les San-Pédrois" },
    { q: "Comment appelle-t-on les habitants de Bouaké ?", r: "Les Bouakois" },
    { q: "Comment appelle-t-on les habitants de Korhogo ?", r: "Les Khorhogoïs" },
    { q: "Comment appelle-t-on les habitants de Man ?", r: "Les Manois" },
    { q: "Comment appelle-t-on les habitants de Daloa ?", r: "Les Daloais" },
    { q: "Comment appelle-t-on les habitants d'Abidjan ?", r: "Les Abidjanais" }
];

async function replaceComplexQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Suppression des questions de réflexion complexes...');
        await client.query(`
            DELETE FROM questions 
            WHERE rubrique_id = 6 
            AND (
                question_texte LIKE '%Analysez le rôle du cacao%' OR
                question_texte LIKE '%Françafrique%' OR
                question_texte LIKE '%diversité ethnique%' OR
                question_texte LIKE '%CEDEAO%' OR
                question_texte LIKE '%crise politico-militaire%' OR
                question_texte LIKE '%Houphouëtisme%'
            )
        `);

        console.log('📥 Insertion de 21 nouvelles questions variées...');
        for (const q of newVariedQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points)
                VALUES (6, $1, $2, 'texte_libre', 'moyen', 25)
            `, [q.q, q.r]);
        }

        await client.query('COMMIT');
        console.log('\n✨ Questions remplacées avec succès !');
        console.log('📊 Ajouté : 5 religion + 5 conjugaison + 5 animaux + 6 gentilés');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

replaceComplexQuestions();
