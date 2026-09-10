import { Router } from 'express';
import { z } from 'zod';
import {
  createQuote,
  getQuotes,
  updateQuoteStatus,
  getXpreSiteConfig,
  updateXpreSiteConfig,
} from '../controllers/quote.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { publicFormLimiter } from '../config/security.js';

const router = Router();

// Configuration dynamique XpreSite
router.get('/config', getXpreSiteConfig);
router.put('/config', requireAuth, updateXpreSiteConfig);

const createQuoteSchema = z.object({
  quoteType: z.enum(['XPRESITE_EXPRESS', 'CUSTOM_BESPOKE']).default('XPRESITE_EXPRESS'),
  clientName: z.string().min(2, 'Le nom est requis.'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().min(6, 'Le numéro WhatsApp est requis.'),
  companyName: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  industryId: z.string().optional(),
  industryName: z.string().optional(),
  selectedAddonTitles: z.array(z.string()).optional(),
  basePriceXAF: z.number().nonnegative().optional(),
  addonsTotalXAF: z.number().nonnegative().optional(),
  totalPriceXAF: z.number().nonnegative().optional(),
  paymentSplits: z.union([z.literal(2), z.literal(3)]).default(2),
  projectType: z.string().optional(),
  features: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  budgetRange: z.string().optional(),
  designPreference: z.string().optional(),
  description: z.string().optional(),
  lang: z.enum(['fr', 'en']).default('fr'),
});

// Création de devis public avec limitation de débit (anti-spam)
router.post('/quotes', publicFormLimiter, validateBody(createQuoteSchema), createQuote);

// Gestion administrative (protégée par JWT)
router.get('/quotes', requireAuth, getQuotes);
router.patch('/quotes/:id', requireAuth, updateQuoteStatus);
router.patch('/quotes/:id/status', requireAuth, updateQuoteStatus);

export default router;
