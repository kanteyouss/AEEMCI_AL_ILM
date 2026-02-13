const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function addAndFixGender() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🔧 Ajout de la colonne genre...\n');

        // Ajouter la colonne genre si elle n'existe pas
        await client.query(`
            ALTER TABLE participants 
            ADD COLUMN IF NOT EXISTS genre VARCHAR(10) DEFAULT 'Frère'
        `);
        console.log('✅ Colonne genre ajoutée');

        // Mettre tous les participants à "Frère" par défaut
        await client.query(`UPDATE participants SET genre = 'Frère'`);
        console.log('✅ Tous les participants mis à "Frère" par défaut\n');

        // Mettre les 3 femmes en "Sœur"
        console.log('🔧 Mise à jour des 3 femmes...\n');

        // Silué Ferelaha Leila
        await client.query(`
            UPDATE participants 
            SET genre = 'Sœur' 
            WHERE LOWER(nom) = 'silué' AND LOWER(prenom) LIKE '%ferelaha%'
        `);
        console.log('✅ Silué Ferelaha Leila → Sœur');

        // KONE FANTA
        await client.query(`
            UPDATE participants 
            SET genre = 'Sœur' 
            WHERE UPPER(nom) = 'KONE' AND UPPER(prenom) = 'FANTA'
        `);
        console.log('✅ KONE FANTA → Sœur');

        // Sanfo Fatiha
        await client.query(`
            UPDATE participants 
            SET genre = 'Sœur' 
            WHERE LOWER(nom) = 'sanfo' AND LOWER(prenom) = 'fatiha'
        `);
        console.log('✅ Sanfo Fatiha → Sœur');

        await client.query('COMMIT');
        console.log('\n✨ Genres corrigés avec succès !');
        console.log('📊 3 Sœurs, 21 Frères (ou plus selon le total)');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

addAndFixGender();
