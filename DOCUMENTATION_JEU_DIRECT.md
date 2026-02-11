# 🎮 Module Jeu en Direct - Guide d'Utilisation

## Vue d'ensemble

Le module Jeu en Direct permet de gérer le déroulement en temps réel des manches du concours AL ILM 2026. Il assure un contrôle strict de la progression par rubrique avec validation par le jury.

## Fonctionnalités principales

### ✅ Fonctionnalités implémentées

1. **Génération aléatoire de questions**
   - Sélection aléatoire par rubrique
   - Exclusion des questions déjà utilisées
   - Respect du nombre de questions par rubrique

2. **Chronomètre automatique**
   - Démarrage automatique à la génération
   - Durée configurable par rubrique (15-20 secondes)
   - Alerte visuelle quand <5 secondes restantes

3. **Validation par le jury**
   - Boutons Correct/Incorrect
   - Calcul automatique des points
   - Enregistrement dans la base de données

4. **Progression stricte par rubrique**
   - Affichage matriciel (équipes × rubriques)
   - Statut en temps réel : ⏳ En attente | 🔄 En cours | ✅ Terminé
   - Indication du nombre de questions répondues

5. **Consolidation automatique des scores**
   - Mise à jour instantanée après chaque réponse
   - Tables synchronisées : soumissions → evaluations → scores

## API Endpoints

### POST /api/jeu/demarrer
Démarre une session de jeu pour une manche.

**Body:**
```json
{
  "mancheId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session démarrée",
  "rubriques": [...],
  "equipes": [...]
}
```

---

### POST /api/jeu/generer-question
Génère une question aléatoire pour une équipe/rubrique.

**Body:**
```json
{
  "mancheId": 1,
  "rubriqueId": 2,
  "equipeId": 5
}
```

**Response:**
```json
{
  "id": 42,
  "question_texte": "Quelle est la capitale de la France?",
  "type": "qcm",
  "points": 25,
  "temps_par_question": 15,
  "options": "[\"Paris\", \"Lyon\", \"Marseille\", \"Toulouse\"]",
  "reponse_correcte": "A"
}
```

---

### POST /api/jeu/soumettre-reponse
Soumet la réponse d'un participant avec validation du jury.

**Body:**
```json
{
  "mancheId": 1,
  "rubriqueId": 2,
  "equipeId": 5,
  "participantId": 123,
  "questionId": 42,
  "estCorrecte": true,
  "tempsReponse": 8
}
```

**Response:**
```json
{
  "success": true,
  "message": "Réponse enregistrée",
  "pointsObtenus": 25,
  "scoreTotal": 75
}
```

---

### GET /api/jeu/questions-restantes
Récupère le nombre de questions restantes pour une équipe/rubrique.

**Query params:**
- `mancheId`: ID de la manche
- `rubriqueId`: ID de la rubrique
- `equipeId`: ID de l'équipe

**Response:**
```json
{
  "total": 4,
  "repondues": 2,
  "restantes": 2,
  "termine": false,
  "score": 50
}
```

---

### GET /api/jeu/etat/:manche_id
Récupère l'état de progression de toutes les équipes pour toutes les rubriques.

**Response:**
```json
[
  {
    "equipe_id": 1,
    "equipe_nom": "AL-FURQAN",
    "rubrique_id": 2,
    "rubrique_nom": "Culture générale",
    "questions_repondues": 2,
    "questions_total": 4,
    "score": 50
  },
  ...
]
```

---

### POST /api/jeu/terminer
Termine la session de jeu et met la manche en statut "terminé".

**Body:**
```json
{
  "mancheId": 1
}
```

## Workflow de jeu

### 1. Démarrage de session
```
Jury → Sélectionne Manche → POST /api/jeu/demarrer
→ Charge rubriques et équipes
→ Interface de jeu s'affiche
```

### 2. Génération de question
```
Jury → Sélectionne Rubrique + Équipe + Membre
→ Clique "Générer Question"
→ POST /api/jeu/generer-question
→ Question s'affiche
→ Chronomètre démarre (15-20s)
→ Membre répond oralement
```

### 3. Validation de réponse
```
Jury → Clique "Bonne Réponse" OU "Mauvaise Réponse"
→ POST /api/jeu/soumettre-reponse
→ Score calculé automatiquement
→ Tables mises à jour (transaction)
→ Progression actualisée
→ Passage à la question suivante
```

### 4. Progression stricte
```
✅ Règle : TOUTES les équipes doivent terminer Rubrique N 
   AVANT de passer à Rubrique N+1

Exemple:
- Rubrique 1 (Culture générale) : 4 questions
  * Équipe A: 4/4 ✅
  * Équipe B: 4/4 ✅
  * Équipe C: 3/4 🔄 → BLOQUE le passage à Rubrique 2
  * ...
  * Équipe J: 4/4 ✅
  
→ Une fois toutes terminées → Rubrique 2 accessible
```

## Structure de la base de données

### Table `soumissions`
Enregistre chaque réponse donnée.
```sql
CREATE TABLE soumissions (
    id SERIAL PRIMARY KEY,
    participant_id INT REFERENCES participants(id),
    question_id INT REFERENCES questions(id),
    reponse_donnee TEXT,
    est_correcte BOOLEAN,
    temps_reponse INT,
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `evaluations`
Évaluations par le jury avec score.
```sql
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    soumission_id INT REFERENCES soumissions(id),
    evaluateur_id INT REFERENCES utilisateurs(id),
    points_obtenus INT,
    commentaire TEXT,
    date_evaluation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `scores`
Consolidation des scores par équipe/manche/rubrique.
```sql
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    equipe_id INT REFERENCES equipes(id),
    manche_id INT REFERENCES manches(id),
    rubrique_id INT REFERENCES rubriques(id),
    points_obtenus INT DEFAULT 0,
    UNIQUE(equipe_id, manche_id, rubrique_id)
);
```

## Calculs de points

### Par rubrique:

| Rubrique | Questions | Points/question | Total max |
|----------|-----------|-----------------|-----------|
| Culture générale | 4 | 25 | 100 |
| Vie du Prophète | 2 | 15 | 30 |
| Jurisprudence | 2 | 25 | 50 |
| Hadith | 1 | 50 | 50 |

### Logique de calcul:
```javascript
if (estCorrecte) {
    pointsObtenus = question.points;
} else {
    pointsObtenus = 0;
}

// Mise à jour du score total
UPDATE scores 
SET points_obtenus = points_obtenus + pointsObtenus
WHERE equipe_id = X AND manche_id = Y AND rubrique_id = Z;
```

## Sécurité

- ✅ Toutes les routes protégées par JWT (middleware `verifyJWT`)
- ✅ Transactions PostgreSQL pour garantir l'intégrité des données
- ✅ Validation des IDs (manche, rubrique, équipe, participant)
- ✅ Empêche les questions dupliquées via flag `utilise = true`

## Tests manuels

### 1. Test de génération
```bash
curl -X POST http://localhost:3000/api/jeu/generer-question \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"mancheId":1,"rubriqueId":2,"equipeId":1}'
```

### 2. Test de soumission
```bash
curl -X POST http://localhost:3000/api/jeu/soumettre-reponse \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"mancheId":1,"rubriqueId":2,"equipeId":1,"participantId":5,"questionId":10,"estCorrecte":true,"tempsReponse":12}'
```

### 3. Test de progression
```bash
curl http://localhost:3000/api/jeu/etat/1 \
  -H "Authorization: Bearer <TOKEN>"
```

## Prochaines améliorations possibles

- [ ] Système de pause/reprise de session
- [ ] Export des résultats en temps réel (PDF/Excel)
- [ ] Mode spectateur pour affichage public
- [ ] Statistiques avancées (temps moyen de réponse, taux de réussite)
- [ ] Notifications sonores (bon/mauvais)
- [ ] Replay des sessions passées
- [ ] Mode "Question Bonus" avec multiplicateur de points

---

**Développé pour AL ILM 2026 - AEEMCI Section ESATIC**  
*Que la lumière de la connaissance vous guide! 🌙*
