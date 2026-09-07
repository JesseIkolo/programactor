import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const quotesFile = path.join(dataDir, 'xpresite-quotes.json');

async function getQuotesList() {
  try {
    const fileContent = await fs.readFile(quotesFile, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const quotes = await getQuotesList();
    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    console.error('Erreur API admin/quotes GET :', error);
    return NextResponse.json({ success: false, message: 'Impossible de lire les devis.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, status, internalNotes } = body;

    if (!reference) {
      return NextResponse.json({ success: false, message: 'Référence requise.' }, { status: 400 });
    }

    const quotes = await getQuotesList();
    const index = quotes.findIndex((q: any) => q.reference === reference);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Devis introuvable.' }, { status: 404 });
    }

    if (status) quotes[index].status = status;
    if (internalNotes !== undefined) quotes[index].internalNotes = internalNotes;
    quotes[index].updatedAt = new Date().toISOString();

    try {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(quotesFile, JSON.stringify(quotes, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Impossible d\'écrire les devis localement :', fsErr);
    }

    return NextResponse.json({ success: true, quote: quotes[index] });
  } catch (error) {
    console.error('Erreur API admin/quotes PATCH :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la mise à jour.' }, { status: 500 });
  }
}
