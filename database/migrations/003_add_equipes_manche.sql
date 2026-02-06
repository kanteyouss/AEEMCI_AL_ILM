-- ============================================
-- MIGRATION: Ajouter table equipes_manche
-- Date: 2026-02-05
-- Description: Permet de sélectionner quelles équipes 
--              participent à quelle manche
-- ============================================

-- Créer la table de liaison
CREATE TABLE IF NOT EXISTS equipes_manche (
    id SERIAL PRIMARY KEY,
    manche_id INTEGER NOT NULL REFERENCES manches(id) ON DELETE CASCADE,
    equipe_id INTEGER NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(manche_id, equipe_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_equipes_manche_manche ON equipes_manche(manche_id);
CREATE INDEX IF NOT EXISTS idx_equipes_manche_equipe ON equipes_manche(equipe_id);

-- Commentaires
COMMENT ON TABLE equipes_manche IS 'Table de liaison pour définir quelles équipes participent à quelle manche';
COMMENT ON COLUMN equipes_manche.manche_id IS 'ID de la manche';
COMMENT ON COLUMN equipes_manche.equipe_id IS 'ID de l''équipe participant à cette manche';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Table equipes_manche créée avec succès';
    RAISE NOTICE '📋 Index créés pour optimisation des requêtes';
END $$;
