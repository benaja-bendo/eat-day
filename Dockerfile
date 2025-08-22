# Dockerfile multi-stage pour l'application Eat Day

# Image de base avec les dépendances système et pnpm
FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++ sqlite \
    && corepack enable

# ----- Build du frontend -----
FROM base AS build
WORKDIR /app

# Installer les dépendances en utilisant le cache Docker
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copier le code source et builder le projet
COPY . .
RUN pnpm run build

# ----- Runtime -----
FROM base AS runtime
WORKDIR /app

# Installer uniquement les dépendances de production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copier le backend et le frontend buildé
COPY server ./server
COPY --from=build /app/dist ./dist

# Préparer les dossiers nécessaires
RUN mkdir -p /app/server/uploads /app/data

# Script de démarrage
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

# Point de montage pour la base de données
VOLUME ["/app/data"]

CMD ["./docker-entrypoint.sh"]

