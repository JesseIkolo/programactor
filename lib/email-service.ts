import { generateGoogleCalendarUrl } from './calendar';

export interface BookingNotificationData {
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  sector?: string;
  topic?: string;
  meetingType: 'EN_LIGNE' | 'PRESENTIEL' | string;
  locationDetails?: string;
  date: string;
  timeSlot: string;
  lang?: string;
}

/**
 * Envoie un email de notification lors de la prise d'un rendez-vous.
 * Cible par défaut : jesseikolo@gmail.com
 */
export async function sendBookingNotificationEmail(
  data: BookingNotificationData
): Promise<{ success: boolean; error?: string }> {
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'jesseikolo@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;

  const channelLabel =
    data.meetingType === 'PRESENTIEL'
      ? 'Chez le client (Douala)'
      : 'En ligne (Google Meet / WhatsApp)';

  const calendarUrl = generateGoogleCalendarUrl({
    title: `Session Stratégique Programactor : ${data.clientName}`,
    description: `Rendez-vous de cadrage stratégique Programactor\n\nClient : ${data.clientName} (${data.companyName || 'Projet'})\nTéléphone : ${data.clientPhone}\nEmail : ${data.clientEmail}\nSujet : ${data.topic || 'Projet digital'}\nFormat : ${channelLabel}\nRéférence : ${data.reference}`,
    location: data.meetingType === 'PRESENTIEL' ? (data.locationDetails || 'Chez le client, Douala') : 'Google Meet / WhatsApp',
    date: data.date,
    timeSlot: data.timeSlot,
  });

  const whatsappPhone = data.clientPhone.replace(/\D/g, '');
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
            <div class="title">${data.date} à ${data.timeSlot}</div>
            <p style="color: #999999; font-size: 14px; margin: 0;">Réf : ${data.reference}</p>
          </div>

          <div class="card">
            <div class="row">
              <span class="label">Client</span>
              <span class="value">${data.clientName}</span>
            </div>
            ${data.companyName ? `
            <div class="row">
              <span class="label">Entreprise / Projet</span>
              <span class="value">${data.companyName}</span>
            </div>` : ''}
            <div class="row">
              <span class="label">Téléphone</span>
              <span class="value">${data.clientPhone}</span>
            </div>
            <div class="row">
              <span class="label">Email</span>
              <span class="value">${data.clientEmail}</span>
            </div>
            <div class="row">
              <span class="label">Créneau (GMT+1)</span>
              <span class="value highlight">${data.date} à ${data.timeSlot}</span>
            </div>
            <div class="row">
              <span class="label">Format</span>
              <span class="value">${channelLabel}</span>
            </div>
            ${data.topic ? `
            <div class="row">
              <span class="label">Sujet abordé</span>
              <span class="value">${data.topic}</span>
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
    console.log(`[Email Service] RESEND_API_KEY non configurée. Notification simulée pour : ${targetEmail}`);
    console.log(`[Email Service] Détails : Rendez-vous ${data.reference} pour ${data.clientName} le ${data.date} à ${data.timeSlot}`);
    console.log(`[Email Service] Lien Google Agenda généré : ${calendarUrl}`);
    return { success: true };
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
        subject: `📅 Nouveau Rendez-vous : ${data.clientName} (${data.date} à ${data.timeSlot})`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[Email Service] Erreur retournée par Resend :', errBody);
      return { success: false, error: errBody };
    }

    console.log(`[Email Service] Notification e-mail envoyée avec succès à ${targetEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Email Service] Exception lors de l’envoi e-mail :', error);
    return { success: false, error: error?.message || 'Erreur réseau email' };
  }
}
