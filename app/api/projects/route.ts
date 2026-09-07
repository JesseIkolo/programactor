import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const projectsFile = path.join(dataDir, 'projects.json');

const INITIAL_PROJECTS = [
  {
    _id: 'proj-fintech-momo',
    slug: 'fintech-momo',
    name: 'MoMo Pay Terminal',
    client: 'Fintech B2B',
    sector: 'Paiement mobile',
    city: 'Douala',
    year: '2026',
    duration: '3 semaines',
    status: 'PUBLISHED',
    featured: true,
    displayOrder: 1,
    coverImageUrl: '/projects/fintech.jpg',
    tags: ['Fintech', 'Mobile Money', 'Offline-First', 'Web'],
    contentFr: {
      tagline: 'Encaissement instantané QR code et USSD pour commerçants de proximité.',
      challenge: 'Réseaux 3G/EDGE instables dans les marchés de Douala, commerçants réticents aux interfaces chargées et retards de notification SMS.',
      solution: 'Architecture offline-first avec synchronisation automatique, génération instantanée de QR codes et confirmation audio bilingue.',
      impact: '-40% temps d’encaissement, 100% opérationnel offline, validé en 15 jours.',
      deliverables: ['PWA Offline-First', 'Passerelle MTN MoMo & Orange Money', 'Audio feedback'],
    },
    contentEn: {
      tagline: 'Instant QR code and USSD merchant terminal designed for low-connectivity markets.',
      challenge: 'Unstable 3G networks in central markets, complex merchant interfaces, and SMS notification lag.',
      solution: 'Offline-first architecture with automatic background sync, instant dynamic QR generation, and bilingual audio confirmations.',
      impact: '-40% transaction time, 100% offline uptime, tested with live merchants in 15 days.',
      deliverables: ['Offline-First PWA', 'MTN MoMo & Orange Money Gateway', 'Audio feedback'],
    },
    metrics: [
      { value: '-40%', labelFr: "Temps d'encaissement", labelEn: 'Transaction time' },
      { value: '100%', labelFr: 'Fonctionnement offline', labelEn: 'Offline uptime' },
      { value: '15j', labelFr: 'Du brief au test marchand', labelEn: 'Brief to live field test' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'proj-logistique-coursier',
    slug: 'logistique-coursier',
    name: 'Yamo Delivery',
    client: 'Express Dispatch',
    sector: 'Livraison dernier kilomètre',
    city: 'Libreville',
    year: '2026',
    duration: '6 semaines',
    status: 'PUBLISHED',
    featured: true,
    displayOrder: 2,
    coverImageUrl: '/projects/logistics.jpg',
    tags: ['Logistique', 'Mobile', 'Dispatch', 'Géolocalisation'],
    contentFr: {
      tagline: 'Système de dispatch coursier et guidage sans adressage postal formel.',
      challenge: 'Absence d’adresses formelles à Libreville, repérage empirique par carrefours, écoles et pharmacies.',
      solution: 'Application coursier basée sur des repères visuels géolocalisés, suivi en temps réel par SMS sans téléchargement obligatoire.',
      impact: '+52% de courses livrées à temps, temps d’orientation divisé par deux.',
      deliverables: ['App mobile coursier', 'Console dispatch dispatchers', 'Tracking SMS direct'],
    },
    contentEn: {
      tagline: 'Courier dispatch and navigation system designed for unmapped urban cities.',
      challenge: 'Lack of formal street addresses in Libreville, where navigation relies on landmark cues and local descriptions.',
      solution: 'Driver mobile app using visual landmark coordinates and no-app customer tracking via direct SMS links.',
      impact: '+52% on-time deliveries, dispatch resolution time reduced by 50%.',
      deliverables: ['Courier Mobile App', 'Dispatcher Central Console', 'Direct SMS Tracking Link'],
    },
    metrics: [
      { value: '+52%', labelFr: 'Livraisons à l’heure', labelEn: 'On-time deliveries' },
      { value: '0 app', labelFr: 'Requis pour le destinataire', labelEn: 'Required for receiver' },
      { value: '6 sem.', labelFr: 'Délai total de livraison', labelEn: 'Total turnaround time' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'proj-sante-rdv',
    slug: 'sante-rdv',
    name: 'Cabinet Médical Santé Plus',
    client: 'Clinique de la Paix',
    sector: 'Santé & Médical',
    city: 'Douala',
    year: '2025',
    duration: '4 semaines',
    status: 'PUBLISHED',
    featured: true,
    displayOrder: 3,
    coverImageUrl: '/projects/health.jpg',
    tags: ['Santé', 'Prise de RDV', 'WhatsApp', 'Web'],
    contentFr: {
      tagline: 'Prise de rendez-vous médical sans friction via WhatsApp et rappels automatisés.',
      challenge: 'Taux élevé de rendez-vous manqués (no-show de 35%) et secrétariat médical surchargé d’appels répétitifs.',
      solution: 'Tunnel de réservation en 3 clics avec confirmation immédiate et rappels programmés par SMS et WhatsApp.',
      impact: '-65% de rendez-vous non honorés, gain de 2 heures par jour pour le secrétariat.',
      deliverables: ['Portail de prise de rendez-vous', 'Synchronisation agenda médecins', 'Module de rappels automatiques'],
    },
    contentEn: {
      tagline: 'Zero-friction medical appointment booking with automated WhatsApp reminders.',
      challenge: 'High 35% patient no-show rate and medical receptionists overloaded with routine booking calls.',
      solution: '3-click web appointment flow with automated SMS and WhatsApp confirmations and 24h reminders.',
      impact: '-65% patient no-show rate, saving 2 hours daily for reception staff.',
      deliverables: ['Patient Booking Web Portal', 'Doctor Calendar Sync', 'Automated Reminder Engine'],
    },
    metrics: [
      { value: '-65%', labelFr: 'Taux de non-présentation', labelEn: 'No-show reduction' },
      { value: '3 clics', labelFr: 'Pour réserver', labelEn: 'To book appointment' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'proj-commerce-catalogue',
    slug: 'commerce-catalogue',
    name: 'Boutique Wax & Chic',
    client: 'Maison Wax',
    sector: 'Commerce & Mode',
    city: 'Yaoundé',
    year: '2025',
    duration: '2 semaines',
    status: 'PUBLISHED',
    featured: false,
    displayOrder: 4,
    coverImageUrl: '/projects/fashion.jpg',
    tags: ['Commerce', 'E-commerce', 'WhatsApp', 'Identité'],
    contentFr: {
      tagline: 'Catalogue interactif mobile avec synchronisation directe du panier WhatsApp.',
      challenge: 'Clients qui demandent les prix un par un en DM Instagram et perte de ventes lors de ruptures de stock non signalées.',
      solution: 'Site catalogue mobile ultra-rapide avec panier persistant et bouton d’envoi direct de la commande formatée sur WhatsApp.',
      impact: 'Conversion multipliée par 2.5, panier moyen en hausse de 35%.',
      deliverables: ['Catalogue web mobile', 'Gestion des stocks simplifiée', 'Panier WhatsApp direct'],
    },
    contentEn: {
      tagline: 'Interactive mobile product catalogue with direct WhatsApp cart handoff.',
      challenge: 'Customer friction asking individual prices in Instagram DMs and lost sales from untracked inventory.',
      solution: 'Fast mobile web showcase with persistent shopping bag and instant WhatsApp order formatting.',
      impact: '2.5x conversion boost, 35% increase in average order value.',
      deliverables: ['Mobile Web Catalogue', 'Stock Management UI', 'WhatsApp Direct Checkout'],
    },
    metrics: [
      { value: 'x2.5', labelFr: 'Taux de conversion', labelEn: 'Conversion rate' },
      { value: '+35%', labelFr: 'Panier moyen', labelEn: 'Average order value' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

async function getLocalProjects(): Promise<any[]> {
  try {
    const fileContent = await fs.readFile(projectsFile, 'utf-8');
    const projects = JSON.parse(fileContent);
    if (Array.isArray(projects) && projects.length > 0) {
      return projects;
    }
  } catch {}

  // Initialisation avec le seed
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(projectsFile, JSON.stringify(INITIAL_PROJECTS, null, 2), 'utf-8');
  return INITIAL_PROJECTS;
}

async function saveLocalProjects(projects: any[]): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    // Tenter de contacter le VPS
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const authHeader = req.headers.get('authorization');
      const vpsRes = await fetch(`${vpsApiUrl}/projects?${searchParams.toString()}`, {
        headers: authHeader ? { Authorization: authHeader } : {},
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(3500),
      });
      if (vpsRes.ok) {
        const vpsData = await vpsRes.json();
        if (vpsData.success && Array.isArray(vpsData.data) && vpsData.data.length > 0) {
          return NextResponse.json(vpsData);
        }
      }
    } catch {}

    let projects = await getLocalProjects();

    if (status && status !== 'ALL') {
      projects = projects.filter((p) => p.status === status);
    }
    if (featured !== null && featured !== undefined && featured !== '') {
      const isFeatured = featured === 'true';
      projects = projects.filter((p) => Boolean(p.featured) === isFeatured);
    }

    projects.sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Erreur API projects GET :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors du chargement des projets.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      client = '',
      sector,
      city,
      year = new Date().getFullYear().toString(),
      duration = '3 semaines',
      status = 'PUBLISHED',
      featured = false,
      displayOrder = 1,
      coverImageUrl = '',
      tags = [],
      contentFr = {},
      contentEn = {},
      metrics = [],
    } = body;

    if (!name || !sector || !city) {
      return NextResponse.json(
        { success: false, message: 'Champs obligatoires manquants (nom, secteur, ville).' },
        { status: 400 }
      );
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProject = {
      _id: `proj-${cleanSlug}-${Date.now()}`,
      slug: cleanSlug,
      name,
      client,
      sector,
      city,
      year,
      duration,
      status,
      featured: Boolean(featured),
      displayOrder: Number(displayOrder) || 1,
      coverImageUrl,
      tags: Array.isArray(tags) ? tags : [],
      contentFr: {
        tagline: contentFr.tagline || '',
        challenge: contentFr.challenge || '',
        solution: contentFr.solution || '',
        impact: contentFr.impact || '',
        deliverables: contentFr.deliverables || [],
      },
      contentEn: {
        tagline: contentEn.tagline || '',
        challenge: contentEn.challenge || '',
        solution: contentEn.solution || '',
        impact: contentEn.impact || '',
        deliverables: contentEn.deliverables || [],
      },
      metrics: Array.isArray(metrics) ? metrics : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Pousser vers le VPS si joignable
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const authHeader = req.headers.get('authorization');
      await fetch(`${vpsApiUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(newProject),
        signal: AbortSignal.timeout(3500),
      });
    } catch {}

    // Sauvegarder dans le cache local
    const projects = await getLocalProjects();
    projects.unshift(newProject);
    await saveLocalProjects(projects);

    return NextResponse.json({
      success: true,
      message: 'Projet créé avec succès.',
      data: newProject,
    });
  } catch (error) {
    console.error('Erreur API projects POST :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la création du projet.' }, { status: 500 });
  }
}
