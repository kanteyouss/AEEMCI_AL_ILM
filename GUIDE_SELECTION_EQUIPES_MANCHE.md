# 👥 Sélection d'Équipes par Manche - Guide d'Installation

## ✅ Ce qui a été implémenté

### 1. Base de données
- ✅ Création de la table `equipes_manche` pour lier équipes et manches
- ✅ Migration SQL prête : `database/migrations/003_add_equipes_manche.sql`
- ✅ Script Node.js pour exécuter la migration

### 2. Backend (Node.js + PostgreSQL)
- ✅ `mancheController.createManche()` : Enregistre les équipes sélectionnées
- ✅ `mancheController.updateManche()` : Met à jour les équipes d'une manche
- ✅ `mancheController.getAllManches()` : Retourne les équipes avec chaque manche
- ✅ `mancheController.getMancheById()` : Inclut les équipes de la manche
- ✅ Endpoint `GET /api/equipes` : Liste toutes les équipes formées (déjà existant)

### 3. Frontend (Dashboard Admin)
- ✅ Section de sélection d'équipes dans le modal de création/modification de manche
- ✅ Affichage en grille avec checkboxes
- ✅ Boutons "Toutes" / "Aucune" pour sélection rapide
- ✅ Indicateurs visuels (couleurs des équipes)
- ✅ Pré-sélection des équipes en mode édition
- ✅ Envoi des équipes sélectionnées lors de la création/modification

---

## 🚀 Installation et Test

### Étape 1 : Exécuter la migration de base de données

**Option A : Via psql (Recommandé)**
```bash
cd "/home/kant_dev/KANTDEV/PROJET PERSO/COUCOURALILM/alilm2026"
psql -h localhost -U postgres -d alilm2026 -f database/migrations/003_add_equipes_manche.sql
```

**Option B : Via le script Node.js**
```bash
cd backend
node scripts/runMigrationEquipesManche.js
```

**Vérification que la table existe :**
```bash
psql -h localhost -U postgres -d alilm2026 -c "\d equipes_manche"
```

Vous devriez voir :
```
Column      |  Type   | Modifiers
-------------+---------+-----------
id          | integer | primary key
manche_id   | integer | not null, foreign key
equipe_id   | integer | not null, foreign key
date_ajout  | timestamp | default now()
```

---

### Étape 2 : Redémarrer le serveur backend

```bash
cd "/home/kant_dev/KANTDEV/PROJET PERSO/COUCOURALILM/alilm2026/backend"
pkill -f "node.*server.js"
node server.js
```

Vous devriez voir :
```
✅ Serveur démarré sur le port 3000
📍 URL: http://localhost:3000
```

---

### Étape 3 : Tester la fonctionnalité

#### 3.1 Accéder au dashboard admin
```
http://localhost:3000/admin/dashboard.html#manches
```

#### 3.2 Créer une nouvelle manche
1. Cliquez sur un bouton **"Créer cette manche"**
2. Le modal s'ouvre avec :
   - 📅 **Section Date/Heure** (si mode édition)
   - 👥 **Section Équipes participantes** (NOUVEAU !)
   - 📚 **Section Rubriques**

#### 3.3 Sélectionner les équipes
- Cliquez sur **"✅ Toutes"** pour sélectionner toutes les équipes
- OU cliquez individuellement sur chaque équipe
- Les équipes sélectionnées ont une bordure bleue et fond bleu clair

#### 3.4 Valider et vérifier

**Dans la console du navigateur (F12) :**
```javascript
// Vérifier que les équipes sont envoyées
// Vous verrez :
👥 X équipe(s) sélectionnée(s): [1, 2, 3, ...]
📦 Données de la manche préparées: {
  nom: "...",
  type: "preliminaire",
  rubriques: [...],
  equipes: [1, 2, 3, ...]  ← NOUVEAU !
}
```

**Dans la base de données :**
```bash
psql -h localhost -U postgres -d alilm2026 -c "
SELECT m.id, m.nom, 
       COUNT(DISTINCT em.equipe_id) as nb_equipes,
       string_agg(e.nom, ', ') as equipes
FROM manches m
LEFT JOIN equipes_manche em ON m.id = em.manche_id
LEFT JOIN equipes e ON em.equipe_id = e.id
WHERE m.id = X  -- Remplacer X par l'ID de la manche créée
GROUP BY m.id, m.nom;
"
```

Résultat attendu :
```
 id |        nom         | nb_equipes |           equipes
----+--------------------+------------+-----------------------------
  X | Préliminaire - ... |     10     | AL-FURQAN, AL-IHSAN, ...
```

---

## 📊 Structure des données

### Requête API : GET /api/manches
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "Préliminaire - Jour 1",
      "type": "preliminaire",
      "numero": 1,
      "date_manche": "2026-02-20",
      "rubriques": [...],
      "equipes": [
        {
          "id": 1,
          "nom": "AL-FURQAN",
          "couleur": "#FF5733",
          "symbole": "🦅"
        },
        {
          "id": 2,
          "nom": "AL-IHSAN",
          "couleur": "#3498DB",
          "symbole": "🌟"
        }
      ]
    }
  ]
}
```

### Création de manche : POST /api/manches
```json
{
  "nom": "Préliminaire - Jour 1",
  "type": "preliminaire",
  "numero": 1,
  "date_manche": "2026-02-20",
  "heure_debut": "19:00",
  "heure_fin": "21:00",
  "description": "...",
  "rubriques": [1, 2, 3],
  "equipes": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  ← NOUVEAU !
}
```

---

## 🎯 Cas d'usage

### Phase Préliminaire (Manches 1-3)
- Toutes les 10 équipes participent
- Sélectionner "Toutes" lors de la création

### Quart de finale (Manches 4-6)
- Seulement les 8 meilleures équipes
- Sélectionner manuellement les 8 équipes qualifiées

### Demi-finale (Manches 7-8)
- Seulement 4 équipes
- Sélectionner manuellement les 4 équipes qualifiées

### Finale (Manche 9)
- Seulement 2 équipes
- Sélectionner les 2 finalistes

---

## 🔧 Dépannage

### Problème : La section équipes ne s'affiche pas
**Solution :**
```javascript
// Console navigateur (F12)
console.log(equipesDisponibles);  // Devrait afficher un array d'équipes
```

Si vide, vérifier :
1. Que des équipes sont formées dans `/admin/equipes.html`
2. Que l'API répond : `curl http://localhost:3000/api/equipes`

### Problème : Les équipes ne sont pas enregistrées
**Vérifier :**
```bash
# La table existe ?
psql -h localhost -U postgres -d alilm2026 -c "\dt equipes_manche"

# Des enregistrements existent ?
psql -h localhost -U postgres -d alilm2026 -c "SELECT COUNT(*) FROM equipes_manche;"
```

### Problème : Erreur SQL lors de la création
**Erreur typique :**
```
ERROR: relation "equipes_manche" does not exist
```

**Solution :** Exécuter la migration (Étape 1)

---

## 📝 Prochaines étapes

Une fois que la sélection d'équipes fonctionne :

### 1. Mise à jour de la page Résultats
Modifier `frontend/js/admin/resultats.js` pour :
- Afficher seulement les équipes sélectionnées pour chaque manche
- Calculer les classements par phase (préliminaire, quart, demi, finale)

### 2. Mise à jour de classementController
Créer des endpoints :
- `GET /api/classement/manche/:id` - Classement d'une manche spécifique
- `GET /api/classement/phase/:type` - Classement cumulé d'une phase

### 3. Publication des résultats par phase
- Publier après les 3 manches préliminaires
- Publier après les 3 manches de quart
- Publier après les 2 manches de demi
- Publier le classement final

---

## ✨ Améliorations futures

- [ ] Sélection automatique des équipes qualifiées selon le classement
- [ ] Validation : empêcher la création d'une manche sans équipe
- [ ] Affichage du nombre d'équipes sélectionnées dans le titre du modal
- [ ] Historique des équipes par manche dans une vue dédiée
- [ ] Export PDF avec liste des équipes par manche

---

**Créé le :** 5 février 2026  
**Auteur :** GitHub Copilot  
**Version :** 1.0
