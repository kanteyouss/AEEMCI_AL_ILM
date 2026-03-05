require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function seedMembers() {
    try {
        // 1. Ajouter des participants
        const participants = [
            { nom: 'TRAORE', prenom: 'Youssouf', email: 'traore@example.com', telephone: '0101010101', etablissement: 'ESATIC' },
            { nom: 'KONE', prenom: 'Moussa', email: 'kone@example.com', telephone: '0202020202', etablissement: 'EMSP' },
            { nom: 'DIARRA', prenom: 'Fatoumata', email: 'diarra@example.com', telephone: '0303030303', etablissement: 'ESATIC' },
            { nom: 'COULIBALY', prenom: 'Adama', email: 'coulibaly@example.com', telephone: '0404040404', etablissement: 'ESATIC' },
            { nom: 'OUATTARA', prenom: 'Mariam', email: 'ouattara@example.com', telephone: '0505050505', etablissement: 'EMSP' }
        ];

        console.log('👥 Ajout des participants...');
        for (const p of participants) {
            await db.query(
                `INSERT INTO participants (nom, prenom, email, telephone, etablissement) 
                 VALUES ($1, $2, $3, $4, $5) ON CONFLICT (telephone) DO NOTHING`,
                [p.nom, p.prenom, p.email, p.telephone, p.etablissement]
            );
        }

        // 2. Récupérer les IDs des équipes et des participants
        const equipesRes = await db.query('SELECT id, nom FROM equipes');
        const participantsRes = await db.query('SELECT id FROM participants');

        if (equipesRes.rows.length === 0 || participantsRes.rows.length === 0) {
            console.error('❌ Équipes ou participants non trouvés.');
            process.exit(1);
        }

        const equipes = equipesRes.rows;
        const pIds = participantsRes.rows.map(r => r.id);

        console.log('🔗 Affectation des membres aux équipes...');
        // Affecter 1 membre à chaque équipe (pour les 5 premiers participants)
        for (let i = 0; i < Math.min(equipes.length, pIds.length); i++) {
            await db.query(
                `INSERT INTO membres_equipe (equipe_id, participant_id, est_capitaine) 
                 VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
                [equipes[i].id, pIds[i], true]
            );
            console.log(`✅ ${equipes[i].nom} a maintenant un capitaine.`);
        }

        console.log('✨ Fin du peuplement des membres !');
    } catch (e) {
        console.error('❌ Erreur seeding membres:', e);
    }
    process.exit();
}

seedMembers();
