# 🚨 CORRECTION URGENTE - Table equipes_manche manquante

## Problème
```
error: relation "equipes_manche" does not exist
```

## Solution Immédiate

### Option 1 : Via psql (RECOMMANDÉ)
```bash
psql -h localhost -U postgres -d alilm2026
```

Puis copier-coller :
```sql
CREATE TABLE IF NOT EXISTS equipes_manche (
    id SERIAL PRIMARY KEY,
    manche_id INTEGER NOT NULL REFERENCES manches(id) ON DELETE CASCADE,
    equipe_id INTEGER NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(manche_id, equipe_id)
);

CREATE INDEX IF NOT EXISTS idx_equipes_manche_manche ON equipes_manche(manche_id);
CREATE INDEX IF NOT EXISTS idx_equipes_manche_equipe ON equipes_manche(equipe_id);

-- Vérifier
\d equipes_manche
SELECT COUNT(*) FROM equipes_manche;
```

### Option 2 : Via fichier SQL
```bash
cd "/home/kant_dev/KANTDEV/PROJET PERSO/COUCOURALILM/alilm2026"
psql -h localhost -U postgres -d alilm2026 -f database/migrations/003_add_equipes_manche.sql
```

### Option 3 : Via Node.js
```bash
cd "/home/kant_dev/KANTDEV/PROJET PERSO/COUCOURALILM/alilm2026/backend"
node create-table-standalone.js
```

## Vérification
```bash
psql -h localhost -U postgres -d alilm2026 -c "SELECT COUNT(*) FROM equipes_manche;"
```

Vous devriez voir : `count = 0`

## Redémarrer le serveur
```bash
cd "/home/kant_dev/KANTDEV/PROJET PERSO/COUCOURALILM/alilm2026/backend"
pkill -f "node.*server.js"
node server.js
```

## Test
```bash
curl http://localhost:3000/api/manches
```

Devrait retourner les manches avec le champ `equipes: []`
