-- ============================================
-- SEED : 8 RUBRIQUES OFFICIELLES
-- JEU CONCOURS AL ILM 2026
-- BARÈME OFFICIEL
-- ============================================

INSERT INTO rubriques (nom, type, points_max, temps_par_question, description, criteres_evaluation) VALUES
(
    'Adhan',
    'recitation',
    10,
    180,
    'Récitation de l''Adhan avec Tajwid. 1 participant par équipe. 3 min max pour l''exécution.',
    '{"voix": 3, "prononciation": 7}'::jsonb
),
(
    'Coran ouvert',
    'recitation',
    15,
    NULL,
    'Lecture d''une partie imposée (Juz Amma). Voix: 5 pts, Prononciation: 10 pts.',
    '{"voix": 5, "prononciation": 10}'::jsonb
),
(
    'Coran fermé',
    'recitation',
    15,
    NULL,
    'Lecture sans consultation (Sabi). Voix: 5 pts, Prononciation: 10 pts.',
    '{"voix": 5, "prononciation": 10}'::jsonb
),
(
    'Vie du Prophète',
    'questions_ecrites',
    30,
    15,
    '2 questions sur le Prophète (ﷺ) et Compagnons. 15 pts par bonne réponse. 15 sec par question.',
    '{"exactitude": 30}'::jsonb
),
(
    'Jurisprudence',
    'questions_ecrites',
    50,
    15,
    '2 questions. 25 pts par bonne réponse. 15 sec par question.',
    '{"exactitude": 50}'::jsonb
),
(
    'Culture générale',
    'questions_ecrites',
    100,
    15,
    '4 questions. 25 pts par bonne réponse. 15 sec par question.',
    '{"exactitude": 100}'::jsonb
),
(
    'Hadith',
    'hadith',
    20,
    20,
    '1 question. 20 pts par bonne réponse. 20 sec par question.',
    '{"exactitude": 20}'::jsonb
),
(
    'Questions relais',
    'relais',
    40,
    15,
    'Relais avec 4 participants max (1 question par personne). Bonne réponse = 10 pts + passage au suivant. Mauvaise réponse = 0 pt + fin du relais. 15 sec par question.',
    '{"exactitude": 10}'::jsonb
);

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ 9 rubriques officielles créées avec succès !';
    RAISE NOTICE '';
    RAISE NOTICE '📖 Les 9 rubriques AL ILM 2026 (Barème officiel) :';
    RAISE NOTICE '   1️⃣  Adhan (10 pts - 3 min)';
    RAISE NOTICE '   2️⃣  Coran ouvert (15 pts - N/A)';
    RAISE NOTICE '   3️⃣  Coran fermé (15 pts - N/A)';
    RAISE NOTICE '   4️⃣  Vie du Prophète (30 pts - 2x 15 sec)';
    RAISE NOTICE '   5️⃣  Jurisprudence (50 pts - 2x 15 sec)';
    RAISE NOTICE '   6️⃣  Culture générale (100 pts - 4x 15 sec)';
    RAISE NOTICE '   7️⃣  Hadith (20 pts - 1x 20 sec)';
    RAISE NOTICE '   8️⃣  Questions relais (40 pts max - 4 participants - 10 pts/question - arrêt si erreur)';
    RAISE NOTICE '';
    RAISE NOTICE '💯 Total maximum possible : 280 points par manche';
    RAISE NOTICE '   (10 + 15 + 15 + 30 + 50 + 100 + 20 + 40 = 280)';
END $$;
