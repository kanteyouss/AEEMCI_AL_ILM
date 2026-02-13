const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function run() {
    const result = await pool.query(`
        SELECT e.nom as equipe, p.prenom, p.nom as participant
        FROM membres_equipe me 
        JOIN equipes e ON me.equipe_id = e.id 
        JOIN participants p ON me.participant_id = p.id 
        WHERE me.est_capitaine = true
        ORDER BY e.nom;
    `);
    console.log(JSON.stringify(result.rows, null, 2));
    await pool.end();
}

run();
