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
  founded: "2023",
  contact: {
    // TODO: coordonnées réelles
    email: "hello@programactor.pro",
    whatsapp: "+237 6 92 02 55 52",
    instagram: "https://www.instagram.com/programactor/",
    booking: "#contact",
  },

  cities: "Douala · Libreville",
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
      title: "Programactor — L'agence qui transforme l'idée en produit",
      description:
        "Agence de design produit centrée humain à Douala et Libreville. Recherche terrain, design d'interface et build en sprints courts, pour des produits pensés pour l'Afrique.",
    },

    nav: {
      tagline: "Agence produit",
      links: [
        { label: "Réalisations", href: "#realisations" },
        { label: "XpreSite", href: "#xpresite" },
        { label: "Services", href: "#services" },
        { label: "Méthode", href: "#methode" },
        { label: "One Touch Labs", href: "#labs" },
        { label: "Tarifs", href: "#tarifs" },
      ],
      cta: "Parler à un designer",
      menu: "Menu",
      close: "Fermer",
    },

    hero: {
      eyebrow: "Douala · Libreville · ouvert aux projets",
      titleBefore: "L'agence qui transforme une idée en ",
      titleMark: "produit",
      titleAfter: " que les gens utilisent vraiment.",
      lead: "Design centré humain, recherche sur le terrain, build en sprints courts. Tu arrives avec une idée et une échéance. Tu repars avec un produit en ligne, entre les mains de tes utilisateurs.",
      ctaPrimary: "Réserver un appel",
      ctaSecondary: "Voir les réalisations",
      status: "Statut : ouvert aux projets",
      since: "Depuis 2023",
    },

    manifesto:
      "Une agence de design produit qui part du terrain, pas du moodboard. On dessine pour des gens qui ont un Android d'entrée de gamme, un forfait data compté et dix secondes d'attention.",

    stats: {
      label: "Par les chiffres",
      title: "Ce que ça donne, en vrai.",
      // TODO: chiffres réels — ceux-ci sont des espaces réservés
      items: [
        { value: 12, suffix: "", label: "Produits mis en ligne" },
        { value: 3, suffix: "", label: "Pays où nos produits tournent" },
        { value: 15, suffix: "j", label: "Du kickoff au premier écran testé" },
      ],
    },

    rhythm: {
      label: "Le rythme",
      title: "3 phases / boucles de 2 semaines / 1 produit en ligne.",
      body: "Toutes les deux semaines on ouvre et on ferme une boucle : un atelier pour cadrer, une démo pour valider. Entre les deux, tu nous joins sur WhatsApp. + À chaque fin de phase tu vois le produit tourner sur tes vraies données, pas sur une maquette.",
      marquee: [
        "Découvrir",
        "Cadrer",
        "Dessiner",
        "Construire",
        "Tester",
        "Lancer",
      ],
    },

    about: {
      label: "L'agence",
      title: "Un studio qui livre.",
      body: [
        "Programactor est né à Douala en 2023. On travaille avec des founders au Cameroun, au Gabon et ailleurs, sur des produits qui doivent marcher là où le réseau tombe, où le paiement passe par mobile money et où l'utilisateur découvre l'application sur WhatsApp.",
        "Recherche utilisateur sur le terrain, design d'interface, build jusqu'à la mise en ligne. Une équipe, un interlocuteur, un produit.",
      ],
      figures: [
        { value: 3, suffix: " pays", label: "Cameroun, Gabon et au-delà" },
        { value: 2023, suffix: "", label: "Année de création", raw: true },
      ],
    },

    work: {
      label: "Réalisations",
      title: "Réalisations.",
      lead: "Des projets réels, avec le secteur, la ville et ce qui a été livré. Rien ici n'est un concept.",
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
        title: "Réalisations · Études de cas — Programactor",
        description:
          "Découvrez les produits conçus et mis en production par Programactor à Douala, Libreville et en Afrique centrale. Recherche terrain, design d'interface et build.",
      },
      badge: "Portfolio & Études de cas",
      titleBefore: "Des produits conçus pour le ",
      titleMark: "terrain",
      titleAfter: ", pas pour la galerie.",
      lead:
        "Ni concepts théoriques, ni maquettes oubliées dans un dossier. Des applications et plateformes qui tournent sur de vrais réseaux, avec de vrais utilisateurs et de vrais paiements.",
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
      label: "Services",
      title: "Nos services.",
      lead: "Cinq métiers, une équipe. Tu briefes une fois, on va jusqu'à la mise en production.",
      cta: "Réserver un appel",
      items: [
        {
          title: "Recherche terrain.",
          body: "On va voir tes utilisateurs là où ils sont. Entretiens, observation, test de l'existant sur leur propre téléphone.",
          tags: ["Entretiens", "Observation", "Test utilisateur", "Benchmark"],
        },
        {
          title: "Design produit et interface.",
          body: "Parcours, écrans, design system. Livré dans Figma, documenté, prêt pour le développement.",
          tags: ["Parcours", "Wireframes", "UI", "Design system"],
        },
        {
          title: "Identité de marque.",
          body: "Nom, logo, charte, ton de voix. Une marque qui tient sur une enseigne comme sur un avatar WhatsApp de 40 pixels.",
          tags: ["Logo", "Charte", "Ton de voix", "Guidelines"],
        },
        {
          title: "Build et mise en ligne.",
          body: "Web et mobile. On construit par morceaux, on teste sur tes données réelles, on met en ligne.",
          tags: ["Web", "Mobile", "Intégrations", "Mise en ligne"],
        },
        {
          title: "Accompagnement produit.",
          body: "Après le lancement : mesure d'usage, itérations, formation de ton équipe. Tu gardes la main.",
          tags: ["Mesure", "Itérations", "Formation", "Passation"],
        },
      ],
    },

    method: {
      label: "Méthode · Lean Product",
      titleBefore: "Comment on passe de l'idée ",
      titleMark: "au produit",
      titleAfter: "",
      steps: [
        {
          title: "Découvrir.",
          body: "On part du problème, pas de la solution. Entretiens terrain, analyse de l'existant, et on écrit noir sur blanc ce qui est vrai.",
        },
        {
          title: "Cadrer.",
          body: "On réduit à un produit minimum qui tient une seule promesse. Tu valides le périmètre et le prix avant qu'on dessine un écran.",
        },
        {
          title: "Construire et tester.",
          body: "Sprints de deux semaines. À chaque fin de boucle tu vois quelque chose qui marche, sur tes données, pas une maquette cliquable.",
        },
        {
          title: "Lancer et transmettre.",
          body: "Mise en ligne, mesure, formation. Tu repars avec les fichiers, le code et la documentation. Aucune dépendance à nous.",
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
      label: "Ce qu'ils en disent",
      titleBefore: "Des founders qui ont ",
      titleMark: "livré",
      titleAfter: ".",
      lead: "On demande un retour 90 jours après la mise en ligne, quand le produit a vécu.",
      placeholder: "",
      items: [
        {
          quote: "Programactor a structuré notre produit de zéro. En 3 semaines, notre système d'encaissement et de gestion tournait sur le terrain à Douala sans friction.",
          author: "Christian T.",
          role: "Co-fondateur",
          company: "BongoSpace (Fintech PME)",
          date: "90j post-kickoff"
        },
        {
          quote: "La formule XpreSite en 72h nous a permis de digitaliser notre flotte de transport immédiatement avec un système de commande WhatsApp clair et professionnel.",
          author: "Marcelle E.",
          role: "Directrice des Opérations",
          company: "TransExpress Douala",
          date: "60j post-lancement"
        },
      ],
    },

    pricing: {
      label: "Tarifs",
      titleBefore: "Trois façons de ",
      titleMark: "commencer",
      titleAfter: ".",
      popular: "Le plus demandé",
      timeline: "Durée",
      note: "Chaque mission démarre par un périmètre écrit et un prix fixe. Tu valides le plan avant qu'on dessine ou qu'on code quoi que ce soit.",
      // TODO: remplace "Sur devis" par un montant si tu veux afficher des prix
      items: [
        {
          n: "01",
          title: "Diagnostic produit.",
          subtitle: "Où ton idée tient, et où elle casse.",
          timeline: "5 jours",
          price: "Sur devis",
          features: [
            "Entretiens utilisateurs sur le terrain",
            "Analyse de l'existant et des concurrents",
            "Parcours cible en un schéma",
            "Plan de lots chiffré",
            "Recommandation écrite que tu gardes",
          ],
          cta: "Lancer un diagnostic",
        },
        {
          n: "02",
          title: "Sprint produit.",
          subtitle: "Conçu, construit, mis en ligne.",
          timeline: "4 à 8 semaines",
          price: "Sur devis",
          popular: true,
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
          subtitle: "Ton équipe design, au mois.",
          timeline: "En continu",
          price: "Sur devis",
          features: [
            "Un binôme design + build dédié",
            "Itérations continues sur l'usage",
            "Design system maintenu",
            "Formation de ton équipe",
          ],
          cta: "En discuter",
        },
      ],
    },

    faq: {
      label: "FAQ",
      title: "Avant l'appel.",
      items: [
        {
          q: "Vous travaillez avec des startups qui démarrent tout juste ?",
          a: "Oui, c'est même notre terrain. La plupart de nos clients arrivent avec une idée et un problème mal formulé. Le diagnostic sert justement à transformer cette intuition en périmètre chiffré, avant d'engager du budget de build.",
        },
        {
          q: "En combien de temps on voit quelque chose ?",
          a: "Un premier écran testé auprès de vrais utilisateurs sous quinze jours. Une première version en ligne entre quatre et huit semaines, selon la complexité et la disponibilité de tes données.",
        },
        {
          q: "Vous faites le développement ou seulement le design ?",
          a: "Les deux. On peut s'arrêter à la remise des fichiers Figma si tu as déjà une équipe technique, ou aller jusqu'à la mise en production. On le décide au cadrage, pas en cours de route.",
        },
        {
          q: "On travaille à distance ou sur place ?",
          a: "Les ateliers de cadrage et la recherche terrain se font sur place, à Douala, Libreville ou chez toi. Le reste tourne à distance, avec deux points fixes par boucle de deux semaines et WhatsApp entre les deux.",
        },
        {
          q: "À qui appartiennent les fichiers et le code ?",
          a: "À toi, entièrement, dès la fin de la mission. Fichiers sources, code, documentation, accès aux hébergements. On ne garde aucune clé et on ne facture aucun abonnement pour te laisser l'accès à ton propre produit.",
        },
        {
          q: "Vous travaillez en français ou en anglais ?",
          a: "Les deux, nativement. On écrit chaque langue dans son rythme propre plutôt que de traduire l'une à partir de l'autre — pour nos livrables comme pour les produits qu'on conçoit.",
        },
      ],
      skip: {
        title: "Pas envie de lire la FAQ ?",
        body: "Écris directement à l'équipe.",
        cta: "Poser une question",
      },
    },

    cta: {
      label: "Une idée en tête ?",
      titleBefore: "Montre-nous le problème que tu veux ",
      titleMark: "résoudre",
      titleAfter: ".",
      body: "Dis-nous en une phrase ce que tes utilisateurs n'arrivent pas à faire aujourd'hui. Au premier appel, on te dit gratuitement si c'est un problème de produit, de marque ou de canal — et ce qu'il faudrait pour le régler.",
      button: "Réserver un appel",
      or: "ou écris-nous",
    },

    footer: {
      tagline: "Agence de design produit. Cameroun, Gabon, monde.",
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
      title: "Programactor — The studio that turns an idea into a product",
      description:
        "Human-centred product design studio in Douala and Libreville. Field research, interface design and short build sprints, for products made to work in Africa.",
    },

    nav: {
      tagline: "Product studio",
      links: [
        { label: "Work", href: "#realisations" },
        { label: "XpreSite", href: "#xpresite" },
        { label: "Services", href: "#services" },
        { label: "Method", href: "#methode" },
        { label: "One Touch Labs", href: "#labs" },
        { label: "Pricing", href: "#tarifs" },
      ],
      cta: "Talk to a designer",
      menu: "Menu",
      close: "Close",
    },

    hero: {
      eyebrow: "Douala · Libreville · open for projects",
      titleBefore: "The studio that turns an idea into a ",
      titleMark: "product",
      titleAfter: " people actually use.",
      lead: "Human-centred design, field research, short build sprints. You arrive with an idea and a deadline. You leave with a product that is live and in your users' hands.",
      ctaPrimary: "Book a call",
      ctaSecondary: "See the work",
      status: "Status: open for projects",
      since: "Since 2023",
    },

    manifesto:
      "A product design studio that starts in the field, not on a moodboard. We design for people on entry-level Android phones, metered data plans and ten seconds of patience.",

    stats: {
      label: "By the numbers",
      title: "What it adds up to.",
      items: [
        { value: 12, suffix: "", label: "Products shipped" },
        { value: 3, suffix: "", label: "Countries running our work" },
        { value: 15, suffix: "d", label: "From kickoff to first tested screen" },
      ],
    },

    rhythm: {
      label: "The rhythm",
      title: "3 phases / 2-week loops / 1 product live.",
      body: "Every two weeks we open and close a loop: one workshop to frame it, one demo to sign it off. In between, you reach us on WhatsApp. + At the end of each phase you watch the product run on your real data, not on a prototype.",
      marquee: ["Discover", "Frame", "Design", "Build", "Test", "Ship"],
    },

    about: {
      label: "The studio",
      title: "A studio that ships.",
      body: [
        "Programactor started in Douala in 2023. We work with founders in Cameroon, Gabon and beyond, on products that have to hold up where the network drops, where payment runs through mobile money, and where users meet the app on WhatsApp first.",
        "Field research, interface design, build through to launch. One team, one point of contact, one product.",
      ],
      figures: [
        { value: 3, suffix: " countries", label: "Cameroon, Gabon and beyond" },
        { value: 2023, suffix: "", label: "Founded", raw: true },
      ],
    },

    work: {
      label: "Case studies",
      title: "Selected work.",
      lead: "Real projects, with the sector, the city and what shipped. Nothing here is a concept.",
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
        title: "Work · Case studies — Programactor",
        description:
          "Explore products designed and shipped by Programactor in Douala, Libreville, and across Central Africa. Field research, interface design, and build.",
      },
      badge: "Portfolio & Case Studies",
      titleBefore: "Products built for the ",
      titleMark: "ground",
      titleAfter: ", not for a moodboard.",
      lead:
        "No theoretical concepts, no forgotten prototypes. Real applications running on real cellular networks, with real users and real transactions.",
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
      label: "Services",
      title: "Our services.",
      lead: "Five crafts, one team. You brief us once and we carry it through to production.",
      cta: "Book a call",
      items: [
        {
          title: "Field research.",
          body: "We go and watch your users where they are. Interviews, observation, testing what exists on their own handset.",
          tags: ["Interviews", "Observation", "Usability", "Benchmark"],
        },
        {
          title: "Product and interface design.",
          body: "Flows, screens, design system. Delivered in Figma, documented, ready for engineering.",
          tags: ["Flows", "Wireframes", "UI", "Design system"],
        },
        {
          title: "Brand identity.",
          body: "Name, mark, guidelines, tone of voice. A brand that holds up on a shopfront and on a 40-pixel WhatsApp avatar.",
          tags: ["Logo", "Guidelines", "Tone of voice", "Assets"],
        },
        {
          title: "Build and launch.",
          body: "Web and mobile. We build in small pieces, test on your real data, and put it live.",
          tags: ["Web", "Mobile", "Integrations", "Launch"],
        },
        {
          title: "Product partnership.",
          body: "After launch: usage measurement, iterations, training for your team. You keep the wheel.",
          tags: ["Measurement", "Iteration", "Training", "Handover"],
        },
      ],
    },

    method: {
      label: "Method · Lean Product",
      titleBefore: "How an idea becomes a ",
      titleMark: "product",
      titleAfter: "",
      steps: [
        {
          title: "Discover.",
          body: "We start from the problem, not the solution. Field interviews, a look at what already exists, and a written account of what is actually true.",
        },
        {
          title: "Frame.",
          body: "We cut it down to a minimum product that holds one promise. You approve scope and price before we draw a single screen.",
        },
        {
          title: "Build and test.",
          body: "Two-week sprints. At the close of every loop you see something that works, on your data, not a clickable mockup.",
        },
        {
          title: "Ship and hand over.",
          body: "Launch, measurement, training. You leave with the files, the code and the documentation. No dependency on us.",
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
      label: "What they say",
      titleBefore: "Founders who ",
      titleMark: "shipped",
      titleAfter: ".",
      lead: "We ask for feedback 90 days after launch, once the product has had a real life in users' hands.",
      placeholder: "",
      items: [
        {
          quote: "Programactor framed our product from scratch. Within 3 weeks, our merchant payment and management system was live on the ground in Douala with zero friction.",
          author: "Christian T.",
          role: "Co-founder",
          company: "BongoSpace (SME Fintech)",
          date: "90d post-kickoff"
        },
        {
          quote: "The 72h XpreSite package allowed us to launch our vehicle rental operations immediately with seamless, professional WhatsApp lead intake.",
          author: "Marcelle E.",
          role: "Operations Lead",
          company: "TransExpress Douala",
          date: "60d post-launch"
        },
      ],
    },

    pricing: {
      label: "Pricing",
      titleBefore: "Three ways to ",
      titleMark: "start",
      titleAfter: ".",
      popular: "Most requested",
      timeline: "Timeline",
      note: "Every engagement starts with a written scope and a fixed price. You approve the plan before we design or code anything.",
      items: [
        {
          n: "01",
          title: "Product audit.",
          subtitle: "Where your idea holds, and where it breaks.",
          timeline: "5 days",
          price: "On request",
          features: [
            "User interviews in the field",
            "Review of what exists, and of competitors",
            "Target journey in one diagram",
            "Costed plan of work",
            "A written recommendation you keep",
          ],
          cta: "Start an audit",
        },
        {
          n: "02",
          title: "Product sprint.",
          subtitle: "Designed, built, put live.",
          timeline: "4 to 8 weeks",
          price: "On request",
          popular: true,
          features: [
            "Everything in the audit",
            "Full product and interface design",
            "Web or mobile build",
            "Testing on real data",
            "Launch and handover",
          ],
          cta: "Plan a sprint",
        },
        {
          n: "03",
          title: "Product partner.",
          subtitle: "Your design team, monthly.",
          timeline: "Ongoing",
          price: "On request",
          features: [
            "A dedicated design + build pair",
            "Continuous iteration on real usage",
            "Design system kept alive",
            "Training for your team",
          ],
          cta: "Talk to us",
        },
      ],
    },

    faq: {
      label: "FAQ",
      title: "Before the call.",
      items: [
        {
          q: "Do you work with startups that are only just starting?",
          a: "Yes — that is our ground. Most of our clients arrive with an idea and a badly framed problem. The audit exists to turn that instinct into a costed scope before you commit build budget.",
        },
        {
          q: "How fast do we see something?",
          a: "A first screen tested with real users inside two weeks. A first version live in four to eight weeks, depending on complexity and how ready your data is.",
        },
        {
          q: "Do you build, or only design?",
          a: "Both. We can stop at the Figma handover if you already have engineers, or carry it all the way to production. That gets decided during framing, not halfway through.",
        },
        {
          q: "Do we work remotely or on site?",
          a: "Framing workshops and field research happen on site, in Douala, Libreville or wherever you are. The rest runs remotely, with two fixed calls per two-week loop and WhatsApp in between.",
        },
        {
          q: "Who owns the files and the code?",
          a: "You do, entirely, from the end of the engagement. Source files, code, documentation, hosting access. We keep no keys and charge no subscription for access to your own product.",
        },
        {
          q: "Do you work in French or English?",
          a: "Both, natively. We write each language in its own rhythm rather than translating one from the other — for our own deliverables and for the products we design.",
        },
      ],
      skip: {
        title: "Rather skip the FAQ?",
        body: "Write to the team directly.",
        cta: "Ask a question",
      },
    },

    cta: {
      label: "Got an idea?",
      titleBefore: "Show us the problem you want to ",
      titleMark: "solve",
      titleAfter: ".",
      body: "Tell us in one sentence what your users cannot do today. On the first call we will tell you, for free, whether it is a product problem, a brand problem or a channel problem — and what it would take to fix it.",
      button: "Book a call",
      or: "or email us",
    },

    footer: {
      tagline: "Product design studio. Cameroon, Gabon, the world.",
      nav: "Navigation",
      contactLabel: "Contact",
      social: "Follow",
      legal: "Legal",
      rights: "All rights reserved.",
    },
  };

  const dict = lang === "en" ? en : fr;
  return {
    ...dict,
    projectsMeta: projectsBase,
  };
}
