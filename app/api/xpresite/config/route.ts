import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const configFile = path.join(dataDir, 'xpresite-config.json');

async function getLocalConfig() {
  try {
    const fileContent = await fs.readFile(configFile, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error('Erreur lecture config xpresite :', err);
    return null;
  }
}

async function saveLocalConfig(config: any) {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(configFile, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Impossible d\'écrire la config xpresite localement (environnement serverless) :', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    // Tenter de récupérer la config la plus récente depuis le VPS
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const vpsRes = await fetch(`${vpsApiUrl}/xpresite/config`, {
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(3000),
      });
      if (vpsRes.ok) {
        const vpsData = await vpsRes.json();
        if (vpsData.success && vpsData.data) {
          return NextResponse.json({ success: true, data: vpsData.data });
        }
      }
    } catch {}

    const config = await getLocalConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Erreur API xpresite/config GET :', error);
    return NextResponse.json({ success: false, message: 'Impossible de lire la configuration.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Pousser vers le VPS si possible
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const authHeader = req.headers.get('authorization');
      await fetch(`${vpsApiUrl}/xpresite/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3500),
      });
    } catch {}

    await saveLocalConfig(body);

    return NextResponse.json({
      success: true,
      message: 'Configuration XpreSite mise à jour avec succès.',
      data: body,
    });
  } catch (error) {
    console.error('Erreur API xpresite/config PUT :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la sauvegarde.' }, { status: 500 });
  }
}
