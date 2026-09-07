import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const bookingsFile = path.join(dataDir, 'bookings.json');

async function getLocalBookings(): Promise<any[]> {
  try {
    const fileContent = await fs.readFile(bookingsFile, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

async function saveLocalBookings(bookings: any[]): Promise<void> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(bookingsFile, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (err) {
    // Dans les environnements serverless read-only (Netlify / AWS Lambda)
    console.warn('Impossible d\'écrire les réservations localement (système de fichiers en lecture seule) :', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Tenter d'abord le VPS
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const authHeader = req.headers.get('authorization');
      const vpsRes = await fetch(`${vpsApiUrl}/bookings?${searchParams.toString()}`, {
        headers: authHeader ? { Authorization: authHeader } : {},
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(3500),
      });
      if (vpsRes.ok) {
        const vpsData = await vpsRes.json();
        return NextResponse.json(vpsData);
      }
    } catch {
      // Fallback local
    }

    let bookings = await getLocalBookings();
    if (status && status !== 'ALL') {
      bookings = bookings.filter((b) => b.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.clientName?.toLowerCase().includes(q) ||
          b.clientPhone?.toLowerCase().includes(q) ||
          b.clientEmail?.toLowerCase().includes(q) ||
          b.reference?.toLowerCase().includes(q) ||
          b.companyName?.toLowerCase().includes(q)
      );
    }

    bookings.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Erreur API bookings GET :', error);
    return NextResponse.json({ success: false, message: 'Impossible de lire les réservations.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientCity = '',
      companyName = '',
      sector = '',
      topic = '',
      meetingType = 'EN_LIGNE',
      locationDetails = '',
      date,
      timeSlot,
      lang = 'fr',
    } = body;

    if (!clientName || !clientEmail || !clientPhone || !date || !timeSlot) {
      return NextResponse.json(
        { success: false, message: 'Champs obligatoires manquants (nom, email, téléphone, date, créneau).' },
        { status: 400 }
      );
    }

    // Tenter de pousser directement vers l'API VPS MongoDB Atlas
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const vpsRes = await fetch(`${vpsApiUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      });
      const vpsData = await vpsRes.json();
      if (vpsRes.status < 500) {
        return NextResponse.json(vpsData, { status: vpsRes.status });
      }
    } catch {
      // VPS injoignable (erreur réseau, 500, timeout), on bascule en secours local
    }

    // Récupérer le numéro du studio depuis site-contact.json ou défaut
    let studioPhone = '237692025552';
    try {
      const contactFile = path.join(dataDir, 'site-contact.json');
      const contactData = JSON.parse(await fs.readFile(contactFile, 'utf-8'));
      if (contactData.whatsapp) {
        studioPhone = contactData.whatsapp.replace(/\D/g, '');
      }
    } catch {}

    const reference = `BK-${date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const channelLabel =
      meetingType === 'PRESENTIEL'
        ? (lang === 'en' ? 'In-Person Meeting' : 'Présentiel (Bureaux Studio / Client)')
        : (lang === 'en' ? 'Online Video (Google Meet / WhatsApp)' : 'En ligne (Google Meet / WhatsApp)');

    const whatsappMessage = lang === 'en'
      ? `Hello Programactor! 👋\n\nI just scheduled a 30-minute studio strategy session:\n\n📋 *Ref:* ${reference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📅 *Date & Slot:* ${date} at ${timeSlot}\n📍 *Channel:* ${channelLabel}\n🎯 *Topic:* ${topic || 'Digital project'}\n\nLooking forward to speaking with you!`
      : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de planifier un rendez-vous de cadrage stratégique (30 min) :\n\n📋 *Réf :* ${reference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📅 *Date & Heure :* ${date} à ${timeSlot}\n📍 *Canal :* ${channelLabel}\n🎯 *Sujet :* ${topic || 'Projet digital'}\n\nÀ très vite pour notre échange !`;

    const whatsappUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    const newBooking = {
      _id: reference,
      reference,
      clientName,
      clientEmail,
      clientPhone,
      clientCity,
      companyName,
      sector,
      topic,
      meetingType,
      locationDetails,
      date,
      timeSlot,
      status: 'CONFIRMÉ',
      lang,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Cache local en secours
    try {
      const localBookings = await getLocalBookings();
      localBookings.unshift(newBooking);
      await saveLocalBookings(localBookings);
    } catch (fsErr) {
      console.warn('Sauvegarde locale ignorée (environnement serverless read-only) :', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous planifié avec succès.',
      data: {
        booking: newBooking,
        whatsappUrl,
      },
    });
  } catch (error) {
    console.error('Erreur API bookings POST :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la réservation.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, reference, status, internalNotes, meetingLink, date, timeSlot } = body;

    const lookupId = id || reference;
    if (!lookupId) {
      return NextResponse.json({ success: false, message: 'ID ou référence requise.' }, { status: 400 });
    }

    // Tenter la mise à jour sur VPS si possible
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const authHeader = req.headers.get('authorization');
      const vpsRes = await fetch(`${vpsApiUrl}/bookings/${lookupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      });
      if (vpsRes.ok) {
        const vpsData = await vpsRes.json();
        return NextResponse.json(vpsData);
      }
    } catch {}

    // Mise à jour locale
    const bookings = await getLocalBookings();
    const index = bookings.findIndex((b) => b._id === lookupId || b.reference === lookupId);
    if (index !== -1) {
      if (status) bookings[index].status = status;
      if (internalNotes !== undefined) bookings[index].internalNotes = internalNotes;
      if (meetingLink !== undefined) bookings[index].meetingLink = meetingLink;
      if (date) bookings[index].date = date;
      if (timeSlot) bookings[index].timeSlot = timeSlot;
      bookings[index].updatedAt = new Date().toISOString();
      await saveLocalBookings(bookings);
      return NextResponse.json({ success: true, data: bookings[index] });
    }

    return NextResponse.json({ success: false, message: 'Rendez-vous introuvable.' }, { status: 404 });
  } catch (error) {
    console.error('Erreur API bookings PATCH :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la modification.' }, { status: 500 });
  }
}
