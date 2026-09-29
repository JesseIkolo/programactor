import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import "../globals.css";
import { getContent, LANGS, type Lang } from "@/lib/content";
import Analytics from "@/components/Analytics";

const satoshi = localFont({
  src: [
    // Satoshi 300 et 500 étaient chargées sans être utilisées nulle part.
    {
      path: "../fonts/satoshi-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const switzer = localFont({
  src: [
    {
      path: "../fonts/switzer-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/switzer-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
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
      ? "Web agency and digital product studio in Douala and Libreville. High-impact website creation, mobile app development (PWA/iOS/Android), and POS cashier software for African businesses."
      : "Agence web et studio produit digital à Douala et Libreville. Création de sites internet professionnels, développement d'applications mobiles (PWA/iOS/Android) et logiciels de caisse pour entreprises en Afrique.",
    slogan: isEn
      ? "The studio that turns an idea into a product"
      : "L'agence qui transforme l'idée en produit",
    email: "hello@programactor.pro",
    telephone: "+237692025552",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Douala",
        addressCountry: "CM",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Libreville",
        addressCountry: "GA",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Douala" },
      { "@type": "City", name: "Yaoundé" },
      { "@type": "City", name: "Libreville" },
      { "@type": "Country", name: "Cameroun" },
      { "@type": "Country", name: "Gabon" },
    ],
    knowsAbout: [
      "Création de sites internet",
      "Développement d'applications mobiles",
      "Design UX/UI",
      "Logiciels de caisse POS",
      "Paiements Mobile Money MTN Orange",
      "Web design Afrique",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services Digitaux Programactor",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "XpreSite — Site Internet Clé en Main en 72h",
            description: "Site web professionnel avec nom de domaine, hébergement 1 an, intégration WhatsApp et paiement en 3 fois sans frais.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sprint Produit & Développement Sur-Mesure",
            description: "Conception UX/UI, développement d'applications web & mobiles et mise en ligne en 4 à 8 semaines.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Logiciels Métiers & Caisses POS",
            description: "Systèmes de caisse tactile, menus QR code interactifs et décompte automatique des stocks.",
          },
        },
      ],
    },
    priceRange: "$$",
    sameAs: [
      "https://facebook.com/programactor",
      "https://instagram.com/programactor",
      "https://x.com/programactor",
    ],
  };

  return (
    <html
      lang={lang}
      className={`${satoshi.variable} ${switzer.variable} ${dmMono.variable}`}
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
