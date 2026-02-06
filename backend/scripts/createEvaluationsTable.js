/**
 * Script pour créer la table evaluations si elle n'existe pas
 */

require('dotenv').config();
const db = require('../config/database');

async function createEvaluationsTable() {
    try {
        console.log('🔍 Vérification de la table evaluations...');
        
        // Vérifier si evaluations existe
        const result = await db.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'evaluations'
            )
        `);
        
        const tableExists = result.rows[0].exists;
        console.log('Table evaluations existe:', tableExists);
        
        if (!tableExists) {
            console.log('📝 Création de la table evaluations...');
            
            await db.query(`
                CREATE TABLE evaluations (
                    id SERIAL PRIMARY KEY,
                    soumission_id INTEGER REFERENCES soumissions(id) ON DELETE CASCADE,
                    jure_id INTEGER REFERENCES utilisateurs(id),
                    equipe_id INTEGER REFERENCES equipes(id),
                    manche_id INTEGER REFERENCES manches(id),
                    rubrique_id INTEGER REFERENCES rubriques(id),
                    note_voix INTEGER,
                    note_tajwid INTEGER,
                    note_prononciation INTEGER,
                    note_totale INTEGER NOT NULL,
                    criteres_notes JSONB,
                    commentaire TEXT,
                    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'conteste')),
                    date_evaluation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE (equipe_id, manche_id, rubrique_id)
                )
            `);
            
            console.log('📊 Création des index...');
            await db.query('CREATE INDEX idx_evaluations_soumission ON evaluations(soumission_id)');
            await db.query('CREATE INDEX idx_evaluations_equipe ON evaluations(equipe_id)');
            await db.query('CREATE INDEX idx_evaluations_manche ON evaluations(manche_id)');
            await db.query('CREATE INDEX idx_evaluations_rubrique ON evaluations(rubrique_id)');
            
            console.log('✅ Table evaluations créée avec succès');
        } else {
            console.log('⚠️ Table evaluations existe déjà, ajout des colonnes manquantes...');
            
            await db.query('ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS equipe_id INTEGER REFERENCES equipes(id)');
            await db.query('ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS manche_id INTEGER REFERENCES manches(id)');
            await db.query('ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS rubrique_id INTEGER REFERENCES rubriques(id)');
            await db.query('ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS criteres_notes JSONB');
            
            console.log('📊 Création des index manquants...');
            await db.query('CREATE INDEX IF NOT EXISTS idx_evaluations_equipe ON evaluations(equipe_id)');
            await db.query('CREATE INDEX IF NOT EXISTS idx_evaluations_manche ON evaluations(manche_id)');
            await db.query('CREATE INDEX IF NOT EXISTS idx_evaluations_rubrique ON evaluations(rubrique_id)');
            
            console.log('✅ Colonnes et index ajoutés');
        }
        
        // Afficher la structure
        const columns = await db.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'evaluations'
            ORDER BY ordinal_position
        `);
        
        console.log('\n📋 Structure de la table evaluations:');
        columns.rows.forEach(col => {
            console.log(`   • ${col.column_name} (${col.data_type})`);
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

createEvaluationsTable();
