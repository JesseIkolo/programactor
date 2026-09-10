#!/usr/bin/env bash
# ==============================================================================
# PROGRAMACTOR - Script de déploiement automatique VPS (Production)
# Compatible Docker / Docker Compose & Mode Natif Node.js / PM2
# ==============================================================================
set -e

echo "========================================================"
echo "🚀 [Programactor] Déploiement automatique sur le VPS..."
echo "========================================================"

cd "$(dirname "$0")"

# 1. Configuration des variables d'environnement de production
if [ ! -f .env ]; then
  echo "⚙️  Génération du fichier .env sécurisé..."
  JWT_SECRET_GEN=$(openssl rand -hex 32)
  REFRESH_SECRET_GEN=$(openssl rand -hex 32)
  ADMIN_PASS_GEN=$(openssl rand -base64 16)

  cat <<EOF > .env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://jesseikoloj39_db_user:FNl0lLrllI6UmmSE@programactor.vqxzekq.mongodb.net/programactor?retryWrites=true&w=majority
JWT_SECRET=${JWT_SECRET_GEN}
JWT_REFRESH_SECRET=${REFRESH_SECRET_GEN}
ALLOWED_ORIGINS=https://www.programactor.pro,https://programactor.pro,https://programactor.netlify.app
INITIAL_ADMIN_EMAIL=admin@programactor.pro
INITIAL_ADMIN_PASSWORD=${ADMIN_PASS_GEN}
STUDIO_WHATSAPP_NUMBER=237692025552
EOF

  echo "✅ Fichier .env créé avec MongoDB Atlas & clés cryptographiques 64-caractères !"
  echo "--------------------------------------------------------"
  echo "🔑 Identifiants Admin générés :"
  echo "   Email    : admin@programactor.pro"
  echo "   Password : ${ADMIN_PASS_GEN}"
  echo "--------------------------------------------------------"
else
  echo "ℹ️  Fichier .env existant conservé."
fi

# Copie du .env dans la racine backend si exécution native
cp .env ../.env 2>/dev/null || true

# 2. Détection du mode de déploiement (Docker ou PM2/Node)
if command -v docker >/dev/null 2>&1 && (command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1); then
  echo "🐳 Déploiement via Docker Compose..."
  docker compose down || true
  docker compose up -d --build
else
  echo "📦 Docker non détecté, déploiement via Node.js + PM2..."
  cd ..
  
  # Vérification Node.js
  if ! command -v node >/dev/null 2>&1; then
    echo "📥 Installation de Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  fi

  # Installation des dépendances et compilation
  npm ci || npm install
  npm run build

  # Installation et configuration PM2
  if ! command -v pm2 >/dev/null 2>&1; then
    npm install -g pm2
  fi

  pm2 stop programactor-api 2>/dev/null || true
  pm2 delete programactor-api 2>/dev/null || true
  pm2 start deploy/ecosystem.config.cjs --env production
  pm2 save
  pm2 startup || true
  cd deploy
fi

# 3. Vérification de santé
echo "⏳ Test de démarrage de l'API..."
sleep 4

HEALTH_URL="http://127.0.0.1:5001/api/v1/health"
if curl -s "$HEALTH_URL" | grep -q '"status":"healthy"'; then
  echo "========================================================"
  echo "🎉 SUCCÈS : L'API Programactor est EN LIGNE et fonctionnelle !"
  echo "   Vérifiée sur : $HEALTH_URL"
  echo "   Connectée à MongoDB Atlas : programactor.vqxzekq.mongodb.net"
  echo "========================================================"
else
  echo "⚠️ Démarrage en cours ou port différent. Vérification des logs :"
  if command -v pm2 >/dev/null 2>&1; then
    pm2 logs programactor-api --lines 15 --nostream
  fi
fi
