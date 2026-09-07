import dotenv from 'dotenv';
import path from 'path';

// Charger .env depuis le dossier racine du backend
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5001', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/programactor',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_in_production_1234567890',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production_0987654321',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://www.programactor.pro,https://programactor.pro')
    .split(',')
    .map((o) => o.trim()),
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || 'hello@programactor.pro',
  STUDIO_WHATSAPP_NUMBER: process.env.STUDIO_WHATSAPP_NUMBER || '237699000000',
  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL || 'admin@programactor.pro',
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD || 'ProgramactorAdmin2026!',
  INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME || 'Jesse Ikolo',
};

// Garde-fou de sécurité critique : bloquer en production si les secrets sont restés par défaut
if (ENV.NODE_ENV === 'production') {
  if (
    ENV.JWT_SECRET.includes('dev_secret') ||
    ENV.JWT_SECRET.length < 32 ||
    ENV.JWT_REFRESH_SECRET.includes('dev_refresh')
  ) {
    console.error('❌ [SÉCURITÉ CRITIQUE] Impossible de démarrer en production avec des clés JWT_SECRET ou JWT_REFRESH_SECRET par défaut ou trop courtes. Veuillez générer des clés aléatoires fortes dans votre fichier .env.');
    process.exit(1);
  }
}
