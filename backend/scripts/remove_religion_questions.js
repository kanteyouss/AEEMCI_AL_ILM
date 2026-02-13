const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function removeReligionQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Suppression de 20 questions sur la religion en Culture Générale...');

        const result = await client.query(`
            DELETE FROM questions 
            WHERE rubrique_id = 6 
            AND (
                question_texte LIKE '%Islam%' OR
                question_texte LIKE '%Allah%' OR
                question_texte LIKE '%Halal%' OR
                question_texte LIKE '%Adhan%' OR
                question_texte LIKE '%Khoutba%' OR
                question_texte LIKE '%Qibla%' OR
                question_texte LIKE '%Injil%' OR
                question_texte LIKE '%Tawhid%' OR
                question_texte LIKE '%Ijtihad%' OR
                question_texte LIKE '%Fiqh%' OR
                question_texte LIKE '%Charia%' OR
                question_texte LIKE '%Bid''ah%' OR
                question_texte LIKE '%Laylatul Qadr%' OR
                question_texte LIKE '%Hajj%' OR
                question_texte LIKE '%Omra%' OR
                question_texte LIKE '%Sunna%' OR
                question_texte LIKE '%Hadith%' OR
                question_texte LIKE '%Zakat%' OR
                question_texte LIKE '%Vendredi%' OR
                question_texte LIKE '%Aïd%'
            )
            RETURNING id
        `);

        await client.query('COMMIT');
        console.log(`\n✨ ${result.rowCount} questions sur la religion supprimées avec succès !`);

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

removeReligionQuestions();
