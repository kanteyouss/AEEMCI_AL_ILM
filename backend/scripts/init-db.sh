#!/bin/bash

# ============================================
# SCRIPT D'INITIALISATION DE LA BDD
# JEU CONCOURS AL ILM 2026
# ============================================

set -e  # Arrêter en cas d'erreur

echo "🕌 =========================================="
echo "   INITIALISATION BASE DE DONNÉES AL ILM 2026"
echo "========================================== 🕌"
echo ""

# Charger les variables d'environnement
if [ -f "../.env" ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
else
    echo "❌ Fichier .env non trouvé !"
    exit 1
fi

# Variables de connexion
DB_NAME=${DB_NAME:-alilm2026}
DB_USER=${DB_USER:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}

echo "📊 Configuration:"
echo "   Base de données: $DB_NAME"
echo "   Utilisateur: $DB_USER"
echo "   Hôte: $DB_HOST"
echo "   Port: $DB_PORT"
echo ""

# Demander confirmation
read -p "Continuer avec cette configuration ? (o/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    echo "❌ Opération annulée"
    exit 1
fi

# Créer la base de données si elle n'existe pas
echo "📦 Création de la base de données..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -c "CREATE DATABASE $DB_NAME"

# Exécuter le schéma
echo "🗄️  Création des tables..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d $DB_NAME -f ../database/schema.sql

# Exécuter les seeds
echo "🌱 Insertion des données initiales..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d $DB_NAME -f ../database/seeds/01_noms_equipes.sql
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d $DB_NAME -f ../database/seeds/02_rubriques.sql

# Créer un compte admin par défaut
echo "👤 Création du compte administrateur..."
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@alilm.ci}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-Admin2026!}

# Hash du mot de passe (utiliser bcrypt en Node.js pour production)
# Pour ce script, on utilise une commande SQL directe
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d $DB_NAME <<EOF
-- Note: Le hash ci-dessous correspond au mot de passe "Admin2026!"
-- En production, générer avec bcrypt
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role)
VALUES ('Admin', 'AL ILM', '$ADMIN_EMAIL', '\$2b\$10\$XGkqZ5y1NHmYqh.7nF8vPO8qGqI6YxJ3Zr5X4K9W1mNvD2LpQ3Rxy', 'admin')
ON CONFLICT (email) DO NOTHING;
EOF

echo ""
echo "✅ =========================================="
echo "   INITIALISATION TERMINÉE AVEC SUCCÈS !"
echo "========================================== ✅"
echo ""
echo "📝 Informations de connexion Admin:"
echo "   Email: $ADMIN_EMAIL"
echo "   Mot de passe: $ADMIN_PASSWORD"
echo ""
echo "🚀 Vous pouvez maintenant démarrer le serveur:"
echo "   cd ../backend"
echo "   npm run dev"
echo ""
