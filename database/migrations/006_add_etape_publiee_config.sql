-- Migration 006: Ajouter etape_publiee à classement_config

-- Ajouter la configuration pour l'étape publiée
INSERT INTO classement_config (cle, valeur, type, description) 
VALUES ('etape_publiee', '', 'text', 'Code de l''étape actuellement publiée')
ON CONFLICT (cle) DO NOTHING;

-- Vérifier
SELECT * FROM classement_config WHERE cle = 'etape_publiee';
