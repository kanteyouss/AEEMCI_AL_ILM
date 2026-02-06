-- Migration: Permettre les notes décimales dans evaluations et scores
-- Date: 2026-02-05
-- Description: Changer INTEGER en NUMERIC(5,2) pour supporter les demi-points

-- 1. Supprimer temporairement les vues
DROP VIEW IF EXISTS classement_general;
DROP VIEW IF EXISTS stats_rubriques;

-- 2. Modifier evaluations pour accepter les décimales
ALTER TABLE evaluations 
ALTER COLUMN note_totale TYPE NUMERIC(5,2);

ALTER TABLE evaluations 
ALTER COLUMN note_voix TYPE NUMERIC(5,2);

ALTER TABLE evaluations 
ALTER COLUMN note_tajwid TYPE NUMERIC(5,2);

ALTER TABLE evaluations 
ALTER COLUMN note_prononciation TYPE NUMERIC(5,2);

-- 3. Modifier scores pour accepter les décimales
ALTER TABLE scores 
ALTER COLUMN points_obtenus TYPE NUMERIC(6,2);

ALTER TABLE scores 
ALTER COLUMN points_max TYPE NUMERIC(6,2);

-- 4. Recréer la vue stats_rubriques
CREATE VIEW stats_rubriques AS
SELECT 
    r.id,
    r.nom AS rubrique,
    COUNT(DISTINCT s.equipe_id) AS nb_equipes_participantes,
    AVG(s.points_obtenus) AS moyenne_points,
    MAX(s.points_obtenus) AS meilleur_score,
    MIN(s.points_obtenus) AS score_min
FROM rubriques r
LEFT JOIN scores s ON r.id = s.rubrique_id
GROUP BY r.id, r.nom;

-- 5. Recréer la vue classement_general
CREATE VIEW classement_general AS
SELECT 
    e.id,
    e.nom AS equipe,
    e.couleur,
    e.symbole,
    COALESCE(SUM(s.points_obtenus), 0) AS points_totaux,
    COUNT(DISTINCT s.manche_id) AS nb_manches_jouees,
    RANK() OVER (ORDER BY COALESCE(SUM(s.points_obtenus), 0) DESC) AS rang
FROM equipes e
LEFT JOIN scores s ON e.id = s.equipe_id
GROUP BY e.id, e.nom, e.couleur, e.symbole
ORDER BY COALESCE(SUM(s.points_obtenus), 0) DESC;

-- Commentaires
COMMENT ON COLUMN evaluations.note_totale IS 'Score total (supporte les demi-points 0.5)';
COMMENT ON COLUMN scores.points_obtenus IS 'Points obtenus (supporte les décimales)';
