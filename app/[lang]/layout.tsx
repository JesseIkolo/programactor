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
      ? "Human-centred digital product studio in Douala and Libreville. Field research, UX/UI interface design, and rapid build sprints for Africa."
      : "Agence de design produit et studio digital à Douala et Libreville. Recherche terrain, design UX/UI et développement en sprints courts, pour des produits pensés pour l'Afrique.",
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
      { "@type": "City", name: "Libreville" },
      { "@type": "Country", name: "Cameroun" },
      { "@type": "Country", name: "Gabon" },
    ],
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
