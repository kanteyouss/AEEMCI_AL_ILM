#!/bin/bash

# ===========================================
# SCRIPT DE CONFIGURATION POSTGRESQL
# AL ILM 2026 - AEEMCI ESATIC
# ===========================================

echo "🕌 =========================================="
echo "   CONFIGURATION POSTGRESQL AL ILM 2026"
echo "========================================== 🕌"
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé !"
    echo "📦 Installation de PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

echo "✅ PostgreSQL détecté"
echo ""

# Créer l'utilisateur et la base de données
echo "📝 Création de l'utilisateur 'alilm' et de la base 'alilm2026'..."
echo ""

sudo -u postgres psql <<EOF
-- Supprimer si existe déjà (pour réinitialisation)
DROP DATABASE IF EXISTS alilm2026;
DROP USER IF EXISTS alilm;

-- Créer l'utilisateur
CREATE USER alilm WITH PASSWORD 'alilm2026';

-- Créer la base de données
CREATE DATABASE alilm2026 OWNER alilm;

-- Donner tous les privilèges
GRANT ALL PRIVILEGES ON DATABASE alilm2026 TO alilm;

-- Se connecter à la base et donner les privilèges sur le schéma
\c alilm2026
GRANT ALL ON SCHEMA public TO alilm;

-- Message de confirmation
\echo '✅ Utilisateur et base de données créés avec succès !'
EOF

echo ""
echo "✅ Configuration PostgreSQL terminée !"
echo ""
echo "📊 Informations de connexion :"
echo "   • Utilisateur : alilm"
echo "   • Mot de passe : alilm2026"
echo "   • Base de données : alilm2026"
echo "   • Hôte : localhost"
echo "   • Port : 5432"
echo ""
echo "🔄 Vous pouvez maintenant lancer : npm run init-db"
echo ""
