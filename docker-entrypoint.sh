#!/bin/sh

# Script de démarrage pour l'application Eat Day
# Lance le serveur backend qui sert aussi le frontend

set -eu

echo "🚀 Démarrage de l'application Eat Day..."

# Vérifier si un volume est monté pour la base de données
if [ -d "/app/data" ] && [ "$(ls -A /app/data 2>/dev/null)" ]; then
    echo "📁 Volume de données détecté, utilisation de la base de données externe"
    # Créer un lien symbolique vers la base de données dans le volume
    if [ ! -f "/app/data/database.sqlite" ]; then
        echo "📋 Initialisation de la base de données dans le volume..."
        # Copier la base de données initiale si elle n'existe pas
        if [ -f "/app/server/database.sqlite" ]; then
            cp /app/server/database.sqlite /app/data/database.sqlite
        fi
    fi
    # Créer le lien symbolique
    rm -f /app/server/database.sqlite
    ln -sf /app/data/database.sqlite /app/server/database.sqlite
else
    echo "💾 Utilisation de la base de données locale du conteneur"
fi

# Vérifier si un volume est monté pour les uploads
if [ -d "/app/data/uploads" ]; then
    echo "📸 Volume d'uploads détecté, utilisation du stockage externe"
    rm -rf /app/server/uploads
    ln -sf /app/data/uploads /app/server/uploads
else
    echo "📸 Utilisation du stockage local du conteneur pour les uploads"
    mkdir -p /app/server/uploads
fi

echo "🌐 Démarrage du serveur sur le port $PORT..."

# Démarrer le serveur Node.js
exec node server/index.js

