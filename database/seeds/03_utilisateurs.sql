-- ============================================
-- UTILISATEURS (Admin & Jurés)
-- JEU CONCOURS AL ILM 2026
-- ============================================

-- Mot de passe hashé avec bcrypt (10 rounds)
-- admin1 : password = Admin123!
-- admin2 : password = Admin456!
-- admin3 : password = Admin789!

INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role, actif) VALUES
    ('ADMINISTRATEUR', 'Principal', 'admin@alilm.ci', '$2b$10$8C2C7njxe6qfmJksK1SCfODaCWo/36gVO/rg2iz74KbmbVRKs6Hn2', 'admin', true),
    ('ADMINISTRATEUR', 'Adjoint', 'admin2@alilm.ci', '$2b$10$JQ11DcKTPL7fsNf7Ef.38ufg8wRvvPfBvOB/eDvz.t5OgZeDX50/.', 'admin', true),
    ('ADMINISTRATEUR', 'Technique', 'admin3@alilm.ci', '$2b$10$F9BJYMYKCIR3AZHNZH3g8OPfc0KMfMgwpWvyVAAIdzDpww25PrzdK', 'admin', true);

-- Comptes affichés dans la console après le seeding
COMMENT ON TABLE utilisateurs IS 'Table des utilisateurs (administrateurs et jurés)';

-- Afficher les comptes créés
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔐 ========================================';
    RAISE NOTICE '   COMPTES ADMINISTRATEURS CRÉÉS';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Admin Principal';
    RAISE NOTICE '   Email    : admin@alilm.ci';
    RAISE NOTICE '   Password : Admin123!';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Admin Adjoint';
    RAISE NOTICE '   Email    : admin2@alilm.ci';
    RAISE NOTICE '   Password : Admin456!';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Admin Technique';
    RAISE NOTICE '   Email    : admin3@alilm.ci';
    RAISE NOTICE '   Password : Admin789!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT : Changez ces mots de passe';
    RAISE NOTICE '   après la première connexion !';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
