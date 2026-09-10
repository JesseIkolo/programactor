import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent, LANGS, type Lang } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Label, Reveal } from "@/components/ui";
import { CustomSiteWizard } from "@/components/CustomSiteWizard";

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
    ? "Custom Website & Bespoke Digital Product | Programactor"
    : "Site Web Personnalisé & Produit Sur-Mesure | Programactor";
  const description = isEn
    ? "Scope your bespoke web application, high-end showcase, SaaS platform, or custom e-commerce product. Multi-step scoping with direct studio architecture."
    : "Cadrez votre plateforme web sur-mesure, SaaS, e-commerce avancé ou portail métier. Formulaire interactif en 4 étapes avec cadrage direct studio.";

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
      canonical: `https://programactor.pro/${lang}/xpresite/sur-mesure`,
      languages: {
        fr: "https://programactor.pro/fr/xpresite/sur-mesure",
        en: "https://programactor.pro/en/xpresite/sur-mesure",
      },
    },
  };
}

export default async function CustomSitePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;
  const c = getContent(l);
  const isEn = l === "en";

  const customServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://programactor.pro/${lang}/xpresite/sur-mesure/#service`,
    name: isEn
      ? "Bespoke Web Platform & Custom Digital Product Engineering"
      : "Ingénierie de Plateformes Web & Produits Numériques Sur-Mesure",
    serviceType: "Custom software and website development",
    description: isEn
      ? "Full-stack custom web applications, SaaS platforms, member portals, and advanced bespoke websites."
      : "Développement full-stack de plateformes web sur-mesure, SaaS, portails clients et sites d'envergure.",
    provider: { "@id": "https://programactor.pro/#organization" },
    areaServed: [
      { "@type": "City", name: "Douala" },
      { "@type": "City", name: "Libreville" },
      { "@type": "Country", name: "Cameroon" },
      { "@type": "Country", name: "Gabon" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(customServiceSchema) }}
      />
      <Nav c={c} lang={l} />

      <main className="pt-28 md:pt-36 pb-20">
        {/* ====================================================================
            HERO CADRAGE SUR-MESURE
        ==================================================================== */}
        <section className="shell pb-10 sm:pb-14">
          {/* Fil d'Ariane */}
          <div className="mb-6 flex items-center gap-2 t-mono text-xs text-white/50">
            <Link href={`/${l}`} className="hover:text-signal transition-colors">
              {isEn ? "Home" : "Accueil"}
            </Link>
            <span>/</span>
            <Link href={`/${l}/xpresite`} className="hover:text-signal transition-colors">
              XpreSite
            </Link>
            <span>/</span>
            <span className="text-signal">{isEn ? "Custom Scope" : "Sur-Mesure"}</span>
          </div>

          <div className="max-w-3xl">
            <Reveal>
              <Label>
                {isEn
                  ? "Bespoke Digital Product · Custom Engineering"
                  : "Projet Sur-Mesure · Cadrage Personnalisé"}
              </Label>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="t-display mt-5 text-paper">
                {isEn ? (
                  <>
                    Build a digital product tailored to your{" "}
                    <span className="mark-word">exact vision</span>.
                  </>
                ) : (
                  <>
                    Donnez vie à un produit digital taillé pour vos{" "}
                    <span className="mark-word">vrais défis</span>.
                  </>
                )}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="t-lead mt-6 text-white/70 max-w-2xl leading-relaxed">
                {isEn
                  ? "Beyond standard packages, we engineer high-performance platforms, member portals, multi-vendor ecosystems, and custom APIs built to scale."
                  : "Au-delà des formules express, nous concevons des architectures logicielles sur-mesure, des plateformes SaaS, des espaces membres sécurisés et des outils métier taillés pour votre croissance."}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ====================================================================
            ASSISTANT EN ÉTAPES
        ==================================================================== */}
        <section className="shell pb-16">
          <CustomSiteWizard lang={l} />
        </section>
      </main>

      <Footer c={c} lang={l} />
    </>
  );
}
