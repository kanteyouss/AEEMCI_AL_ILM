const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const advancedMathQuestions = [
    { q: "Calcul : (15 × 8) - (12 × 5) ?", r: "60" },
    { q: "Calcul : 35% de 240 ?", r: "84" },
    { q: "Calcul : √144 ?", r: "12" },
    { q: "Calcul : 2³ + 3² ?", r: "17" },
    { q: "Calcul : (45 + 35) ÷ 4 ?", r: "20" },
    { q: "Calcul : 3/4 de 120 ?", r: "90" },
    { q: "Calcul : 15² ?", r: "225" },
    { q: "Calcul : (18 × 6) ÷ 9 ?", r: "12" },
    { q: "Calcul : 40% de 350 ?", r: "140" },
    { q: "Calcul : 2/5 + 1/5 ?", r: "3/5 (ou 0.6)" },
    { q: "Calcul : (25 × 4) - 36 ?", r: "64" },
    { q: "Calcul : 17 × 13 ?", r: "221" },
    { q: "Calcul : √225 ?", r: "15" },
    { q: "Calcul : 5/8 de 160 ?", r: "100" },
    { q: "Calcul : (144 ÷ 12) × 7 ?", r: "84" },
    { q: "Calcul : 18% de 500 ?", r: "90" },
    { q: "Calcul : 3/7 de 210 ?", r: "90" },
    { q: "Calcul : (36 + 24) × 2 ?", r: "120" },
    { q: "Calcul : 125 ÷ 5 + 48 ?", r: "73" },
    { q: "Calcul : 4² × 3 - 10 ?", r: "38" }
];

async function replaceSimpleMath() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Suppression des questions mathématiques trop simples...');
        await client.query(`
            DELETE FROM questions 
            WHERE rubrique_id = 6 
            AND question_texte LIKE 'Calcul :%'
            AND (
                question_texte LIKE '%15 x 4%' OR
                question_texte LIKE '%125 + 75%' OR
                question_texte LIKE '%Le tiers de 90%' OR
                question_texte LIKE '%8 x 7%' OR
                question_texte LIKE '%1000 - 350%' OR
                question_texte LIKE '%14 x 2 + 10%' OR
                question_texte LIKE '%25% de 200%' OR
                question_texte LIKE '%9 x 9%' OR
                question_texte LIKE '%150 divisé par 5%' OR
                question_texte LIKE '%11 x 11%' OR
                question_texte LIKE '%45 + 55 + 23%' OR
                question_texte LIKE '%La moitié de 150%' OR
                question_texte LIKE '%12 x 5%' OR
                question_texte LIKE '%7 x 9%' OR
                question_texte LIKE '%200 ÷ 4%' OR
                question_texte LIKE '%100 x 0,5%' OR
                question_texte LIKE '%17 + 18%' OR
                question_texte LIKE '%6 x 8%' OR
                question_texte LIKE '%500 - 125%' OR
                question_texte LIKE '%10 x 10 x 10%'
            )
        `);

        console.log('📥 Insertion de 20 nouvelles questions mathématiques avancées...');
        for (const q of advancedMathQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points)
                VALUES (6, $1, $2, 'texte_libre', 'difficile', 25)
            `, [q.q, q.r]);
        }

        await client.query('COMMIT');
        console.log('\n✨ Questions mathématiques mises à jour avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

replaceSimpleMath();
