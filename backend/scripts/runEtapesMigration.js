const db = require('../config/database');

async function runMigration() {
    const client = await db.pool.connect();
    try {
        console.log('🔄 Exécution des migrations pour les étapes...');
        
        // 1. Ajouter colonne etape
        await client.query(`
            ALTER TABLE manches 
            ADD COLUMN IF NOT EXISTS etape VARCHAR(50) DEFAULT 'preliminaire'
        `);
        console.log('✅ Colonne etape ajoutée');
        
        // 2. Mettre à jour les manches existantes
        await client.query(`
            UPDATE manches 
            SET etape = 'preliminaire' 
            WHERE etape IS NULL OR etape = ''
        `);
        console.log('✅ Manches existantes mises à jour');
        
        // 3. Ajouter config etape_publiee
        await client.query(`
            INSERT INTO classement_config (cle, valeur, type, description) 
            VALUES ('etape_publiee', '', 'text', 'Code de l''étape actuellement publiée')
            ON CONFLICT (cle) DO NOTHING
        `);
        console.log('✅ Configuration etape_publiee ajoutée');
        
        // 4. Vérifier
        const manchesResult = await client.query(`
            SELECT id, nom, numero, etape, date_manche 
            FROM manches 
            ORDER BY numero
        `);
        
        console.log('\n📊 Manches dans la base:');
        manchesResult.rows.forEach(m => {
            console.log(`  - Manche ${m.numero}: ${m.nom} (étape: ${m.etape})`);
        });
        
        const configResult = await client.query(`
            SELECT * FROM classement_config WHERE cle = 'etape_publiee'
        `);
        
        console.log('\n⚙️ Configuration:');
        console.log('  ', configResult.rows[0]);
        
        console.log('\n✅ Migration terminée avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await db.pool.end();
    }
}

runMigration();
