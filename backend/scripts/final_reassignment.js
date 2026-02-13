const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const teams = {
    "AS-SOLIHATE": ["SILUE Ferelaha Leila", "KONE Fanta", "SANFO Fatiha"],
    "AT-TAWWABOUNE": ["DOUMBIA Sekou", "MAYAKI Nameoua Ibrahim", "SOUMAHORO Chaka"],
    "AZ-ZAKIROUNE": ["ABDOU Bachir", "SANOGO Ahmed", "DIEGNANA OUATTARA Toumani"],
    "AL YAQRA'OUN": ["ABDOU ELHADJI IDI Mikhail", "CISSEY Kalil Ibrahim", "OUATTARA Kabidaho Ben Amed"],
    "AL MOUHTADOUNE": ["DOUMBIA Issa", "KONE Daouda", "TOURE N'fali"],
    "AL MOUDJAHIDOUNE": ["IGDASS Ali", "TRAORE Zana Djibril", "OUSMANE BAGNAN Moussa"],
    "AS SORBIROUNE": ["SANI Amadou", "DIARRA Ben Idriss Zanga", "COULIBALY Donissongui Siaka"],
    "ASH-SHAKIROUNE": ["SORO Sona Youssef", "KOUMA Amadou", "SOUMAHORO N'gouamahan"]
};

const newParticipants = [
    { prenom: "Kalil Ibrahim", nom: "CISSEY", telephone: "0556694206", etablissement: "ESATIC" }
];

function normalize(str) {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlever les accents
        .replace(/[’']/g, "'") // Normaliser les apostrophes
        .replace(/Ahmed/gi, "Amhed") // Gérer la typo spécifique en BD
        .toLowerCase()
        .trim();
}

async function run() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🔄 Mise à jour des noms des participants...');
        await client.query(
            "UPDATE participants SET prenom = 'Zana Djibril' WHERE nom ILIKE 'Traore' AND prenom ILIKE 'Ibrahim'"
        );

        console.log('➕ Ajout des participants manquants...');
        for (const p of newParticipants) {
            const check = await client.query("SELECT id FROM participants WHERE telephone = $1", [p.telephone]);
            if (check.rows.length === 0) {
                await client.query(
                    "INSERT INTO participants (nom, prenom, telephone, etablissement) VALUES ($1, $2, $3, $4)",
                    [p.nom, p.prenom, p.telephone, p.etablissement]
                );
                console.log(`✅ Ajouté : ${p.prenom} ${p.nom}`);
            }
        }

        console.log('🧹 Nettoyage des affectations actuelles...');
        await client.query('DELETE FROM membres_equipe');

        // Récupérer tous les participants pour matching local
        const allParts = await client.query("SELECT id, nom, prenom FROM participants");

        console.log('📋 Affectation des équipes (le premier est capitaine)...');
        for (const [teamName, members] of Object.entries(teams)) {
            const eqRes = await client.query("SELECT id FROM equipes WHERE nom = $1", [teamName]);
            if (eqRes.rows.length === 0) continue;
            const equipeId = eqRes.rows[0].id;

            for (let i = 0; i < members.length; i++) {
                const fullName = members[i];
                const isCaptain = (i === 0);
                const normSearch = normalize(fullName);

                const participant = allParts.rows.find(p => {
                    const normDB = normalize(`${p.nom} ${p.prenom}`);
                    const normDBRev = normalize(`${p.prenom} ${p.nom}`);
                    return normDB.includes(normSearch) || normDBRev.includes(normSearch) ||
                        normSearch.includes(normalize(p.nom)) && normSearch.includes(normalize(p.prenom));
                });

                if (!participant) {
                    console.error(`❌ Participant non trouvé pour l'équipe ${teamName} : ${fullName}`);
                    continue;
                }

                await client.query(
                    "INSERT INTO membres_equipe (equipe_id, participant_id, est_capitaine) VALUES ($1, $2, $3)",
                    [equipeId, participant.id, isCaptain]
                );
                console.log(`✅ ${fullName} -> ${teamName} ${isCaptain ? '(CAPITAINE)' : ''}`);
            }
        }

        await client.query('COMMIT');
        console.log('\n✨ Réaffectation terminée avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
