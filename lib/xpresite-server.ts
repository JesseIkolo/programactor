import fs from 'fs/promises';
import path from 'path';
import { XPRESITE_CONFIG, type XpreSiteConfig } from './xpresite-data';

export async function getXpreSiteConfigServer(): Promise<XpreSiteConfig> {
  // 1. Si VPS configuré
  const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (vpsApiUrl) {
    try {
      const res = await fetch(`${vpsApiUrl}/xpresite/config`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return {
            ...XPRESITE_CONFIG,
            ...json.data,
          };
        }
      }
    } catch {}
  }

  // 2. Fichier data/xpresite-config.json local
  const configFile = path.join(process.cwd(), 'data', 'xpresite-config.json');
  try {
    const raw = await fs.readFile(configFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        ...XPRESITE_CONFIG,
        ...parsed,
      };
    }
  } catch {}

  return XPRESITE_CONFIG;
}
