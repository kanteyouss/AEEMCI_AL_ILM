-- ============================================
-- MISE À JOUR DES ADMINISTRATEURS
-- Délégués Culturels AEEMCI - Section ESATIC
-- ============================================

-- Supprimer les comptes administrateurs génériques
DELETE FROM utilisateurs WHERE role = 'admin';

-- Créer les comptes des délégués culturels
-- Mot de passe par défaut : AlIlm2026! (à changer après première connexion)
-- Hash bcrypt : $2b$10$vZxMm5pQwH7zKNnJ8YE9xuTw7YJqhgzCbJYPZ4X5kF8tHZqGx6JNa

INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role, telephone, actif) VALUES
    -- Délégué Culturel Principal
    ('KANTÉ', 'Youssouf Aziz', 'kanteyoussoufaziz@gmail.com', '$2b$10$vZxMm5pQwH7zKNnJ8YE9xuTw7YJqhgzCbJYPZ4X5kF8tHZqGx6JNa', 'admin', '05-00-01-74-05', true),
    
    -- Délégué Culturel Adjoint 1
    ('DÉLÉGUÉ', 'Culturel 2', 'delegue2@aeemci-esatic.ci', '$2b$10$vZxMm5pQwH7zKNnJ8YE9xuTw7YJqhgzCbJYPZ4X5kF8tHZqGx6JNa', 'admin', '07-06-47-11-85', true),
    
    -- Délégué Culturel Adjoint 2
    ('DÉLÉGUÉ', 'Culturel 3', 'delegue3@aeemci-esatic.ci', '$2b$10$vZxMm5pQwH7zKNnJ8YE9xuTw7YJqhgzCbJYPZ4X5kF8tHZqGx6JNa', 'admin', '05-84-83-05-98', true);

-- Afficher les comptes créés
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🕌 ========================================';
    RAISE NOTICE '   DÉLÉGUÉS CULTURELS AEEMCI-ESATIC';
    RAISE NOTICE '   Comptes Administrateurs créés';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Délégué Principal';
    RAISE NOTICE '   Nom      : KANTÉ Youssouf Aziz';
    RAISE NOTICE '   Email    : kanteyoussoufaziz@gmail.com';
    RAISE NOTICE '   Tel      : 05-00-01-74-05';
    RAISE NOTICE '   Password : AlIlm2026!';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Délégué Adjoint 1';
    RAISE NOTICE '   Email    : delegue2@aeemci-esatic.ci';
    RAISE NOTICE '   Tel      : 07-06-47-11-85';
    RAISE NOTICE '   Password : AlIlm2026!';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Délégué Adjoint 2';
    RAISE NOTICE '   Email    : delegue3@aeemci-esatic.ci';
    RAISE NOTICE '   Tel      : 05-84-83-05-98';
    RAISE NOTICE '   Password : AlIlm2026!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT :';
    RAISE NOTICE '   - Changez ces mots de passe après';
    RAISE NOTICE '     la première connexion !';
    RAISE NOTICE '   - Renseignez les noms complets des';
    RAISE NOTICE '     délégués adjoints';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
