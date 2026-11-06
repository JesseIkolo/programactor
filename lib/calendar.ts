/**
 * Utilitaires pour la génération de liens Google Agenda et de calendrier
 */

interface CalendarEventParams {
  title: string;
  description: string;
  location?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm ou HH:mm - HH:mm
  durationMinutes?: number;
}

/**
 * Génère un lien direct pour ajouter l'événement dans Google Agenda
 */
export function generateGoogleCalendarUrl({
  title,
  description,
  location = 'En ligne (Google Meet / WhatsApp)',
  date,
  timeSlot,
  durationMinutes = 30,
}: CalendarEventParams): string {
  try {
    const rawTime = (timeSlot || '10:00').split('-')[0].trim();
    const parts = rawTime.split(':').map((p) => parseInt(p, 10));
    const hours = isNaN(parts[0]) ? 10 : parts[0];
    const minutes = isNaN(parts[1]) ? 0 : parts[1];

    const startTotal = hours * 60 + minutes;
    const endTotal = startTotal + durationMinutes;

    const endH = Math.floor(endTotal / 60) % 24;
    const endM = endTotal % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    const cleanDate = date.replace(/-/g, '');

    const startStr = `${cleanDate}T${pad(hours)}${pad(minutes)}00`;
    const endStr = `${cleanDate}T${pad(endH)}${pad(endM)}00`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startStr}/${endStr}`,
      ctz: 'Africa/Douala',
      details: description,
      location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (err) {
    console.error('Erreur generateGoogleCalendarUrl:', err);
    return 'https://calendar.google.com';
  }
}
