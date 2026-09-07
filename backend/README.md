# Guide de Déploiement VPS — API Backend Programactor

Ce dossier contient l'API Backend sécurisée conçue pour être hébergée sur votre serveur VPS (Ubuntu, Debian, etc.).

---

## 📋 Prérequis sur le VPS

* Un serveur VPS avec accès SSH (Ubuntu 22.04 ou 24.04 recommandé).
* Un nom de domaine ou sous-domaine pointant vers l'IP de votre VPS (ex: `api.programactor.pro` avec un enregistrement DNS de type `A`).

---

## 🚀 Méthode 1 : Déploiement avec Docker Compose (Recommandée)

Cette méthode est la plus simple et la plus robuste car elle conteneurise l'application et MongoDB ensemble.

### 1. Installer Docker sur le VPS (si pas encore fait)
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. Cloner le projet et naviguer dans le backend
```bash
git clone https://github.com/JesseIkolo/programactor.git
cd programactor/backend
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env
nano .env
# Personnalisez JWT_SECRET, INITIAL_ADMIN_PASSWORD, etc.
```

### 4. Démarrer les conteneurs en arrière-plan
```bash
cd deploy
docker compose up -d --build
```

### 5. Vérifier que l'API répond
```bash
curl http://127.0.0.1:5000/api/v1/health
# Doit renvoyer : {"status":"healthy", ...}
```

---

## 🛠️ Méthode 2 : Déploiement Natif avec PM2 & MongoDB

Si vous préférez exécuter Node.js directement sur l'hôte :

### 1. Installer Node.js 20, PM2 et MongoDB
```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# PM2
sudo npm install -g pm2
```

### 2. Installer les dépendances et compiler
```bash
cd programactor/backend
npm install
npm run build
```

### 3. Démarrer avec PM2
```bash
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 🔒 Configuration du Reverse-Proxy Nginx & SSL HTTPS

Pour rendre l'API accessible publiquement via `https://api.programactor.pro` :

### 1. Installer Nginx et Certbot
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Créer la configuration Nginx
```bash
sudo cp deploy/nginx-api.conf.example /etc/nginx/sites-available/api.programactor.pro
sudo ln -s /etc/nginx/sites-available/api.programactor.pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Activer le certificat SSL gratuit (Let's Encrypt)
```bash
sudo certbot --nginx -d api.programactor.pro
```

Votre API est désormais accessible publiquement et de manière ultra-sécurisée sur :  
👉 `https://api.programactor.pro/api/v1/health`

---

## 🔗 Connexion avec le Frontend Netlify

Dans les paramètres de votre site sur Netlify (Section *Site configuration* > *Environment variables*), ajoutez la variable suivante :

```ini
NEXT_PUBLIC_API_URL=https://api.programactor.pro/api/v1
```
