-- Migration: Ajouter la colonne numero à la table manches
-- Date: 2024
-- Description: Ajoute le numéro de manche (1-9) pour la structure fixe du tournoi

ALTER TABLE manches ADD COLUMN IF NOT EXISTS numero INTEGER;

-- Ajouter un index sur le numéro pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_manches_numero ON manches(numero);

-- Ajouter une contrainte d'unicité sur le numéro (chaque manche a un numéro unique)
ALTER TABLE manches ADD CONSTRAINT unique_manche_numero UNIQUE (numero);

COMMENT ON COLUMN manches.numero IS 'Numéro de la manche (1-9): 1-3 Préliminaire, 4-6 Quart, 7-8 Demi, 9 Finale';
