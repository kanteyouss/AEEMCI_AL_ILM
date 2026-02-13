const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkOrphanParticipants() {
    try {
        const result = await pool.query(`
            SELECT COUNT(*) as total,
                   COUNT(p.id) FILTER (WHERE NOT EXISTS (SELECT 1 FROM membres_equipe me WHERE me.participant_id = p.id)) as non_assignes
            FROM participants p
        `);
        console.log('ORPHANS_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('ORPHANS_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrphanParticipants();
