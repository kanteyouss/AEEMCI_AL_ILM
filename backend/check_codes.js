const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkAccessCodes() {
    try {
        const result = await pool.query(`
            SELECT id, nom, code_acces
            FROM equipes
            ORDER BY nom
        `);
        console.log('ACCESS_CODES_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('ACCESS_CODES_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAccessCodes();
