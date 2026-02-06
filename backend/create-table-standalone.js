#!/usr/bin/env node

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432')
});

async function createTable() {
    try {
        console.log('🔧 Configuration:', {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        
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
        
        await pool.query(sql);
        console.log('✅ Table equipes_manche créée avec succès !');
        
        const countResult = await pool.query('SELECT COUNT(*) FROM equipes_manche');
        console.log('📊 Nombre d\'enregistrements:', countResult.rows[0].count);
        
        await pool.end();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        await pool.end();
        process.exit(1);
    }
}

createTable();
