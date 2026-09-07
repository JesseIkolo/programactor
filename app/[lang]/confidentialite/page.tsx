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
    ? "Privacy Policy & Data Protection | Programactor"
    : "Politique de Confidentialité & Données | Programactor";
  const description = isEn
    ? "How Programactor collects, protects, and respects client information submitted through booking and quotation requests."
    : "Engagement de transparence de Programactor sur la collecte, la protection et le traitement de vos données personnelles.";

  return {
    title,
    description,
    icons: { icon: "/mark.svg" },
    alternates: {
      canonical: `https://programactor.pro/${lang}/confidentialite`,
      languages: {
        fr: "https://programactor.pro/fr/confidentialite",
        en: "https://programactor.pro/en/confidentialite",
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

export default async function ConfidentialitePage({
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
                <Label className="text-xs">{isEn ? "Privacy & Ethics" : "Protection des Données"}</Label>
              </div>
            </Reveal>

            <div className="max-w-3xl">
              <Reveal delay={60}>
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white md:text-5xl">
                  {isEn ? "Privacy Policy" : "Politique de Confidentialité"}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-4 text-base text-[color:var(--color-muted)] md:text-lg">
                  {isEn
                    ? "We believe digital products should respect privacy by default. Here is our direct commitment to handling your project data."
                    : "Nous concevons des produits numériques respectueux par défaut. Voici notre engagement sans jargon sur l'usage de vos données."}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--color-hairline)] py-12 md:py-16">
          <div className="shell max-w-4xl space-y-12">
            {/* 1. Données collectées */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>1. {isEn ? "Data We Collect" : "Données Collectées"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "We only collect data that you voluntarily provide when submitting a project inquiry, booking a 30-minute strategic call, or configuring an XpreSite quote:"
                  : "Nous ne collectons que les informations que vous nous transmettez volontairement lors de la réservation d'un créneau de cadrage ou de la configuration d'un devis XpreSite :"}
              </p>
              <ul className="list-disc list-inside text-sm text-[color:var(--color-muted)] space-y-1.5 pl-2">
                <li>{isEn ? "Contact details: Name, business email, telephone & WhatsApp number." : "Identité & Contact : Nom, prénom, email professionnel, numéro de téléphone / WhatsApp."}</li>
                <li>{isEn ? "Project context: Company name, sector, project description and chosen meeting channel." : "Contexte de cadrage : Nom de l'entreprise, secteur d'activité, besoin exprimé et modalité d'échange (en ligne ou présentiel)."}</li>
              </ul>
            </div>

            {/* 2. Finalité & Absence de revente */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>2. {isEn ? "Purpose & Zero Third-Party Resale" : "Finalité & Non-Revente"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "Your data is strictly used to prepare our strategy call, follow up on quotes, and manage client accounts. We never sell, rent, or transfer your contact information to third-party ad networks or brokers."
                  : "Vos données sont strictement utilisées pour préparer notre échange, assurer le suivi de votre devis et la gestion de notre relation client. Elles ne sont jamais revendues, louées ou cédées à des tiers publicitaires."}
              </p>
            </div>

            {/* 3. Sécurité et Hébergement */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>3. {isEn ? "Security & Storage" : "Sécurité & Stockage"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "All data transmissions occur over encrypted HTTPS connections (TLS 1.3). Administrative access to internal bookings is protected by industry-standard authentication (Argon2 password hashing, JWT tokens with expiration, and rate-limiting against brute force)."
                  : "Les échanges de données bénéficient d'un chiffrement complet HTTPS (TLS 1.3). Les accès au tableau de bord administrateur sont verrouillés par des mécanismes de sécurité robustes (hachage Argon2, tokens JWT avec expiration et protection contre les attaques par force brute)."}
              </p>
            </div>

            {/* 4. Vos Droits */}
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72]" />
                <span>4. {isEn ? "Your Rights (Access & Deletion)" : "Vos Droits (Accès & Suppression)"}</span>
              </h2>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                {isEn
                  ? "You retain full control over your personal information. You can request access, rectification, or complete deletion of your records at any time by emailing our team at "
                  : "Vous disposez d'un droit permanent d'accès, de rectification ou de suppression totale de vos coordonnées. Il vous suffit de nous adresser une demande par courriel à "}
                <a href="mailto:hello@programactor.pro" className="text-[#EBFF72] hover:underline">
                  hello@programactor.pro
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer c={c} lang={l} />
    </>
  );
}
