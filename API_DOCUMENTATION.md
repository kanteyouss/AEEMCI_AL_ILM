# 🕌 API Documentation - AL ILM 2026

## URL de base

```
http://localhost:3000/api
```

## Authentification

Toutes les routes (sauf `/auth/login`, `/auth/login-equipe` et `/participants` POST) nécessitent un token JWT.

**Format du header :**

```
Authorization: Bearer <votre_token_jwt>
```

---

## Routes d'authentification

### POST `/auth/login`

Connexion Admin ou Juré

**Body :**

```json
{
  "email": "admin@alilm.ci",
  "password": "Admin2026!"
}
```

**Réponse :**

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nom": "Admin",
      "prenom": "AL ILM",
      "email": "admin@alilm.ci",
      "role": "admin"
    }
  }
}
```

### POST `/auth/login-equipe`

Connexion Équipe (avec code d'accès)

**Body :**

```json
{
  "code_acces": "FURQAN2026"
}
```

**Réponse :**

```json
{
  "success": true,
  "message": "Connexion équipe réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "equipe": {
      "id": 1,
      "nom": "AL-FURQAN",
      "couleur": "#FF5733",
      "symbole": "⚖️"
    }
  }
}
```

### POST `/auth/logout`

Déconnexion (suppression de session)

**Headers :** `Authorization: Bearer <token>`

**Réponse :**

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## Routes Participants

### GET `/participants`

Récupérer tous les participants (Admin uniquement)

**Headers :** `Authorization: Bearer <token>`

**Query params (optionnels) :**

- `etablissement` : `ESATIC` ou `EMSP`
- `disponibilite` : `true` ou `false`

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "KOUAME",
      "prenom": "Jean",
      "email": "jean@example.com",
      "telephone": "0701020304",
      "etablissement": "ESATIC",
      "niveau_coranique": "lis_aisement",
      "disponibilite": true
    }
  ],
  "count": 1
}
```

### POST `/participants`

Créer un nouveau participant (inscription publique)

**Body :**

```json
{
  "nom": "KOUAME",
  "prenom": "Jean",
  "email": "jean@example.com",
  "telephone": "0701020304",
  "etablissement": "ESATIC",
  "niveau_coranique": "lis_aisement",
  "connaissance_hadiths": "oui",
  "memorisation_sourate": "oui"
}
```

### POST `/participants/import-csv`

Importer des participants depuis CSV (Admin uniquement)

**Headers :**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (form-data) :**

- `csvFile` : Fichier CSV

---

## Routes Équipes

### GET `/equipes`

Récupérer toutes les équipes

**Headers :** `Authorization: Bearer <token>`

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "AL-FURQAN",
      "signification": "Le discernement",
      "couleur": "#FF5733",
      "symbole": "⚖️",
      "code_acces": "FURQAN2026",
      "nb_membres": 5
    }
  ],
  "count": 9
}
```

### GET `/equipes/:id`

Récupérer une équipe avec ses membres

**Headers :** `Authorization: Bearer <token>`

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nom": "AL-FURQAN",
    "couleur": "#FF5733",
    "membres": [
      {
        "id": 1,
        "nom": "KOUAME",
        "prenom": "Jean",
        "est_capitaine": true,
        "role_adhan": true,
        "role_coran_ouvert": false
      }
    ]
  }
}
```

### POST `/equipes/:id/membres`

Ajouter un membre à une équipe (Admin uniquement)

**Body :**

```json
{
  "participant_id": 5,
  "est_capitaine": false
}
```

### PUT `/equipes/:id/capitaine`

Définir le capitaine (Admin uniquement)

**Body :**

```json
{
  "participant_id": 5
}
```

### PUT `/equipes/:id/membres/:participantId/roles`

Définir les rôles d'un membre

**Body :**

```json
{
  "role_adhan": true,
  "role_coran_ouvert": false,
  "role_coran_ferme": true,
  "role_hadith": false
}
```

---

## Routes Manches

### GET `/manches`

Récupérer toutes les manches

**Query params (optionnels) :**

- `type` : `preliminaire`, `quart`, `demi`, `finale`
- `statut` : `brouillon`, `publie`, `en_cours`, `termine`

### POST `/manches`

Créer une manche (Admin uniquement)

**Body :**

```json
{
  "nom": "Préliminaires - Groupe A",
  "type": "preliminaire",
  "date_manche": "2026-03-15",
  "heure_debut": "14:00",
  "heure_fin": "18:00",
  "description": "Première phase du concours"
}
```

---

## Routes Classement

### GET `/classement/general`

Récupérer le classement général

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "equipe": "AL-FURQAN",
      "couleur": "#FF5733",
      "symbole": "⚖️",
      "points_totaux": 850,
      "nb_manches_jouees": 3,
      "rang": 1
    }
  ]
}
```

### GET `/classement/manche/:mancheId`

Classement pour une manche spécifique

### GET `/classement/equipe/:equipeId`

Scores détaillés d'une équipe

---

## Routes Upload

### POST `/upload/audio`

Upload d'un fichier audio (Adhan, Coran, Hadith)

**Headers :**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (form-data) :**

- `audioFile` : Fichier audio (.mp3, .wav, .ogg, .m4a)
- `type` : `adhan`, `coran`, ou `hadith`
- `equipeId` : ID de l'équipe
- `rubriqueId` : ID de la rubrique

**Réponse :**

```json
{
  "success": true,
  "message": "Fichier uploadé avec succès",
  "data": {
    "filename": "equipe1_rubrique2_1678901234567.mp3",
    "url": "/uploads/coran/equipe1_rubrique2_1678901234567.mp3",
    "size": 2458624
  }
}
```

---

## Codes d'erreur

| Code | Signification               |
| ---- | --------------------------- |
| 200  | Succès                      |
| 201  | Créé avec succès            |
| 400  | Requête invalide            |
| 401  | Non authentifié             |
| 403  | Accès refusé                |
| 404  | Ressource non trouvée       |
| 409  | Conflit (doublon)           |
| 500  | Erreur serveur              |

---

## Exemples d'utilisation avec cURL

### Connexion et récupération de token

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alilm.ci","password":"Admin2026!"}' \
  | jq -r '.data.token')

echo $TOKEN
```

### Récupérer toutes les équipes

```bash
curl -X GET http://localhost:3000/api/equipes \
  -H "Authorization: Bearer $TOKEN"
```

### Créer un participant

```bash
curl -X POST http://localhost:3000/api/participants \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "DIALLO",
    "prenom": "Fatou",
    "email": "fatou@example.com",
    "telephone": "0705060708",
    "etablissement": "EMSP"
  }'
```

---

## Postman Collection

Une collection Postman complète avec tous les endpoints est disponible dans `backend/docs/postman_collection.json`.

---

📧 Support : aeemci.esatic@gmail.com
🕌 AEEMCI - Section ESATIC
