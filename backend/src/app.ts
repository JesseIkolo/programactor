import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { corsMiddleware, helmetMiddleware } from './config/security.js';
import { errorHandler } from './middlewares/error.middleware.js';
import apiRoutes from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // 1. Sécurité En-têtes & CORS
  app.use(helmetMiddleware);
  app.use(corsMiddleware);

  // 2. Parsing du corps des requêtes et cookies
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());

  // 3. Prévention des injections NoSQL (nettoie les requêtes contenant des $ et .)
  app.use(mongoSanitize());

  // 4. Routes de l'API
  app.use('/api/v1', apiRoutes);

  // 5. Route par défaut 404
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `La route demandée ${req.originalUrl} n'existe pas sur cette API.`,
    });
  });

  // 6. Gestionnaire d'erreurs global
  app.use(errorHandler);

  return app;
}
