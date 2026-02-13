const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'alilm2026',
    password: 'postgres',
    port: 5432,
});

const participantsData = [
    {
        nom: 'Diarra',
        prenom: 'Ben Idriss Zanga',
        telephone: '799758168',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Doumbia',
        prenom: 'Issa',
        telephone: '584154857',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Diegnana',
        prenom: 'Ouattara Toumani Ange tidiane',
        telephone: '769893740',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'Traore',
        prenom: 'Ibrahim',
        telephone: '544823225',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Ouattara',
        prenom: 'Kabidaho Ben Amed',
        telephone: '575548594',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'Kouma',
        prenom: 'Amadou',
        telephone: '554924601',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Ousmane Bagnan',
        prenom: 'Moussa',
        telephone: '715552856',
        etablissement: 'EMSP',
        niveau_coranique: 'ne_sais_pas',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Toure',
        prenom: 'N’fali',
        telephone: '507674208',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Sani',
        prenom: 'Amadou',
        telephone: '789604788',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'IGDASS',
        prenom: 'ALI',
        telephone: '594842302',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'un_peu_moins',
        disponibilite: true
    },
    {
        nom: 'Coulibaly',
        prenom: 'Donissongui siaka',
        telephone: '586106613',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'moins_de_5',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Kone',
        prenom: 'Daouda',
        telephone: '585831889',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Sanogo',
        prenom: 'Amhed',
        telephone: '142665463',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'KONE',
        prenom: 'FANTA',
        telephone: '142459328',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Mayaki Nameoua',
        prenom: 'IBRAHIM',
        telephone: '718803057',
        etablissement: 'EMSP',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'moins_de_5',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Abdou Elhadji Idi',
        prenom: 'Mikhail',
        telephone: '719764652',
        etablissement: 'EMSP',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'moins_de_5',
        memorisation_sourate: 'oui',
        disponibilite: true
    },
    {
        nom: 'Soumahoro',
        prenom: "N'gouamahan",
        telephone: '104551672',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'DOUMBIA',
        prenom: 'SEKOU',
        telephone: '554213166',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Abdou',
        prenom: 'Bachir',
        telephone: '0702375058',
        etablissement: 'EMSP',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'KONE',
        prenom: 'FATOUMATA',
        telephone: '747744474',
        etablissement: 'ESATIC',
        niveau_coranique: 'ne_sais_pas',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'SOUMAHORO',
        prenom: 'Chaka',
        telephone: '+225 0566466876',
        etablissement: 'ESATIC',
        niveau_coranique: 'ne_sais_pas',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Sanfo',
        prenom: 'Fatiha',
        telephone: '+225 0749492472',
        etablissement: 'ESATIC',
        niveau_coranique: 'ne_sais_pas',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Silué',
        prenom: 'Ferelaha Leila',
        telephone: '719184954',
        etablissement: 'ESATIC',
        niveau_coranique: 'debute',
        connaissance_hadiths: 'oui',
        memorisation_sourate: 'non',
        disponibilite: true
    },
    {
        nom: 'Soro',
        prenom: 'Sona youssef',
        telephone: '594964112',
        etablissement: 'ESATIC',
        niveau_coranique: 'lis_aisement',
        connaissance_hadiths: 'non',
        memorisation_sourate: 'oui',
        disponibilite: true
    }
];

async function cleanupAndImport() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Nettoyage des tables...');
        // Vider les tables dans l'ordre de dépendance
        await client.query('DELETE FROM evaluations');
        await client.query('DELETE FROM soumissions');
        await client.query('DELETE FROM scores');
        await client.query('DELETE FROM membres_equipe');
        await client.query('DELETE FROM participants');

        console.log('📥 Insertion des nouveaux participants...');
        for (const p of participantsData) {
            await client.query(`
                INSERT INTO participants (
                    nom, prenom, telephone, etablissement, 
                    niveau_coranique, connaissance_hadiths, 
                    memorisation_sourate, disponibilite
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
                p.nom, p.prenom, p.telephone, p.etablissement,
                p.niveau_coranique, p.connaissance_hadiths,
                p.memorisation_sourate, p.disponibilite
            ]);
        }

        await client.query('COMMIT');
        console.log('✅ Nettoyage et importation terminés avec succès !');
        console.log(`📊 ${participantsData.length} participants importés.`);

        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur lors de la migration:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

cleanupAndImport();
