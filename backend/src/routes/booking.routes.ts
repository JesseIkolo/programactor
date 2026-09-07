import { Router } from 'express';
import { z } from 'zod';
import {
  createBooking,
  getBookings,
  updateBooking,
} from '../controllers/booking.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { publicFormLimiter } from '../config/security.js';

const router = Router();

const createBookingSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(6),
  clientCity: z.string().optional(),
  companyName: z.string().optional(),
  sector: z.string().min(1),
  problemSummary: z.string().min(5),
  desiredOffer: z.string().optional(),
  preferredChannel: z.enum(['meet', 'whatsapp']).default('meet'),
  scheduledAt: z.string().datetime(),
  clientTimezone: z.string().default('Africa/Douala'),
});

// Réservation publique anti-spam
router.post('/bookings', publicFormLimiter, validateBody(createBookingSchema), createBooking);

// Gestion administrative
router.get('/bookings', requireAuth, getBookings);
router.patch('/bookings/:id', requireAuth, updateBooking);

export default router;
