const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const assignments = [
    { nom: 'Diarra', prenom: 'Ben Idriss Zanga', telephone: '799758168', equipe: 'AS SORBIROUNE', est_capitaine: true },
    { nom: 'Coulibaly', prenom: 'Donissongui Siaka', telephone: '586106613', equipe: 'AS SORBIROUNE', est_capitaine: false },

    { nom: 'Doumbia', prenom: 'Issa', telephone: '584154857', equipe: 'AL MOUHTADOUNE', est_capitaine: true },
    { nom: 'Toure', prenom: 'N’fali', telephone: '507674208', equipe: 'AL MOUHTADOUNE', est_capitaine: false },
    { nom: 'Kone', prenom: 'Daouda', telephone: '585831889', equipe: 'AL MOUHTADOUNE', est_capitaine: false },

    { nom: 'Diegnana', prenom: 'Ouattara Toumani', telephone: '769893740', equipe: 'AZ-ZAKIROUNE', est_capitaine: true },
    { nom: 'Sanogo', prenom: 'Ahmed', telephone: '142665463', equipe: 'AZ-ZAKIROUNE', est_capitaine: false },
    { nom: 'Abdou', prenom: 'Bachir', telephone: '0702375058', equipe: 'AZ-ZAKIROUNE', est_capitaine: false },

    { nom: 'Traore', prenom: 'Ibrahim', telephone: '544823225', equipe: 'AL MOUDJAHIDOUNE', est_capitaine: true },
    { nom: 'Ousmane Bagnan', prenom: 'Moussa', telephone: '715552856', equipe: 'AL MOUDJAHIDOUNE', est_capitaine: false },
    { nom: 'IGDASS', prenom: 'Ali', telephone: '594842302', equipe: 'AL MOUDJAHIDOUNE', est_capitaine: false },

    { nom: 'Ouattara', prenom: 'Kabidaho Ben Amed', telephone: '575548594', equipe: 'AL YAQRA\'OUN', est_capitaine: true },
    { nom: 'Abdou Elhadji Idi', prenom: 'Mikhail', telephone: '719764652', equipe: 'AL YAQRA\'OUN', est_capitaine: false },

    { nom: 'Kouma', prenom: 'Amadou', telephone: '554924601', equipe: 'ASH-SHAKIROUNE', est_capitaine: true },
    { nom: 'Soumahoro', prenom: 'N’gouamahan', telephone: '104551672', equipe: 'ASH-SHAKIROUNE', est_capitaine: false },
    { nom: 'Soro', prenom: 'Sona Youssef', telephone: '594964112', equipe: 'ASH-SHAKIROUNE', est_capitaine: false },

    { nom: 'Kone', prenom: 'Fanta', telephone: '142459328', equipe: 'AS-SOLIHATE', est_capitaine: true },
    { nom: 'Kone', prenom: 'Fatoumata', telephone: '747744474', equipe: 'AS-SOLIHATE', est_capitaine: false },
    { nom: 'Sanfo', prenom: 'Fatiha', telephone: '0749492472', equipe: 'AS-SOLIHATE', est_capitaine: false },
    { nom: 'Silué', prenom: 'Ferelaha Leila', telephone: '719184954', equipe: 'AS-SOLIHATE', est_capitaine: false },

    { nom: 'Mayaki Nameoua', prenom: 'Ibrahim', telephone: '718803057', equipe: 'AT-TAWWABOUNE', est_capitaine: true },
    { nom: 'Doumbia', prenom: 'Sekou', telephone: '554213166', equipe: 'AT-TAWWABOUNE', est_capitaine: false },
    { nom: 'Soumahoro', prenom: 'Chaka', telephone: '0566466876', equipe: 'AT-TAWWABOUNE', est_capitaine: false }
];

async function run() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Suppression des membres d\'équipe existants...');
        await client.query('DELETE FROM membres_equipe');

        console.log('📋 Début de l\'affectation...');

        for (const assign of assignments) {
            // Rechercher le participant
            // Note: On utilise LIKE avec % pour gérer les espaces ou variations mineures
            const partRes = await client.query(
                'SELECT id FROM participants WHERE nom ILIKE $1 AND prenom ILIKE $2 OR telephone = $3',
                [assign.nom, assign.prenom, assign.telephone]
            );

            if (partRes.rows.length === 0) {
                console.error(`❌ Participant non trouvé: ${assign.prenom} ${assign.nom} (${assign.telephone})`);
                continue;
            }

            const participantId = partRes.rows[0].id;

            // Rechercher l'équipe
            const eqRes = await client.query(
                'SELECT id FROM equipes WHERE nom = $1',
                [assign.equipe]
            );

            if (eqRes.rows.length === 0) {
                console.error(`❌ Équipe non trouvée: ${assign.equipe}`);
                continue;
            }

            const equipeId = eqRes.rows[0].id;

            // Insérer l'affectation
            await client.query(
                'INSERT INTO membres_equipe (equipe_id, participant_id, est_capitaine) VALUES ($1, $2, $3)',
                [equipeId, participantId, assign.est_capitaine]
            );

            console.log(`✅ Affecté: ${assign.prenom} ${assign.nom} -> ${assign.equipe} ${assign.est_capitaine ? '(CAPITAINE)' : ''}`);
        }

        await client.query('COMMIT');
        console.log('\n✨ Affectation terminée avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur lors de l\'affectation:', e);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
