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
  return {
    title: c.meta.title,
    description: c.meta.description,
    icons: { icon: "/mark.svg" },
    openGraph: {
      title: c.meta.title,
      description: c.meta.description,
      locale: lang === "fr" ? "fr_CM" : "en_GB",
      type: "website",
    },
    alternates: {
      languages: { fr: "/fr", en: "/en" },
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
      <body>{children}</body>
    </html>
  );
}
