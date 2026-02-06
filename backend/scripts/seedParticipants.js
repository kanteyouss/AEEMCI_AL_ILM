require('dotenv').config();
const db = require('../config/database');

/**
 * Script pour ajouter 15 participants de test avec des noms musulmans
 * Pas de mot de passe nécessaire car ce sont des participants, pas des utilisateurs
 */

const participants = [
    {
        nom: 'Diallo',
        prenom: 'Aisha',
        email: 'aisha.diallo@esatic.edu.ci',
        telephone: '+225 0701234501',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Traoré',
        prenom: 'Ibrahim',
        email: 'ibrahim.traore@esatic.edu.ci',
        telephone: '+225 0701234502',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'moins_de_5',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'Koné',
        prenom: 'Fatima',
        email: 'fatima.kone@emsp.edu.ci',
        telephone: '+225 0701234503',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Coulibaly',
        prenom: 'Mohammed',
        email: 'mohammed.coulibaly@esatic.edu.ci',
        telephone: '+225 0701234504',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Sangaré',
        prenom: 'Khadija',
        email: 'khadija.sangare@emsp.edu.ci',
        telephone: '+225 0701234505',
        etablissement: 'EMSP',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'Ouattara',
        prenom: 'Youssouf',
        email: 'youssouf.ouattara@esatic.edu.ci',
        telephone: '+225 0701234506',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'moins_de_5',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Touré',
        prenom: 'Zainab',
        email: 'zainab.toure@emsp.edu.ci',
        telephone: '+225 0701234507',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Bamba',
        prenom: 'Abdul',
        email: 'abdul.bamba@esatic.edu.ci',
        telephone: '+225 0701234508',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'Fofana',
        prenom: 'Mariam',
        email: 'mariam.fofana@emsp.edu.ci',
        telephone: '+225 0701234509',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Konaté',
        prenom: 'Omar',
        email: 'omar.konate@esatic.edu.ci',
        telephone: '+225 0701234510',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Sanou',
        prenom: 'Amina',
        email: 'amina.sanou@emsp.edu.ci',
        telephone: '+225 0701234511',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'moins_de_5',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Camara',
        prenom: 'Hamza',
        email: 'hamza.camara@esatic.edu.ci',
        telephone: '+225 0701234512',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'Diabaté',
        prenom: 'Salimata',
        email: 'salimata.diabate@emsp.edu.ci',
        telephone: '+225 0701234513',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Sylla',
        prenom: 'Bilal',
        email: 'bilal.sylla@esatic.edu.ci',
        telephone: '+225 0701234514',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Cissé',
        prenom: 'Halima',
        email: 'halima.cisse@emsp.edu.ci',
        telephone: '+225 0701234515',
        etablissement: 'EMSP',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'moins_de_5',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    }
];

async function seedParticipants() {
    const client = await db.pool.connect();
    
    try {
        console.log('🌱 Début du seed des participants...\n');
        
        await client.query('BEGIN');
        
        let count = 0;
        
        for (const participant of participants) {
            // Vérifier si l'email existe déjà
            const checkQuery = 'SELECT id FROM participants WHERE email = $1';
            const checkResult = await client.query(checkQuery, [participant.email]);
            
            if (checkResult.rows.length > 0) {
                console.log(`⚠️  ${participant.prenom} ${participant.nom} existe déjà - ignoré`);
                continue;
            }
            
            // Insérer le participant
            const insertQuery = `
                INSERT INTO participants (
                    nom, prenom, email, telephone,
                    etablissement, niveau_coranique, connaissance_hadiths, 
                    memorisation_sourate, disponibilite
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, nom, prenom, email
            `;
            
            const values = [
                participant.nom,
                participant.prenom,
                participant.email,
                participant.telephone,
                participant.etablissement,
                participant.niveau_coranique,
                participant.connaissance_hadiths,
                participant.memorisation_sourate,
                participant.disponibilite
            ];
            
            const result = await client.query(insertQuery, values);
            const inserted = result.rows[0];
            
            count++;
            console.log(`✅ ${count}. ${inserted.prenom} ${inserted.nom} (${inserted.email})`);
        }
        
        await client.query('COMMIT');
        
        console.log(`\n✨ ${count} participants ajoutés avec succès !`);
        console.log('\n📋 Liste des participants :');
        console.log('─'.repeat(60));
        
        participants.slice(0, count).forEach((p, i) => {
            console.log(`${i + 1}. ${p.prenom} ${p.nom} - ${p.etablissement}`);
        });
        
        console.log('─'.repeat(60));
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur lors du seed :', error.message);
        throw error;
    } finally {
        client.release();
        await db.pool.end();
    }
}

// Exécuter le seed
seedParticipants()
    .then(() => {
        console.log('\n✅ Seed terminé avec succès !');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Erreur fatale :', error);
        process.exit(1);
    });
