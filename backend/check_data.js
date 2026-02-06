const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkRubriques() {
    try {
        const res = await pool.query('SELECT * FROM rubriques ORDER BY id');
        console.log('--- RUBRIQUES ---');
        console.table(res.rows);
        
        const res2 = await pool.query(`
            SELECT m.nom as manche, r.nom as rubrique, r.points_max
            FROM rubriques_manche rm
            JOIN manches m ON m.id = rm.manche_id
            JOIN rubriques r ON r.id = rm.rubrique_id
            ORDER BY m.id, rm.ordre_passage
        `);
        console.log('--- RUBRIQUES PAR MANCHE ---');
        console.table(res2.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkRubriques();