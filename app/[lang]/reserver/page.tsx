import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContent, LANGS, type Lang } from "@/lib/content";
import BookingForm from "@/components/BookingForm";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) return {};

  const isEn = lang === "en";
  const title = isEn
    ? "Book a 30-Min Strategy Call | Programactor Studio"
    : "Réserver une session de cadrage 30 min | Programactor Studio";
  const description = isEn
    ? "Schedule a 30-minute technical and product discovery session with Programactor leads in Douala, Libreville or online via Meet/WhatsApp."
    : "Planifiez un échange de 30 minutes avec l'équipe de direction de Programactor à Douala, Libreville ou en visio pour cadrer votre produit.";

  return {
    title,
    description,
    icons: { icon: "/mark.svg" },
    openGraph: {
      title,
      description,
      locale: lang === "fr" ? "fr_CM" : "en_GB",
      type: "website",
    },
    alternates: {
      languages: {
        fr: "/fr/reserver",
        en: "/en/reserver",
      },
    },
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;

  return <BookingForm lang={l} />;
}
