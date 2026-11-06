import { ENV } from '../config/env.js';

interface BookingEmailParams {
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  meetingType: string;
  locationDetails?: string;
  topic?: string;
  date: string;
  timeSlot: string;
  lang?: string;
}

function generateGoogleCalendarUrl(params: {
  title: string;
  description: string;
  location: string;
  date: string;
  timeSlot: string;
}): string {
  try {
    const rawTime = (params.timeSlot || '10:00').split('-')[0].trim();
    const parts = rawTime.split(':').map((p) => parseInt(p, 10));
    const hours = isNaN(parts[0]) ? 10 : parts[0];
    const minutes = isNaN(parts[1]) ? 0 : parts[1];

    const startTotal = hours * 60 + minutes;
    const endTotal = startTotal + 30;

    const endH = Math.floor(endTotal / 60) % 24;
    const endM = endTotal % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    const cleanDate = params.date.replace(/-/g, '');

    const startStr = `${cleanDate}T${pad(hours)}${pad(minutes)}00`;
    const endStr = `${cleanDate}T${pad(endH)}${pad(endM)}00`;

    const q = new URLSearchParams({
      action: 'TEMPLATE',
      text: params.title,
      dates: `${startStr}/${endStr}`,
      ctz: 'Africa/Douala',
      details: params.description,
      location: params.location,
    });

    return `https://calendar.google.com/calendar/render?${q.toString()}`;
  } catch {
    return 'https://calendar.google.com';
  }
}

export async function sendBookingNotificationEmail(params: BookingEmailParams): Promise<boolean> {
  const targetEmail = ENV.NOTIFICATION_EMAIL || 'jesseikolo@gmail.com';
  const resendApiKey = ENV.RESEND_API_KEY || process.env.RESEND_API_KEY;

  const channelLabel =
    params.meetingType === 'PRESENTIEL'
      ? 'Chez le client (Douala)'
      : 'En ligne (Google Meet / WhatsApp)';

  const calendarUrl = generateGoogleCalendarUrl({
    title: `Session Stratégique Programactor : ${params.clientName}`,
    description: `Rendez-vous de cadrage stratégique Programactor\n\nClient : ${params.clientName} (${params.companyName || 'Projet'})\nTéléphone : ${params.clientPhone}\nEmail : ${params.clientEmail}\nSujet : ${params.topic || 'Projet digital'}\nFormat : ${channelLabel}\nRéférence : ${params.reference}`,
    location: params.meetingType === 'PRESENTIEL' ? (params.locationDetails || 'Chez le client, Douala') : 'Google Meet / WhatsApp',
    date: params.date,
    timeSlot: params.timeSlot,
  });

  const whatsappPhone = params.clientPhone.replace(/\D/g, '');
  const clientWhatsappUrl = `https://wa.me/${whatsappPhone}`;
  const adminUrl = 'https://www.programactor.pro/fr/admin';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0E0E0E; color: #FFFFFF; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #141414; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px; }
          .header { text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 20px; font-weight: bold; letter-spacing: -0.5px; color: #FFFFFF; }
          .badge { display: inline-block; background-color: rgba(235, 255, 114, 0.15); color: #EBFF72; border: 1px solid rgba(235, 255, 114, 0.3); padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 10px; }
          .title { font-size: 22px; font-weight: 700; color: #FFFFFF; margin-top: 14px; margin-bottom: 8px; }
          .card { background-color: #0A0A0A; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; border-bottom: 1px dashed rgba(255, 255, 255, 0.05); padding-bottom: 8px; }
          .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .label { color: #888888; }
          .value { color: #FFFFFF; font-weight: 600; text-align: right; }
          .highlight { color: #EBFF72; }
          .btn-container { text-align: center; margin-top: 28px; }
          .btn-primary { display: inline-block; background-color: #EBFF72; color: #0E0E0E; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-bottom: 12px; }
          .btn-secondary { display: inline-block; background-color: rgba(255, 255, 255, 0.08); color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 13px; margin: 0 6px 12px 6px; border: 1px solid rgba(255, 255, 255, 0.15); }
          .footer { text-align: center; font-size: 12px; color: #666666; margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">PROGRAMACTOR</div>
            <div class="badge">Nouveau Rendez-vous Programmé</div>
            <div class="title">${params.date} à ${params.timeSlot}</div>
            <p style="color: #999999; font-size: 14px; margin: 0;">Réf : ${params.reference}</p>
          </div>

          <div class="card">
            <div class="row">
              <span class="label">Client</span>
              <span class="value">${params.clientName}</span>
            </div>
            ${params.companyName ? `
            <div class="row">
              <span class="label">Entreprise / Projet</span>
              <span class="value">${params.companyName}</span>
            </div>` : ''}
            <div class="row">
              <span class="label">Téléphone</span>
              <span class="value">${params.clientPhone}</span>
            </div>
            <div class="row">
              <span class="label">Email</span>
              <span class="value">${params.clientEmail}</span>
            </div>
            <div class="row">
              <span class="label">Créneau (GMT+1)</span>
              <span class="value highlight">${params.date} à ${params.timeSlot}</span>
            </div>
            <div class="row">
              <span class="label">Format</span>
              <span class="value">${channelLabel}</span>
            </div>
            ${params.topic ? `
            <div class="row">
              <span class="label">Sujet abordé</span>
              <span class="value">${params.topic}</span>
            </div>` : ''}
          </div>

          <div class="btn-container">
            <a href="${calendarUrl}" class="btn-primary" target="_blank">
              📅 Ajouter à Google Agenda
            </a>
            <br>
            <a href="${clientWhatsappUrl}" class="btn-secondary" target="_blank">
              💬 Contacter sur WhatsApp
            </a>
            <a href="${adminUrl}" class="btn-secondary" target="_blank">
              🔐 Ouvrir le Dashboard Admin
            </a>
          </div>

          <div class="footer">
            Cet email a été envoyé automatiquement par le système d'agenda Programactor.<br>
            Destination configurée : ${targetEmail}
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resendApiKey) {
    console.log(`[Backend Email Service] Notification simulée pour ${targetEmail} (RESEND_API_KEY non fournie)`);
    console.log(`[Backend Email Service] Google Calendar Link: ${calendarUrl}`);
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Programactor Bookings <onboarding@resend.dev>',
        to: [targetEmail],
        subject: `📅 Nouveau Rendez-vous : ${params.clientName} (${params.date} à ${params.timeSlot})`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Backend Email Service] Erreur API Resend :', errText);
      return false;
    }

    console.log(`[Backend Email Service] Email de notification envoyé avec succès à ${targetEmail}`);
    return true;
  } catch (err) {
    console.error('[Backend Email Service] Exception envoi email :', err);
    return false;
  }
}
