-- Ajouter la colonne mode_affichage à la table rubriques
ALTER TABLE rubriques ADD COLUMN IF NOT EXISTS mode_affichage VARCHAR(20) DEFAULT 'individuel';

-- Mettre à jour les rubriques 'Vie du Prophète' et 'Jurisprudence' pour être en mode collectif
UPDATE rubriques 
SET mode_affichage = 'collectif' 
WHERE nom IN ('Vie du Prophète', 'Jurisprudence');

-- Vérifier les changements
SELECT id, nom, type, mode_affichage FROM rubriques ORDER BY id;
