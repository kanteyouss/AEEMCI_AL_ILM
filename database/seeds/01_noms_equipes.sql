-- ============================================
-- SEED : 9 NOMS D'ÉQUIPES OFFICIELS
-- JEU CONCOURS AL ILM 2026
-- ============================================

INSERT INTO equipes (nom, signification, couleur, symbole, code_acces) VALUES
(
    'AL-FURQAN',
    'Le discernement (Coran - Sourate 25). Symbole de la capacité à distinguer le vrai du faux.',
    '#FF5733',
    '⚖️',
    'FURQAN2026'
),
(
    'AS-SABIQUN',
    'Les devanciers. Ceux qui se précipitent vers le bien et l''obéissance à Allah.',
    '#3498DB',
    '🏃',
    'SABIQUN2026'
),
(
    'AL-MUJAHIDUN',
    'Les combattants. Ceux qui fournissent des efforts dans le chemin d''Allah.',
    '#28A745',
    '⚔️',
    'MUJAHIDUN2026'
),
(
    'AN-NUR',
    'La lumière (Sourate 24). Symbole de la guidance et de la connaissance.',
    '#FFD700',
    '💡',
    'NUR2026'
),
(
    'AL-HUDA',
    'La guidance. Le droit chemin éclairé par la révélation divine.',
    '#9B59B6',
    '🧭',
    'HUDA2026'
),
(
    'AL-BADR',
    'La pleine lune. Référence à la bataille de Badr, victoire décisive de l''Islam.',
    '#E74C3C',
    '🌕',
    'BADR2026'
),
(
    'AL-FIRDAWS',
    'Le paradis le plus élevé. L''objectif ultime du croyant.',
    '#1ABC9C',
    '🌴',
    'FIRDAWS2026'
),
(
    'AL-MUFLIHUN',
    'Les bienheureux. Ceux qui réussissent dans cette vie et dans l''au-delà.',
    '#F39C12',
    '🎯',
    'MUFLIHUN2026'
),
(
    'AS-SADIQUN',
    'Les véridiques. Ceux qui sont sincères dans leur foi et leurs actes.',
    '#34495E',
    '🤝',
    'SADIQUN2026'
),
(
    'AL-IMAN',
    'La foi. Fondement de toute pratique religieuse et source de force spirituelle.',
    '#8E44AD',
    '🕋',
    'IMAN2026'
);

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ 10 équipes officielles créées avec succès !';
    RAISE NOTICE '';
    RAISE NOTICE '🕌 Les 10 équipes AL ILM 2026 :';
    RAISE NOTICE '   1️⃣  AL-FURQAN (Le discernement)';
    RAISE NOTICE '   2️⃣  AS-SABIQUN (Les devanciers)';
    RAISE NOTICE '   3️⃣  AL-MUJAHIDUN (Les combattants)';
    RAISE NOTICE '   4️⃣  AN-NUR (La lumière)';
    RAISE NOTICE '   5️⃣  AL-HUDA (La guidance)';
    RAISE NOTICE '   6️⃣  AL-BADR (La pleine lune)';
    RAISE NOTICE '   7️⃣  AL-FIRDAWS (Le paradis)';
    RAISE NOTICE '   8️⃣  AL-MUFLIHUN (Les bienheureux)';
    RAISE NOTICE '   9️⃣  AS-SADIQUN (Les véridiques)';
    RAISE NOTICE '   🔟 AL-IMAN (La foi)';
END $$;
