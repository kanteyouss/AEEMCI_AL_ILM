const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

async function checkMancheEquipes() {
    try {
        // Chercher la manche 3
        const mancheResult = await pool.query("SELECT id, nom, numero FROM manches WHERE numero = 3");
        if (mancheResult.rows.length === 0) {
            console.log("MANCHE_NOT_FOUND");
            process.exit(0);
        }

        const manche = mancheResult.rows[0];
        console.log(`MANCHE_FOUND: ${manche.id} - ${manche.nom}`);

        // Chercher les équipes de cette manche
        const equipesResult = await pool.query(`
            SELECT e.id, e.nom 
            FROM equipes e
            JOIN equipes_manche em ON e.id = em.equipe_id
            WHERE em.manche_id = $1
            ORDER BY e.nom
        `, [manche.id]);

        console.log('EQUIPES_START');
        console.log(JSON.stringify(equipesResult.rows, null, 2));
        console.log('EQUIPES_END');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkMancheEquipes();
