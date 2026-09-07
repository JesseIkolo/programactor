import { Request, Response } from 'express';
import { Booking } from '../models/Booking.model.js';

export async function createBooking(req: Request, res: Response): Promise<void> {
  const {
    clientName,
    clientEmail,
    clientPhone,
    clientCity,
    companyName,
    sector,
    problemSummary,
    desiredOffer,
    preferredChannel = 'meet',
    scheduledAt,
    clientTimezone = 'Africa/Douala',
  } = req.body;

  const appointmentDate = new Date(scheduledAt);

  // Vérifier les créneaux déjà réservés (anti-collision)
  const existingBooking = await Booking.findOne({
    scheduledAt: appointmentDate,
    status: { $in: ['CONFIRMED', 'RESCHEDULED'] },
  });

  if (existingBooking) {
    res.status(409).json({
      success: false,
      message: 'Ce créneau horaire est déjà réservé. Veuillez en choisir un autre.',
    });
    return;
  }

  const newBooking = await Booking.create({
    clientName,
    clientEmail,
    clientPhone,
    clientCity,
    companyName,
    sector,
    problemSummary,
    desiredOffer,
    preferredChannel,
    scheduledAt: appointmentDate,
    durationMinutes: 30,
    clientTimezone,
    status: 'CONFIRMED',
  });

  console.log(`[Booking] Nouveau rendez-vous confirmé : ${clientName} le ${appointmentDate.toISOString()}`);

  res.status(201).json({
    success: true,
    message: 'Rendez-vous confirmé avec succès.',
    data: newBooking,
  });
}

export async function getBookings(req: Request, res: Response): Promise<void> {
  const { status, fromDate } = req.query;

  const query: any = {};
  if (status && typeof status === 'string') {
    query.status = status;
  }
  if (fromDate && typeof fromDate === 'string') {
    query.scheduledAt = { $gte: new Date(fromDate) };
  }

  const bookings = await Booking.find(query).sort({ scheduledAt: 1 });

  res.json({
    success: true,
    data: bookings,
  });
}

export async function updateBooking(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, scheduledAt, internalNotes, meetingLink } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    id,
    {
      ...(status && { status }),
      ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      ...(internalNotes !== undefined && { internalNotes }),
      ...(meetingLink !== undefined && { meetingLink }),
    },
    { new: true }
  );

  if (!booking) {
    res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
    return;
  }

  res.json({ success: true, data: booking });
}
