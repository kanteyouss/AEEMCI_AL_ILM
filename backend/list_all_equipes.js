const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function listAll() {
    try {
        const result = await pool.query('SELECT id, nom FROM equipes ORDER BY id');
        console.log('ALL_LIST_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('ALL_LIST_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listAll();
