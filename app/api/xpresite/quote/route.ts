import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateQuoteReference } from '@/lib/xpresite-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
    } = body;

    // Validation de base
    if (!clientName || !clientPhone) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (nom, téléphone WhatsApp).' },
        { status: 400 }
      );
    }

    const isBespoke = quoteType === 'CUSTOM_BESPOKE';
    const rawRef = generateQuoteReference();
    const quoteReference = isBespoke ? rawRef.replace(/^XPS-/, 'PRG-CUSTOM-') : rawRef;
    const createdAt = new Date().toISOString();

    const splitAmount = totalPriceXAF > 0 ? Math.ceil(totalPriceXAF / paymentSplits) : 0;

    const quoteRecord = {
      reference: quoteReference,
      quoteType,
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
      projectType,
      features,
      timeline,
      budgetRange,
      designPreference,
      description,
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

    // Forwarder vers le backend VPS / MongoDB Atlas si joignable
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      await fetch(`${vpsApiUrl}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          industryId: industryId || 'custom-bespoke',
          industryName: industryName || (isBespoke ? 'Sur-Mesure' : 'XpreSite'),
          basePriceXAF: basePriceXAF > 0 ? basePriceXAF : 1,
          totalPriceXAF: totalPriceXAF > 0 ? totalPriceXAF : 1,
          selectedAddonTitles: selectedAddonTitles || [],
          reference: quoteReference,
        }),
      });
      console.log(`[XpreSite] Devis synchronisé sur MongoDB Atlas : ${quoteReference}`);
    } catch (atlasSyncError) {
      console.warn('[XpreSite] Backend VPS injoignable, sauvegarde locale conservée.');
    }

    console.log(`[XPRESITE] Nouveau devis généré (${quoteType}) : ${quoteReference} pour ${clientName} (${clientPhone})`);

    // Construction du message WhatsApp
    const formattedTotal = new Intl.NumberFormat('fr-FR').format(totalPriceXAF);
    const formattedSplit = new Intl.NumberFormat('fr-FR').format(splitAmount);

    let whatsappText = '';
    const isEn = lang === 'en';

    if (isBespoke) {
      const featuresList = features.length > 0
        ? features.map((f: string) => `• ${f}`).join('\n')
        : '• Fonctionnalités sur-mesure à cadrer';

      whatsappText = isEn
        ? `Hello Programactor! 👋\n\nI just submitted a bespoke project request:\n\n📋 *Ref:* ${quoteReference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📍 *City:* ${city || 'Not specified'}\n💼 *Project Type:* ${projectType || 'Custom'}\n\n*Key Features:*\n${featuresList}\n\n🎨 *Design & Identity:* ${designPreference || 'To discuss'}\n⏱️ *Target Timeline:* ${timeline || 'To define'}\n💰 *Budget Range:* ${budgetRange || 'To evaluate'}\n${description ? `📝 *Notes:* ${description}\n` : ''}\nLooking forward to scheduling a scoping call!`
        : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de soumettre une demande de projet sur-mesure :\n\n📋 *Réf :* ${quoteReference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📍 *Ville :* ${city || 'Non renseignée'}\n💼 *Type de projet :* ${projectType || 'Sur-mesure'}\n\n*Besoins & Fonctionnalités :*\n${featuresList}\n\n🎨 *Design & Identité :* ${designPreference || 'À cadrer'}\n⏱️ *Délai visé :* ${timeline || 'À convenir'}\n💰 *Budget indicatif :* ${budgetRange || 'À estimer'}\n${description ? `📝 *Précisions :* ${description}\n` : ''}\nDiscutons ensemble pour planifier un appel de cadrage !`;
    } else {
      const optionsList = selectedAddonTitles && selectedAddonTitles.length > 0
        ? selectedAddonTitles.map((t: string) => `• ${t}`).join('\n')
        : '• Pack Vitrine Essentiel';

      whatsappText = isEn
        ? `Hello Programactor! 👋\n\nI just configured my XpreSite project:\n\n📋 *Ref:* ${quoteReference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📍 *City:* ${city || 'Not specified'}\n🏷️ *Industry:* ${industryName}\n\n*Selected Features:*\n${optionsList}\n\n💰 *Total Price:* ${formattedTotal} FCFA\n💳 *Payment Plan:* ${paymentSplits} installments of ~${formattedSplit} FCFA\n\nLooking forward to getting started within 72h!`
        : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de configurer mon offre XpreSite sur votre site :\n\n📋 *Réf devis :* ${quoteReference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📍 *Ville :* ${city || 'Non renseignée'}\n🏷️ *Secteur :* ${industryName}\n\n*Fonctionnalités choisies :*\n${optionsList}\n\n💰 *Total estimé :* ${formattedTotal} FCFA\n💳 *Facilité :* ${paymentSplits} tranches de ~${formattedSplit} FCFA\n⚡ *Délai :* 72h dès remise des éléments\n\nDiscutons des prochaines étapes pour le lancement !`;
    }

    const studioPhone = process.env.NEXT_PUBLIC_STUDIO_WHATSAPP || '237692025552';
    const whatsappUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(whatsappText)}`;


    return NextResponse.json({
      success: true,
      quoteReference,
      quoteType,
      whatsappUrl,
      summary: {
        totalPriceXAF,
        formattedTotal: totalPriceXAF > 0 ? `${formattedTotal} FCFA` : (isEn ? 'Custom Quote' : 'Sur Devis'),
        splits: paymentSplits,
        splitAmount: splitAmount > 0 ? `${formattedSplit} FCFA` : undefined,
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
