import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const contactFile = path.join(dataDir, 'site-contact.json');

const defaultContact = {
  phone: '+237 6 99 00 00 00',
  whatsapp: '+237 6 99 00 00 00',
  email: 'hello@programactor.pro',
  facebook: 'https://facebook.com/programactor',
  twitter: 'https://x.com/programactor',
  instagram: 'https://www.instagram.com/programactor/',
  cities: 'Douala · Libreville',
  updatedAt: new Date().toISOString(),
};

async function getContactData() {
  try {
    const raw = await fs.readFile(contactFile, 'utf-8');
    return { ...defaultContact, ...JSON.parse(raw) };
  } catch {
    return defaultContact;
  }
}

export async function GET() {
  try {
    const data = await getContactData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, data: defaultContact }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await getContactData();

    const updated = {
      ...current,
      phone: body.phone !== undefined ? String(body.phone).trim() : current.phone,
      whatsapp: body.whatsapp !== undefined ? String(body.whatsapp).trim() : current.whatsapp,
      email: body.email !== undefined ? String(body.email).trim() : current.email,
      facebook: body.facebook !== undefined ? String(body.facebook).trim() : current.facebook,
      twitter: body.twitter !== undefined ? String(body.twitter).trim() : current.twitter,
      instagram: body.instagram !== undefined ? String(body.instagram).trim() : current.instagram,
      cities: body.cities !== undefined ? String(body.cities).trim() : current.cities,
      updatedAt: new Date().toISOString(),
    };

    try {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(contactFile, JSON.stringify(updated, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn('Erreur écriture locale site-contact.json :', writeErr);
    }

    // Synchronisation avec le backend VPS / MongoDB Atlas si configuré
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      await fetch(`${vpsApiUrl}/settings/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (vpsErr) {
      // Tolérance aux pannes réseau
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Erreur API settings/contact PATCH :', error);
    return NextResponse.json({ success: false, message: 'Erreur mise à jour contact.' }, { status: 500 });
  }
}
