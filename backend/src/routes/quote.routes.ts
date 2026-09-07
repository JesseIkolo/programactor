import { Router } from 'express';
import { z } from 'zod';
import {
  createQuote,
  getQuotes,
  updateQuoteStatus,
} from '../controllers/quote.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { publicFormLimiter } from '../config/security.js';

const router = Router();

const createQuoteSchema = z.object({
  clientName: z.string().min(2, 'Le nom est requis.'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().min(6, 'Le numéro WhatsApp est requis.'),
  companyName: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  industryId: z.string().min(1, 'Le secteur est requis.'),
  industryName: z.string().min(1, 'Le nom du secteur est requis.'),
  selectedAddonTitles: z.array(z.string()).optional(),
  basePriceXAF: z.number().positive(),
  addonsTotalXAF: z.number().nonnegative().optional(),
  totalPriceXAF: z.number().positive(),
  paymentSplits: z.union([z.literal(2), z.literal(3)]).default(2),
  lang: z.enum(['fr', 'en']).default('fr'),
});

// Création de devis public avec limitation de débit (anti-spam)
router.post('/quotes', publicFormLimiter, validateBody(createQuoteSchema), createQuote);

// Gestion administrative (protégée par JWT)
router.get('/quotes', requireAuth, getQuotes);
router.patch('/quotes/:id/status', requireAuth, updateQuoteStatus);

export default router;
