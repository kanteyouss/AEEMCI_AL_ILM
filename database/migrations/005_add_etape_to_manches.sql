-- Migration 005: Ajouter colonne etape à la table manches

-- Ajouter la colonne etape
ALTER TABLE manches 
ADD COLUMN IF NOT EXISTS etape VARCHAR(50) DEFAULT 'preliminaire';

-- Ajouter un commentaire
COMMENT ON COLUMN manches.etape IS 'Étape du concours: preliminaire, quart, demi, finale';

-- Mettre à jour les manches existantes si besoin
UPDATE manches SET etape = 'preliminaire' WHERE etape IS NULL;

-- Vérifier
SELECT id, nom, numero, etape, date_heure FROM manches ORDER BY numero;
