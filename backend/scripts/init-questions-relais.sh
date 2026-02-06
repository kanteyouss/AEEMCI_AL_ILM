#!/bin/bash

# Script pour générer les questions relais

echo "🚀 Génération des questions pour Questions relais..."

cd "$(dirname "$0")/.."

# Vérifier que Node.js est disponible
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Exécuter le script de génération
node scripts/generateQuestionsRelais.js

echo ""
echo "✅ Terminé ! Les questions ont été insérées dans la base de données."
echo "💡 Vous pouvez maintenant utiliser la rubrique Questions relais dans l'interface de notation."
