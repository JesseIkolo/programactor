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

export type Content = ReturnType<typeof getContent>;

const shared = {
  brand: "Programactor",
  founded: "2023",
  contact: {
    // TODO: coordonnées réelles
    email: "hello@programactor.com",
    whatsapp: "+237 6 00 00 00 00",
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
      // TODO: remplacer par les vrais clients
      projects: [
        {
          name: "Fintech",
          sector: "Paiement mobile",
          city: "Douala",
          tags: ["Recherche", "Identité", "Produit"],
        },
        {
          name: "Logistique",
          sector: "Livraison dernier kilomètre",
          city: "Libreville",
          tags: ["Stratégie", "Design", "Build"],
        },
        {
          name: "Santé",
          sector: "Prise de rendez-vous",
          city: "Douala",
          tags: ["Recherche", "Produit"],
        },
        {
          name: "Commerce",
          sector: "Catalogue WhatsApp",
          city: "Yaoundé",
          tags: ["Identité", "Web"],
        },
        {
          name: "Agritech",
          sector: "Traçabilité",
          city: "Kribi",
          tags: ["Terrain", "Design", "Build"],
        },
        {
          name: "Éducation",
          sector: "Plateforme de cours",
          city: "Libreville",
          tags: ["Produit", "Design system"],
        },
      ],
    },

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
      // ⚠️ AUCUN FAUX TÉMOIGNAGE LIVRÉ. Remplace le contenu ci-dessous
      //    par de vrais verbatims avant de publier le site.
      placeholder: "Verbatim client à insérer.",
      items: [
        { quote: "", author: "Nom Prénom", role: "Fondateur·rice", company: "Entreprise", date: "" },
        { quote: "", author: "Nom Prénom", role: "Directeur·rice produit", company: "Entreprise", date: "" },
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
        { name: "Fintech", sector: "Mobile payments", city: "Douala", tags: ["Research", "Identity", "Product"] },
        { name: "Logistics", sector: "Last-mile delivery", city: "Libreville", tags: ["Strategy", "Design", "Build"] },
        { name: "Health", sector: "Appointment booking", city: "Douala", tags: ["Research", "Product"] },
        { name: "Retail", sector: "WhatsApp catalogue", city: "Yaoundé", tags: ["Identity", "Web"] },
        { name: "Agritech", sector: "Traceability", city: "Kribi", tags: ["Field", "Design", "Build"] },
        { name: "Education", sector: "Course platform", city: "Libreville", tags: ["Product", "Design system"] },
      ],
    },

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
      lead: "We ask for feedback 90 days after launch, once the product has had a life.",
      placeholder: "Client quote to be added.",
      items: [
        { quote: "", author: "Full name", role: "Founder", company: "Company", date: "" },
        { quote: "", author: "Full name", role: "Head of product", company: "Company", date: "" },
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
