const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

// Configuration de la base de données
// Priorité à DATABASE_URL (pour Render)
const connectionString = process.env.DATABASE_URL;

const poolConfig = connectionString ? {
    connectionString,
    ssl: { rejectUnauthorized: false }
} : {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
};

const pool = new Pool(poolConfig);

async function resetQuestions() {
    const client = await pool.connect();
    try {
        console.log('🔄 Réinitialisation du statut des questions...');

        const result = await client.query('UPDATE questions SET utilise = false WHERE utilise = true');

        console.log(`✅ Succès : ${result.rowCount} question(s) ont été remises à zéro.`);

    } catch (err) {
        console.error('❌ Erreur lors de la réinitialisation :', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

resetQuestions();
