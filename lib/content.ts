/* ==========================================================================
   PROGRAMACTOR — CONTENU BILINGUE
   « Bilingue, jamais traduit » : chaque langue est écrite dans son rythme
   propre. Ne traduis pas mot à mot d'une colonne à l'autre.

   ⚠️  À COMPLÉTER AVANT MISE EN LIGNE — voir les blocs marqués TODO :
       · projects[]   → noms de clients + visuels (source : Instagram @programactor)
       · stats[]      → chiffres réels
       · testimonials[] → verbatims réels (aucun faux témoignage livré)
       · pricing[].price → montants réels si tu veux afficher des prix
       · contact      → e-mail, téléphone, lien de prise de rendez-vous
   ========================================================================== */

export type Lang = "fr" | "en";
export const LANGS: Lang[] = ["fr", "en"];

export type Project = {
  /** TODO: remplacer par le nom réel du client */
  name: string;
  sector: string;
  city: string;
  year: string;
  duration: string;
  tags: string[];
  /** TODO: /work/xxx.jpg — 1600×1200 recommandé */
  image?: string;
  status: string;
};

export type DetailedProject = {
  key: string;
  id: string;
  name: string;
  client: string;
  sector: string;
  city: string;
  year: string;
  duration: string;
  status: string;
  tags: string[];
  tagline: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  metrics: { value: string; label: string }[];
  accentTone?: "indigo" | "signal" | "surface";
  image?: string;
  coverImageUrl?: string;
  cardCoverImageUrl?: string;
  heroCoverImageUrl?: string;
  gallery?: string[];
};

export type Content = ReturnType<typeof getContent>;

const shared = {
  brand: "Programactor",
  founded: "2015",
  contact: {
    email: "hello@programactor.pro",
    phone: "+237 692 02 55 52",
    whatsapp: "+237 692 02 55 52",
    whatsappUrl: "https://wa.me/237692025552",
    whatsappPreviewFr:
      "https://wa.me/237692025552?text=Bonjour%20Programactor%2C%20j%27aimerais%20un%20aper%C3%A7u%20gratuit%20pour%20mon%20entreprise%20%3A%20%5BNom%2C%20Activit%C3%A9%2C%20Ville%5D",
    whatsappPreviewEn:
      "https://wa.me/237692025552?text=Hello%20Programactor%2C%20I%27d%20like%20a%20free%20preview%20for%20my%20business%3A%20%5BName%2C%20Industry%2C%20City%5D",
    instagram: "https://www.instagram.com/programactor/",
    booking: "/fr/reserver",
  },

  cities: "Douala · Libreville",
};

/* --------------------------------------------------------------------------
   TARIFS AGENCE — les trois seuls montants à renseigner.
   Laisser la chaîne vide affiche « Sur devis » comme avant.
   Exemples de format : "350 000 FCFA" · "à partir de 1 800 000 FCFA"
   -------------------------------------------------------------------------- */
const AGENCY_PRICES = {
  diagnostic: "à partir de 250 000 FCFA",
  sprint: "à partir de 750 000 FCFA",
  partner: "à partir de 1 500 000 FCFA",
};

/* --------------------------------------------------------------------------
   PROJETS — structure commune, libellés traduits plus bas
   TODO: remplacer par les réalisations réelles (Instagram @programactor)
   -------------------------------------------------------------------------- */
const projectsBase = [
  { key: "p1", year: "2026", duration: "3", image: undefined },
  { key: "p2", year: "2026", duration: "6", image: undefined },
  { key: "p3", year: "2025", duration: "4", image: undefined },
  { key: "p4", year: "2025", duration: "2", image: undefined },
  { key: "p5", year: "2025", duration: "8", image: undefined },
  { key: "p6", year: "2024", duration: "3", image: undefined },
];

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  date?: string;
};

export function getContent(lang: Lang) {
  const fr = {
    ...shared,
    contact: {
      ...shared.contact,
      booking: "/fr/reserver",
    },
    lang: "fr" as const,
    htmlLang: "fr",
    meta: {
      title: "Sites web et menus digitaux à Douala · Programactor",
      description:
        "Site internet, menu digital et fiche Google pour restaurants, hôtels et loueurs de véhicules. Nous venons chez vous à Douala, en visio pour Libreville. Aperçu gratuit.",
    },

    nav: {
      tagline: "Sites web & Menus digitaux",
      links: [
        { label: "Démos", href: "#demos" },
        { label: "Tarifs", href: "#tarifs" },
        { label: "Ce que nous faisons", href: "#services" },
        { label: "Comment ça marche", href: "#methode" },
        { label: "Studio produit", href: "#studio" },
      ],
      cta: "Aperçu gratuit",
      ctaShort: "Aperçu",
      menu: "Menu",
      close: "Fermer",
    },

    hero: {
      eyebrow: "AGENCE WEB · RENDEZ-VOUS CHEZ VOUS À DOUALA · VISIO POUR LIBREVILLE",
      titleBefore: "Plus de réservations et de commandes sur WhatsApp pour votre ",
      titleMark: "restaurant, hôtel",
      titleAfter: " ou agence de location.",
      lead: "Nous créons votre site, votre menu digital et votre fiche Google, puis nous les relions à votre WhatsApp. Vos clients voient vos plats, vos chambres ou vos véhicules, choisissent, et vous recevez une demande prête à traiter.",
      ctaPrimary: "Recevoir l'aperçu gratuit de mon établissement",
      ctaSecondary: "Tester une démo",
      status: "NOUS VENONS CHEZ VOUS À DOUALA · VISIO POUR LIBREVILLE",
      since: "PAIEMENT MOBILE MONEY",
    },

    manifesto:
      "NOUS CONCEVONS POUR VOS CLIENTS TELS QU'ILS SONT : UN ANDROID D'ENTRÉE DE GAMME, UN FORFAIT DATA COMPTÉ ET DIX SECONDES POUR SE DÉCIDER. VOTRE SITE S'OUVRE VITE, ET LA COMMANDE ARRIVE SUR VOTRE WHATSAPP.",

    stats: {
      label: "Ce que vous pouvez vérifier",
      title: "Ce que vous pouvez vérifier, maintenant.",
      items: [
        { value: 2, suffix: "", label: "Démos en ligne à tester sur votre téléphone" },
        { value: 2, prefix: "< ", suffix: "h", label: "Pour vous répondre sur WhatsApp (lun–sam)" },
        { value: 72, suffix: "h", label: "Pour mettre en ligne un site Essentiel" },
        { value: 50, suffix: "%", label: "D'acompte, le solde à la livraison" },
      ],
    },

    rhythm: {
      label: "Le rythme",
      title: "3 phases / boucles de 2 semaines / 1 produit en ligne.",
      body: "Toutes les deux semaines nous ouvrons et nous fermons une boucle : un atelier pour cadrer, une démo pour valider. Entre les deux, vous nous joignez sur WhatsApp. À chaque fin de phase vous voyez le produit tourner sur vos vraies données, pas sur une maquette.",
      marquee: [
        "Aperçu gratuit",
        "Rendez-vous",
        "Acompte 50%",
        "Mise en ligne",
        "Formation",
      ],
    },

    about: {
      label: "Qui vous répond",
      title: "Jesse B. Ikolo, fondateur.",
      body: [
        "Programactor a été fondée en 2015 par Jesse B. Ikolo. Designer produit et développeur, il a enseigné le développement et le design UI/UX en université et forme des équipes informatiques. C'est lui qui vient chez vous à Douala, qui conçoit votre site et qui vous répond sur WhatsApp.",
        "Notre engagement : aucune fausse promesse, aucun bureau factice. Nous venons dans votre établissement ou nous faisons le point en visio.",
      ],
      figures: [
        { value: 2015, suffix: "", label: "Année de fondation", raw: true },
        { value: 50, suffix: "%", label: "Acompte à la commande", raw: false },
      ],
    },

    work: {
      label: "Réalisations",
      title: "Réalisations.",
      lead: "Nos projets, avec le secteur, la ville et ce qui a été livré.",
      durationUnit: "semaines",
      statusLive: "En ligne",
      cta: "Voir le projet",
      projects: [
        {
          name: "BongoSpace",
          sector: "Commerce & Comptabilité",
          city: "Douala, Kinshasa",
          tags: ["Mobile Money", "Offline-First", "PWA"],
        },
        {
          name: "Bimaround",
          sector: "Beauté & Bien-être, BeautyTech, POS",
          city: "Douala, Cameroun (avec Libreville)",
          tags: ["BeautyTech", "Mobile-First", "POS & Caisse", "Mobile Money", "WhatsApp"],
          image: "/Projet/bimaroundpro.png",
        },
        {
          name: "Yamo Delivery",
          sector: "Livraison dernier kilomètre",
          city: "Libreville",
          tags: ["Logistique", "Dispatch", "Mobile"],
        },
        {
          name: "Cabinet Médical Santé Plus",
          sector: "Santé & Prise de RDV",
          city: "Douala",
          tags: ["Santé", "WhatsApp", "Web"],
        },
        {
          name: "Boutique Wax & Chic",
          sector: "Commerce & Mode",
          city: "Yaoundé",
          tags: ["Catalogue", "WhatsApp", "E-commerce"],
        },
      ],
    },

    realisationsPage: {
      meta: {
        title: "Réalisations et démos",
        description:
          "Découvrez nos créations de sites internet professionnels, applications web/mobiles et logiciels de caisse pour entreprises à Douala, Yaoundé, Libreville et Kinshasa.",
      },
      badge: "Portfolio & Études de cas",
      titleBefore: "Des produits conçus pour le ",
      titleMark: "terrain",
      titleAfter: ", pas pour la galerie.",
      lead:
        "Des sites, des applications et nos propres produits, conçus pour des téléphones Android et des réseaux mobiles d'Afrique centrale.",
      filterAllSectors: "Tous les secteurs",
      filterAllCities: "Toutes les villes",
      viewCards: "Vue détaillée",
      viewGrid: "Vue compacte",
      filterSectorLabel: "Secteur",
      filterCityLabel: "Localisation",
      resultsCount: "projets livrés",
      challengeLabel: "Le défi terrain",
      solutionLabel: "La réponse produit",
      deliverablesLabel: "Livrables finaux",
      metricsLabel: "Impact mesuré",
      viewDetails: "Explorer l'étude de cas",
      closeDetails: "Fermer la vue détaillée",
      backHome: "Retour à l'accueil",
      statusLive: "En ligne",
      durationUnit: "semaines",
      timelineLabel: "Délai",
      cityLabel: "Ville",
      sectorLabel: "Secteur",
      methodBanner: {
        label: "La promesse Programactor",
        title: "Toutes les deux semaines, un incrément testé sur le terrain.",
        body: "On ne facture pas des mois de recherche théorique. Dès le 15ème jour, tu as entre les mains un écran validé avec tes utilisateurs cibles.",
        cta: "Découvrir notre méthode",
      },
      cta: {
        label: "Ton projet",
        titleBefore: "Tu as un produit à ",
        titleMark: "lancer",
        titleAfter: " en Afrique centrale ?",
        body: "Explique-nous le problème en une phrase. On te dit sans détour si c'est réalisable en un sprint de 4 à 8 semaines et à quel coût.",
        button: "Réserver un appel de cadrage",
      },
    },

    detailedProjects: [
      {
        key: "p1",
        id: "fintech-momo",
        name: "BongoSpace",
        client: "Propriétaire",
        sector: "Commerce & Comptabilité",
        city: "Douala, Kinshasa",
        year: "2026",
        duration: "3 semaines",
        status: "En ligne",
        tags: ["Mobile Money", "Offline-First", "PWA", "SAAS", "ERP"],
        tagline: "Encaissement instantané QR code et USSD pour commerçants de proximité.",
        challenge:
          "Réseaux 3G/EDGE instables dans les marchés de Douala, commerçants réticents aux interfaces chargées et retards fréquents de validation des notifications SMS d'opérateurs.",
        solution:
          "Architecture offline-first avec synchronisation en tâche de fond, génération instantanée de QR statiques et dynamiques, et confirmation audio bilingue (français/pidgin) à chaque encaissement réussi.",
        deliverables: [
          "Entretiens immersifs au Marché Central",
          "Design system mobile haute densité",
          "PWA offline-first ultra-légère (< 2 Mo)",
          "Passerelle d'encaissement MTN MoMo & Orange Money",
        ],
        metrics: [
          { value: "-40%", label: "Temps d'encaissement" },
          { value: "100%", label: "Fonctionnement offline" },
          { value: "15 jours", label: "Du brief au test marchand" },
        ],
        accentTone: "signal" as const,
      },
      {
        key: "p-bimaround",
        id: "bimaround",
        name: "Bimaround",
        client: "Produit R&D OnetouchLabs",
        sector: "Beauté & Bien-être, BeautyTech, POS",
        city: "Douala, Cameroun (avec Libreville)",
        year: "2026",
        duration: "8 semaines",
        status: "En ligne",
        tags: ["BeautyTech", "Mobile-First", "POS & Caisse", "Mobile Money", "WhatsApp"],
        tagline: "La suite tout-en-un qui transforme les prestataires de la beauté africains en entrepreneurs organisés et rentables.",
        challenge:
          "En Afrique centrale et de l'ouest, plus de 80% des salons de coiffure, barbiers et esthéticiennes exercent dans l'informel et subissent des pertes financières chroniques (15% à 30% du revenu mensuel). Leurs défis quotidiens sont sévères : encaissements en liquide non tracés et sources de conflits avec les employés, oublis massifs de rendez-vous sans système de relance, et comptabilité manuelle sur cahier papier. Les logiciels SaaS internationaux (Fresha, Treatwell) échouent sur ce marché : ils exigent une connexion permanente à haut débit, ignorent les paiements Mobile Money (Orange Money, MTN MoMo, Wave) et ne s'intègrent pas aux usages WhatsApp, canal central du commerce local.",
        solution:
          "Programactor a conçu et développé Bimaround comme un système d'exploitation métier ultra-léger et centré sur l'humain, adapté aux réalités des smartphones d'entrée de gamme et des connexions instables : caisse tactile hybride Cash + Mobile Money, rappels automatiques WhatsApp pour neutraliser les no-shows, répartition automatique des commissions d'équipe, gestion des stocks critiques et design tactile ergonomique à une main.",
        deliverables: [
          "Application Web & PWA Responsive (salons, indépendants, clients)",
          "Terminal POS tactile avec encaissement Cash & Mobile Money",
          "Passerelle de réservation 24/7 et rappels automatisés WhatsApp",
          "Tableau de bord financier et analytique des commissions en temps réel",
          "Landing page à très haute conversion avec liste d'attente résiliente",
        ],
        metrics: [
          { value: "+96", label: "Prestataires sur liste d'attente" },
          { value: "< 5 min", label: "Pour clôturer la caisse du salon" },
          { value: "2 Villes", label: "Marchés pilotes (Douala & Libreville)" },
        ],
        accentTone: "signal" as const,
        image: "/Projet/bimaroundpro.webp",
        coverImageUrl: "/Projet/bimaroundpro.webp",
        cardCoverImageUrl: "/Projet/bimaroundpro.webp",
        heroCoverImageUrl: "/Projet/bimaroundpro.webp",
        gallery: [
          "/Projet/bimaroundpro.webp",
          "/projects/bimaround.png",
          "/projects/bimaroundpro.jpg"
        ],
      },
      {
        key: "p2",
        id: "logistique-coursier",
        name: "Yamo Delivery",
        client: "Express Dispatch",
        sector: "Livraison dernier kilomètre",
        city: "Libreville",
        year: "2026",
        duration: "6 semaines",
        status: "En ligne",
        tags: ["Stratégie", "Design", "Build", "Dispatch"],
        tagline: "Système de dispatch coursier et guidage sans adressage postal formel.",
        challenge:
          "À Libreville, l'absence de noms de rues et de numéros rend le GPS classique inopérant : le repérage se fait par carrefours, écoles, pharmacies et descriptions informelles.",
        solution:
          "Application coursier basée sur des repères visuels géolocalisés avec photos de référence, suivi en temps réel par lien SMS sans installation pour le destinataire final, et console de dispatch temps réel.",
        deliverables: [
          "Cartographie des parcours coursiers à Libreville",
          "Application mobile Android basse consommation",
          "Console web de supervision et dispatch",
          "Système de notification WhatsApp et SMS",
        ],
        metrics: [
          { value: "-35%", label: "Temps moyen de livraison" },
          { value: "< 8 Mo", label: "Taille de l'application" },
          { value: "99.2%", label: "Taux de livraison réussie" },
        ],
        accentTone: "indigo" as const,
      },
      {
        key: "p3",
        id: "sante-consultation",
        name: "Cabinet Médical Santé Plus",
        client: "Clinique de la Paix",
        sector: "Prise de rendez-vous",
        city: "Douala",
        year: "2025",
        duration: "4 semaines",
        status: "En ligne",
        tags: ["Recherche", "Produit", "SMS/WhatsApp"],
        tagline: "Gestion de consultations médicales et rappels automatiques multi-canaux.",
        challenge:
          "Plus de 40% de rendez-vous manqués dans les cliniques privées, files d'attente désordonnées dès 7h du matin et secrétariats submergés d'appels téléphoniques répétés.",
        solution:
          "Parcours de prise de rendez-vous en 3 étapes avec acompte Mobile Money pour verrouiller le créneau, et système automatisé de rappels préventifs sur WhatsApp et SMS la veille.",
        deliverables: [
          "Étude terrain en salle d'attente et entretiens patients",
          "Interface patient web fluide sans création de compte obligatoire",
          "Espace praticien avec gestion de file d'attente",
          "Système de rappels automatiques WhatsApp & SMS",
        ],
        metrics: [
          { value: "-62%", label: "Taux de rendez-vous manqués" },
          { value: "3 clics", label: "Pour finaliser un créneau" },
          { value: "+180%", label: "Paiements d'acompte digitalisés" },
        ],
        accentTone: "surface" as const,
      },
      {
        key: "p4",
        id: "commerce-catalogue",
        name: "Boutique Wax & Chic",
        client: "Maison Wax",
        sector: "Catalogue WhatsApp",
        city: "Yaoundé",
        year: "2025",
        duration: "2 semaines",
        status: "En ligne",
        tags: ["Identité", "Web", "Social Commerce"],
        tagline: "Boutique en ligne ultra-légère synchronisée avec WhatsApp Business.",
        challenge:
          "Vendeurs passant leurs journées à renvoyer des photos de produits et des prix un par un dans des conversations WhatsApp, entraînant des pertes de commandes et des erreurs d'inventaire.",
        solution:
          "Mini-catalogue web ultra-rapide (chargement < 1 seconde sur réseau 3G) permettant aux acheteurs de composer leur panier et de générer un message de commande WhatsApp préformaté en un clic.",
        deliverables: [
          "Design du catalogue mobile centré sur les visuels produits",
          "Générateur intelligent de panier WhatsApp",
          "Outil mobile simplifié de mise à jour des stocks",
          "Guide de bonnes pratiques pour les vendeurs",
        ],
        metrics: [
          { value: "< 1s", label: "Temps de chargement sur 3G" },
          { value: "2 sem", label: "Du brief à la première vente" },
          { value: "+210%", label: "Commandes finalisées sans friction" },
        ],
        accentTone: "signal" as const,
      },
      {
        key: "p5",
        id: "agritech-cacao",
        name: "Agritech",
        client: "Coopérative Cacao Sud",
        sector: "Traçabilité",
        city: "Kribi",
        year: "2025",
        duration: "8 semaines",
        status: "En ligne",
        tags: ["Terrain", "Design", "Build", "PWA"],
        tagline: "Traçabilité de la fève au conteneur d'export pour les coopératives de cacao.",
        challenge:
          "Centres de pesée situés en zone blanche sans réseau mobile, pèseurs peu familiers des smartphones et impératif de respecter les normes européennes de traçabilité anti-déforestation.",
        solution:
          "Application tablette durcie à très fort contraste et typographie DM Mono agrandie, synchronisation différée par paquet dès reconnexion, et étiquetage de sacs par QR codes indélébiles.",
        deliverables: [
          "Immersion de 7 jours en campement et centre de pesée",
          "Application tablette hors-ligne avec stockage local chiffré",
          "Portail de supervision pour les auditeurs et exportateurs",
          "Manuel d'utilisation imagé sous forme de poster plastifié",
        ],
        metrics: [
          { value: "100%", label: "Conformité d'audit export" },
          { value: "0 perte", label: "De données lors des coupures" },
          { value: "+18%", label: "Prime de qualité redistribuée" },
        ],
        accentTone: "indigo" as const,
      },
      {
        key: "p6",
        id: "education-microlearning",
        name: "Éducation",
        client: "Académie Pro Afrique",
        sector: "Plateforme de cours",
        city: "Libreville",
        year: "2024",
        duration: "3 semaines",
        status: "En ligne",
        tags: ["Produit", "Design system", "Audio/Video"],
        tagline: "Plateforme de formation allégée avec capsules audio et fiches de synthèse.",
        challenge:
          "Coût exorbitant de la bande passante data pour le streaming vidéo chez les étudiants, entraînant un taux d'abandon supérieur à 80% sur les MOOC traditionnels.",
        solution:
          "Expérience d'apprentissage restructurée autour de formats micro-audio de 3 à 5 minutes consommables en mobilité, téléchargement en WiFi nocturne et fiches PDF synthétiques.",
        deliverables: [
          "Design system complet pensé pour la faible consommation d'énergie",
          "Lecteur audio progressif avec reprise de lecture automatique",
          "Espace apprenant PWA avec mode sombre par défaut",
          "Outil d'administration et publication de cours",
        ],
        metrics: [
          { value: "-85%", label: "Consommation data vs vidéo" },
          { value: "78%", label: "Taux de complétion des parcours" },
          { value: "3 sem", label: "Pour lancer la première promotion" },
        ],
        accentTone: "surface" as const,
      },
    ],

    services: {
      label: "Ce que nous faisons",
      title: "Ce que nous faisons pour votre établissement.",
      lead: "Vous nous montrez votre activité une fois, nous nous occupons du reste jusqu'à la mise en ligne.",
      cta: "Recevoir l'aperçu gratuit",
      items: [
        {
          title: "Votre site internet.",
          body: "Un site rapide sur téléphone, avec vos services, vos prix, vos photos et un bouton WhatsApp à chaque étape. En ligne en 72 h (Essentiel) ou en 2 semaines (Complet).",
          tags: ["Site vitrine", "WhatsApp", "72 h"],
        },
        {
          title: "Votre menu digital.",
          body: "Votre carte sur téléphone, un QR code sur chaque table, la commande envoyée sur votre WhatsApp. Fini les photos de menu floues.",
          tags: ["Menu QR", "Commande WhatsApp"],
        },
        {
          title: "Votre visibilité sur Google et Yango.",
          body: "Fiche Google créée ou corrigée, itinéraire en un clic, référencement local pour apparaître quand on cherche « restaurant Bonamoussadi » ou « location voiture Douala ».",
          tags: ["Google", "Yango", "SEO local"],
        },
        {
          title: "Réservations et devis en ligne.",
          body: "Le client choisit sa date, son véhicule ou sa prestation, voit le prix et vous envoie une demande complète.",
          tags: ["Réservation", "Devis", "Calculateur"],
        },
        {
          title: "La caisse et la gestion de votre restaurant (Bongo Space).",
          body: "Prise de commande, caisse, stocks, même quand le réseau coupe.",
          tags: ["Bongo Space", "Caisse", "Hors-ligne"],
        },
      ],
    },

    method: {
      label: "Comment ça marche",
      titleBefore: "Vous voyez votre établissement en ligne ",
      titleMark: "avant",
      titleAfter: " de payer.",
      steps: [
        {
          title: "Aperçu gratuit.",
          body: "Envoyez-nous le nom de votre établissement sur WhatsApp. Nous vous renvoyons un aperçu de ce que vos clients verront sous 48 h ouvrées.",
        },
        {
          title: "Rendez-vous chez vous ou en visio.",
          body: "À Douala, nous passons dans votre établissement (30 min). À Libreville ou ailleurs, en visio WhatsApp ou Google Meet. Nous validons l'offre et le prix ensemble, par écrit.",
        },
        {
          title: "Acompte de 50 %.",
          body: "Par Mobile Money ou virement. Nous lançons le travail le jour même.",
        },
        {
          title: "Mise en ligne et formation.",
          body: "Nous livrons, nous vous montrons comment faire les mises à jour, et vous réglez le solde à la livraison. Le nom de domaine et vos contenus vous appartiennent.",
        },
      ],
    },

    labs: {
      label: "École",
      title: "One Touch Labs.",
      lead: "Notre école. Six mois de pratique, un portfolio, et des entretiens avec des studios partenaires.",
      body: "Les deux côtés s'alimentent : les élèves travaillent sur des briefs réels, les startups repartent avec des gens déjà formés au métier.",
      points: [
        { title: "Briefs réels", body: "Pas d'exercices. Des projets clients, encadrés." },
        { title: "Portfolio", body: "Six mois pour construire un dossier qui tient debout." },
        { title: "Mise en relation", body: "Entretiens avec des studios partenaires, ici et à l'international." },
      ],
      cta: "Découvrir One Touch Labs",
    },

    testimonials: {
      published: false,
      label: "Ce qu'ils en disent",
      titleBefore: "Ce que disent nos ",
      titleMark: "clients",
      titleAfter: ".",
      lead: "Des retours d'expérience concrets sur nos déploiements.",
      placeholder: "",
      items: [] as Testimonial[],
    },

    pricing: {
      label: "Studio produit",
      titleBefore: "Vous lancez une application ou un ",
      titleMark: "logiciel",
      titleAfter: " ?",
      lead: "Programactor est aussi un studio produit : recherche terrain, design et développement d'applications web et mobiles. C'est avec cette méthode que nous avons conçu nos propres produits, Bongo Space et BongoFleet.",
      popular: "",
      timeline: "Durée",
      note: "CHAQUE MISSION DÉMARRE PAR UN PÉRIMÈTRE ÉCRIT ET UN PRIX FIXE. VOUS VALIDEZ LE PLAN AVANT QUE NOUS DESSINIONS OU CODIONS QUOI QUE CE SOIT.",
      items: [
        {
          n: "01",
          title: "Diagnostic produit.",
          subtitle: "Où votre idée tient, et où elle casse.",
          timeline: "5 jours",
          price: AGENCY_PRICES.diagnostic || "250 000 FCFA",
          priceLabel: "À partir de",
          features: [
            "Entretiens utilisateurs sur le terrain",
            "Analyse de l'existant et des concurrents",
            "Parcours cible en un schéma",
            "Plan de lots chiffré",
            "Recommandation écrite que vous gardez",
          ],
          cta: "Lancer un diagnostic",
        },
        {
          n: "02",
          title: "Sprint produit.",
          subtitle: "Conçu, construit, mis en ligne.",
          timeline: "4 à 8 semaines",
          price: AGENCY_PRICES.sprint || "750 000 FCFA",
          priceLabel: "À partir de",
          popular: false,
          features: [
            "Tout le diagnostic",
            "Design produit et interface complets",
            "Build web ou mobile",
            "Test sur données réelles",
            "Mise en ligne et passation",
          ],
          cta: "Planifier un sprint",
        },
        {
          n: "03",
          title: "Partenaire produit.",
          subtitle: "Votre équipe design, au mois.",
          timeline: "En continu",
          price: AGENCY_PRICES.partner || "1 500 000 FCFA",
          priceLabel: "Par mois · À partir de",
          features: [
            "Un binôme design + build dédié",
            "Itérations continues sur l'usage",
            "Design system maintenu",
            "Formation de votre équipe",
          ],
          cta: "En discuter",
        },
      ],
    },

    faq: {
      label: "FAQ",
      title: "Les questions qu'on nous pose avant de commencer.",
      items: [
        {
          q: "Combien ça coûte ?",
          a: "Le site Essentiel coûte 75 000 FCFA et le site Complet 130 000 FCFA. Le menu digital va de 90 000 à 130 000 FCFA selon la taille de votre carte, et le Pack installation Bongo Space coûte 250 000 FCFA. Le prix est écrit avant de commencer et ne bouge plus.",
        },
        {
          q: "Comment je paie ?",
          a: "50 % d'acompte à la commande, le solde à la livraison. Au Cameroun : Orange Money ou MTN MoMo. Au Gabon : Airtel Money. Virement bancaire possible.",
        },
        {
          q: "Où se passe le rendez-vous ?",
          a: "Chez vous. À Douala, nous venons dans votre établissement, c'est là que nous voyons comment vos clients commandent et que nous prenons les photos. Pour Libreville et l'international, tout se fait en visio.",
        },
        {
          q: "En combien de temps mon site est en ligne ?",
          a: "72 h pour l'Essentiel et environ 2 semaines pour le Complet, à partir du moment où nous avons vos éléments (logo, photos, prix).",
        },
        {
          q: "Je n'ai pas de photos ni de logo.",
          a: "Ce n'est pas un problème : nous prenons les photos pendant le rendez-vous à Douala et nous partons de votre enseigne.",
        },
        {
          q: "À qui appartiennent le site et le nom de domaine ?",
          a: "À vous. Le nom de domaine est à votre nom, et vous gardez vos textes et vos photos.",
        },
        {
          q: "Et après la première année ?",
          a: "L'hébergement et le nom de domaine coûtent ensuite environ 35 000 FCFA par an.",
        },
        {
          q: "Vous travaillez au Gabon ?",
          a: "Oui, à Libreville : rendez-vous en visio, paiement en Airtel Money, même grille de prix en FCFA.",
        },
        {
          q: "J'ai un projet d'application, pas un commerce.",
          a: "Programactor est aussi un studio produit : nous concevons et développons des applications sur mesure. Voir la section Studio en bas de page.",
        },
      ],
      skip: {
        title: "Une autre question ?",
        body: "Écrivez-nous directement sur WhatsApp.",
        cta: "Poser une question sur WhatsApp",
      },
    },

    cta: {
      label: "Aperçu gratuit",
      titleBefore: "Recevez l'aperçu gratuit de votre ",
      titleMark: "futur site",
      titleAfter: " en 48 h.",
      body: "Envoyez-nous le nom de votre établissement, votre ville et votre activité sur WhatsApp. Nous vous renvoyons un premier aperçu sans engagement.",
      button: "Recevoir mon aperçu gratuit",
      or: "ou écrivez-nous sur WhatsApp",
    },

    footer: {
      tagline: "Sites internet, menus digitaux et visibilité pour PME. Douala · Libreville.",
      nav: "Navigation",
      contactLabel: "Contact",
      social: "Suivre",
      legal: "Mentions légales",
      rights: "Tous droits réservés.",
    },
  };

  const en = {
    ...shared,
    contact: {
      ...shared.contact,
      booking: "/en/reserver",
    },
    lang: "en" as const,
    htmlLang: "en",
    meta: {
      title: "Websites & digital menus in Douala · Programactor",
      description:
        "Website, digital menu and Google listing for restaurants, hotels and car rental businesses. We come to you in Douala, video calls for Libreville. Free preview.",
    },

    nav: {
      tagline: "Websites & Digital Menus",
      links: [
        { label: "Demos", href: "#demos" },
        { label: "Pricing", href: "#tarifs" },
        { label: "What we do", href: "#services" },
        { label: "How it works", href: "#methode" },
        { label: "Product studio", href: "#studio" },
      ],
      cta: "Free preview",
      ctaShort: "Preview",
      menu: "Menu",
      close: "Close",
    },

    hero: {
      eyebrow: "WEB AGENCY · WE COME TO YOU IN DOUALA · VIDEO CALLS FOR LIBREVILLE",
      titleBefore: "More bookings and WhatsApp orders for your ",
      titleMark: "restaurant, hotel",
      titleAfter: " or car rental business.",
      lead: "We build your website, your digital menu and your Google listing, and connect them to your WhatsApp. Customers see your dishes, rooms or vehicles, choose, and you receive a request that is ready to handle.",
      ctaPrimary: "Get my free business preview",
      ctaSecondary: "Try a live demo",
      status: "WE COME TO YOU IN DOUALA · VIDEO CALLS FOR LIBREVILLE",
      since: "MOBILE MONEY PAYMENTS",
    },

    manifesto:
      "WE DESIGN FOR YOUR CUSTOMERS AS THEY ARE: AN ENTRY-LEVEL ANDROID, A METERED DATA PLAN AND TEN SECONDS TO DECIDE. YOUR SITE LOADS FAST, AND THE ORDER LANDS ON YOUR WHATSAPP.",

    stats: {
      label: "Verify for yourself",
      title: "What you can verify, right now.",
      items: [
        { value: 2, suffix: "", label: "Live demos to try on your phone" },
        { value: 2, prefix: "< ", suffix: "h", label: "WhatsApp reply, Monday to Saturday" },
        { value: 72, suffix: "h", label: "To put an Essentiel site online" },
        { value: 50, suffix: "%", label: "Deposit, balance on delivery" },
      ],
    },

    rhythm: {
      label: "The rhythm",
      title: "3 phases / 2-week loops / 1 product live.",
      body: "Every two weeks we open and close a loop: one workshop to frame it, one demo to sign it off. In between, you reach us on WhatsApp. At the end of each phase you watch the product run on your real data, not on a prototype.",
      marquee: ["Free preview", "Meeting", "50% deposit", "Go live", "Training"],
    },

    about: {
      label: "Who answers you",
      title: "Jesse B. Ikolo, founder.",
      body: [
        "Programactor was founded in 2015 by Jesse B. Ikolo. A product designer and developer, he has taught software development and UI/UX design at university level and trains corporate IT teams. He is the one who visits you in Douala, designs your site and answers you on WhatsApp.",
        "Our promise: no hollow claims, no fake offices. We come to your business venue or meet by video.",
      ],
      figures: [
        { value: 2015, suffix: "", label: "Founded", raw: true },
        { value: 50, suffix: "%", label: "Deposit upon order", raw: false },
      ],
    },

    work: {
      label: "Case studies",
      title: "Selected work.",
      lead: "Our projects, with the sector, the city and what shipped.",
      durationUnit: "weeks",
      statusLive: "Live",
      cta: "View project",
      projects: [
        { name: "BongoSpace", sector: "Commerce & Accounting", city: "Douala, Kinshasa", tags: ["Mobile Money", "Offline-First", "PWA"] },
        { name: "Bimaround", sector: "BeautyTech & Micro-POS", city: "Douala, Cameroon", tags: ["BeautyTech", "Mobile-First", "POS", "Mobile Money", "WhatsApp"], image: "/Projet/bimaroundpro.png" },
        { name: "Yamo Delivery", sector: "Last-mile delivery", city: "Libreville", tags: ["Logistics", "Dispatch", "Mobile"] },
        { name: "Cabinet Médical Santé Plus", sector: "Health & Booking", city: "Douala", tags: ["Health", "WhatsApp", "Web"] },
        { name: "Boutique Wax & Chic", sector: "Fashion & Retail", city: "Yaoundé", tags: ["Catalogue", "WhatsApp", "E-commerce"] },
      ],
    },

    realisationsPage: {
      meta: {
        title: "Projects and demos",
        description:
          "Explore live web applications, mobile platforms, and POS systems built for businesses across Douala, Libreville, Yaoundé and beyond.",
      },
      badge: "Portfolio & Case Studies",
      titleBefore: "Products built for the ",
      titleMark: "ground",
      titleAfter: ", not for a moodboard.",
      lead:
        "Websites, apps and our own products, designed for Android phones and mobile networks in Central Africa.",
      filterAllSectors: "All sectors",
      filterAllCities: "All cities",
      viewCards: "Detailed story view",
      viewGrid: "Compact grid",
      filterSectorLabel: "Sector",
      filterCityLabel: "Location",
      resultsCount: "delivered products",
      challengeLabel: "Field challenge",
      solutionLabel: "Product answer",
      deliverablesLabel: "Final deliverables",
      metricsLabel: "Measured impact",
      viewDetails: "Explore case study",
      closeDetails: "Close detailed view",
      backHome: "Back to home",
      statusLive: "Live",
      durationUnit: "weeks",
      timelineLabel: "Timeline",
      cityLabel: "City",
      sectorLabel: "Sector",
      methodBanner: {
        label: "The Programactor promise",
        title: "Every two weeks, a functional increment tested in the field.",
        body: "We do not bill for months of detached research. By day 15, you hold an interface validated with your target users.",
        cta: "Discover our method",
      },
      cta: {
        label: "Your project",
        titleBefore: "Have a product to ",
        titleMark: "ship",
        titleAfter: " in Central Africa?",
        body: "Tell us the core problem in one sentence. We will give you a direct feasibility verdict for a 4 to 8-week sprint and transparent pricing.",
        button: "Book a scoping call",
      },
    },

    detailedProjects: [
      {
        key: "p1",
        id: "fintech-momo",
        name: "BongoSpace",
        client: "Owner",
        sector: "Commerce & Accounting",
        city: "Douala, Kinshasa",
        year: "2026",
        duration: "3 weeks",
        status: "Live",
        tags: ["Mobile Money", "Offline-First", "PWA", "SAAS", "ERP"],
        tagline: "Instant QR code and USSD merchant checkout for neighborhood retail.",
        challenge:
          "Unstable 3G/EDGE coverage across Douala open-air markets, shopkeeper reluctance toward bloated UI, and delayed SMS operator confirmations.",
        solution:
          "Offline-first architecture with background queueing, instantaneous static and dynamic QR generation, and bilingual audio verification (French/Pidgin) on every payment.",
        deliverables: [
          "Field research across Marché Central",
          "High-density mobile design system",
          "Ultra-lightweight offline PWA (< 2MB)",
          "MTN MoMo & Orange Money payment gateway",
        ],
        metrics: [
          { value: "-40%", label: "Checkout completion time" },
          { value: "100%", label: "Offline-ready operations" },
          { value: "15 days", label: "Kickoff to merchant test" },
        ],
        accentTone: "signal" as const,
      },
      {
        key: "p-bimaround",
        id: "bimaround",
        name: "Bimaround",
        client: "R&D Product OnetouchLabs",
        sector: "BeautyTech & Micro-POS",
        city: "Douala, Cameroon (with Libreville)",
        year: "2026",
        duration: "8 weeks",
        status: "Live",
        tags: ["BeautyTech", "Mobile-First", "POS", "Mobile Money", "WhatsApp"],
        tagline: "The all-in-one platform turning African beauty professionals into organized, profitable entrepreneurs.",
        challenge:
          "Over 80% of barbers, hair stylists, and beauty salons in Central and West Africa operate informally, losing 15% to 30% of their monthly income to untracked cash payments, frequent client no-shows, and manual paper book-keeping. Western salon software completely fails in this ecosystem: too heavy for erratic 3G connections, zero integration with local Mobile Money networks (Orange Money, MTN MoMo, Wave), and disconnected from WhatsApp where customer interactions actually happen.",
        solution:
          "Programactor engineered Bimaround from the ground up for the African street economy: an ultra-responsive, mobile-first operating system combining a lightweight POS cash register (supporting Cash + Mobile Money), automated booking confirmations via WhatsApp, multi-staff commission calculations, and real-time inventory alerts, packaged in an offline-ready, accessible interface.",
        deliverables: [
          "Responsive Web App & PWA for salon owners, staff, and clients",
          "Touch-friendly POS register with Cash & Mobile Money checkout",
          "24/7 booking engine with automated WhatsApp reminders",
          "Financial dashboard tracking revenue, staff splits, and stock",
          "High-converting landing page with resilient 2-step waitlist engine",
        ],
        metrics: [
          { value: "+96", label: "Beauty pros on waitlist" },
          { value: "< 5 min", label: "Daily salon register closing time" },
          { value: "2 Cities", label: "Pilot launch cities (Douala & Libreville)" },
        ],
        accentTone: "signal" as const,
        image: "/Projet/bimaroundpro.webp",
        coverImageUrl: "/Projet/bimaroundpro.webp",
        cardCoverImageUrl: "/Projet/bimaroundpro.webp",
        heroCoverImageUrl: "/Projet/bimaroundpro.webp",
        gallery: [
          "/Projet/bimaroundpro.webp",
          "/projects/bimaround.png",
          "/projects/bimaroundpro.jpg"
        ],
      },
      {
        key: "p2",
        id: "logistique-coursier",
        name: "Yamo Delivery",
        client: "Express Dispatch",
        sector: "Last-mile delivery",
        city: "Libreville",
        year: "2026",
        duration: "6 weeks",
        status: "Live",
        tags: ["Strategy", "Design", "Build", "Dispatch"],
        tagline: "Courier dispatch system and location tracking without formal street addresses.",
        challenge:
          "In Libreville, the lack of formal street naming and building numbers breaks traditional navigation; dispatches rely on visual landmarks and phone guidance.",
        solution:
          "Courier app guided by geo-anchored visual landmarks with reference photos, zero-install customer SMS tracking links, and real-time operations console.",
        deliverables: [
          "Libreville courier route & landmark mapping",
          "Low-battery Android courier application",
          "Web supervisor & dispatch console",
          "Automated WhatsApp & SMS notifications",
        ],
        metrics: [
          { value: "-35%", label: "Average delivery turnaround" },
          { value: "< 8 MB", label: "Application install size" },
          { value: "99.2%", label: "Successful drop-off rate" },
        ],
        accentTone: "indigo" as const,
      },
      {
        key: "p3",
        id: "sante-consultation",
        name: "Cabinet Médical Santé Plus",
        client: "Clinique de la Paix",
        sector: "Appointment booking",
        city: "Douala",
        year: "2025",
        duration: "4 weeks",
        status: "Live",
        tags: ["Research", "Product", "SMS/WhatsApp"],
        tagline: "Clinical appointment management and multi-channel automated reminders.",
        challenge:
          "Over 40% patient no-show rate in private polyclinics, disorganized morning queues, and medical receptionists flooded with repetitive calls.",
        solution:
          "Streamlined 3-step appointment portal paired with Mobile Money micro-deposits to secure slots, plus scheduled WhatsApp and SMS alerts.",
        deliverables: [
          "Waiting room field research & patient interviews",
          "Zero-friction web booking (no account needed)",
          "Doctor queue management dashboard",
          "Automated SMS & WhatsApp reminder pipeline",
        ],
        metrics: [
          { value: "-62%", label: "Missed appointment rate" },
          { value: "3 clicks", label: "To confirm booking" },
          { value: "+180%", label: "Digital deposit adoption" },
        ],
        accentTone: "surface" as const,
      },
      {
        key: "p4",
        id: "commerce-catalogue",
        name: "Boutique Wax & Chic",
        client: "Maison Wax",
        sector: "WhatsApp catalogue",
        city: "Yaoundé",
        year: "2025",
        duration: "2 weeks",
        status: "Live",
        tags: ["Identity", "Web", "Social Commerce"],
        tagline: "Lightweight digital storefront synchronized with WhatsApp Business.",
        challenge:
          "Sellers losing hours manually sharing product pictures and prices one by one in chat threads, resulting in inventory mismatches and abandoned checkouts.",
        solution:
          "Blazing-fast mini-store (< 1s load on 3G) enabling shoppers to build a basket and generate a pre-formatted WhatsApp order message in a single tap.",
        deliverables: [
          "Visual-first responsive catalogue design",
          "Smart WhatsApp cart text generator",
          "Simplified mobile stock manager",
          "Merchant best-practices guide",
        ],
        metrics: [
          { value: "< 1s", label: "Page load on 3G mobile" },
          { value: "2 wks", label: "Brief to initial sales" },
          { value: "+210%", label: "Completed order conversions" },
        ],
        accentTone: "signal" as const,
      },
      {
        key: "p5",
        id: "agritech-cacao",
        name: "Agritech",
        client: "Cacao Sud Cooperative",
        sector: "Traceability",
        city: "Kribi",
        year: "2025",
        duration: "8 weeks",
        status: "Live",
        tags: ["Field", "Design", "Build", "PWA"],
        tagline: "Farm-to-export traceability for cocoa farmer cooperatives.",
        challenge:
          "Weighing stations located in complete cellular dead zones, scale operators unfamiliar with touchscreens, and mandatory compliance with EU anti-deforestation laws.",
        solution:
          "Ruggedized tablet interface with high-contrast DM Mono typography, reliable offline-first queued sync, and permanent QR tags on individual burlap bags.",
        deliverables: [
          "7-day field immersion in plantation hubs",
          "Offline tablet app with encrypted local DB",
          "Exporter & compliance audit portal",
          "Illustrated pictorial field operator guide",
        ],
        metrics: [
          { value: "100%", label: "Export compliance pass" },
          { value: "0 loss", label: "Data drops during blackouts" },
          { value: "+18%", label: "Fair premium payout" },
        ],
        accentTone: "indigo" as const,
      },
      {
        key: "p6",
        id: "education-microlearning",
        name: "Education",
        client: "Africa Pro Academy",
        sector: "Course platform",
        city: "Libreville",
        year: "2024",
        duration: "3 weeks",
        status: "Live",
        tags: ["Product", "Design system", "Audio/Video"],
        tagline: "Low-bandwidth learning platform with audio micro-lessons and summary cards.",
        challenge:
          "Prohibitive mobile data costs making video streaming unaffordable for learners, causing over 80% dropout rates on standard video platforms.",
        solution:
          "Curriculum restructured around 3-5 minute micro-audio modules, scheduled off-peak Wi-Fi downloads, and downloadable summary cards.",
        deliverables: [
          "Low-energy high-efficiency design system",
          "Progressive audio player with resume memory",
          "Learner PWA with default dark mode",
          "Course publishing & instructor console",
        ],
        metrics: [
          { value: "-85%", label: "Data usage versus video" },
          { value: "78%", label: "Course completion rate" },
          { value: "3 wks", label: "Kickoff to first cohort" },
        ],
        accentTone: "surface" as const,
      },
    ],

    services: {
      label: "What we do",
      title: "What we do for your business.",
      lead: "Show us your business once, we handle everything until it goes live.",
      cta: "Get my free preview",
      items: [
        {
          title: "Your website.",
          body: "A fast mobile site with your services, prices, photos and a WhatsApp button at every step. Live in 72 hours (Essentiel) or 2 weeks (Complet).",
          tags: ["Showcase website", "WhatsApp", "72 hours"],
        },
        {
          title: "Your digital menu.",
          body: "Your menu on the phone, a QR code on every table, orders sent to your WhatsApp. No more blurry menu photos.",
          tags: ["QR menu", "WhatsApp ordering"],
        },
        {
          title: "Your visibility on Google and Yango.",
          body: "Google listing created or fixed, one-tap directions, local SEO so you show up when people search \"restaurant Bonamoussadi\" or \"car rental Douala\".",
          tags: ["Google", "Yango", "Local SEO"],
        },
        {
          title: "Online bookings and quotes.",
          body: "Customers pick a date, a vehicle or a service, see the price and send you a complete request.",
          tags: ["Booking", "Quotes", "Calculator"],
        },
        {
          title: "Your restaurant's till and management (Bongo Space).",
          body: "Order taking, till, stock, even when the network drops.",
          tags: ["Bongo Space", "Till", "Offline-first"],
        },
      ],
    },

    method: {
      label: "How it works",
      titleBefore: "See your business online ",
      titleMark: "before",
      titleAfter: " you pay.",
      steps: [
        {
          title: "Free preview.",
          body: "Send us your business name on WhatsApp. We send back a preview of what your customers will see within 48 business hours.",
        },
        {
          title: "Meeting at your place or by video.",
          body: "In Douala, we come to your venue (30 min). In Libreville or elsewhere, by WhatsApp video or Google Meet. We agree on the offer and the price together, in writing.",
        },
        {
          title: "50% deposit.",
          body: "By Mobile Money or bank transfer. We start the same day.",
        },
        {
          title: "Go-live and training.",
          body: "We deliver, show you how to update everything, and you pay the balance on delivery. Your domain name and your content belong to you.",
        },
      ],
    },

    labs: {
      label: "School",
      title: "One Touch Labs.",
      lead: "Our school. Six months of practice, a portfolio, and interviews with partner studios.",
      body: "Both sides feed each other: students work on live briefs, startups get people who already know the work.",
      points: [
        { title: "Live briefs", body: "No exercises. Real client projects, supervised." },
        { title: "Portfolio", body: "Six months to build a body of work that stands up." },
        { title: "Introductions", body: "Interviews with partner studios, here and abroad." },
      ],
      cta: "Discover One Touch Labs",
    },

    testimonials: {
      published: false,
      label: "What they say",
      titleBefore: "What our ",
      titleMark: "clients",
      titleAfter: " say.",
      lead: "Real feedback from our live deployments.",
      placeholder: "",
      items: [] as Testimonial[],
    },

    pricing: {
      label: "Product studio",
      titleBefore: "Are you launching an app or a ",
      titleMark: "software",
      titleAfter: " ?",
      lead: "Programactor is also a product studio: field research, design and development of web and mobile apps. That's how we designed our own products, Bongo Space and BongoFleet.",
      popular: "",
      timeline: "Timeline",
      note: "EVERY ENGAGEMENT STARTS WITH A WRITTEN SCOPE AND A FIXED PRICE. YOU APPROVE THE PLAN BEFORE WE DESIGN OR CODE ANYTHING.",
      items: [
        {
          n: "01",
          title: "Product audit.",
          subtitle: "Where your idea holds up, and where it breaks.",
          timeline: "5 days",
          price: AGENCY_PRICES.diagnostic || "250,000 FCFA",
          priceLabel: "From",
          features: [
            "User interviews in the field",
            "Review of existing systems and competitors",
            "Target journey in one diagram",
            "Costed delivery plan",
            "Written recommendation you keep",
          ],
          cta: "Start an audit",
        },
        {
          n: "02",
          title: "Product sprint.",
          subtitle: "Designed, built, shipped.",
          timeline: "4 to 8 weeks",
          price: AGENCY_PRICES.sprint || "750,000 FCFA",
          priceLabel: "From",
          popular: false,
          features: [
            "Everything in the audit",
            "Full product & interface design",
            "Web or mobile build",
            "Testing on real data",
            "Go-live and handover",
          ],
          cta: "Plan a sprint",
        },
        {
          n: "03",
          title: "Product partner.",
          subtitle: "Your design team, monthly.",
          timeline: "Ongoing",
          price: AGENCY_PRICES.partner || "1,500,000 FCFA",
          priceLabel: "Per month · From",
          features: [
            "Dedicated design + build pair",
            "Continuous iteration on real usage",
            "Maintained design system",
            "Training for your team",
          ],
          cta: "Talk to us",
        },
      ],
    },

    faq: {
      label: "FAQ",
      title: "What people ask us before starting.",
      items: [
        {
          q: "How much does it cost?",
          a: "The Essentiel website is 75,000 FCFA and the Complet website 130,000 FCFA. A digital menu costs 90,000 to 130,000 FCFA depending on the size of your menu, and the Bongo Space installation pack is 250,000 FCFA. The price is written down before we start and does not change.",
        },
        {
          q: "How do I pay?",
          a: "50% deposit when you order, the balance on delivery. In Cameroon: Orange Money or MTN MoMo. In Gabon: Airtel Money. Bank transfer also accepted.",
        },
        {
          q: "Where do we meet?",
          a: "At your place. In Douala, we come to your venue: that's where we see how your customers order and take the photos. For Libreville and abroad, everything happens by video call.",
        },
        {
          q: "How fast is my site live?",
          a: "72 hours for Essentiel and about 2 weeks for Complet, once we have your logo, photos and prices.",
        },
        {
          q: "I don't have photos or a logo.",
          a: "No problem: we take photos during the meeting in Douala and work from your signage.",
        },
        {
          q: "Who owns the site and domain?",
          a: "You do. The domain is registered in your name and you keep your texts and photos.",
        },
        {
          q: "What happens after year one?",
          a: "Hosting and domain then cost about 35,000 FCFA per year.",
        },
        {
          q: "Do you work in Gabon?",
          a: "Yes, in Libreville: video meetings, payment by Airtel Money, same FCFA price list.",
        },
        {
          q: "I have an app project, not a shop.",
          a: "Programactor is also a product studio: we design and develop custom web and mobile apps. See the Studio section below.",
        },
      ],
      skip: {
        title: "Another question?",
        body: "Message the team directly on WhatsApp.",
        cta: "Ask a question on WhatsApp",
      },
    },

    cta: {
      label: "Free preview",
      titleBefore: "Get a free preview of your ",
      titleMark: "future website",
      titleAfter: " in 48 hours.",
      body: "Send us your business name, your city and your activity on WhatsApp. We send back a first preview with zero commitment.",
      button: "Get my free preview",
      or: "or message us on WhatsApp",
    },

    footer: {
      tagline: "Websites, digital menus and online visibility for SMEs. Douala · Libreville.",
      nav: "Navigation",
      contactLabel: "Contact",
      social: "Follow",
      legal: "Legal notice",
      rights: "All rights reserved.",
    },
  };

  const dict = lang === "en" ? en : fr;
  return {
    ...dict,
    projectsMeta: projectsBase,
  };
}
