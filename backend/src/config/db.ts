import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connecté avec succès : ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Erreur de connexion runtime :', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Déconnecté. Tentative de reconnexion...');
    });
  } catch (error) {
    console.error('[MongoDB] Échec critique de connexion initiale :', error);
    // En développement, ne pas crasher immédiatement pour permettre l'inspection
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}
