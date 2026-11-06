import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import "../globals.css";
import { getContent, LANGS, type Lang } from "@/lib/content";
import Analytics from "@/components/Analytics";

// Titres : Familjen Grotesk (OFL). Texte courant : Satoshi (ITF Free Font License).
// Sous-ensembles latins générés avec pyftsubset (PRD partie C, §2.3), flèches incluses.
const familjen = localFont({
  src: [
    {
      path: "../fonts/familjen-grotesk-latin-var.woff2",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-familjen",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Familjen Fallback Android", "system-ui", "sans-serif"],
});

const satoshi = localFont({
  src: [
    {
      path: "../fonts/satoshi-latin-var.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Satoshi Fallback Android", "system-ui", "sans-serif"],
});

const dmMono = DM_Mono({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});


export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const c = getContent(lang as Lang);
  const isEn = lang === "en";

  return {
    metadataBase: new URL("https://programactor.pro"),
    title: {
      default: c.meta.title,
      template: "%s | Programactor",
    },
    description: c.meta.description,
    keywords: isEn
      ? [
          "web agency douala",
          "website design cameroon",
          "mobile app development gabon",
          "digital product studio libreville",
          "turnkey website 72h",
          "pos cashier software africa",
          "restaurant qr menu douala",
          "mobile money payments mtn orange",
          "ui ux design central africa",
          "programactor",
        ]
      : [
          "création site web douala",
          "agence web cameroun",
          "création site internet libreville",
          "développeur application mobile douala",
          "agence web yaoundé",
          "prix site internet cameroun",
          "logiciel caisse restaurant cameroun",
          "menu qr code restaurant douala",
          "xpresite création site 72h",
          "paiement mobile money orange mtn momo",
          "design ux ui afrique",
          "studio digital douala",
          "programactor",
        ],
    icons: { icon: "/mark.svg", apple: "/mark.svg" },
    alternates: {
      canonical: `https://programactor.pro/${lang}`,
      languages: {
        fr: "https://programactor.pro/fr",
        en: "https://programactor.pro/en",
        "x-default": "https://programactor.pro/fr",
      },
    },
    openGraph: {
      title: c.meta.title,
      description: c.meta.description,
      url: `https://programactor.pro/${lang}`,
      siteName: "Programactor",
      locale: isEn ? "en_US" : "fr_FR",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Programactor Studio — Douala & Libreville",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
      creator: "@programactor",
      images: ["/og-image.png"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isEn = lang === "en";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": "https://programactor.pro/#organization",
    name: "Programactor",
    url: "https://programactor.pro",
    logo: {
      "@type": "ImageObject",
      url: "https://programactor.pro/mark.svg",
    },
    image: "https://programactor.pro/og-image.png",
    description: isEn
      ? "Web agency based in Douala (Cameroon). Websites, digital QR menus, and software for restaurants, bars, hotels, and car rental businesses. On-site meetings in Douala; remote service for Libreville and abroad."
      : "Agence web basée à Douala (Cameroun). Sites internet, menus digitaux QR et logiciels pour restaurants, bars, hôtels et loueurs de véhicules. Rendez-vous chez le client à Douala ; accompagnement à distance pour Libreville et l'international.",
    foundingDate: "2015",
    foundingLocation: {
      "@type": "Place",
      name: "Douala, Cameroun",
    },
    founder: {
      "@type": "Person",
      name: "Jesse B. Ikolo",
      jobTitle: "CEO & Design Leader",
      sameAs: [
        "https://www.linkedin.com/company/programactor",
        "https://www.behance.net/jesseikolo",
        "https://dribbble.com/jesseikolo",
      ],
    },
    email: "hello@programactor.pro",
    telephone: "+237692025552",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Douala",
      addressRegion: "Littoral",
      addressCountry: "CM",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Douala",
        description: "Interventions en présentiel chez le client",
      },
      {
        "@type": "Country",
        name: "Cameroun",
      },
      {
        "@type": "City",
        name: "Libreville",
        description: "Accompagnement 100% à distance (visio, appel, WhatsApp)",
      },
      {
        "@type": "Country",
        name: "Gabon",
      },
    ],
    currenciesAccepted: "XAF",
    paymentAccepted: "Orange Money, MTN Mobile Money, Airtel Money, virement bancaire",
    priceRange: "75 000 – 250 000 FCFA",
    knowsAbout: [
      "Création de sites internet pour PME",
      "Menu digital QR code pour restaurants",
      "Référencement local Google et Yango",
      "Commande WhatsApp",
      "Paiement Mobile Money",
      "Logiciels de gestion et caisse hors-ligne",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEn ? "Programactor Digital Services" : "Services Digitaux Programactor",
      itemListElement: [
        {
          "@type": "Offer",
          name: isEn ? "Essentiel Website" : "Site Essentiel",
          price: 75000,
          priceCurrency: "XAF",
          description: isEn
            ? "1-page mobile-friendly website with WhatsApp button, domain & hosting for 1 year, delivered in 72h. 50% deposit."
            : "Site 1 page sur mobile avec bouton WhatsApp, nom de domaine et hébergement 1 an, livré en 72h. Acompte de 50 %.",
        },
        {
          "@type": "Offer",
          name: isEn ? "Complet Website" : "Site Complet",
          price: 130000,
          priceCurrency: "XAF",
          description: isEn
            ? "Complete website with local SEO, Google & Yango listing, hosting 1 year, 10 email addresses, WhatsApp booking. 50% deposit."
            : "Site complet avec SEO local, fiche Google et Yango, hébergement 1 an, 10 e-mails professionnels, réservation WhatsApp. Acompte de 50 %.",
        },
        {
          "@type": "Offer",
          name: isEn ? "Digital QR Menu" : "Menu digital QR code",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: 90000,
            maxPrice: 130000,
            priceCurrency: "XAF",
          },
          description: isEn
            ? "Full menu on mobile, table QR codes, WhatsApp order. 50% deposit."
            : "Carte complète sur mobile, QR codes de table, commande sur WhatsApp. Acompte de 50 %.",
        },
        {
          "@type": "Offer",
          name: isEn ? "Bongo Space Setup Pack" : "Pack installation Bongo Space",
          price: 250000,
          priceCurrency: "XAF",
          description: isEn
            ? "Setup, menu entry, table QR codes, staff training, 12 months subscription included."
            : "Paramétrage, saisie du menu, QR codes, formation du personnel, 12 mois d'abonnement inclus.",
        },
      ],
    },
    sameAs: [
      "https://www.linkedin.com/company/programactor",
      "https://facebook.com/programactor",
      "https://instagram.com/programactor",
    ],
  };

  return (
    <html
      lang={lang}
      className={`${familjen.variable} ${satoshi.variable} ${dmMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#0E0E0E" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
