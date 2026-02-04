-- Script pour créer une manche de test avec rubriques
-- Date: 2026-02-04

BEGIN;

-- Créer la manche
INSERT INTO manches (nom, type, numero, date_manche, heure_debut, heure_fin, description, statut)
VALUES (
    'Phase Préliminaire - Jour 1',
    'preliminaire',
    1,
    '2026-02-20',
    '19:00',
    '21:00',
    'Manche 1 - Phase Préliminaire',
    'publie'
) RETURNING id, nom, type, numero, date_manche, statut;

-- Récupérer l'ID de la manche créée (dernière insertion)
DO $$
DECLARE
    manche_id_var INTEGER;
    rubrique_rec RECORD;
    ordre INTEGER := 1;
BEGIN
    -- Récupérer l'ID de la dernière manche créée
    SELECT id INTO manche_id_var FROM manches ORDER BY id DESC LIMIT 1;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Manche créée avec ID: %', manche_id_var;
    RAISE NOTICE '';
    RAISE NOTICE '📋 Association des rubriques...';
    
    -- Associer les 3 premières rubriques
    FOR rubrique_rec IN 
        SELECT id, nom FROM rubriques ORDER BY id LIMIT 3
    LOOP
        INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage, actif)
        VALUES (manche_id_var, rubrique_rec.id, ordre, true);
        
        RAISE NOTICE '  ✓ Rubrique "%" associée (ordre %)', rubrique_rec.nom, ordre;
        ordre := ordre + 1;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '✅ Manche de test créée avec succès !';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

COMMIT;

-- Vérifier le résultat
SELECT 
    m.id,
    m.nom,
    m.type,
    m.numero,
    m.date_manche,
    m.heure_debut,
    m.heure_fin,
    m.statut,
    COUNT(rm.id) as nb_rubriques
FROM manches m
LEFT JOIN rubriques_manche rm ON m.id = rm.manche_id
GROUP BY m.id
ORDER BY m.numero;
