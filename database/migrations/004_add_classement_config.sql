-- ============================================
-- MIGRATION: Configuration affichage classement public
-- Date: 2026-02-05
-- ============================================

CREATE TABLE IF NOT EXISTS classement_config (
    id SERIAL PRIMARY KEY,
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT,
    type VARCHAR(50) DEFAULT 'boolean',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Paramètres par défaut
INSERT INTO classement_config (cle, valeur, type, description) VALUES
    ('afficher_podium', 'true', 'boolean', 'Afficher la section podium sur la page publique'),
    ('afficher_statistiques', 'true', 'boolean', 'Afficher les statistiques générales'),
    ('afficher_classement_complet', 'true', 'boolean', 'Afficher le classement complet ou top 10'),
    ('afficher_filtres', 'true', 'boolean', 'Afficher les filtres par manche/rubrique'),
    ('nombre_equipes_affichees', '10', 'number', 'Nombre d\'équipes à afficher (0 = toutes)'),
    ('classement_publie', 'false', 'boolean', 'Statut de publication du classement'),
    ('derniere_publication', NULL, 'datetime', 'Date de la dernière publication'),
    ('message_personnalise', '', 'text', 'Message personnalisé en haut de page')
ON CONFLICT (cle) DO NOTHING;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_classement_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_classement_config
    BEFORE UPDATE ON classement_config
    FOR EACH ROW
    EXECUTE FUNCTION update_classement_config_timestamp();

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Table classement_config créée avec succès';
    RAISE NOTICE '📋 8 paramètres d''affichage configurés';
END $$;
