import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateQuoteReference } from '@/lib/xpresite-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
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
      paymentSplits = 2,
      lang = 'fr',
    } = body;

    // Validation de base
    if (!clientName || !clientPhone || !industryId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (nom, téléphone, secteur).' },
        { status: 400 }
      );
    }

    const quoteReference = generateQuoteReference();
    const createdAt = new Date().toISOString();

    const splitAmount = Math.ceil(totalPriceXAF / paymentSplits);

    const quoteRecord = {
      reference: quoteReference,
      clientName,
      clientEmail: clientEmail || '',
      clientPhone,
      companyName: companyName || '',
      city: city || '',
      industryId,
      industryName,
      selectedAddonTitles: selectedAddonTitles || [],
      basePriceXAF,
      addonsTotalXAF,
      totalPriceXAF,
      paymentSplits,
      splitAmount,
      lang,
      status: 'NEW',
      createdAt,
    };

    // Sauvegarde dans le stockage local (data/xpresite-quotes.json)
    const dataDir = path.join(process.cwd(), 'data');
    const quotesFile = path.join(dataDir, 'xpresite-quotes.json');

    try {
      await fs.mkdir(dataDir, { recursive: true });
      let existingQuotes = [];
      try {
        const fileContent = await fs.readFile(quotesFile, 'utf-8');
        existingQuotes = JSON.parse(fileContent);
      } catch {
        existingQuotes = [];
      }
      existingQuotes.unshift(quoteRecord);
      await fs.writeFile(quotesFile, JSON.stringify(existingQuotes, null, 2), 'utf-8');
    } catch (saveError) {
      console.error('Erreur lors de la sauvegarde du devis XpreSite :', saveError);
    }

    // Notification interne (Simulation/Log d'envoi vers hello@programactor.pro)
    console.log(`[XPRESITE] Nouveau devis généré : ${quoteReference} pour ${clientName} (${clientPhone}) - Total: ${totalPriceXAF} FCFA`);

    // Construction du message WhatsApp pré-formaté pour le studio (+237 690 000 000 ou prospect)
    const formattedTotal = new Intl.NumberFormat('fr-FR').format(totalPriceXAF);
    const formattedSplit = new Intl.NumberFormat('fr-FR').format(splitAmount);

    const optionsList = selectedAddonTitles && selectedAddonTitles.length > 0
      ? selectedAddonTitles.map((t: string) => `• ${t}`).join('\n')
      : '• Pack Vitrine Essentiel';

    const whatsappText = lang === 'en'
      ? `Hello Programactor! 👋\n\nI just configured my XpreSite project:\n\n📋 *Ref:* ${quoteReference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📍 *City:* ${city || 'Not specified'}\n🏷️ *Industry:* ${industryName}\n\n*Selected Features:*\n${optionsList}\n\n💰 *Total Price:* ${formattedTotal} FCFA\n💳 *Payment Plan:* ${paymentSplits} installments of ~${formattedSplit} FCFA\n\nLooking forward to getting started within 72h!`
      : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de configurer mon offre XpreSite sur votre site :\n\n📋 *Réf devis :* ${quoteReference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📍 *Ville :* ${city || 'Non renseignée'}\n🏷️ *Secteur :* ${industryName}\n\n*Fonctionnalités choisies :*\n${optionsList}\n\n💰 *Total estimé :* ${formattedTotal} FCFA\n💳 *Facilité :* ${paymentSplits} tranches de ~${formattedSplit} FCFA\n⚡ *Délai :* 72h dès remise des éléments\n\nDiscutons des prochaines étapes pour le lancement !`;

    // Lien WhatsApp vers le studio Programactor (ex: numéro direct)
    const studioPhone = '237690000000'; // Remplaçable par le numéro officiel dans .env
    const whatsappUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(whatsappText)}`;

    return NextResponse.json({
      success: true,
      quoteReference,
      whatsappUrl,
      summary: {
        totalPriceXAF,
        formattedTotal: `${formattedTotal} FCFA`,
        splits: paymentSplits,
        splitAmount: `${formattedSplit} FCFA`,
      },
    });
  } catch (error) {
    console.error('Erreur API xpresite/quote :', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de la création du devis.' },
      { status: 500 }
    );
  }
}
