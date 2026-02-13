const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkHistory() {
    try {
        const result = await pool.query(`
            SELECT m.numero, e.nom 
            FROM manches m
            JOIN equipes_manche em ON m.id = em.manche_id
            JOIN equipes e ON em.equipe_id = e.id
            ORDER BY m.numero, e.nom
        `);
        console.log('HISTORY_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('HISTORY_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkHistory();
