import { notFound } from "next/navigation";
import { getContent, LANGS, type Lang } from "@/lib/content";
import { getFeaturedProjects } from "@/lib/projects-data";
import { getXpreSiteConfigServer } from "@/lib/xpresite-server";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import DemosSection from "@/components/DemosSection";
import Services from "@/components/Services";
import XpreSiteSection from "@/components/XpreSiteSection";
import ProductsSection from "@/components/ProductsSection";
import Method from "@/components/Method";
import OfficeSection from "@/components/OfficeSection";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import {
  About,
  FinalCta,
  Manifesto,
  Rhythm,
  Stats,
  Testimonials,
} from "@/components/Misc";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;
  const c = getContent(l);
  const xpresiteConfig = await getXpreSiteConfigServer();
  const isEn = l === "en";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const xpresiteSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://programactor.pro/${l}/xpresite#service`,
    name: isEn
      ? "XpreSite — a website built for your trade, live in 72h"
      : "XpreSite — un site web taillé pour votre métier, livré en 72 h",
    serviceType: isEn
      ? "Website design and development"
      : "Création de site web professionnel",
    url: `https://programactor.pro/${l}/xpresite`,
    provider: { "@id": "https://programactor.pro/#organization" },
    areaServed: [
      { "@type": "City", name: "Douala" },
      { "@type": "City", name: "Libreville" },
      { "@type": "Country", name: isEn ? "Cameroon" : "Cameroun" },
      { "@type": "Country", name: "Gabon" },
    ],
    offers: {
      "@type": "Offer",
      price: 75000,
      priceCurrency: "XAF",
      url: `https://programactor.pro/${l}/xpresite`,
      availability: "https://schema.org/InStock",
      description: isEn
        ? "Domain and one year of hosting included. 50% deposit, balance on delivery."
        : "Domaine et hébergement 1 an inclus. Acompte 50 %, solde à la livraison.",
    },
  };

  const previewWhatsappUrl =
    l === "fr" ? c.contact.whatsappPreviewFr : c.contact.whatsappPreviewEn;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(xpresiteSchema) }}
      />
      <Nav c={c} lang={l} />
      <main>
        {/* 1. Hero PME */}
        <Hero c={c} />
        {/* Phrase-bandeau signature */}
        <Manifesto c={c} />
        {/* 2. Ce que vous pouvez vérifier */}
        <Stats c={c} />
        {/* 3. Démos en ligne */}
        <DemosSection c={c} lang={l} />
        {/* 4. Ce que nous faisons */}
        <Services c={c} />
        {/* 5. Tarifs PME */}
        <XpreSiteSection lang={l} config={xpresiteConfig} />
        {/* 6. Nos produits : Bongo Space et BongoFleet */}
        <ProductsSection c={c} lang={l} />
        {/* 7. Comment ça marche */}
        <Method c={c} />
        {/* 8. Notre bureau, c'est votre établissement */}
        <OfficeSection c={c} lang={l} />
        {/* 9. Qui vous répond */}
        <About c={c} />
        {/* 10. Étude de cas (masquée tant que pas d'accord client) */}
        <Testimonials c={c} />
        {/* 11. FAQ PME */}
        <Faq c={c} />
        {/* 12. Studio produit avec Le rythme */}
        <Rhythm c={c} />
        <Pricing c={c} />
        {/* 13. CTA final */}
        <FinalCta c={c} />
      </main>
      <Footer c={c} lang={l} />
      <StickyCta
        lang={l}
        bookingHref={previewWhatsappUrl}
        bookingLabel={c.nav.cta}
      />
    </>
  );
}
