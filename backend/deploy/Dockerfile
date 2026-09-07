# =============================================================================
# DOCKERFILE MULTI-STAGE — PROGRAMACTOR BACKEND
# =============================================================================

# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json tsconfig.json ./

# Installer toutes les dépendances (y compris devDependencies pour tsc)
RUN npm ci

# Copier le code source
COPY src/ ./src/

# Compiler TypeScript en JavaScript pur (dist/)
RUN npm run build

# Étape 2 : Production Runtime minimaliste
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copier uniquement les fichiers nécessaires
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Passer à l'utilisateur non-root
USER appuser

EXPOSE 5001

CMD ["node", "dist/server.js"]
