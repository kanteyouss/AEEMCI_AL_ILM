# 🚀 GUIDE DE DÉMARRAGE RAPIDE - AL ILM 2026

## 📋 PRÉREQUIS

Avant de commencer, assurez-vous d'avoir installé :

- ✅ **Node.js** version 18 ou supérieure
  ```bash
  node --version  # Doit afficher v18.x.x ou plus
  ```

- ✅ **PostgreSQL** version 14 ou supérieure
  ```bash
  psql --version  # Doit afficher 14.x ou plus
  ```

- ✅ **npm** (installé avec Node.js)
  ```bash
  npm --version
  ```

---

## ⚡ DÉMARRAGE RAPIDE (3 COMMANDES)

Si vous avez déjà PostgreSQL configuré et le fichier `.env` prêt :

```bash
# 1. Installer les dépendances
cd backend && npm install

# 2. Initialiser la base de données
npm run init-db

# 3. Démarrer le serveur
npm run dev
```

**✅ Le serveur démarre sur : http://localhost:3000**

Le frontend est automatiquement servi par le backend ! Ouvrez simplement votre navigateur.

---

## 🎯 CONFIGURATION COMPLÈTE (PREMIÈRE FOIS)

### ÉTAPE 1 : Installer PostgreSQL (si pas déjà installé)

#### Sur Ubuntu/Debian :
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Sur macOS :
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Vérifier que PostgreSQL fonctionne :
```bash
sudo systemctl status postgresql
# ou
brew services list
```

---

### ÉTAPE 2 : Configurer PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le terminal PostgreSQL, créer un utilisateur et une base de données
CREATE USER alilm WITH PASSWORD 'votreMotDePasse2026';
CREATE DATABASE alilm2026 OWNER alilm;
GRANT ALL PRIVILEGES ON DATABASE alilm2026 TO alilm;

# Quitter PostgreSQL
\q
```

**💡 Note :** Retenez le mot de passe que vous avez choisi !

---

### ÉTAPE 3 : Configurer le fichier .env

```bash
# Aller dans le dossier backend
cd /home/kant_dev/KANTDEV/PROJET\ PERSO/COUCOURALILM/alilm2026/backend

# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Remplacez les valeurs suivantes dans le fichier .env :**

```env
# ============================================
# BASE DE DONNÉES PostgreSQL
# ============================================
DB_USER=alilm
DB_HOST=localhost
DB_NAME=alilm2026
DB_PASSWORD=votreDePasse2026    # ⚠️ METTEZ VOTRE MOT DE PASSE ICI
DB_PORT=5432

# ============================================
# JWT (Sécurité)
# ============================================
JWT_SECRET=mon_super_secret_jwt_alilm_2026_securise
JWT_EXPIRES_IN=7d

# ============================================
# EMAIL (Pour l'envoi d'emails)
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre.email@gmail.com              # ⚠️ VOTRE EMAIL
EMAIL_PASSWORD=votre_mot_de_passe_application # ⚠️ MOT DE PASSE APPLICATION GMAIL

# ============================================
# APPLICATION
# ============================================
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

**Sauvegarder et quitter :**
- Appuyez sur `Ctrl + X`
- Appuyez sur `Y` (pour Yes)
- Appuyez sur `Entrée`

---

### ÉTAPE 4 : Installer les dépendances Node.js

```bash
# Toujours dans le dossier backend
npm install
```

**Cela va installer :**
- express
- pg (PostgreSQL)
- jsonwebtoken
- bcrypt
- multer
- nodemailer
- cors
- dotenv
- express-validator
- nodemon

---

### ÉTAPE 5 : Initialiser la base de données

```bash
# Rendre le script exécutable
chmod +x scripts/init-db.sh

# Lancer l'initialisation
npm run init-db
```

**⚠️ Si vous avez une erreur de permission :**

```bash
# Alternative manuelle :
psql -U alilm -d alilm2026 -f ../database/schema.sql
psql -U alilm -d alilm2026 -f ../database/seeds/01_noms_equipes.sql
psql -U alilm -d alilm2026 -f ../database/seeds/02_rubriques.sql
```

**Ce qui sera créé :**
- ✅ 13 tables (participants, équipes, manches, etc.)
- ✅ 9 équipes avec leurs noms islamiques
- ✅ 9 rubriques de jeu
- ✅ Triggers et vues SQL

---

---

### ÉTAPE 6 : Démarrer le serveur backend

```bash
# Démarrage en mode développement (avec auto-reload)
npm run dev

# OU en mode production
npm start
```

**✅ Vous devriez voir :**

```
🕌 ==========================================
   JEU CONCOURS AL ILM 2026
   AEEMCI - Section ESATIC
========================================== 🕌

📁 Dossier créé: /home/.../frontend/assets/uploads/adhan
📁 Dossier créé: /home/.../frontend/assets/uploads/coran
📁 Dossier créé: /home/.../frontend/assets/uploads/hadith
✅ Nouvelle connexion à PostgreSQL établie
🗄️  Base de données connectée à: 2026-02-03 ...
✅ Serveur démarré sur le port 3000
📍 URL: http://localhost:3000
🔗 API: http://localhost:3000/api

🌙 Ramadan 2026 - Que la lumière de la connaissance vous guide !
```

---

### ÉTAPE 7 : Accéder au frontend

**Le frontend est automatiquement servi par le backend !**

Ouvrez simplement votre navigateur et allez sur :

```
http://localhost:3000
```

**Pages disponibles :**
- 🏠 **Page d'accueil** : http://localhost:3000
- 📝 **Inscription** : http://localhost:3000/public/inscription.html
- 🔐 **Connexion** : http://localhost:3000/login.html
- 👨‍💼 **Dashboard Admin** : http://localhost:3000/admin/dashboard.html
- 🔗 **API** : http://localhost:3000/api

---

## 🎮 TESTER L'APPLICATION

### 1. Créer un compte administrateur

**Dans un nouveau terminal :**

```bash
# Se connecter à PostgreSQL
psql -U alilm -d alilm2026

# Créer un admin
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role)
VALUES ('Admin', 'AL ILM', 'admin@alilm.ci', '$2b$10$YourHashedPasswordHere', 'admin');

# Quitter
\q
```

**OU utilisez ce script Node.js :**

Créez un fichier `backend/scripts/create-admin.js` :

```javascript
require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

async function createAdmin() {
    const hashedPassword = await bcrypt.hash('Admin2026!', 10);
    
    const result = await pool.query(
        `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        ['Admin', 'AL ILM', 'admin@alilm.ci', hashedPassword, 'admin']
    );
    
    console.log('✅ Admin créé avec succès !');
    console.log('📧 Email: admin@alilm.ci');
    console.log('🔑 Mot de passe: Admin2026!');
    
    await pool.end();
}

createAdmin().catch(console.error);
```

Puis lancez :

```bash
node scripts/create-admin.js
```

### 2. Se connecter

- Allez sur http://localhost:3000/login.html
- Email : `admin@alilm.ci`
- Mot de passe : `Admin2026!`

### 3. Tester l'inscription

- Allez sur http://localhost:3000/public/inscription.html
- Remplissez le formulaire
- Le participant sera créé dans la base de données

---

## 📦 COMMANDES DISPONIBLES

```bash
# Dans le dossier backend/

# Démarrer en développement (auto-reload avec nodemon)
npm run dev

# Démarrer en production
npm start

# Initialiser la base de données
npm run init-db

# Tester la connexion BDD
npm run test-db

# Insérer les données initiales (seeds)
npm run seed

# Lancer les tests (si configurés)
npm test

# Backup de la base de données
npm run backup
```

---

## 🌐 ARCHITECTURE DU PROJET

```
Le serveur backend (port 3000) sert AUTOMATIQUEMENT le frontend !

Backend API          Frontend Statique
┌─────────────┐      ┌──────────────┐
│ Express.js  │◄────►│    HTML      │
│   /api/*    │      │    CSS       │
│             │      │     JS       │
└─────────────┘      └──────────────┘
      │
      ▼
┌─────────────┐
│ PostgreSQL  │
│  (Port 5432)│
└─────────────┘
```

**Comment ça marche :**

1. **Backend démarre sur le port 3000**
2. **Routes API** : `/api/*` (JSON)
3. **Fichiers statiques** : Tout le reste (HTML/CSS/JS du frontend)
4. **Le frontend appelle l'API** via `fetch()` ou `apiRequest()`

**Pas besoin de serveur séparé pour le frontend !** ✅

---

## 🔧 DÉPANNAGE

### Erreur : "Port 3000 already in use"

```bash
# Trouver le processus sur le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# OU utiliser un autre port
PORT=3001 npm run dev
```

### Erreur : "ECONNREFUSED" (PostgreSQL)

```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql

# Démarrer PostgreSQL
sudo systemctl start postgresql

# Vérifier les paramètres de connexion dans .env
cat .env | grep DB_
```

### Erreur : "relation does not exist"

```bash
# La base n'est pas initialisée
npm run init-db
```

### Erreur : "Invalid token" ou "No token provided"

- Vérifiez que vous êtes connecté
- Vérifiez que le JWT_SECRET dans `.env` est correct
- Reconnectez-vous pour obtenir un nouveau token

---

## 🚀 DÉPLOIEMENT EN PRODUCTION

Voir le fichier **`GUIDE_DEPLOIEMENT.md`** pour :
- Déploiement sur un VPS (Ubuntu/Nginx)
- Déploiement sur Heroku
- Configuration SSL/HTTPS
- Variables d'environnement de production

---

## 📞 SUPPORT

En cas de problème :

1. Vérifiez les logs du serveur dans le terminal
2. Consultez le fichier `GUIDE_DEMARRAGE_RAPIDE.md`
3. Vérifiez la documentation API : `API_DOCUMENTATION.md`
4. Contactez l'équipe : kanteyoussoufaziz@gmail.com

---

**🕌 Pour une identité islamique !**  
**AEEMCI - Section ESATIC - Ramadan 2026**
🧪 Test de connexion à la base de données...

✅ Connexion PostgreSQL réussie

📊 13 tables trouvées:
   - participants
   - equipes
   - membres_equipe
   - manches
   - rubriques
   ...

🎯 9 équipes enregistrées
📖 9 rubriques enregistrées
👥 0 participants inscrits

🕌 Les 9 équipes AL ILM 2026:
   1. ⚖️ AL-FURQAN
   2. 🏃 AS-SABIQUN
   ...

✅ Tests réussis !
```

---

### ÉTAPE 7 : Créer le compte administrateur

**Méthode 1 : Directement en SQL**

```bash
psql -U alilm -d alilm2026
```

Puis dans le terminal PostgreSQL :

```sql
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role)
VALUES (
    'Admin',
    'AL ILM',
    'admin@alilm.ci',
    '$2b$10$XGkqZ5y1NHmYqh.7nF8vPO8qGqI6YxJ3Zr5X4K9W1mNvD2LpQ3Rxy',
    'admin'
);
```

Quitter avec `\q`

**📝 Compte admin créé :**
- Email : `admin@alilm.ci`
- Mot de passe : `Admin2026!`

---

### ÉTAPE 8 : Démarrer le serveur

```bash
# Mode développement (avec auto-reload)
npm run dev
```

**Vous devriez voir :**
```
🕌 ==========================================
   JEU CONCOURS AL ILM 2026
   AEEMCI - Section ESATIC
========================================== 🕌

✅ Serveur démarré sur le port 3000
📍 URL: http://localhost:3000
🔗 API: http://localhost:3000/api

🌙 Ramadan 2026 - Que la lumière de la connaissance vous guide !
```

---

### ÉTAPE 9 : Tester l'application

#### 1️⃣ Tester l'API

Ouvrir un nouveau terminal :

```bash
curl http://localhost:3000/api
```

**Réponse attendue :**
```json
{
  "message": "Bienvenue sur l'API du Jeu Concours AL ILM 2026 🕌",
  "version": "1.0.0",
  "organisation": "AEEMCI - Section ESATIC",
  "devise": "Pour une identité islamique !"
}
```

#### 2️⃣ Tester la connexion Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alilm.ci",
    "password": "Admin2026!"
  }'
```

**Vous devriez recevoir un token JWT**

#### 3️⃣ Ouvrir dans le navigateur

- **Page d'accueil :** http://localhost:3000
- **Connexion :** http://localhost:3000/login.html
- **Inscription :** http://localhost:3000/public/inscription.html
- **API :** http://localhost:3000/api

---

## 🎯 UTILISATION DE L'APPLICATION

### Connexion Admin

1. Aller sur http://localhost:3000/login.html
2. Cliquer sur l'onglet **"Admin / Jury"**
3. Entrer :
   - Email : `admin@alilm.ci`
   - Mot de passe : `Admin2026!`
4. Cliquer sur **"Se connecter"**

Vous serez redirigé vers le dashboard admin.

### Inscrire des participants

**Option 1 : Formulaire web**

1. Aller sur http://localhost:3000/public/inscription.html
2. Remplir le formulaire
3. Cliquer sur "S'inscrire"

**Option 2 : Import CSV (Google Forms)**

1. Se connecter en tant qu'Admin
2. Aller dans "Participants"
3. Cliquer sur "Importer CSV"
4. Sélectionner votre fichier CSV exporté de Google Forms

**Format CSV attendu :**
```csv
nom,prenom,email,telephone,etablissement,niveau_coranique,connaissance_hadiths,memorisation_sourate
KOUAME,Jean,jean@example.com,0701020304,ESATIC,lis_aisement,oui,oui
DIALLO,Fatou,fatou@example.com,0705060708,EMSP,debute,moins_de_5,un_peu_moins
```

### Connexion Équipe

1. Aller sur http://localhost:3000/login.html
2. Cliquer sur l'onglet **"Équipe"**
3. Entrer le code d'accès (ex: `FURQAN2026`)
4. Cliquer sur "Accéder à mon équipe"

**Codes d'accès des 9 équipes :**
- AL-FURQAN : `FURQAN2026`
- AS-SABIQUN : `SABIQUN2026`
- AL-MUJAHIDUN : `MUJAHIDUN2026`
- AN-NUR : `NUR2026`
- AL-HUDA : `HUDA2026`
- AL-BADR : `BADR2026`
- AL-FIRDAWS : `FIRDAWS2026`
- AL-MUFLIHUN : `MUFLIHUN2026`
- AS-SADIQUN : `SADIQUN2026`

---

## 🔧 COMMANDES UTILES

### Développement

```bash
# Démarrer en mode développement (auto-reload)
npm run dev

# Démarrer en mode production
npm start

# Tester la base de données
npm run test-db

# Réinitialiser la base de données
npm run init-db
```

### Base de données

```bash
# Se connecter à PostgreSQL
psql -U alilm -d alilm2026

# Voir toutes les tables
\dt

# Voir les équipes
SELECT * FROM equipes;

# Voir les participants
SELECT * FROM participants;

# Voir le classement
SELECT * FROM classement_general;

# Quitter
\q
```

### Sauvegarder la base de données

```bash
pg_dump -U alilm -d alilm2026 > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurer une sauvegarde

```bash
psql -U alilm -d alilm2026 < backup_20260203_143000.sql
```

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Problème 1 : Le serveur ne démarre pas

**Erreur :** `Cannot find module 'express'`

**Solution :**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### Problème 2 : Erreur de connexion PostgreSQL

**Erreur :** `password authentication failed for user "alilm"`

**Solution :**
1. Vérifier que PostgreSQL fonctionne :
   ```bash
   sudo systemctl status postgresql
   ```

2. Vérifier votre fichier `.env` :
   ```bash
   cat backend/.env
   ```

3. Réinitialiser le mot de passe :
   ```bash
   sudo -u postgres psql
   ALTER USER alilm WITH PASSWORD 'nouveauMotDePasse';
   \q
   ```
   
4. Mettre à jour le fichier `.env` avec le nouveau mot de passe

---

### Problème 3 : Port 3000 déjà utilisé

**Erreur :** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution :**
```bash
# Trouver le processus qui utilise le port 3000
lsof -i :3000

# Tuer le processus (remplacer PID par le numéro affiché)
kill -9 PID

# Ou changer le port dans .env
PORT=3001
```

---

### Problème 4 : Permission denied sur init-db.sh

**Solution :**
```bash
chmod +x backend/scripts/init-db.sh
```

---

### Problème 5 : Import CSV échoue

**Vérifications :**
1. Format UTF-8
2. Colonnes correctes
3. Pas de virgules dans les valeurs

**Tester avec un fichier minimal :**
```csv
nom,prenom,telephone,etablissement
TEST,Test,0700000000,ESATIC
```

---

## 📧 CONFIGURATION EMAIL (Optionnel)

Pour envoyer des emails de bienvenue et des codes d'accès :

### Avec Gmail

1. Activer la validation en 2 étapes sur votre compte Gmail
2. Générer un "Mot de passe d'application" :
   - https://myaccount.google.com/apppasswords
   - Sélectionner "Autre" comme application
   - Copier le mot de passe généré (16 caractères)

3. Mettre à jour `.env` :
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=votre.email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Le mot de passe d'application
   ```

### Avec un autre service SMTP

```env
# Exemple avec Outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=votre.email@outlook.com
EMAIL_PASSWORD=votreMotDePasse
```

---

## 📊 ENDPOINTS API PRINCIPAUX

### Authentification
- `POST /api/auth/login` - Connexion Admin/Jury
- `POST /api/auth/login-equipe` - Connexion Équipe
- `POST /api/auth/logout` - Déconnexion

### Participants
- `GET /api/participants` - Liste (Admin)
- `POST /api/participants` - Inscription publique
- `POST /api/participants/import-csv` - Import CSV (Admin)

### Équipes
- `GET /api/equipes` - Liste des équipes
- `GET /api/equipes/:id` - Détails équipe + membres
- `POST /api/equipes/:id/membres` - Ajouter membre (Admin)
- `PUT /api/equipes/:id/capitaine` - Définir capitaine (Admin)

### Classement
- `GET /api/classement/general` - Classement général
- `GET /api/classement/manche/:mancheId` - Par manche
- `GET /api/classement/equipe/:equipeId` - Détails équipe

**📖 Documentation complète :** Voir `API_DOCUMENTATION.md`

---

## 🎓 PROCHAINES ÉTAPES

Maintenant que le serveur fonctionne :

1. ✅ **Tester l'inscription** de quelques participants
2. ✅ **Affecter des participants aux équipes** (Dashboard Admin)
3. ✅ **Créer une manche** (Préliminaires)
4. ✅ **Ajouter des questions** à la banque
5. ✅ **Développer les interfaces manquantes** (voir CHECKLIST_DEV.md)

---

## 📚 DOCUMENTATION COMPLÈTE

- **README.md** - Vue d'ensemble du projet
- **GUIDE_DEPLOIEMENT.md** - Déploiement en production (VPS, Heroku)
- **API_DOCUMENTATION.md** - Tous les endpoints avec exemples
- **CHECKLIST_DEV.md** - Tâches restantes
- **PROJET_COMPLET.md** - Récapitulatif technique

---

## 🆘 BESOIN D'AIDE ?

### Logs du serveur

Le serveur affiche les erreurs dans le terminal. Surveillez :
- ❌ Erreurs de connexion BDD
- ❌ Erreurs de routes
- ❌ Erreurs de validation

### Commandes de diagnostic

```bash
# Vérifier Node.js
node --version

# Vérifier PostgreSQL
psql --version
sudo systemctl status postgresql

# Vérifier les processus
ps aux | grep node
ps aux | grep postgres

# Vérifier les ports
lsof -i :3000
lsof -i :5432
```

---

## 🌙 MESSAGE

> *"Iqra" (Lis) - Premier mot révélé du Saint Coran*

**Qu'Allah facilite ce projet et qu'il soit une source de baraka pour tous ! 🕌**

---

## ✅ CHECKLIST DE LANCEMENT

- [ ] PostgreSQL installé et démarré
- [ ] Base de données `alilm2026` créée
- [ ] Utilisateur PostgreSQL `alilm` créé
- [ ] Fichier `.env` configuré
- [ ] `npm install` exécuté
- [ ] `npm run init-db` exécuté avec succès
- [ ] `npm run test-db` passe tous les tests
- [ ] Compte admin créé
- [ ] `npm run dev` démarre le serveur
- [ ] http://localhost:3000 accessible
- [ ] http://localhost:3000/api répond
- [ ] Login admin fonctionne

**Une fois tout coché, vous êtes prêt ! 🚀**

---

**AEEMCI - Section ESATIC**  
*"Pour une identité islamique !"*

**Ramadan Mubarak 2026 !** 🕌✨
