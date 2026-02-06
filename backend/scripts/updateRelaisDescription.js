require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')
});

async function updateRelais() {
    try {
        await client.connect();
        console.log('📡 Connexion à la base de données...');
        
        const result = await client.query(`
            UPDATE rubriques 
            SET description = 'Relais avec 4 participants max (1 question par personne). Bonne réponse = 10 pts + passage au suivant. Mauvaise réponse = 0 pt + fin du relais. 15 sec par question.',
                points_max = 40,
                criteres_evaluation = '{"exactitude": 10}'::jsonb
            WHERE nom = 'Questions relais'
            RETURNING id, nom, points_max, description, criteres_evaluation;
        `);
        
        if (result.rows.length > 0) {
            console.log('✅ Rubrique mise à jour:');
            console.log(`   ID: ${result.rows[0].id}`);
            console.log(`   Nom: ${result.rows[0].nom}`);
            console.log(`   Points max: ${result.rows[0].points_max}`);
            console.log(`   Description: ${result.rows[0].description}`);
            console.log(`   Critères: ${JSON.stringify(result.rows[0].criteres_evaluation)}`);
        } else {
            console.log('⚠️  Aucune rubrique "Questions relais" trouvée');
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await client.end();
        console.log('🔌 Connexion fermée');
    }
}

updateRelais();
