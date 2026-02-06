-- Script SQL complet pour les étapes du concours AL-ILM 2026

-- 1. Ajouter colonne etape à la table manches
ALTER TABLE manches ADD COLUMN IF NOT EXISTS etape VARCHAR(50) DEFAULT 'preliminaire';

-- 2. Mettre à jour les manches existantes
UPDATE manches SET etape = 'preliminaire' WHERE etape IS NULL OR etape = '';

-- 3. Ajouter la configuration pour l'étape publiée
INSERT INTO classement_config (cle, valeur, type, description) 
VALUES ('etape_publiee', '', 'text', 'Code de l''étape actuellement publiée')
ON CONFLICT (cle) DO NOTHING;

-- 4. Vérifier les résultats
SELECT id, nom, numero, etape, date_manche FROM manches ORDER BY numero;
SELECT * FROM classement_config WHERE cle = 'etape_publiee';

-- Migration terminée avec succès !
