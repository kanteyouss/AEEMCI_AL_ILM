const pool = require('../config/database');

async function checkTable() {
    const client = await pool.connect();
    try {
        // Vérifier si la table existe
        const checkResult = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'classement_config'
            );
        `);
        
        if (checkResult.rows[0].exists) {
            console.log('✅ La table classement_config existe déjà');
            
            const data = await client.query('SELECT * FROM classement_config ORDER BY cle');
            console.log('\n📊 Données actuelles:');
            data.rows.forEach(row => {
                console.log(`  ${row.cle}: ${row.valeur} (${row.type})`);
            });
        } else {
            console.log('❌ La table classement_config n\'existe pas encore');
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

checkTable();
