const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function deleteMancheNull() {
    const client = await pool.connect();
    try {
        console.log('🗑️ Suppression de la manche ID 33 ("Manche null")...');

        // Supprimer toutes les dépendances
        await client.query('DELETE FROM evaluations WHERE manche_id = 33');
        await client.query('DELETE FROM scores WHERE manche_id = 33');
        await client.query('DELETE FROM soumissions WHERE manche_id = 33');
        await client.query('DELETE FROM equipes_manche WHERE manche_id = 33');
        await client.query('DELETE FROM rubriques_manche WHERE manche_id = 33');
        await client.query('DELETE FROM manches WHERE id = 33');

        console.log('✅ Manche 33 supprimée avec succès.');

    } catch (e) {
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

deleteMancheNull();
