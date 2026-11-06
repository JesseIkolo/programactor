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
    ? "Book a meeting"
    : "Prendre rendez-vous";
  const description = isEn
    ? "30-minute meeting at your place in Douala or by video. Confirmation on WhatsApp."
    : "Rendez-vous de 30 min chez vous à Douala ou en visio. Confirmation sur WhatsApp.";

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
      canonical: `https://programactor.pro/${lang}/reserver`,
      languages: {
        fr: "https://programactor.pro/fr/reserver",
        en: "https://programactor.pro/en/reserver",
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
