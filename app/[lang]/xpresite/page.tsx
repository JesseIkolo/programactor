import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent, LANGS, type Lang } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Label, Reveal } from "@/components/ui";
import { XpreSiteConfigurator } from "@/components/XpreSiteConfigurator";

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
    ? "XpreSite — Express Turnkey Website in 72h | Programactor"
    : "XpreSite — Votre Site Web Métier Clé en Main en 72h | Programactor";
  const description = isEn
    ? "Turnkey website tailored for restaurants, couriers, laundries, car rentals, and agencies. Starting at 75,000 FCFA with 1-year domain & hosting included. Pay in 2 or 3 installments."
    : "Formule de site web sur-mesure pour restaurants, livreurs, pressings, agences et loueurs de véhicules. Dès 75.000 FCFA, 1 an de domaine + hébergement inclus, paiement en 2 ou 3 tranches.";

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
      canonical: `https://programactor.pro/${lang}/xpresite`,
      languages: {
        fr: "https://programactor.pro/fr/xpresite",
        en: "https://programactor.pro/en/xpresite",
      },
    },
  };
}

export default async function XpreSitePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;
  const c = getContent(l);
  const isEn = l === "en";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://programactor.pro/${lang}/xpresite/#service`,
    name: isEn ? "XpreSite — Express Turnkey Website in 72h" : "XpreSite — Site Web Métier Clé en Main en 72h",
    serviceType: "Website design and development package",
    description: isEn
      ? "Turnkey website package tailored for restaurants, couriers, laundries, car rentals, and agencies. Delivered in 72 hours, with 1-year domain & hosting included."
      : "Formule de site web sur-mesure pour restaurants, livreurs, pressings, agences et loueurs de véhicules. Livraison garantie en 72h, 1 an de domaine + hébergement inclus.",
    provider: { "@id": "https://programactor.pro/#organization" },
    areaServed: [
      { "@type": "City", name: "Douala" },
      { "@type": "City", name: "Libreville" },
    ],
    offers: {
      "@type": "Offer",
      url: `https://programactor.pro/${lang}/xpresite`,
      priceCurrency: "XAF",
      price: "75000",
      availability: "https://schema.org/InStock",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: isEn
          ? "How does the 72-hour delivery guarantee work?"
          : "Comment fonctionne la garantie de livraison en 72 heures ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? "The 72-hour timer starts as soon as you provide your core content: logo, images, price list, and contact details."
            : "Le chrono de 72 heures démarre dès que vous nous transmettez vos éléments essentiels : logo, photos, grille de prix et coordonnées.",
        },
      },
      {
        "@type": "Question",
        name: isEn
          ? "How does the 2 or 3 installment payment plan work?"
          : "Comment se déroule le paiement échelonné en 2 ou 3 tranches ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? "You pay an initial deposit via Mobile Money (Orange Money, MTN MoMo) or bank transfer, followed by milestone payments upon live delivery and approval."
            : "Vous réglez un premier acompte au lancement par Mobile Money (Orange Money, MTN MoMo) ou virement. Le solde est versé à la livraison et validation de votre site.",
        },
      },
      {
        "@type": "Question",
        name: isEn
          ? "Can I edit and update my site after launch?"
          : "Est-ce que je pourrai modifier mon site après sa mise en ligne ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? "Yes, you receive a full training handover and can request updates or add new pages anytime with studio support."
            : "Oui, vous bénéficiez d'une prise en main complète pour mettre à jour vos tarifs, photos et textes en toute autonomie.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav c={c} lang={l} />

      <main className="pt-28 md:pt-36">
        {/* ====================================================================
            HERO SECTION XPRESITE
        ==================================================================== */}
        <section className="shell pb-14 md:pb-20">
          {/* Fil d'Ariane */}
          <div className="mb-6 flex items-center gap-2 t-mono text-xs text-white/50">
            <Link
              href={`/${l}`}
              className="hover:text-signal transition-colors"
            >
              {isEn ? "Home" : "Accueil"}
            </Link>
            <span>/</span>
            <span className="text-signal">XpreSite</span>
          </div>

          <div className="max-w-3xl">
            <Reveal>
              <Label>
                {isEn
                  ? "Express Formula · Turnkey Digital Asset"
                  : "Formule Express · Site Clé en Main"}
              </Label>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="t-display mt-5 text-paper">
                {isEn ? (
                  <>
                    Your business website ready in{" "}
                    <span className="mark-word">72h</span> sharp.
                  </>
                ) : (
                  <>
                    Votre site web métier prêt en{" "}
                    <span className="mark-word">72h</span> chrono.
                  </>
                )}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="t-lead mt-6 text-white/70 max-w-2xl leading-relaxed">
                {isEn
                  ? "A solid showcase foundation paired with dedicated features for your trade: WhatsApp direct ordering, real-time tracking, table reservation, or appointment scheduling. Starting at 75,000 FCFA with 1-year domain, hosting, and split payment facilities."
                  : "Un socle vitrine performant enrichi des modules propres à votre métier : commande WhatsApp, suivi de course, réservation de table ou prise de rendez-vous. À partir de 75.000 FCFA avec 1 an de nom de domaine, hébergement et paiement en 2 ou 3 tranches."}
              </p>
            </Reveal>

            {/* Micro-puces avantages */}
            <Reveal delay={220}>
              <div className="mt-8 flex flex-wrap gap-2.5 t-mono text-xs">
                <span className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1.5 text-signal">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  {isEn ? "72h Delivery Guarantee" : "Livraison 72h garantie"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  {isEn ? "Pay in 2 or 3 installments" : "Paiement en 2 ou 3 tranches"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  {isEn ? "1-Year Domain & Hosting Included" : "Domaine + Hébergement 1 an inclus"}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ====================================================================
            CE QUI EST TOUJOURS INCLUS DANS LE PACK DE BASE
        ==================================================================== */}
        <section className="shell pb-16">
          <div className="rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface p-6 sm:p-10">
            <div className="max-w-2xl mb-8">
              <span className="t-mono text-xs uppercase tracking-wider text-signal block mb-2">
                {isEn ? "Turnkey Standard" : "Socle Standard Inclus"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {isEn
                  ? "Everything you get right from the base pack"
                  : "Tout ce qui est compris d'office dans votre pack vitrine"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-surface-2 border border-white/5">
                <div className="text-signal font-mono text-sm font-bold mb-1">01. Mobile First</div>
                <div className="text-sm font-semibold text-white mb-1">
                  {isEn ? "Ultra-lightweight" : "Ultra-léger & Rapide"}
                </div>
                <div className="text-xs text-white/60 leading-relaxed">
                  {isEn
                    ? "Optimized to load fast even on 3G and low-tier Android smartphones."
                    : "Conçu pour s'afficher en moins d'une seconde sur smartphone 3G sans consommer la data."}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-2 border border-white/5">
                <div className="text-signal font-mono text-sm font-bold mb-1">02. Infrastructure</div>
                <div className="text-sm font-semibold text-white mb-1">
                  {isEn ? "Domain & Hosting" : "Domaine & Hébergement"}
                </div>
                <div className="text-xs text-white/60 leading-relaxed">
                  {isEn
                    ? "1 year of .pro, .cm, or .com name and SSL certificate setup free."
                    : "1 an de nom de domaine (.pro, .cm ou .com), certificat SSL HTTPS et hébergement haute vitesse."}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-2 border border-white/5">
                <div className="text-signal font-mono text-sm font-bold mb-1">03. WhatsApp Direct</div>
                <div className="text-sm font-semibold text-white mb-1">
                  {isEn ? "Instant WhatsApp CTA" : "Conversion WhatsApp"}
                </div>
                <div className="text-xs text-white/60 leading-relaxed">
                  {isEn
                    ? "Every call-to-action directs visitors straight to your WhatsApp business."
                    : "Boutons d'action optimisés pour démarrer des conversations directes sur WhatsApp."}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-2 border border-white/5">
                <div className="text-signal font-mono text-sm font-bold mb-1">04. Local SEO</div>
                <div className="text-sm font-semibold text-white mb-1">
                  {isEn ? "Local Search Visibility" : "Référencement Local"}
                </div>
                <div className="text-xs text-white/60 leading-relaxed">
                  {isEn
                    ? "Structured data so customers find you on Google Search and Maps in your city."
                    : "Balisage pour que vos clients locaux vous trouvent facilement sur Google et Maps."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CONFIGURATEUR INTERACTIF
        ==================================================================== */}
        <section id="configurateur" className="shell pb-24 scroll-mt-28">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="t-mono text-xs uppercase tracking-widest text-signal block mb-2">
              {isEn ? "Interactive Simulator" : "Simulateur Interactif"}
            </span>
            <h2 className="t-section text-paper">
              {isEn
                ? "Configure your website & calculate your price"
                : "Composez votre site et simulez votre devis"}
            </h2>
            <p className="text-sm text-white/60 mt-3">
              {isEn
                ? "Select your trade, toggle specific modules, and view your split breakdown immediately."
                : "Choisissez votre secteur, activez vos options métier et visualisez vos mensualités instantanément."}
            </p>
          </div>

          <XpreSiteConfigurator lang={l} />
        </section>

        {/* ====================================================================
            FAQ XPRESITE
        ==================================================================== */}
        <section className="shell pb-24 border-t border-[color:var(--color-hairline)] pt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="t-mono text-xs uppercase tracking-widest text-signal block mb-2">
                FAQ
              </span>
              <h2 className="t-section text-paper">
                {isEn ? "Frequently Asked Questions" : "Questions Fréquentes sur XpreSite"}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-6">
                <h3 className="text-base font-semibold text-white mb-2">
                  {isEn
                    ? "How does the 72-hour delivery guarantee work?"
                    : "Comment fonctionne la garantie de livraison en 72 heures ?"}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {isEn
                    ? "The 72h sprint officially starts once we receive all your assets: logo, pictures/menu, list of services, and contact information. Our team dedicates an intensive sprint to assemble and launch your site."
                    : "Le chrono de 72 heures démarre dès que vous nous transmettez vos éléments essentiels : logo, photos de vos produits ou plats, grille de prix et coordonnées. Notre équipe se consacre alors en sprint exclusif pour monter, intégrer et mettre votre site en ligne."}
                </p>
              </div>

              <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-6">
                <h3 className="text-base font-semibold text-white mb-2">
                  {isEn
                    ? "How does the 2 or 3 installment payment work?"
                    : "Comment se déroule le paiement échelonné en 2 ou 3 tranches ?"}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {isEn
                    ? "You pay an initial deposit (50% or 33%) at project kickoff via Mobile Money (Orange Money, MTN MoMo) or bank transfer. The remaining balance is paid upon validation and official launch."
                    : "Vous réglez un premier acompte au lancement (50% pour la formule 2 tranches, ou 33% pour la formule 3 tranches) par Mobile Money (Orange Money, MTN MoMo) ou virement. Le solde est versé à la livraison et validation de votre site."}
                </p>
              </div>

              <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-6">
                <h3 className="text-base font-semibold text-white mb-2">
                  {isEn
                    ? "What happens after the first free year of hosting?"
                    : "Que se passe-t-il après la 1ère année d'hébergement offerte ?"}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {isEn
                    ? "The first year of hosting, security certificate, and domain name is 100% included. After 12 months, annual renewal is transparent (approximately 35,000 FCFA/year) to maintain your site online without downtime."
                    : "La première année est 100% offerte pour le nom de domaine, la sécurité SSL et l'hébergement. Après 12 mois, le renouvellement annuel est facturé à tarif transparent (environ 35.000 FCFA/an) pour maintenir votre site actif en continu."}
                </p>
              </div>

              <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-6">
                <h3 className="text-base font-semibold text-white mb-2">
                  {isEn
                    ? "Can I add more features later?"
                    : "Puis-je faire évoluer mon site plus tard avec d'autres options ?"}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {isEn
                    ? "Yes, absolutely! XpreSite is built on a modern, modular architecture. You can start with the base showcase and activate advanced modules (tracking, payment, reservations) whenever your business grows."
                    : "Absolument ! XpreSite repose sur une architecture moderne et évolutive. Vous pouvez démarrer avec la vitrine essentielle et ajouter des fonctionnalités (suivi de commande, paiement en ligne, formulaires avancés) à tout moment au fil de votre croissance."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer c={c} lang={l} />
    </>
  );
}
