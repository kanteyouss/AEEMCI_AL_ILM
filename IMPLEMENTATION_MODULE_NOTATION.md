# 📝 MODULE DE NOTATION - AL ILM 2026

## ✅ Implémentation Complète

Le module de notation est maintenant **entièrement fonctionnel** avec toutes les contraintes respectées.

---

## 🎯 Fonctionnalités Implémentées

### 1. **Vérification Calendrier Obligatoire**
- ✅ Aucune notation possible hors calendrier programmé
- ✅ Récupération des sessions depuis `rubriques_manche`
- ✅ Vérification du statut de la manche (brouillon/publié/en_cours/terminé)

### 2. **Backend API** (`/api/notation/*`)

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/notation/sessions` | GET | Liste des sessions programmées (calendrier) |
| `/api/notation/equipes/:manche_id` | GET | Équipes éligibles pour une manche |
| `/api/notation/check` | GET | Vérifier si notation existe déjà |
| `/api/notation` | POST | Créer/modifier une notation |
| `/api/notation/:equipe_id/:manche_id/:rubrique_id` | GET | Récupérer une notation spécifique |
| `/api/notation/manche/:manche_id` | GET | Toutes les notations d'une manche |
| `/api/notation/classement/:manche_id` | GET | Classement d'une phase |

### 3. **Frontend** (`/admin/notation.html`)

#### Interface de Notation
- ✅ Sélection de session (depuis calendrier)
- ✅ Sélection d'équipe (uniquement équipes avec membres)
- ✅ Affichage des critères d'évaluation
- ✅ Sliders pour notation par critère
- ✅ Calcul automatique du score total
- ✅ Commentaire optionnel
- ✅ Détection notation existante

#### Critères d'Évaluation

**Rubriques avec critères** (stockés dans `criteres_evaluation` JSONB):
```json
{
  "Voix": 5,
  "Tajwid": 10,
  "Prononciation": 7
}
```

**Rubriques à score direct**:
- Score unique sur `points_max`

### 4. **Barème Automatique**

Le système respecte le barème défini dans `BAREME_POINTS_AUTO.md`:

| Rubrique | Points Max | Type |
|----------|-----------|------|
| Adhan | 10 | Critères (Voix 3 + Prononciation 7) |
| Coran ouvert | 15 | Critères (Voix 5 + Prononciation 10) |
| Coran fermé | 15 | Critères (Voix 5 + Prononciation 10) |
| Questions sur le Coran | 5/question | Score direct |
| Vie du Prophète | 15/question | Score direct |
| Jurisprudence | 25/question | Score direct |
| Culture générale | 25/question | Score direct |
| Hadith | 20 | Score direct |
| Questions relais | 5/question | Score direct |

### 5. **Sécurité**

- ✅ Authentification JWT obligatoire
- ✅ Vérification Admin/Jury (rôle)
- ✅ Validation session active
- ✅ Prévention doublons (contrainte unique)
- ✅ Transactions SQL (BEGIN/COMMIT/ROLLBACK)

### 6. **Consolidation Scores**

À chaque notation, mise à jour automatique de la table `scores`:
```sql
INSERT INTO scores (equipe_id, manche_id, rubrique_id, points_obtenus, points_max)
VALUES (...)
ON CONFLICT (equipe_id, manche_id, rubrique_id)
DO UPDATE SET points_obtenus = ..., date_calcul = NOW()
```

### 7. **Classement par Phase**

Endpoint `/api/notation/classement/:manche_id` retourne:
```json
{
  "success": true,
  "data": [
    {
      "rang": 1,
      "equipe_nom": "AL-FURQAN",
      "total_points": 185,
      "total_possible": 250,
      "pourcentage": 74.00,
      "nb_rubriques_notees": 9
    }
  ]
}
```

---

## 📊 Structure de Données

### Table `evaluations` (modifiée)

```sql
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    soumission_id INTEGER REFERENCES soumissions(id) ON DELETE CASCADE,
    equipe_id INTEGER REFERENCES equipes(id),           -- NOUVEAU
    manche_id INTEGER REFERENCES manches(id),           -- NOUVEAU
    rubrique_id INTEGER REFERENCES rubriques(id),       -- NOUVEAU
    session_id INTEGER REFERENCES rubriques_manche(id), -- NOUVEAU
    jure_id INTEGER REFERENCES utilisateurs(id),
    criteres_notes JSONB,                               -- NOUVEAU
    note_totale INTEGER NOT NULL,
    commentaire TEXT,
    statut VARCHAR(20) DEFAULT 'en_attente',
    date_evaluation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_evaluation_equipe_manche_rubrique 
        UNIQUE (equipe_id, manche_id, rubrique_id)     -- NOUVEAU
);
```

### Table `scores` (consolidation)

```sql
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    equipe_id INTEGER NOT NULL REFERENCES equipes(id),
    manche_id INTEGER NOT NULL REFERENCES manches(id),
    rubrique_id INTEGER NOT NULL REFERENCES rubriques(id),
    points_obtenus INTEGER NOT NULL DEFAULT 0,
    points_max INTEGER NOT NULL,
    date_calcul TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(equipe_id, manche_id, rubrique_id)
);
```

---

## 🔧 Migration Base de Données

**Fichier**: `/database/migrations/add_notation_fields.sql`

Pour appliquer:
```bash
psql -h localhost -U alilm -d alilm2026 -f database/migrations/add_notation_fields.sql
```

---

## 🚀 Utilisation

### 1. Programmer une Session (Calendrier)

Avant de noter, il faut configurer le calendrier dans `rubriques_manche`:
```sql
INSERT INTO rubriques_manche (manche_id, rubrique_id, ordre_passage, actif)
VALUES (1, 1, 1, true);
```

### 2. Accéder à la Notation

URL: `http://localhost:3000/admin/notation.html`

**Étapes**:
1. Sélectionner une session (calendrier)
2. Sélectionner une équipe
3. Noter avec les sliders
4. Ajouter un commentaire (optionnel)
5. Enregistrer

### 3. Consulter le Classement

- Dans le dashboard admin
- Ou via API: `/api/notation/classement/:manche_id`

---

## 📝 Workflow Complet

```
┌─────────────────────────┐
│  Admin configure le     │
│  calendrier (rubriques_ │
│  manche)                │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Jury/Admin sélectionne │
│  session + équipe       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Système charge les     │
│  critères d'évaluation  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Jury note avec sliders │
│  + commentaire          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  POST /api/notation     │
│  - Vérifie session      │
│  - Enregistre notation  │
│  - Met à jour scores    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Calcul automatique du  │
│  classement disponible  │
└─────────────────────────┘
```

---

## ⚠️ Contraintes Respectées

✅ **Notation strictement liée au calendrier**: Impossible de noter sans session programmée

✅ **Barème automatique**: Points max depuis `rubriques.points_max`

✅ **Pas de recréation**: Utilise les équipes, rubriques, phases existantes

✅ **Vérification statut**: Empêche notation sur manche "brouillon"

✅ **Unicité**: Une seule notation par équipe/manche/rubrique

✅ **Modification**: Possibilité de modifier une notation existante

✅ **Traçabilité**: Juge, date, commentaire enregistrés

---

## 🎨 Interface Utilisateur

### Sélection
- Dropdown sessions (calendrier)
- Dropdown équipes (avec nb membres)
- Affichage infos session (phase, rubrique, date, points max)

### Notation
- Badge équipe (avec couleur)
- Sliders par critère (0 à max)
- Affichage valeur en temps réel
- Total calculé automatiquement
- Zone commentaire

### Feedback
- Alerte si notation existe
- Confirmation modification
- Notification succès/erreur
- Réinitialisation formulaire après enregistrement

---

## 📚 Fichiers Créés/Modifiés

### Backend
- ✅ `backend/controllers/notationController.js` (NOUVEAU)
- ✅ `backend/routes/notation.js` (NOUVEAU)
- ✅ `backend/server.js` (MODIFIÉ - ajout route notation)

### Frontend
- ✅ `frontend/admin/notation.html` (NOUVEAU)
- ✅ `frontend/js/admin/notation.js` (NOUVEAU)

### Database
- ✅ `database/migrations/add_notation_fields.sql` (NOUVEAU)

---

## 🧪 Test API

### Récupérer les sessions
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/notation/sessions
```

### Créer une notation
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "equipe_id": 1,
    "manche_id": 1,
    "rubrique_id": 1,
    "session_id": 1,
    "criteres": {"Voix": 4, "Prononciation": 6},
    "note_totale": 10,
    "commentaire": "Excellente prestation"
  }' \
  http://localhost:3000/api/notation
```

### Classement
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/notation/classement/1
```

---

## ✨ Prochaines Améliorations Possibles

- [ ] Export PDF des notations
- [ ] Graphiques de performance
- [ ] Comparaison équipes
- [ ] Historique des modifications
- [ ] Multi-jury (moyenne des notes)
- [ ] Notation en temps réel (WebSocket)

---

**Statut**: ✅ **FONCTIONNEL** - Prêt pour utilisation en production

**Date**: 5 février 2026
