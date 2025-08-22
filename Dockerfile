# Dockerfile multi-stage pour l'application Eat Day
# Stage 1: Build du frontend React avec Vite
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Builder l'application frontend
RUN pnpm run build

# Stage 2: Configuration du runtime avec Node.js
FROM node:20-alpine AS runtime

# Installer les dépendances système nécessaires pour better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Installer pnpm et les dépendances de production
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

# Copier le serveur backend
COPY server/ ./server/

# Copier les assets buildés du frontend depuis le stage précédent
COPY --from=frontend-builder /app/dist ./dist

# Créer les dossiers nécessaires
RUN mkdir -p /app/server/uploads
RUN mkdir -p /app/data

# Copier le script de démarrage
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Exposer les ports
EXPOSE 3001 5173

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3001

# Point de montage pour la base de données (optionnel)
VOLUME ["/app/data"]

# Commande de démarrage
CMD ["./docker-entrypoint.sh"]