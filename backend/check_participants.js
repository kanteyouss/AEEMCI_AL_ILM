const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkParticipants() {
    try {
        const result = await pool.query(`
            SELECT e.nom, COUNT(me.participant_id) as nb_membres
            FROM equipes e
            LEFT JOIN membres_equipe me ON e.id = me.equipe_id
            GROUP BY e.nom
            ORDER BY e.nom
        `);
        console.log('PARTICIPANTS_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('PARTICIPANTS_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkParticipants();
