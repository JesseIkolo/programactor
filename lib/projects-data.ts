import fs from 'fs/promises';
import path from 'path';
import type { DetailedProject, Lang } from './content';

const dataDir = path.join(process.cwd(), 'data');
const projectsFile = path.join(dataDir, 'projects.json');

export interface ProjectRecord {
  _id: string;
  slug: string;
  name: string;
  client?: string;
  sector: string;
  city: string;
  year?: string;
  duration?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured?: boolean;
  displayOrder?: number;
  coverImageUrl?: string;
  tags?: string[];
  contentFr?: {
    tagline?: string;
    challenge?: string;
    solution?: string;
    impact?: string;
    deliverables?: string[];
  };
  contentEn?: {
    tagline?: string;
    challenge?: string;
    solution?: string;
    impact?: string;
    deliverables?: string[];
  };
  metrics?: Array<{
    value: string;
    labelFr?: string;
    labelEn?: string;
  }>;
}

/**
 * Récupère tous les projets bruts depuis le stockage (VPS ou fichier data/projects.json).
 */
export async function getRawProjects(): Promise<ProjectRecord[]> {
  // 1. Tenter l'API distante VPS si disponible
  const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (vpsApiUrl) {
    try {
      const res = await fetch(`${vpsApiUrl}/projects`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {}
  }

  // 2. Tenter de lire data/projects.json local
  try {
    const raw = await fs.readFile(projectsFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}

  return [];
}

/**
 * Formate un enregistrement de projet brut en DetailedProject selon la langue.
 */
export function formatProject(p: ProjectRecord, lang: Lang): DetailedProject {
  const isEn = lang === 'en';

  const tagline = isEn
    ? p.contentEn?.tagline || p.contentFr?.tagline || ''
    : p.contentFr?.tagline || p.contentEn?.tagline || '';

  const challenge = isEn
    ? p.contentEn?.challenge || p.contentFr?.challenge || ''
    : p.contentFr?.challenge || p.contentEn?.challenge || '';

  const solution = isEn
    ? p.contentEn?.solution || p.contentFr?.solution || ''
    : p.contentFr?.solution || p.contentEn?.solution || '';

  const deliverables = (isEn ? p.contentEn?.deliverables : p.contentFr?.deliverables) || [];

  const metrics = (p.metrics || []).map((m) => ({
    value: m.value,
    label: isEn ? m.labelEn || m.labelFr || '' : m.labelFr || m.labelEn || '',
  }));

  const statusLabel =
    p.status === 'PUBLISHED' ? (isEn ? 'Live' : 'En ligne') : p.status;

  return {
    key: p.slug || p._id,
    id: p.slug || p._id,
    name: p.name,
    client: p.client || '',
    sector: p.sector,
    city: p.city,
    year: p.year || '2026',
    duration: p.duration || (isEn ? '3 weeks' : '3 semaines'),
    status: statusLabel,
    tags: p.tags && p.tags.length > 0 ? p.tags : ['Produit', 'Design'],
    tagline,
    challenge,
    solution,
    deliverables,
    metrics,
    accentTone: 'signal',
    image: p.coverImageUrl,
    coverImageUrl: p.coverImageUrl,
  };
}

/**
 * Retourne tous les projets publiés triés par ordre d'affichage.
 */
export async function getPublishedProjects(lang: Lang): Promise<DetailedProject[]> {
  const raw = await getRawProjects();
  const published = raw.filter((p) => p.status === 'PUBLISHED');

  published.sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

  return published.map((p) => formatProject(p, lang));
}

/**
 * Retourne les projets mis en avant pour la page d'accueil (featured: true).
 */
export async function getFeaturedProjects(lang: Lang): Promise<DetailedProject[]> {
  const raw = await getRawProjects();
  let featured = raw.filter((p) => p.status === 'PUBLISHED' && p.featured);

  // Si aucun n'est expressément 'featured', prendre les 4 premiers publiés
  if (featured.length === 0) {
    featured = raw.filter((p) => p.status === 'PUBLISHED').slice(0, 4);
  }

  featured.sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

  return featured.map((p) => formatProject(p, lang));
}
