const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkEquipes() {
    try {
        const result = await pool.query('SELECT id, nom, couleur FROM equipes ORDER BY nom');
        console.log('EQUIPES_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('EQUIPES_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkEquipes();
