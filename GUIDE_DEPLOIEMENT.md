# 🕌 Guide de Déploiement - AL ILM 2026

## Prérequis

- **Node.js** 18+ installé
- **PostgreSQL** 14+ installé et en cours d'exécution
- **npm** ou **yarn**
- Accès à un serveur SMTP pour l'envoi d'emails

## Étape 1 : Installation des dépendances

```bash
cd /home/kant_dev/KANTDEV/PROJET\ PERSO/COUCOURALILM/alilm2026/backend
npm install
```

## Étape 2 : Configuration de l'environnement

Créer le fichier `.env` à partir du template :

```bash
cp .env.example .env
```

Modifier `.env` avec vos paramètres :

```env
# Base de données PostgreSQL
DB_USER=votre_utilisateur_postgres
DB_HOST=localhost
DB_NAME=alilm2026
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_2026
JWT_EXPIRES_IN=7d

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application

# Frontend
FRONTEND_URL=http://localhost:3000

# Environnement
NODE_ENV=development
PORT=3000
```

## Étape 3 : Initialiser la base de données

### Option A : Avec le script automatique (Linux/Mac)

```bash
cd backend/scripts
chmod +x init-db.sh
./init-db.sh
```

### Option B : Manuellement

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE alilm2026;

# Se connecter à la base
\c alilm2026

# Exécuter le schéma
\i database/schema.sql

# Exécuter les seeds
\i database/seeds/01_noms_equipes.sql
\i database/seeds/02_rubriques.sql

# Quitter
\q
```

### Créer le compte administrateur

```bash
cd backend
npm run create-admin
```

Ou directement en SQL :

```sql
-- Mot de passe : Admin2026!
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role)
VALUES (
    'Admin',
    'AL ILM',
    'admin@alilm.ci',
    '$2b$10$XGkqZ5y1NHmYqh.7nF8vPO8qGqI6YxJ3Zr5X4K9W1mNvD2LpQ3Rxy',
    'admin'
);
```

## Étape 4 : Lancer le serveur

### Mode développement (avec auto-reload)

```bash
cd backend
npm run dev
```

### Mode production

```bash
cd backend
npm start
```

Le serveur démarre sur `http://localhost:3000`

## Étape 5 : Vérifier l'installation

### Tester l'API

```bash
curl http://localhost:3000/api
```

Réponse attendue :

```json
{
  "message": "Bienvenue sur l'API du Jeu Concours AL ILM 2026 🕌",
  "version": "1.0.0",
  "organisation": "AEEMCI - Section ESATIC"
}
```

### Tester la connexion Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alilm.ci",
    "password": "Admin2026!"
  }'
```

### Accéder au frontend

Ouvrir dans le navigateur : `http://localhost:3000`

## Étape 6 : Import des participants (Google Forms)

1. Se connecter en tant qu'Admin : `http://localhost:3000/login.html`
2. Aller dans "Participants"
3. Cliquer sur "Importer CSV"
4. Sélectionner le fichier CSV exporté de Google Forms

**Format CSV attendu :**

```csv
nom,prenom,email,telephone,etablissement,niveau_coranique,connaissance_hadiths,memorisation_sourate
KOUAME,Jean,jean@example.com,0701020304,ESATIC,lis_aisement,oui,oui
DIALLO,Fatou,fatou@example.com,0705060708,EMSP,debute,moins_de_5,un_peu_moins
```

## Déploiement en production

### Option 1 : VPS (Serveur dédié)

#### Installation sur Ubuntu/Debian

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configurer PostgreSQL
sudo -u postgres psql
CREATE DATABASE alilm2026;
CREATE USER alilm WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE alilm2026 TO alilm;
\q

# Cloner le projet
git clone <votre_repo> /var/www/alilm2026
cd /var/www/alilm2026/backend

# Installer les dépendances
npm install --production

# Configurer .env
cp .env.example .env
nano .env  # Éditer les variables

# Initialiser la BDD
npm run init-db

# Installer PM2 (Process Manager)
sudo npm install -g pm2

# Démarrer l'application
pm2 start server.js --name alilm2026

# Configurer PM2 au démarrage
pm2 startup
pm2 save
```

#### Configurer Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Créer la configuration
sudo nano /etc/nginx/sites-available/alilm2026
```

Contenu :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/alilm2026 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Configurer SSL (HTTPS) avec Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### Option 2 : Heroku

```bash
# Installer Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Se connecter
heroku login

# Créer l'application
heroku create alilm2026

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurer les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=votre_secret
heroku config:set EMAIL_HOST=smtp.gmail.com
# ... etc

# Déployer
git push heroku main

# Initialiser la BDD
heroku run npm run init-db
```

## Maintenance

### Sauvegarder la base de données

```bash
npm run backup
```

Ou manuellement :

```bash
pg_dump -U alilm -h localhost alilm2026 > backup_$(date +%Y%m%d).sql
```

### Restaurer une sauvegarde

```bash
psql -U alilm -h localhost alilm2026 < backup_20260315.sql
```

### Logs

```bash
# Logs PM2
pm2 logs alilm2026

# Logs Heroku
heroku logs --tail
```

## Résolution de problèmes

### Le serveur ne démarre pas

```bash
# Vérifier les logs
npm run dev

# Vérifier la connexion PostgreSQL
psql -U alilm -h localhost -d alilm2026
```

### Erreur "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur CORS

Vérifier que `FRONTEND_URL` dans `.env` correspond à votre URL frontend

---

## Support

📧 Email : aeemci.esatic@gmail.com
🕌 AEEMCI - Section ESATIC
💚 "Pour une identité islamique !"
