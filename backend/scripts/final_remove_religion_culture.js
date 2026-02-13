const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function listAndRemoveReligionFromCulture() {
    const client = await pool.connect();
    try {
        // D'abord lister
        console.log('🔍 Recherche des questions religieuses en Culture Générale...\n');
        const listResult = await client.query(`
            SELECT id, question_texte 
            FROM questions 
            WHERE rubrique_id = 6 
            AND (
                question_texte LIKE '%Islam%' OR
                question_texte LIKE '%Prophète%' OR
                question_texte LIKE '%prophète%' OR
                question_texte LIKE '%Allah%' OR
                question_texte LIKE '%Tawhid%' OR
                question_texte LIKE '%Ijtihad%' OR
                question_texte LIKE '%Fiqh%' OR
                question_texte LIKE '%Charia%' OR
                question_texte LIKE '%Hajj%' OR
                question_texte LIKE '%Omra%' OR
                question_texte LIKE '%Bid''ah%' OR
                question_texte LIKE '%Laylatul Qadr%'
            )
        `);

        console.log(`Trouvé ${listResult.rowCount} questions religieuses :\n`);
        listResult.rows.forEach((r, i) => {
            console.log(`${i + 1}. ${r.question_texte.substring(0, 100)}...`);
        });

        // Ensuite supprimer
        await client.query('BEGIN');

        const deleteResult = await client.query(`
            DELETE FROM questions 
            WHERE rubrique_id = 6 
            AND (
                question_texte LIKE '%Islam%' OR
                question_texte LIKE '%Prophète%' OR
                question_texte LIKE '%prophète%' OR
                question_texte LIKE '%Allah%' OR
                question_texte LIKE '%Tawhid%' OR
                question_texte LIKE '%Ijtihad%' OR
                question_texte LIKE '%Fiqh%' OR
                question_texte LIKE '%Charia%' OR
                question_texte LIKE '%Hajj%' OR
                question_texte LIKE '%Omra%' OR
                question_texte LIKE '%Bid''ah%' OR
                question_texte LIKE '%Laylatul Qadr%'
            )
            RETURNING id
        `);

        await client.query('COMMIT');
        console.log(`\n✨ ${deleteResult.rowCount} questions religieuses supprimées de Culture Générale !`);

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

listAndRemoveReligionFromCulture();
