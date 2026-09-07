import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BUSINESS_SLOTS = [
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
];

const dataDir = path.join(process.cwd(), 'data');
const bookingsFile = path.join(dataDir, 'bookings.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ success: false, message: 'Date invalide (YYYY-MM-DD).' }, { status: 400 });
    }

    // Tenter d'abord d'appeler le backend VPS
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const vpsRes = await fetch(`${vpsApiUrl}/bookings/slots?date=${date}`, {
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(3000),
      });
      if (vpsRes.ok) {
        const vpsData = await vpsRes.json();
        return NextResponse.json(vpsData);
      }
    } catch {
      // Fallback local
    }

    const selectedDate = new Date(`${date}T00:00:00Z`);
    const dayOfWeek = selectedDate.getUTCDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({
        success: true,
        date,
        isWeekend: true,
        slots: [],
        message: 'Le studio est fermé le week-end.',
      });
    }

    let bookedSlots = new Set<string>();
    try {
      const content = await fs.readFile(bookingsFile, 'utf-8');
      const bookings = JSON.parse(content);
      bookings
        .filter((b: any) => b.date === date && b.status !== 'ANNULÉ')
        .forEach((b: any) => bookedSlots.add(b.timeSlot));
    } catch {
      // Pas encore de fichier
    }

    const slots = BUSINESS_SLOTS.map((time) => ({
      time,
      available: !bookedSlots.has(time),
    }));

    return NextResponse.json({
      success: true,
      date,
      isWeekend: false,
      slots,
    });
  } catch (error) {
    console.error('Erreur API bookings/slots GET :', error);
    return NextResponse.json({ success: false, message: 'Erreur de calcul des créneaux.' }, { status: 500 });
  }
}
