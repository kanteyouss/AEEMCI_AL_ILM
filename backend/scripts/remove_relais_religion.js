const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function removeMoreReligionQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Suppression de questions sur l\'Islam et le Prophète dans Relais...');

        const result = await client.query(`
            DELETE FROM questions 
            WHERE rubrique_id = 8 
            AND (
                question_texte LIKE '%Prophète%' OR
                question_texte LIKE '%prophète%' OR
                question_texte LIKE '%ﷺ%' OR
                question_texte LIKE '%Mecque%' OR
                question_texte LIKE '%Médine%' OR
                question_texte LIKE '%calife%' OR
                question_texte LIKE '%Coran%' OR
                question_texte LIKE '%sourate%' OR
                question_texte LIKE '%Jibril%' OR
                question_texte LIKE '%Gabriel%' OR
                question_texte LIKE '%Moussa%' OR
                question_texte LIKE '%Moïse%' OR
                question_texte LIKE '%Tawrat%' OR
                question_texte LIKE '%Zabûr%' OR
                question_texte LIKE '%Psaumes%' OR
                question_texte LIKE '%Daoud%' OR
                question_texte LIKE '%David%' OR
                question_texte LIKE '%Nouh%' OR
                question_texte LIKE '%Noé%' OR
                question_texte LIKE '%Younous%' OR
                question_texte LIKE '%Jonas%' OR
                question_texte LIKE '%Ibrahim%' OR
                question_texte LIKE '%Abraham%' OR
                question_texte LIKE '%Issa%' OR
                question_texte LIKE '%Jésus%' OR
                question_texte LIKE '%musulman%' OR
                question_texte LIKE '%Islam%' OR
                question_texte LIKE '%Hégire%' OR
                question_texte LIKE '%Hijra%' OR
                question_texte LIKE '%Ramadan%' OR
                question_texte LIKE '%Badr%' OR
                question_texte LIKE '%Kaaba%' OR
                question_texte LIKE '%Ka''ba%' OR
                question_texte LIKE '%tawâf%' OR
                question_texte LIKE '%Arafah%' OR
                question_texte LIKE '%Hajj%' OR
                question_texte LIKE '%Dhul%' OR
                question_texte LIKE '%juz''%' OR
                question_texte LIKE '%Bismillah%' OR
                question_texte LIKE '%muezzin%' OR
                question_texte LIKE '%Bilal%' OR
                question_texte LIKE '%Khadija%' OR
                question_texte LIKE '%Abou Bakr%' OR
                question_texte LIKE '%Ali ibn%' OR
                question_texte LIKE '%Othman%' OR
                question_texte LIKE '%Omar%' OR
                question_texte LIKE '%Khalil Allah%' OR
                question_texte LIKE '%Yathrib%' OR
                question_texte LIKE '%Isra%' OR
                question_texte LIKE '%Mouharram%' OR
                question_texte LIKE '%hégirien%' OR
                question_texte LIKE '%Al-Farouq%' OR
                question_texte LIKE '%Hira%' OR
                question_texte LIKE '%révélation%' OR
                question_texte LIKE '%Iqra%' OR
                question_texte LIKE '%Alaq%'
            )
            RETURNING id
        `);

        await client.query('COMMIT');
        console.log(`\n✨ ${result.rowCount} questions religieuses supprimées de la rubrique Relais !`);

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

removeMoreReligionQuestions();
