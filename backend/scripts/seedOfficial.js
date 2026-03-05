require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');
const bcrypt = require('bcrypt');

async function seedOfficialData() {
    try {
        console.log('🧹 Nettoyage des données existantes...');
        await db.query('TRUNCATE TABLE equipes, utilisateurs, participants CASCADE');

        // 1. Seed Admin
        console.log('🔐 Création de l\'admin...');
        const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
        await db.query(
            `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role, actif) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            ['ADMIN', 'Principal', 'admin@alilm.ci', adminPasswordHash, 'admin', true]
        );

        // 2. Seed Teams
        console.log('🏆 Création des équipes officielles...');
        const officialTeams = [
            { nom: 'AL MOUDJAHIDOUNE', code: 'MOUDJAHIDOUNE024', symbole: '⚔️', couleur: '#2ecc71', signification: 'Les combattants sur le sentier d\'Allah.' },
            { nom: 'AL MOUHTADOUNE', code: 'MOUHTADOUNE024', symbole: '🧭', couleur: '#3498db', signification: 'Ceux qui sont bien guidés.' },
            { nom: 'AL YAQRA\'OUN', code: 'YAQRAOUN024', symbole: '📖', couleur: '#9b59b6', signification: 'Ceux qui lisent/récitent.' },
            { nom: 'ASH-SHAKIROUNE', code: 'SHAKIROUNE024', symbole: '🙌', couleur: '#f1c40f', signification: 'Les reconnaissants.' },
            { nom: 'AS-SOLIHATE', code: 'SOLIHATE024', symbole: '🧕', couleur: '#e91e63', signification: 'Les femmes vertueuses.' },
            { nom: 'AS SORBIROUNE', code: 'SORBIROUNE024', symbole: '⏳', couleur: '#e67e22', signification: 'Les endurants.' },
            { nom: 'AT-TAWWABOUNE', code: 'TAWWABOUNE024', symbole: '🤲', couleur: '#1abc9c', signification: 'Ceux qui se repentent sans cesse.' },
            { nom: 'AZ-ZAKIROUNE', code: 'ZAKIROUNE024', symbole: '📿', couleur: '#34495e', signification: 'Ceux qui invoquent souvent Allah.' }
        ];

        for (const t of officialTeams) {
            const res = await db.query(
                `INSERT INTO equipes (nom, code_acces, symbole, couleur, signification) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [t.nom, t.code, t.symbole, t.couleur, t.signification]
            );

            const equipeId = res.rows[0].id;

            // 3. Ajouter un membre par défaut pour chaque équipe
            const pNom = `MEMBRE-${t.nom.split(' ').pop()}`;
            const pTel = `07${Math.floor(10000000 + Math.random() * 90000000)}`;

            const pRes = await db.query(
                `INSERT INTO participants (nom, prenom, email, telephone, etablissement) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [pNom, 'Participant', `${pNom.toLowerCase()}@test.ci`, pTel, 'ESATIC']
            );

            await db.query(
                `INSERT INTO membres_equipe (equipe_id, participant_id, est_capitaine) 
                 VALUES ($1, $2, $3)`,
                [equipeId, pRes.rows[0].id, true]
            );
            console.log(`✅ Équipe ${t.nom} créée avec un capitaine.`);
        }

        console.log('\n✨ Base de données mise à jour avec les 8 équipes officielles et l\'admin !');
    } catch (e) {
        console.error('❌ Erreur seed:', e);
    }
    process.exit();
}

seedOfficialData();
