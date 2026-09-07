import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Quote } from '../models/Quote.model.js';
import { ENV } from '../config/env.js';

// Générateur de référence unique XPS-YYYYMMDD-XXXX
function generateQuoteReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `XPS-${dateStr}-${randomSuffix}`;
}

export async function createQuote(req: Request, res: Response): Promise<void> {
  const {
    clientName,
    clientEmail,
    clientPhone,
    companyName,
    city,
    industryId,
    industryName,
    selectedAddonTitles = [],
    basePriceXAF,
    addonsTotalXAF = 0,
    totalPriceXAF,
    paymentSplits = 2,
    lang = 'fr',
  } = req.body;

  const reference = generateQuoteReference();
  const splitAmount = Math.ceil(totalPriceXAF / paymentSplits);

  const newQuote = await Quote.create({
    reference,
    clientName,
    clientEmail,
    clientPhone,
    companyName,
    city,
    industryId,
    industryName,
    selectedAddonTitles,
    basePriceXAF,
    addonsTotalXAF,
    totalPriceXAF,
    paymentSplits,
    splitAmount,
    lang,
    status: 'NEW',
  });

  // Construction du message WhatsApp
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(totalPriceXAF);
  const formattedSplit = new Intl.NumberFormat('fr-FR').format(splitAmount);

  const optionsList = selectedAddonTitles.length > 0
    ? selectedAddonTitles.map((t: string) => `• ${t}`).join('\n')
    : '• Pack Vitrine Essentiel';

  const isEn = lang === 'en';
  const whatsappText = isEn
    ? `Hello Programactor! 👋\n\nI just configured my XpreSite project:\n\n📋 *Ref:* ${reference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📍 *City:* ${city || 'Not specified'}\n🏷️ *Industry:* ${industryName}\n\n*Selected Features:*\n${optionsList}\n\n💰 *Total Price:* ${formattedTotal} FCFA\n💳 *Payment Plan:* ${paymentSplits} installments of ~${formattedSplit} FCFA\n⚡ *Delivery:* 72h upon elements reception\n\nLooking forward to getting started!`
    : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de configurer mon offre XpreSite sur votre site :\n\n📋 *Réf devis :* ${reference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📍 *Ville :* ${city || 'Non renseignée'}\n🏷️ *Secteur :* ${industryName}\n\n*Fonctionnalités choisies :*\n${optionsList}\n\n💰 *Total estimé :* ${formattedTotal} FCFA\n💳 *Facilité :* ${paymentSplits} tranches de ~${formattedSplit} FCFA\n⚡ *Délai :* 72h dès remise des éléments\n\nDiscutons des prochaines étapes pour le lancement !`;

  const whatsappUrl = `https://wa.me/${ENV.STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  console.log(`[Quote] Nouveau devis enregistré : ${reference} pour ${clientName} (${clientPhone}) - ${totalPriceXAF} FCFA`);

  res.status(201).json({
    success: true,
    message: 'Devis créé avec succès.',
    data: {
      quoteId: newQuote._id,
      reference,
      whatsappUrl,
      summary: {
        totalPriceXAF,
        formattedTotal: `${formattedTotal} FCFA`,
        splits: paymentSplits,
        splitAmount: `${formattedSplit} FCFA`,
      },
    },
  });
}

export async function getQuotes(req: Request, res: Response): Promise<void> {
  const { status, limit = 50, page = 1 } = req.query;

  const query: any = {};
  if (status && typeof status === 'string') {
    query.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [quotes, total] = await Promise.all([
    Quote.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Quote.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      quotes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
}

export async function updateQuoteStatus(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const { status, internalNotes } = req.body;

  const isMongoId = mongoose.Types.ObjectId.isValid(id);
  const filter = isMongoId ? { _id: id } : { reference: id };

  const quote = await Quote.findOneAndUpdate(
    filter,
    {
      ...(status && { status }),
      ...(internalNotes !== undefined && { internalNotes }),
    },
    { new: true }
  );

  if (!quote) {
    res.status(404).json({ success: false, message: 'Devis introuvable.' });
    return;
  }

  res.json({ success: true, data: quote });
}
