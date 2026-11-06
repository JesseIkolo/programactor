import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent, LANGS, type Lang } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Label, Reveal } from "@/components/ui";

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
    ? "Legal notice"
    : "Mentions légales";
  const description = isEn
    ? "Legal notices and information for Programactor, web agency and product studio in Douala."
    : "Mentions légales et informations éditeur de Programactor, agence web et studio produit à Douala.";

  return {
    title,
    description,
    icons: { icon: "/mark.svg" },
    alternates: {
      canonical: `https://programactor.pro/${lang}/mentions-legales`,
      languages: {
        fr: "https://programactor.pro/fr/mentions-legales",
        en: "https://programactor.pro/en/mentions-legales",
        "x-default": "https://programactor.pro/fr/mentions-legales",
      },
    },
    openGraph: {
      title,
      description,
      locale: lang === "fr" ? "fr_FR" : "en_GB",
      type: "website",
    },
  };
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;
  const c = getContent(l);
  const isEn = l === "en";

  return (
    <>
      <Nav c={c} lang={l} />

      <main className="pt-28 md:pt-36">
        <section className="relative overflow-hidden pb-12">
          <div className="shell relative z-10">
            <Reveal>
              <div className="mb-8 flex items-center gap-3">
                <Link
                  href={`/${l}`}
                  className="t-mono inline-flex items-center gap-2 text-xs text-[color:var(--color-muted-2)] transition-colors hover:text-paper"
                >
                  <span aria-hidden>←</span>
                  <span>{isEn ? "Back to Home" : "Retour à l'accueil"}</span>
                </Link>
                <span className="text-[color:var(--color-hairline-strong)]" aria-hidden>
                  /
                </span>
                <Label className="text-xs">{isEn ? "Legal Information" : "Cadre Juridique"}</Label>
              </div>
            </Reveal>

            <div className="max-w-3xl">
              <Reveal delay={60}>
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white md:text-5xl">
                  {isEn ? "Legal Notice" : "Mentions Légales"}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-4 text-base text-[color:var(--color-muted)] md:text-lg">
                  {isEn
                    ? "In accordance with digital trust and electronic commerce legal frameworks (OHADA & Law n°2010/012 on cybersecurity and cybercriminality in Cameroon)."
                    : "Conformément aux dispositions régissant la confiance dans l'économie numérique (droit OHADA et Loi n°2010/012 du 21 décembre 2010 relative à la cybersécurité et à la cybercriminalité au Cameroun)."}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--color-hairline)] py-12 md:py-16">
          <div className="shell max-w-4xl space-y-12">
            {/* 1. Éditeur */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>1. {isEn ? "Site Publisher" : "Éditeur du Site"}</span>
              </h2>
              <div className="space-y-2 text-sm text-[color:var(--color-muted)] leading-relaxed">
                <p>
                  <strong>{isEn ? "Brand / Activity:" : "Dénomination :"}</strong> Programactor — agence web et studio produit.
                </p>
                <p>
                  <strong>{isEn ? "Founder & Director of Publication:" : "Direction / Fondateur :"}</strong> Jesse Bondenge Ikolo.
                </p>
                <p>
                  <strong>{isEn ? "Place of Business:" : "Lieu d'activité :"}</strong>{" "}
                  {isEn
                    ? "Douala, Cameroon. Programactor does not receive the public: meetings take place at our clients' venues in Douala, or by video calls."
                    : "Douala, Cameroun. Programactor n'accueille pas de public : nos rendez-vous ont lieu chez nos clients à Douala, ou en visio."}
                </p>
                <p>
                  <strong>{isEn ? "Contact Phone & WhatsApp:" : "Téléphone direct & WhatsApp :"}</strong>{" "}
                  <a href="tel:+237692025552" className="text-white hover:text-[#EBFF72]">
                    +237 692 02 55 52
                  </a>
                </p>
                <p>
                  <strong>{isEn ? "Contact Email:" : "Email de contact :"}</strong>{" "}
                  <a href="mailto:hello@programactor.pro" className="text-[#EBFF72] hover:underline">
                    hello@programactor.pro
                  </a>
                </p>
              </div>
            </div>

            {/* 2. Hébergement */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>2. {isEn ? "Hosting & Infrastructure" : "Hébergement du Site"}</span>
              </h2>
              <div className="space-y-2 text-sm text-[color:var(--color-muted)] leading-relaxed">
                <p>
                  <strong>{isEn ? "Edge CDN & Static Hosting:" : "CDN Edge & Hébergement Frontend :"}</strong> Netlify, Inc. (512 2nd Street, Suite 200, San Francisco, CA 94107, USA).
                </p>
                <p>
                  <strong>{isEn ? "Database & API Services:" : "Services API & Base de données :"}</strong> MongoDB Atlas / VPS Cloud sécurisé.
                </p>
              </div>
            </div>

            {/* 3. Prix et commandes */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>3. {isEn ? "Pricing & Orders" : "Prix et Commandes"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "Displayed prices are in CFA francs (XAF). A written quotation is provided before starting any work. 50% deposit upon order, balance upon delivery. Estimates provided by the online configurator are indicative: only the signed quotation is binding."
                  : "Les prix affichés sont en francs CFA (XAF). Un devis écrit est remis avant tout travail. Acompte de 50 % à la commande, solde à la livraison. Les estimations du configurateur sont indicatives : seul le devis accepté engage."}
              </p>
            </div>

            {/* 4. Propriété intellectuelle */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>4. {isEn ? "Ownership & Intellectual Property" : "Propriété"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "The domain name and client-supplied content belong to the client. Elements specific to Programactor (code, design mockups, Programactor, Bongo Space and BongoFleet brands) remain its property unless specified otherwise in the quotation."
                  : "Le nom de domaine et les contenus fournis par le client lui appartiennent. Les éléments propres à Programactor (code, maquettes, marques Programactor, Bongo Space, BongoFleet) restent sa propriété, sauf mention contraire dans le devis."}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer c={c} lang={l} />
    </>
  );
}
