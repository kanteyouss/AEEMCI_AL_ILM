-- ============================================
-- SEED : 9 RUBRIQUES OFFICIELLES
-- JEU CONCOURS AL ILM 2026
-- ============================================

INSERT INTO rubriques (nom, type, points_max, temps_par_question, description, criteres_evaluation) VALUES
(
    'Adhan',
    'recitation',
    100,
    180,
    'Récitation de l''Adhan avec Tajwid. Chaque équipe désigne un membre pour réciter.',
    '{"voix": 40, "tajwid": 40, "prononciation": 20}'::jsonb
),
(
    'Coran Ouvert',
    'recitation',
    100,
    300,
    'Récitation d''un passage du Coran choisi par le jury (livre ouvert).',
    '{"voix": 35, "tajwid": 45, "prononciation": 20}'::jsonb
),
(
    'Coran Fermé',
    'recitation',
    150,
    300,
    'Récitation de mémoire d''une sourate désignée par le jury.',
    '{"voix": 30, "tajwid": 50, "memorisation": 40, "prononciation": 30}'::jsonb
),
(
    'Jurisprudence',
    'questions_ecrites',
    100,
    60,
    'Questions sur le Fiqh : prière, jeûne, purification, Zakat, Hajj.',
    '{"exactitude": 70, "temps": 30}'::jsonb
),
(
    'Questions Relais',
    'relais',
    150,
    30,
    'Série de questions rapides en relais. Toute l''équipe participe à tour de rôle.',
    '{"rapidite": 50, "exactitude": 100}'::jsonb
),
(
    'Vie du Prophète et des Compagnons',
    'questions_ecrites',
    100,
    60,
    'Questions sur la vie du Prophète Muhammad (SAW), sa Sira, ses enseignements et l''histoire de ses Compagnons.',
    '{"exactitude": 70, "temps": 30}'::jsonb
),
(
    'Culture Générale Islamique',
    'questions_ecrites',
    100,
    60,
    'Questions sur l''histoire islamique, les compagnons, les califes, les savants.',
    '{"exactitude": 70, "temps": 30}'::jsonb
),
(
    'Hadith',
    'hadith',
    100,
    180,
    'Récitation de Hadiths (en arabe avec traduction française). Évaluation de la mémorisation et prononciation.',
    '{"memorisation": 50, "prononciation": 30, "comprehension": 20}'::jsonb
);

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ 8 rubriques officielles créées avec succès !';
    RAISE NOTICE '';
    RAISE NOTICE '📖 Les 8 rubriques AL ILM 2026 :';
    RAISE NOTICE '   1️⃣  Adhan (100 pts)';
    RAISE NOTICE '   2️⃣  Coran Ouvert (100 pts)';
    RAISE NOTICE '   3️⃣  Coran Fermé (150 pts)';
    RAISE NOTICE '   4️⃣  Jurisprudence (100 pts)';
    RAISE NOTICE '   5️⃣  Questions Relais (150 pts)';
    RAISE NOTICE '   6️⃣  Vie du Prophète et des Compagnons (100 pts)';
    RAISE NOTICE '   7️⃣  Culture Générale Islamique (100 pts)';
    RAISE NOTICE '   8️⃣  Hadith (100 pts)';
    RAISE NOTICE '';
    RAISE NOTICE '💯 Total maximum possible : 900 points par manche';
END $$;
