// =============================================================================
// CATALOGUE & TYPES OFFRE XPRESITE — PROGRAMACTOR
// =============================================================================

export interface XpreSiteAddon {
  id: string;
  slug: string;
  title: {
    fr: string;
    en: string;
  };
  desc: {
    fr: string;
    en: string;
  };
  priceXAF: number; // 0 = Inclus / Gratuit
  isRecommended?: boolean;
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
  iconName: 'utensils' | 'truck' | 'shirt' | 'car' | 'plane';
  badge: {
    fr: string;
    en: string;
  };
  addons: XpreSiteAddon[];
}

export interface XpreSiteConfig {
  defaultBasePriceXAF: number;
  deliveryPromiseHours: number;
  hostingIncludedYears: number;
  whatsappContactNumber: string; // Ex: 237699000000
}

export const XPRESITE_CONFIG: XpreSiteConfig = {
  defaultBasePriceXAF: 75000,
  deliveryPromiseHours: 72,
  hostingIncludedYears: 1,
  whatsappContactNumber: '237699000000', // À synchroniser avec le numéro du studio
};

export const XPRESITE_INDUSTRIES: XpreSiteIndustry[] = [
  {
    id: 'ind-restaurant',
    slug: 'restaurant',
    name: {
      fr: 'Restaurant & Traiteur',
      en: 'Restaurant & Catering',
    },
    tagline: {
      fr: 'Sublimez vos plats, facilitez les commandes directes et remplissez vos tables.',
      en: 'Showcase your dishes, streamline direct orders, and fill your tables.',
    },
    iconName: 'utensils',
    badge: {
      fr: 'Food & Bar',
      en: 'Food & Bar',
    },
    addons: [
      {
        id: 'addon-resto-wa',
        slug: 'wa-ordering',
        title: {
          fr: 'Commande directe WhatsApp avec panier',
          en: 'Direct WhatsApp ordering with cart',
        },
        desc: {
          fr: 'Le client compose son menu et vous envoie la commande prête à traiter sur WhatsApp.',
          en: 'Customers select their meal and send the prepared order directly to WhatsApp.',
        },
        priceXAF: 0,
        isRecommended: true,
      },
      {
        id: 'addon-resto-qr',
        slug: 'qr-menu',
        title: {
          fr: 'Menu QR Code interactif sur table',
          en: 'Interactive table QR code menu',
        },
        desc: {
          fr: 'Un QR code personnalisé à imprimer sur vos tables pour consulter le menu en un scan.',
          en: 'Custom printable QR codes for tables to browse the menu instantly on smartphones.',
        },
        priceXAF: 15000,
      },
      {
        id: 'addon-resto-maps',
        slug: 'maps-integration',
        title: {
          fr: 'Géolocalisation Google Maps & Yango Maps',
          en: 'Google Maps & Yango Maps integration',
        },
        desc: {
          fr: 'Itinéraire instantané en un clic pour que les clients et livreurs vous trouvent sans effort.',
          en: 'One-tap directions so guests and riders arrive directly at your doors.',
        },
        priceXAF: 25000,
        isRecommended: true,
      },
      {
        id: 'addon-resto-booking',
        slug: 'table-reservation',
        title: {
          fr: 'Module de réservation de table en direct',
          en: 'Direct table booking module',
        },
        desc: {
          fr: 'Formulaire de réservation avec confirmation automatique par SMS ou WhatsApp.',
          en: 'Reservation form with instant confirmation via WhatsApp or SMS.',
        },
        priceXAF: 35000,
      },
      {
        id: 'addon-resto-ecommerce',
        slug: 'online-ordering-system',
        title: {
          fr: 'Système complet de commande en ligne & gestion cuisine',
          en: 'Full online ordering system & kitchen dashboard',
        },
        desc: {
          fr: 'Tableau de bord de gestion des commandes, suivi de préparation et paiement en ligne.',
          en: 'Order management dashboard, prep status updates, and online payments.',
        },
        priceXAF: 65000,
      },
    ],
  },
  {
    id: 'ind-livraison',
    slug: 'livraison',
    name: {
      fr: 'Entreprise de Livraison & Coursiers',
      en: 'Delivery & Courier Service',
    },
    tagline: {
      fr: 'Gagnez la confiance de vos clients avec un site ultra-rapide et un suivi transparent.',
      en: 'Build customer trust with a blazing-fast website and seamless tracking.',
    },
    iconName: 'truck',
    badge: {
      fr: 'Logistique Urbaine',
      en: 'Urban Logistics',
    },
    addons: [
      {
        id: 'addon-livr-wa',
        slug: 'instant-dispatch-wa',
        title: {
          fr: 'Demande de course instantanée via WhatsApp',
          en: 'Instant dispatch request via WhatsApp',
        },
        desc: {
          fr: 'Bouton d\'appel de coursier avec pré-remplissage des adresses de départ et d\'arrivée.',
          en: 'Courier request button pre-populating pickup and drop-off addresses.',
        },
        priceXAF: 0,
        isRecommended: true,
      },
      {
        id: 'addon-livr-form',
        slug: 'pickup-schedule-form',
        title: {
          fr: 'Formulaire d\'enlèvement programmé',
          en: 'Scheduled pickup form',
        },
        desc: {
          fr: 'Permet aux e-commerçants de planifier des ramassages récurrents à l\'avance.',
          en: 'Allows e-merchants to schedule recurring pickups in advance.',
        },
        priceXAF: 25000,
      },
      {
        id: 'addon-livr-calc',
        slug: 'fare-calculator',
        title: {
          fr: 'Calculateur automatique de tarif par quartier',
          en: 'Automated neighborhood fare calculator',
        },
        desc: {
          fr: 'Estimation transparente du prix de la course selon la zone sélectionnée à Douala, Yaoundé ou Libreville.',
          en: 'Instant price estimation based on selected zones in Douala, Yaoundé, or Libreville.',
        },
        priceXAF: 35000,
        isRecommended: true,
      },
      {
        id: 'addon-livr-tracking',
        slug: 'parcel-tracking',
        title: {
          fr: 'Module de suivi de colis par numéro de bordereau',
          en: 'Tracking module by waybill number',
        },
        desc: {
          fr: 'Vos clients saisissent leur numéro de suivi pour voir où en est leur colis en temps réel.',
          en: 'Customers enter their waybill number to check package delivery status live.',
        },
        priceXAF: 55000,
      },
    ],
  },
  {
    id: 'ind-pressing',
    slug: 'pressing',
    name: {
      fr: 'Pressing & Blanchisserie',
      en: 'Dry Cleaning & Laundry',
    },
    tagline: {
      fr: 'Digitalisez vos collectes de linge et fidélisez vos clients avec des alertes automatiques.',
      en: 'Digitalize laundry pickups and boost customer loyalty with automated alerts.',
    },
    iconName: 'shirt',
    badge: {
      fr: 'Services & Soins',
      en: 'Care & Services',
    },
    addons: [
      {
        id: 'addon-press-wa',
        slug: 'price-grid-wa',
        title: {
          fr: 'Grille tarifaire par vêtement & contact WhatsApp',
          en: 'Garment price guide & WhatsApp inquiry',
        },
        desc: {
          fr: 'Catalogue clair des prestations (costumes, robes, draps) avec contact direct.',
          en: 'Clear rate card for suits, dresses, and linens with direct contact.',
        },
        priceXAF: 0,
        isRecommended: true,
      },
      {
        id: 'addon-press-pickup',
        slug: 'home-pickup-booking',
        title: {
          fr: 'Demande d\'enlèvement & livraison à domicile',
          en: 'Home pickup & delivery booking',
        },
        desc: {
          fr: 'Planification du passage du livreur pour récupérer le linge sale chez le client.',
          en: 'Schedule courier visits to pick up laundry directly at the customer’s door.',
        },
        priceXAF: 30000,
        isRecommended: true,
      },
      {
        id: 'addon-press-calc',
        slug: 'laundry-basket-calculator',
        title: {
          fr: 'Simulateur de panier & devis pressing instantané',
          en: 'Laundry basket simulator & instant quote',
        },
        desc: {
          fr: 'Le client sélectionne le nombre de chemises, pantalons, vestes et obtient son total exact.',
          en: 'Customers select shirt, trouser, and jacket counts to see their exact total.',
        },
        priceXAF: 40000,
      },
      {
        id: 'addon-press-alert',
        slug: 'order-ready-alert',
        title: {
          fr: 'Module d\'alerte « Votre linge est prêt »',
          en: 'Automated "Laundry Ready" alert module',
        },
        desc: {
          fr: 'Système pour notifier vos clients en 1 clic dès que leur commande est repassée et prête.',
          en: 'One-click alert system to notify customers as soon as their clothes are ready.',
        },
        priceXAF: 45000,
      },
    ],
  },
  {
    id: 'ind-location',
    slug: 'location-voiture',
    name: {
      fr: 'Location de Véhicules & Chauffeurs',
      en: 'Car Rental & Chauffeur Service',
    },
    tagline: {
      fr: 'Mettez votre flotte en valeur et convertissez chaque visiteur en réservation confirmée.',
      en: 'Showcase your fleet and turn every website visitor into a confirmed booking.',
    },
    iconName: 'car',
    badge: {
      fr: 'Mobilité & Flotte',
      en: 'Mobility & Fleet',
    },
    addons: [
      {
        id: 'addon-loc-wa',
        slug: 'fleet-catalog-wa',
        title: {
          fr: 'Catalogue de la flotte avec fiches techniques & WhatsApp',
          en: 'Fleet showroom with specs & direct WhatsApp contact',
        },
        desc: {
          fr: 'Présentation soignée des SUV, berlines et 4x4 avec tarifs journaliers et contact immédiat.',
          en: 'Sleek presentation of SUVs, sedans, and 4x4s with daily rates and contact links.',
        },
        priceXAF: 0,
        isRecommended: true,
      },
      {
        id: 'addon-loc-chauffeur',
        slug: 'chauffeur-airport-option',
        title: {
          fr: 'Option mise à disposition de chauffeur & transfert aéroport',
          en: 'Chauffeur option & airport transfer booking',
        },
        desc: {
          fr: 'Sélecteur de formule (avec ou sans chauffeur) et tarification navette aéroport.',
          en: 'Choice between self-drive or dedicated driver, with airport transfer add-on.',
        },
        priceXAF: 20000,
      },
      {
        id: 'addon-loc-calc',
        slug: 'deposit-duration-calculator',
        title: {
          fr: 'Calculateur automatique de caution & tarif dégressif',
          en: 'Automated deposit & tiered duration calculator',
        },
        desc: {
          fr: 'Réduction automatique selon le nombre de jours de location et affichage de la caution requise.',
          en: 'Automatic discount calculation for weekly/monthly rentals and security deposit rules.',
        },
        priceXAF: 40000,
      },
      {
        id: 'addon-loc-calendar',
        slug: 'fleet-availability-calendar',
        title: {
          fr: 'Calendrier interactif de réservation par véhicule',
          en: 'Interactive vehicle availability calendar',
        },
        desc: {
          fr: 'Le client choisit ses dates de départ et de retour et bloque son véhicule en ligne.',
          en: 'Customers pick pickup and return dates and reserve their car in seconds.',
        },
        priceXAF: 50000,
        isRecommended: true,
      },
    ],
  },
  {
    id: 'ind-immigration',
    slug: 'immigration',
    name: {
      fr: 'Agence d\'Immigration & Facilitation Visas',
      en: 'Immigration & Visa Assistance Agency',
    },
    tagline: {
      fr: 'Inspirez une crédibilité totale pour accompagner étudiants et travailleurs vers l\'étranger.',
      en: 'Inspire unwavering trust to guide students and professionals abroad.',
    },
    iconName: 'plane',
    badge: {
      fr: 'Conseil & Mobilité',
      en: 'Consulting & Mobility',
    },
    addons: [
      {
        id: 'addon-imm-catalog',
        slug: 'destinations-visas-catalog',
        title: {
          fr: 'Présentation des destinations & types de visas',
          en: 'Destinations & visa categories presentation',
        },
        desc: {
          fr: 'Fiches claires pour le Canada, la France, l\'Allemagne, les USA avec conditions générales.',
          en: 'Structured destination guides (Canada, France, Germany, USA) with requirements.',
        },
        priceXAF: 0,
        isRecommended: true,
      },
      {
        id: 'addon-imm-rdv',
        slug: 'dossier-review-booking',
        title: {
          fr: 'Prise de rendez-vous pour étude de dossier & upload de CV',
          en: 'Case evaluation appointment booking with CV upload',
        },
        desc: {
          fr: 'Planification d\'un entretien d\'orientation avec collecte préalable du dossier du candidat.',
          en: 'Schedule orientation sessions with pre-submission of resumes and transcripts.',
        },
        priceXAF: 40000,
        isRecommended: true,
      },
      {
        id: 'addon-imm-test',
        slug: 'interactive-eligibility-quiz',
        title: {
          fr: 'Test d\'éligibilité visa interactif en 5 questions',
          en: 'Interactive 5-question visa eligibility quiz',
        },
        desc: {
          fr: 'Simulateur captivant qui oriente le candidat vers la meilleure procédure selon son profil.',
          en: 'Engaging quiz funnel that recommends the right immigration stream to applicants.',
        },
        priceXAF: 45000,
      },
      {
        id: 'addon-imm-tracking',
        slug: 'candidate-portal-status',
        title: {
          fr: 'Espace suivi d\'avancement de procédure pour le candidat',
          en: 'Candidate procedure status portal',
        },
        desc: {
          fr: 'Portail sécurisé où le client consulte chaque étape franchie (admission, garant, visa).',
          en: 'Secure portal where candidates check milestone progress (admission, sponsor, visa).',
        },
        priceXAF: 65000,
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function generateQuoteReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `XPS-${dateStr}-${randomSuffix}`;
}
