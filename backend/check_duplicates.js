const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkDuplicates() {
    try {
        const result = await pool.query(`
            SELECT nom, COUNT(*) as count, ARRAY_AGG(id) as ids
            FROM equipes
            GROUP BY nom
            HAVING COUNT(*) > 1
        `);
        console.log('DUPLICATES_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('DUPLICATES_END');

        const all = await pool.query('SELECT id, nom, couleur FROM equipes ORDER BY id');
        console.log('ALL_EQUIPES_START');
        console.log(JSON.stringify(all.rows, null, 2));
        console.log('ALL_EQUIPES_END');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDuplicates();
