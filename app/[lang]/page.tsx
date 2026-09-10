import { notFound } from "next/navigation";
import { getContent, LANGS, type Lang } from "@/lib/content";
import { getFeaturedProjects } from "@/lib/projects-data";
import { getXpreSiteConfigServer } from "@/lib/xpresite-server";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Method from "@/components/Method";
import Labs from "@/components/Labs";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import XpreSiteSection from "@/components/XpreSiteSection";
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
  const featuredProjects = await getFeaturedProjects(l);
  const xpresiteConfig = await getXpreSiteConfigServer();
  const isEn = l === "en";

  /* Les six réponses sont déjà dans le DOM (balises <details>), donc
     indexables : il ne manquait que le balisage qui les déclare. */
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
        ? "Domain and one year of hosting included. Payment in 2 or 3 instalments."
        : "Domaine et hébergement 1 an inclus. Paiement en 2 ou 3 tranches.",
    },
  };

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
        <Hero c={c} />
        <Manifesto c={c} />
        <Stats c={c} />
        <Rhythm c={c} />
        <About c={c} />
        <Work c={c} projects={featuredProjects} />
        <Services c={c} />
        <XpreSiteSection lang={l} config={xpresiteConfig} />
        <Method c={c} />
        <Labs c={c} />
        <Testimonials c={c} />
        <Pricing c={c} />
        <Faq c={c} />
        <FinalCta c={c} />
      </main>
      <Footer c={c} lang={l} />
      <StickyCta
        lang={l}
        bookingHref={c.contact.booking}
        bookingLabel={c.hero.ctaPrimary}
      />
    </>
  );
}
