// =============================================================================
// CATALOGUE & TYPES OFFRE SITES PME / XPRESITE — PROGRAMACTOR
// Grille unique officielle du 05/11/2026
// =============================================================================

export interface XpreSitePlan {
  id: string;
  slug: 'essentiel' | 'complet';
  name: {
    fr: string;
    en: string;
  };
  badge?: {
    fr: string;
    en: string;
  };
  priceXAF: number;
  delay: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  features: {
    fr: string[];
    en: string[];
  };
}

export interface XpreSiteOption {
  id: string;
  slug: string;
  name: {
    fr: string;
    en: string;
  };
  desc: {
    fr: string;
    en: string;
  };
  priceXAF: number;
}

export interface XpreSiteIndustry {
  id: string;
  slug: string;
  name: {
    fr: string;
    en: string;
  };
  tagline: {
    fr: string;
    en: string;
  };
  iconName: 'utensils' | 'building' | 'car' | 'store' | string;
  badge?: {
    fr: string;
    en: string;
  };
  basePriceXAF?: number;
  isActive?: boolean;
  productBridges?: {
    title: string;
    price: string;
    cta: string;
    url?: string;
    waContext?: string;
  }[];
}

export interface XpreSiteConfig {
  defaultBasePriceXAF: number;
  completBasePriceXAF: number;
  deliveryPromiseHours: number;
  deliveryDelay?: string;
  allowThreeSplits?: boolean;
  hostingIncludedYears: number;
  whatsappContactNumber: string; // Ex: 237692025552
  plans?: XpreSitePlan[];
  globalOptions?: XpreSiteOption[];
  industries?: XpreSiteIndustry[];
}

export const XPRESITE_PLANS: XpreSitePlan[] = [
  {
    id: 'plan-essentiel',
    slug: 'essentiel',
    name: {
      fr: 'Site Essentiel',
      en: 'Essentiel Website',
    },
    priceXAF: 75000,
    delay: {
      fr: '72h chrono',
      en: '72 hours',
    },
    description: {
      fr: 'Site 1 page sur smartphone, bouton WhatsApp direct, horaires, nom de domaine et hébergement 1 an.',
      en: '1-page mobile-friendly website, WhatsApp button on each section, opening hours, 1-year domain & hosting.',
    },
    features: {
      fr: [
        'Site 1 page adapté au téléphone',
        'Bouton WhatsApp direct sur chaque section',
        'Horaires, adresse et lien d\'itinéraire',
        'Nom de domaine et hébergement 1 an inclus',
        'En ligne en 72 h chrono',
      ],
      en: [
        '1-page mobile-optimised website',
        'Direct WhatsApp button at every step',
        'Hours, address and one-tap directions',
        '1-year domain & high-performance hosting',
        'Live in 72 hours guaranteed',
      ],
    },
  },
  {
    id: 'plan-complet',
    slug: 'complet',
    name: {
      fr: 'Site Complet',
      en: 'Complet Website',
    },
    badge: {
      fr: 'Recommandé',
      en: 'Recommended',
    },
    priceXAF: 130000,
    delay: {
      fr: 'Environ 2 semaines',
      en: 'About 2 weeks',
    },
    description: {
      fr: 'Tout l\'Essentiel + plusieurs pages, référencement local Google & Yango, 10 e-mails pro, réservation WhatsApp.',
      en: 'Everything in Essentiel + multiple pages, local SEO, Google & Yango listing, 10 business email addresses, WhatsApp booking.',
    },
    features: {
      fr: [
        'Tout le contenu du site Essentiel',
        'Structure sur plusieurs pages sur-mesure',
        'Référencement local (SEO), fiche Google et Yango',
        '10 adresses e-mail professionnelles à votre nom',
        'Formulaire de réservation ou de commande vers WhatsApp',
      ],
      en: [
        'Everything included in Essentiel site',
        'Custom multi-page architecture',
        'Local SEO, Google listing and Yango Maps',
        '10 professional domain email addresses',
        'Online booking or order form to WhatsApp',
      ],
    },
  },
];

export const XPRESITE_OPTIONS: XpreSiteOption[] = [
  {
    id: 'opt-smart-quote',
    slug: 'devis-intelligent',
    name: {
      fr: 'Option Devis intelligent',
      en: 'Smart Quote Add-on',
    },
    desc: {
      fr: 'Le client répond à quelques questions, voit une estimation et vous envoie une demande chiffrée sur WhatsApp.',
      en: 'Customers answer key questions, get an automated estimate and send a detailed quote request to WhatsApp.',
    },
    priceXAF: 60000,
  },
  {
    id: 'opt-calculator',
    slug: 'calculateur',
    name: {
      fr: 'Option Calculateur de tarif & caution',
      en: 'Rate & Deposit Calculator',
    },
    desc: {
      fr: 'Calcul automatique : location à la journée, caution, tarif dégressif, livraison par quartier.',
      en: 'Automated calculation: daily rates, security deposit, tiered discounts, zone-based delivery fees.',
    },
    priceXAF: 80000,
  },
  {
    id: 'opt-marketplace',
    slug: 'marketplace',
    name: {
      fr: 'Option Marketplace multi-vendeurs',
      en: 'Multi-Vendor Marketplace Add-on',
    },
    desc: {
      fr: 'Plusieurs vendeurs, chauffeurs ou établissements sur le même site, chacun avec son catalogue.',
      en: 'Multiple vendors, chauffeurs or establishments on the same website, each with dedicated catalogue.',
    },
    priceXAF: 80000,
  },
];

export const XPRESITE_INDUSTRIES: XpreSiteIndustry[] = [
  {
    id: 'ind-restaurant',
    slug: 'restaurant',
    name: {
      fr: 'Restaurant & Bar',
      en: 'Restaurant & Bar',
    },
    tagline: {
      fr: 'Menu en ligne, commandes WhatsApp directes et présence Google Maps.',
      en: 'Online menu, direct WhatsApp orders, and Google Maps visibility.',
    },
    iconName: 'utensils',
    badge: {
      fr: 'Food & Bar',
      en: 'Food & Bar',
    },
    basePriceXAF: 75000,
    isActive: true,
    productBridges: [
      {
        title: 'Menu digital QR code',
        price: '90 000 à 130 000 FCFA',
        cta: 'Recevoir l\'aperçu gratuit de mon menu',
        waContext: 'fr_resto',
      },
      {
        title: 'Pack installation Bongo Space',
        price: '250 000 FCFA (12 mois inclus)',
        cta: 'Découvrir Bongo Space',
        url: 'https://bongospace.pro/fr',
      },
    ],
  },
  {
    id: 'ind-hotel',
    slug: 'hotel',
    name: {
      fr: 'Hôtel & Hébergement',
      en: 'Hotel & Hospitality',
    },
    tagline: {
      fr: 'Présentation des chambres, tarifs par nuitée et demandes de réservation directes.',
      en: 'Room showcase, nightly rates, and direct booking requests.',
    },
    iconName: 'building',
    badge: {
      fr: 'Hôtellerie',
      en: 'Hospitality',
    },
    basePriceXAF: 75000,
    isActive: true,
  },
  {
    id: 'ind-rental',
    slug: 'location-voiture',
    name: {
      fr: 'Location de Véhicules',
      en: 'Car Rental & Fleet',
    },
    tagline: {
      fr: 'Catalogue de la flotte, tarifs à la journée, caution et réservation WhatsApp.',
      en: 'Fleet showcase, daily rates, deposit calculation, and WhatsApp bookings.',
    },
    iconName: 'car',
    badge: {
      fr: 'Flotte & Auto',
      en: 'Fleet & Auto',
    },
    basePriceXAF: 75000,
    isActive: true,
    productBridges: [
      {
        title: 'Démo BongoFleet (loueurs)',
        price: 'Dès 130 000 FCFA',
        cta: 'Tester la démo BongoFleet',
        url: 'https://drivo-demo.netlify.app',
      },
    ],
  },
  {
    id: 'ind-services',
    slug: 'commerces-services',
    name: {
      fr: 'Commerces & Services',
      en: 'Retail & Services',
    },
    tagline: {
      fr: 'Livraison, pressing, agence ou cabinet : soyez trouvé et contacté immédiatement.',
      en: 'Delivery, dry cleaning, agency or practice: get found and contacted instantly.',
    },
    iconName: 'store',
    badge: {
      fr: 'PME & Services',
      en: 'SME & Services',
    },
    basePriceXAF: 75000,
    isActive: true,
  },
];

export const XPRESITE_CONFIG: XpreSiteConfig = {
  defaultBasePriceXAF: 75000,
  completBasePriceXAF: 130000,
  deliveryPromiseHours: 72,
  deliveryDelay: '72h à 2 semaines',
  allowThreeSplits: false,
  hostingIncludedYears: 1,
  whatsappContactNumber: '237692025552',
  plans: XPRESITE_PLANS,
  globalOptions: XPRESITE_OPTIONS,
  industries: XPRESITE_INDUSTRIES,
};

export function generateQuoteReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `XPS-${dateStr}-${rand}`;
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}
