-- Migration: Ajouter session_id à evaluations
-- Date: 2026-02-05
-- Description: Ajouter la référence à rubriques_manche (session de notation)

-- Ajouter la colonne session_id
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS session_id INTEGER REFERENCES rubriques_manche(id);

-- Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_evaluations_session ON evaluations(session_id);

-- Commentaire pour documentation
COMMENT ON COLUMN evaluations.session_id IS 'Référence à la session de notation (rubriques_manche)';
