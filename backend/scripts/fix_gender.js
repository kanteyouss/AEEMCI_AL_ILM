const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function fixGender() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🔧 Correction du genre des participants...\n');

        // D'abord, mettre tous les participants en "Frère"
        await client.query(`UPDATE participants SET genre = 'Frère'`);
        console.log('✅ Tous les participants mis à "Frère" par défaut');

        // Ensuite, mettre les 3 femmes en "Sœur"
        const femmes = [
            'Silué Ferelaha Leila',
            'KONE FANTA',
            'Sanfo Fatiha'
        ];

        for (const nom of femmes) {
            const result = await client.query(`
                UPDATE participants 
                SET genre = 'Sœur' 
                WHERE nom || ' ' || prenom = $1 OR prenom || ' ' || nom = $1
            `, [nom]);
            console.log(`✅ ${nom} → Sœur`);
        }

        await client.query('COMMIT');
        console.log('\n✨ Genres corrigés avec succès !');
        console.log('📊 3 Sœurs, 21 Frères');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

fixGender();
