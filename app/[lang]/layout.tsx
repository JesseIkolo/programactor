import type { Metadata } from "next";
import "../globals.css";
import { getContent, LANGS, type Lang } from "@/lib/content";

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
    <html lang={lang}>
      <head>
        {/* Satoshi + Switzer — Fontshare (licence gratuite, usage commercial) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,300&f[]=switzer@400,500&display=swap"
        />
        {/* DM Mono — Google Fonts (SIL Open Font License) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@500&display=swap"
        />
        <meta name="theme-color" content="#0E0E0E" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
