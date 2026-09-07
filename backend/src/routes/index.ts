import { Router } from 'express';
import authRoutes from './auth.routes.js';
import quoteRoutes from './quote.routes.js';
import bookingRoutes from './booking.routes.js';
import projectRoutes from './project.routes.js';

const router = Router();

// Endpoint de santé pour monitoring VPS / Nginx
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: '1.0.0',
  });
});

// Montage des routes v1
router.use('/auth', authRoutes);
router.use('/xpresite', quoteRoutes);
router.use('/', bookingRoutes);
router.use('/', projectRoutes);

export default router;
