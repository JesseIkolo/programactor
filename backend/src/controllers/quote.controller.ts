import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Quote } from '../models/Quote.model.js';
import { ENV } from '../config/env.js';

// Générateur de référence unique XPS-YYYYMMDD-XXXX ou PRG-CUSTOM-YYYYMMDD-XXXX
function generateQuoteReference(type: string = 'XPRESITE_EXPRESS'): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const prefix = type === 'CUSTOM_BESPOKE' ? 'PRG-CUSTOM' : 'XPS';
  return `${prefix}-${dateStr}-${randomSuffix}`;
}

export async function createQuote(req: Request, res: Response): Promise<void> {
  const {
    quoteType = 'XPRESITE_EXPRESS',
    clientName,
    clientEmail,
    clientPhone,
    companyName,
    city,
    industryId = 'custom',
    industryName = 'Sur-Mesure',
    selectedAddonTitles = [],
    basePriceXAF = 0,
    addonsTotalXAF = 0,
    totalPriceXAF = 0,
    paymentSplits = 2,
    projectType = '',
    features = [],
    timeline = '',
    budgetRange = '',
    designPreference = '',
    description = '',
    lang = 'fr',
  } = req.body;

  const isBespoke = quoteType === 'CUSTOM_BESPOKE';
  const reference = generateQuoteReference(quoteType);
  const splitAmount = totalPriceXAF > 0 ? Math.ceil(totalPriceXAF / paymentSplits) : 0;

  const newQuote = await Quote.create({
    reference,
    quoteType,
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
    projectType,
    features,
    timeline,
    budgetRange,
    designPreference,
    description,
    lang,
    status: 'NEW',
  });

  // Construction du message WhatsApp
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(totalPriceXAF);
  const formattedSplit = new Intl.NumberFormat('fr-FR').format(splitAmount);

  const isEn = lang === 'en';
  let whatsappText = '';

  if (isBespoke) {
    const featuresList = features.length > 0
      ? features.map((f: string) => `• ${f}`).join('\n')
      : '• Fonctionnalités sur-mesure à cadrer';

    whatsappText = isEn
      ? `Hello Programactor! 👋\n\nI just submitted a bespoke project request:\n\n📋 *Ref:* ${reference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📍 *City:* ${city || 'Not specified'}\n💼 *Project Type:* ${projectType || 'Custom'}\n\n*Key Features:* \n${featuresList}\n\n🎨 *Design & Identity:* ${designPreference || 'To discuss'}\n⏱️ *Target Timeline:* ${timeline || 'To define'}\n💰 *Budget Range:* ${budgetRange || 'To evaluate'}\n${description ? `📝 *Notes:* ${description}\n` : ''}\nLooking forward to scheduling a scoping call!`
      : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de soumettre une demande de projet sur-mesure :\n\n📋 *Réf :* ${reference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📍 *Ville :* ${city || 'Non renseignée'}\n💼 *Type de projet :* ${projectType || 'Sur-mesure'}\n\n*Besoins & Fonctionnalités :*\n${featuresList}\n\n🎨 *Design & Identité :* ${designPreference || 'À cadrer'}\n⏱️ *Délai visé :* ${timeline || 'À convenir'}\n💰 *Budget indicatif :* ${budgetRange || 'À estimer'}\n${description ? `📝 *Précisions :* ${description}\n` : ''}\nDiscutons ensemble pour planifier un appel de cadrage !`;
  } else {
    const optionsList = selectedAddonTitles.length > 0
      ? selectedAddonTitles.map((t: string) => `• ${t}`).join('\n')
      : '• Pack Vitrine Essentiel';

    whatsappText = isEn
      ? `Hello Programactor! 👋\n\nI just configured my XpreSite project:\n\n📋 *Ref:* ${reference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📍 *City:* ${city || 'Not specified'}\n🏷️ *Industry:* ${industryName}\n\n*Selected Features:*\n${optionsList}\n\n💰 *Total Price:* ${formattedTotal} FCFA\n💳 *Payment Plan:* ${paymentSplits} installments of ~${formattedSplit} FCFA\n⚡ *Delivery:* 72h upon elements reception\n\nLooking forward to getting started!`
      : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de configurer mon offre XpreSite sur votre site :\n\n📋 *Réf devis :* ${reference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📍 *Ville :* ${city || 'Non renseignée'}\n🏷️ *Secteur :* ${industryName}\n\n*Fonctionnalités choisies :*\n${optionsList}\n\n💰 *Total estimé :* ${formattedTotal} FCFA\n💳 *Facilité :* ${paymentSplits} tranches de ~${formattedSplit} FCFA\n⚡ *Délai :* 72h dès remise des éléments\n\nDiscutons des prochaines étapes pour le lancement !`;
  }

  const whatsappUrl = `https://wa.me/${ENV.STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  console.log(`[Quote] Nouveau devis enregistré (${quoteType}) : ${reference} pour ${clientName} (${clientPhone})`);

  res.status(201).json({
    success: true,
    message: 'Devis créé avec succès.',
    data: {
      quoteId: newQuote._id,
      reference,
      quoteType,
      whatsappUrl,
      summary: {
        totalPriceXAF,
        formattedTotal: totalPriceXAF > 0 ? `${formattedTotal} FCFA` : (isEn ? 'Custom Quote' : 'Sur Devis'),
        splits: paymentSplits,
        splitAmount: splitAmount > 0 ? `${formattedSplit} FCFA` : undefined,
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

export async function getXpreSiteConfig(req: Request, res: Response): Promise<void> {
  try {
    const { XpreSiteConfig } = await import('../models/XpreSiteConfig.model.js');
    let config = await XpreSiteConfig.findOne().sort({ updatedAt: -1 });

    if (!config) {
      config = await XpreSiteConfig.create({
        defaultBasePriceXAF: 75000,
        deliveryDelay: '72h',
        allowThreeSplits: true,
        minAmountForThreeSplits: 100000,
        hostingIncludedYears: 1,
        whatsappContactNumber: '237699000000',
        industries: [],
      });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Erreur getXpreSiteConfig :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la lecture de la configuration.' });
  }
}

export async function updateXpreSiteConfig(req: Request, res: Response): Promise<void> {
  try {
    const { XpreSiteConfig } = await import('../models/XpreSiteConfig.model.js');
    let config = await XpreSiteConfig.findOne().sort({ updatedAt: -1 });

    if (!config) {
      config = await XpreSiteConfig.create(req.body);
    } else {
      Object.assign(config, req.body);
      await config.save();
    }

    res.json({ success: true, message: 'Configuration XpreSite mise à jour.', data: config });
  } catch (error) {
    console.error('Erreur updateXpreSiteConfig :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde.' });
  }
}

