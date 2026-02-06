-- ============================================
-- MIGRATION: Amélioration table evaluations pour notation
-- ============================================

-- Ajouter les colonnes manquantes pour la notation complète
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS equipe_id INTEGER REFERENCES equipes(id),
ADD COLUMN IF NOT EXISTS manche_id INTEGER REFERENCES manches(id),
ADD COLUMN IF NOT EXISTS rubrique_id INTEGER REFERENCES rubriques(id),
ADD COLUMN IF NOT EXISTS session_id INTEGER REFERENCES rubriques_manche(id),
ADD COLUMN IF NOT EXISTS criteres_notes JSONB;

-- Créer index pour performance
CREATE INDEX IF NOT EXISTS idx_evaluations_equipe ON evaluations(equipe_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_manche ON evaluations(manche_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_rubrique ON evaluations(rubrique_id);

-- Ajouter contrainte unique pour éviter doublon
ALTER TABLE evaluations 
DROP CONSTRAINT IF EXISTS unique_evaluation_equipe_manche_rubrique;

ALTER TABLE evaluations 
ADD CONSTRAINT unique_evaluation_equipe_manche_rubrique 
UNIQUE (equipe_id, manche_id, rubrique_id);

-- Mettre à jour les évaluations existantes si nécessaire
UPDATE evaluations e
SET 
    equipe_id = s.equipe_id,
    manche_id = s.manche_id,
    rubrique_id = s.rubrique_id
FROM soumissions s
WHERE e.soumission_id = s.id
AND e.equipe_id IS NULL;
