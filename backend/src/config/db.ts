import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB(): Promise<boolean> {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`[MongoDB] Connecté avec succès : ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Erreur de connexion runtime :', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Déconnecté. Tentative de reconnexion...');
    });
    return true;
  } catch (error: any) {
    console.error('[MongoDB] Erreur de connexion MongoDB :', error?.message || error);
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
    return false;
  }
}
