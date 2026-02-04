// ============================================
// SCRIPT DE TEST - AL ILM 2026
// ============================================

const db = require('../config/database');

async function testDatabase() {
    console.log('🧪 Test de connexion à la base de données...\n');
    
    try {
        // Test connexion
        const result = await db.testConnection();
        
        if (result) {
            console.log('✅ Connexion PostgreSQL réussie\n');
            
            // Compter les tables
            const tables = await db.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `);
            
            console.log(`📊 ${tables.rows.length} tables trouvées:\n`);
            tables.rows.forEach(t => console.log(`   - ${t.table_name}`));
            
            // Compter les équipes
            const equipes = await db.query('SELECT COUNT(*) FROM equipes');
            console.log(`\n🎯 ${equipes.rows[0].count} équipes enregistrées`);
            
            // Compter les rubriques
            const rubriques = await db.query('SELECT COUNT(*) FROM rubriques');
            console.log(`📖 ${rubriques.rows[0].count} rubriques enregistrées`);
            
            // Compter les participants
            const participants = await db.query('SELECT COUNT(*) FROM participants');
            console.log(`👥 ${participants.rows[0].count} participants inscrits`);
            
            // Afficher les équipes
            const equipesDetails = await db.query('SELECT nom, couleur, symbole FROM equipes ORDER BY id');
            console.log('\n🕌 Les 9 équipes AL ILM 2026:\n');
            equipesDetails.rows.forEach((e, i) => {
                console.log(`   ${i+1}. ${e.symbole} ${e.nom}`);
            });
            
            console.log('\n✅ Tests réussis !\n');
            process.exit(0);
            
        } else {
            console.error('❌ Échec de connexion à la base de données');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors des tests:', error.message);
        process.exit(1);
    }
}

testDatabase();
