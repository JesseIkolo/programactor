import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './env.js';

// Configuration CORS stricte
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Autorise les requêtes sans origine (comme curl, mobile apps ou serveurs)
    if (!origin) return callback(null, true);

    if (ENV.ALLOWED_ORIGINS.includes(origin) || ENV.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Origine non autorisée par la politique CORS Programactor.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// En-têtes HTTP de sécurité via Helmet
export const helmetMiddleware = helmet({
  contentSecurityPolicy: ENV.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
});

// Rate limiter pour les routes publiques de formulaires (anti-spam)
export const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette adresse IP. Veuillez patienter 15 minutes.',
  },
});

// Rate limiter pour les tentatives d'authentification (anti-brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 tentatives par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion échouées. Accès temporairement bloqué pendant 15 minutes.',
  },
});
