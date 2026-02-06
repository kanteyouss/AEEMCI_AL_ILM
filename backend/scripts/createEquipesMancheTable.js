#!/usr/bin/env node

const db = require('./config/database');

async function createEquipesMancheTable() {
    const client = await db.pool.connect();
    
    try {
        console.log('🚀 Création de la table equipes_manche...');
        
        const sql = `
            CREATE TABLE IF NOT EXISTS equipes_manche (
                id SERIAL PRIMARY KEY,
                manche_id INTEGER NOT NULL REFERENCES manches(id) ON DELETE CASCADE,
                equipe_id INTEGER NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
                date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(manche_id, equipe_id)
            );

            CREATE INDEX IF NOT EXISTS idx_equipes_manche_manche ON equipes_manche(manche_id);
            CREATE INDEX IF NOT EXISTS idx_equipes_manche_equipe ON equipes_manche(equipe_id);
        `;
        
        await client.query(sql);
        console.log('✅ Table equipes_manche créée avec succès !');
        
        const countResult = await client.query('SELECT COUNT(*) FROM equipes_manche');
        console.log('📊 Nombre d\'enregistrements:', countResult.rows[0].count);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        client.release();
    }
}

createEquipesMancheTable();
