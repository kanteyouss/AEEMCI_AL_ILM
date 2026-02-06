-- ============================================
-- MIGRATION : MISE À JOUR BARÈME OFFICIEL
-- Date : 4 février 2026
-- ============================================

-- Supprimer les anciennes rubriques
TRUNCATE TABLE rubriques CASCADE;

-- Réinitialiser la séquence
ALTER SEQUENCE rubriques_id_seq RESTART WITH 1;

-- Insérer les nouvelles rubriques avec le barème officiel
INSERT INTO rubriques (nom, type, points_max, temps_par_question, description, criteres_evaluation) VALUES
(
    'Adhan',
    'recitation',
    10,
    180,
    'Récitation de l''Adhan (normal ou Fajr). 1 participant par équipe. 3 min max pour l''exécution. 1 question = 10 pts.',
    '{"voix": 3, "prononciation": 7}'::jsonb
),
(
    'Coran ouvert',
    'recitation',
    15,
    NULL,
    'Lecture d''une partie imposée du Juz Amma (sourates 78 à 114). Voix: 5 pts, Prononciation: 10 pts. 1 question = 15 pts.',
    '{"voix": 5, "prononciation": 10}'::jsonb
),
(
    'Coran fermé',
    'recitation',
    15,
    NULL,
    'Récitation de mémoire (sourates 87 à 114). Voix: 5 pts, Prononciation: 10 pts. 1 question = 15 pts.',
    '{"voix": 5, "prononciation": 10}'::jsonb
),
(
    'Questions sur le Coran',
    'questions_ecrites',
    10,
    15,
    '2 questions sur le Coran. 1 question = 5 pts. 15 sec par question.',
    '{"exactitude": 5}'::jsonb
),
(
    'Vie du Prophète',
    'questions_ecrites',
    30,
    15,
    '2 questions sur le Prophète (ﷺ) et Compagnons. 1 question = 15 pts. 15 sec par question.',
    '{"exactitude": 15}'::jsonb
),
(
    'Jurisprudence',
    'questions_ecrites',
    50,
    15,
    '2 questions sur le Fiqh. 1 question = 25 pts. 15 sec par question.',
    '{"exactitude": 25}'::jsonb
),
(
    'Culture générale',
    'questions_ecrites',
    100,
    15,
    '4 questions sur la culture islamique. 1 question = 25 pts. 15 sec par question.',
    '{"exactitude": 25}'::jsonb
),
(
    'Hadith',
    'hadith',
    20,
    20,
    'Récitation de Hadith. 1 question = 20 pts. 20 sec par question.',
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

-- Afficher le résultat
SELECT 
    id,
    nom,
    type,
    points_max || ' pts' as points,
    COALESCE(temps_par_question || ' sec', 'N/A') as temps,
    description
FROM rubriques
ORDER BY id;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Rubriques mises à jour avec le barème officiel !';
    RAISE NOTICE '💯 Total : 280 points maximum par manche (Adhan 10 + Coran ouvert 15 + Coran fermé 15 + Questions Coran 10 + Vie Prophète 30 + Jurisprudence 50 + Culture générale 100 + Hadith 20 + Questions relais 40)';
END $$;
