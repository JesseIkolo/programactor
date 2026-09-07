#!/usr/bin/env bash
# ==============================================================================
# PROGRAMACTOR - Script d'automatisation de déploiement VPS (Production)
# ==============================================================================
set -e

echo "🚀 [Programactor] Démarrage du déploiement VPS..."

# 1. Vérification des outils nécessaires
command -v docker >/dev/null 2>&1 || { echo "❌ Docker n'est pas installé. Installez Docker d'abord."; exit 1; }
command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose n'est pas installé."; exit 1; }

# Déplacement dans le dossier du script
cd "$(dirname "$0")"

# 2. Vérification / Création du fichier .env de production
if [ ! -f .env ]; then
  echo "⚠️ Fichier .env manquant dans deploy/. Génération d'un fichier .env sécurisé..."
  
  JWT_SECRET_GEN=$(openssl rand -hex 32)
  REFRESH_SECRET_GEN=$(openssl rand -hex 32)
  ADMIN_PASS_GEN=$(openssl rand -base64 16)

  cat <<EOF > .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/programactor
JWT_SECRET=${JWT_SECRET_GEN}
JWT_REFRESH_SECRET=${REFRESH_SECRET_GEN}
ALLOWED_ORIGINS=https://www.programactor.pro,https://programactor.pro
INITIAL_ADMIN_EMAIL=admin@programactor.pro
INITIAL_ADMIN_PASSWORD=${ADMIN_PASS_GEN}
STUDIO_WHATSAPP_NUMBER=237699000000
EOF

  echo "✅ Fichier .env généré avec des clés cryptographiques aléatoires de 64 caractères !"
  echo "🔑 Identifiants Admin créés :"
  echo "   Email    : admin@programactor.pro"
  echo "   Password : ${ADMIN_PASS_GEN}"
  echo "⚠️ Conservez précieusement ces identifiants !"
fi

# 3. Build et relance des conteneurs
echo "📦 Construction des images Docker et redémarrage..."
docker compose down || true
docker compose up -d --build

# 4. Attente et test de santé
echo "⏳ Vérification du statut de l'API..."
sleep 5

if curl -s http://127.0.0.1:5000/api/v1/health | grep -q '"status":"healthy"'; then
  echo "🎉 SUCCÈS : L'API Programactor est en ligne et en parfaite santé !"
  echo "👉 Accessible en interne sur http://127.0.0.1:5000/api/v1"
else
  echo "⚠️ L'API démarre ou nécessite une vérification. Affichage des logs récents :"
  docker compose logs api --tail=20
fi
