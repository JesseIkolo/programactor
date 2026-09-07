import { Router } from 'express';
import { z } from 'zod';
import {
  getAvailableSlots,
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
  sector: z.string().optional(),
  topic: z.string().optional(),
  meetingType: z.enum(['EN_LIGNE', 'PRESENTIEL']).default('EN_LIGNE'),
  locationDetails: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().min(4),
  lang: z.string().optional(),
});

// Consultation des créneaux disponibles pour une date
router.get('/bookings/slots', getAvailableSlots);

// Réservation publique anti-spam
router.post('/bookings', publicFormLimiter, validateBody(createBookingSchema), createBooking);

// Gestion administrative (protégée par JWT)
router.get('/bookings', requireAuth, getBookings);
router.patch('/bookings/:id', requireAuth, updateBooking);

export default router;
