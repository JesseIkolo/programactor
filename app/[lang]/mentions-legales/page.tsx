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
    ? "Legal Notices & Terms | Programactor Studio"
    : "Mentions Légales | Programactor Studio";
  const description = isEn
    ? "Official legal disclosures, ownership information and terms for Programactor digital studio in Douala and Libreville."
    : "Mentions légales, identification de l'éditeur et conditions générales du studio Programactor à Douala et Libreville.";

  return {
    title,
    description,
    icons: { icon: "/mark.svg" },
    alternates: {
      canonical: `https://programactor.pro/${lang}/mentions-legales`,
      languages: {
        fr: "https://programactor.pro/fr/mentions-legales",
        en: "https://programactor.pro/en/mentions-legales",
      },
    },
    openGraph: {
      title,
      description,
      locale: lang === "fr" ? "fr_CM" : "en_GB",
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
                  {isEn ? "Legal Notices" : "Mentions Légales"}
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
                  <strong>{isEn ? "Company Name:" : "Dénomination :"}</strong> Programactor (Studio de design produit et d&apos;ingénierie numérique)
                </p>
                <p>
                  <strong>{isEn ? "Direction / Founder:" : "Direction / Fondateur :"}</strong> Jesse Ikolo
                </p>
                <p>
                  <strong>{isEn ? "Operating Hubs:" : "Bureaux d&apos;opération :"}</strong> Douala (Cameroun) &amp; Libreville (Gabon)
                </p>
                <p>
                  <strong>{isEn ? "Contact Email:" : "Email de contact :"}</strong>{" "}
                  <a href="mailto:hello@programactor.pro" className="text-[#EBFF72] hover:underline">
                    hello@programactor.pro
                  </a>
                </p>
                <p>
                  <strong>{isEn ? "Direct Telephone & WhatsApp:" : "Téléphone direct &amp; WhatsApp :"}</strong> +237 692 025 552
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
                  <strong>{isEn ? "Edge CDN & Static Hosting:" : "CDN Edge &amp; Hébergement Frontend :"}</strong> Netlify, Inc. (512 2nd Street, Suite 200, San Francisco, CA 94107, USA)
                </p>
                <p>
                  <strong>{isEn ? "Database & API Services:" : "Services API &amp; Base de données :"}</strong> MongoDB Atlas / VPS Sécurisé Cloud (Chiffrement TLS 1.3, isolation des données).
                </p>
              </div>
            </div>

            {/* 3. Propriété intellectuelle */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>3. {isEn ? "Intellectual Property" : "Propriété Intellectuelle"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "All elements of this site, including source code, branding, logos, texts, UI mockups, case study formulations, and architectural diagrams, are the exclusive intellectual property of Programactor and its respective clients. Any unauthorized reproduction, distribution, or decompilation is strictly prohibited without prior written consent."
                  : "L'ensemble des éléments constituant ce site internet (code source, marques, logotypes, textes, maquettes UI/UX, formulations d'études de cas et schémas d'architecture) relève de la législation sur la propriété intellectuelle. Toute reproduction, copie ou représentation intégrale ou partielle sans l'accord préalable écrit de Programactor est formellement interdite."}
              </p>
            </div>

            {/* 4. Prestations & Responsabilité */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>4. {isEn ? "Services & Responsibility" : "Prestations & Responsabilité"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "The estimates provided by the XpreSite interactive configurator or during 30-minute discovery calls constitute non-binding preliminary assessments. Definitive commitments occur solely upon signing a formal proposal and initial installment validation."
                  : "Les estimations calculées par le configurateur interactif XpreSite ou lors des sessions de cadrage stratégique constituent des évaluations indicatives. L'engagement contractuel définitif intervient exclusivement après signature du bon de commande ou du devis formel."}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer c={c} lang={l} />
    </>
  );
}
