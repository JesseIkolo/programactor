import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { seedInitialAdmin } from './controllers/auth.controller.js';

async function startServer() {
  console.log('--- Initialisation du Backend Programactor ---');

  // 1. Connexion à MongoDB
  const isConnected = await connectDB();

  // 2. Initialisation du compte super-administrateur si premier lancement
  if (isConnected) {
    await seedInitialAdmin();
  } else {
    console.log('[Seed] En attente de connexion MongoDB pour initialiser le compte admin.');
  }

  // 3. Démarrage du serveur HTTP
  const app = createApp();

  const server = app.listen(ENV.PORT, () => {
    console.log(`🚀 API Programactor opérationnelle sur http://127.0.0.1:${ENV.PORT}`);
    console.log(`🛡️ Environnement : ${ENV.NODE_ENV}`);
    console.log(`📡 Healthcheck : http://127.0.0.1:${ENV.PORT}/api/v1/health`);
  });

  // Arrêt propre (Graceful Shutdown)
  const shutdown = (signal: string) => {
    console.log(`\nSignal ${signal} reçu. Fermeture propre du serveur...`);
    server.close(() => {
      console.log('Serveur HTTP fermé.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('Erreur fatale lors du démarrage du serveur :', err);
  process.exit(1);
});
