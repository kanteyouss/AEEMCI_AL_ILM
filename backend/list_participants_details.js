const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function listParticipants() {
    try {
        const result = await pool.query(`
            SELECT id, nom, prenom, etablissement, telephone, email
            FROM participants
            ORDER BY nom, prenom
        `);
        console.log('PARTICIPANTS_LIST_START');
        console.log(JSON.stringify(result.rows, null, 2));
        console.log('PARTICIPANTS_LIST_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listParticipants();
