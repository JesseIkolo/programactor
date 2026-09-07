import { Request, Response } from 'express';
import { Booking, BookingStatus } from '../models/Booking.model.js';

// Créneaux horaires fixes (Option A : 10h00 à 18h00 par pas de 30 minutes)
export const BUSINESS_SLOTS = [
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
];

function generateBookingRef(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK-${dateStr}-${rand}`;
}

/**
 * GET /api/v1/bookings/slots?date=YYYY-MM-DD
 * Renvoie les créneaux disponibles pour une date donnée (Lun-Ven uniquement)
 */
export async function getAvailableSlots(req: Request, res: Response): Promise<void> {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ success: false, message: 'Format de date invalide (requis : YYYY-MM-DD).' });
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00Z`);
    const dayOfWeek = selectedDate.getUTCDay(); // 0 = Dimanche, 6 = Samedi

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      res.json({
        success: true,
        date,
        isWeekend: true,
        availableSlots: [],
        message: 'Le studio est fermé le week-end.',
      });
      return;
    }

    // Récupérer les réservations existantes actives pour cette date
    const bookedOnDate = await Booking.find({
      date,
      status: { $in: ['CONFIRMÉ', 'EN ATTENTE', 'EN ATTENTE DE PAIEMENT', 'REPORTÉ'] },
    }).select('timeSlot');

    const bookedSlots = new Set(bookedOnDate.map((b) => b.timeSlot));

    const slots = BUSINESS_SLOTS.map((time) => ({
      time,
      available: !bookedSlots.has(time),
    }));

    res.json({
      success: true,
      date,
      isWeekend: false,
      slots,
    });
  } catch (error) {
    console.error('Erreur getAvailableSlots :', error);
    res.status(500).json({ success: false, message: 'Erreur lors du calcul des créneaux.' });
  }
}

/**
 * POST /api/v1/bookings
 * Création d'un rendez-vous avec anti-collision et génération du lien WhatsApp
 */
export async function createBooking(req: Request, res: Response): Promise<void> {
  try {
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
    } = req.body;

    if (!clientName || !clientEmail || !clientPhone || !date || !timeSlot) {
      res.status(400).json({
        success: false,
        message: 'Champs obligatoires manquants (nom, email, téléphone, date, créneau).',
      });
      return;
    }

    // Anti-collision : Vérifier si le créneau est déjà pris
    const collision = await Booking.findOne({
      date,
      timeSlot,
      status: { $in: ['CONFIRMÉ', 'EN ATTENTE', 'REPORTÉ'] },
    });

    if (collision) {
      res.status(409).json({
        success: false,
        message: 'Ce créneau horaire est déjà réservé. Veuillez choisir une autre tranche horaire.',
      });
      return;
    }

    const reference = generateBookingRef();
    const scheduledAt = new Date(`${date}T${timeSlot}:00Z`);

    const booking = await Booking.create({
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
      scheduledAt,
      durationMinutes: 30,
      clientTimezone: 'Africa/Douala',
      status: 'CONFIRMÉ',
      lang,
    });

    // Formatage du message de redirection WhatsApp
    const studioPhone = '237699000000';
    const channelLabel =
      meetingType === 'PRESENTIEL'
        ? (lang === 'en' ? 'In-Person Meeting' : 'Présentiel (Bureaux Studio / Client)')
        : (lang === 'en' ? 'Online Video (Google Meet / WhatsApp)' : 'En ligne (Google Meet / WhatsApp)');

    const whatsappMessage = lang === 'en'
      ? `Hello Programactor! 👋\n\nI just scheduled a 30-minute studio strategy session:\n\n📋 *Ref:* ${reference}\n👤 *Name:* ${clientName} (${companyName || 'Project'})\n📅 *Date & Slot:* ${date} at ${timeSlot}\n📍 *Channel:* ${channelLabel}\n🎯 *Topic:* ${topic || 'Digital project'}\n\nLooking forward to speaking with you!`
      : `Bonjour l'équipe Programactor ! 👋\n\nJe viens de planifier un rendez-vous de cadrage stratégique (30 min) :\n\n📋 *Réf :* ${reference}\n👤 *Nom :* ${clientName} (${companyName || 'Mon projet'})\n📅 *Date & Heure :* ${date} à ${timeSlot}\n📍 *Canal :* ${channelLabel}\n🎯 *Sujet :* ${topic || 'Projet digital'}\n\nÀ très vite pour notre échange !`;

    const whatsappUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    res.status(201).json({
      success: true,
      message: 'Rendez-vous planifié avec succès.',
      data: {
        booking,
        whatsappUrl,
      },
    });
  } catch (error) {
    console.error('Erreur createBooking :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la réservation.' });
  }
}

/**
 * GET /api/v1/bookings
 * Liste administrative des rendez-vous avec filtres
 */
export async function getBookings(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;
    const query: any = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search && typeof search === 'string') {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientPhone: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(query).sort({ date: -1, timeSlot: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Erreur getBookings :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rendez-vous.' });
  }
}

/**
 * PATCH /api/v1/bookings/:id
 * Mise à jour de statut, notes internes, créneau
 */
export async function updateBooking(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, internalNotes, meetingLink, date, timeSlot } = req.body;

    const updates: any = {};
    if (status) updates.status = status as BookingStatus;
    if (internalNotes !== undefined) updates.internalNotes = internalNotes;
    if (meetingLink !== undefined) updates.meetingLink = meetingLink;
    if (date && timeSlot) {
      updates.date = date;
      updates.timeSlot = timeSlot;
      updates.scheduledAt = new Date(`${date}T${timeSlot}:00Z`);
    }

    const booking = await Booking.findByIdAndUpdate(id, updates, { new: true });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
      return;
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Erreur updateBooking :', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour.' });
  }
}
