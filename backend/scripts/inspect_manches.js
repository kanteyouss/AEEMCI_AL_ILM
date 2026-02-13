const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function inspectManches() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id, nom, type, date_manche, etape FROM manches ORDER BY id');

        console.log('📋 LISTE DES MANCHES :');
        console.log('==================================');
        res.rows.forEach(m => {
            console.log(`[${m.id}] Nom: "${m.nom}", Type: "${m.type}", Date: ${m.date_manche}, Etape: "${m.etape}"`);
        });

    } catch (e) {
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

inspectManches();
