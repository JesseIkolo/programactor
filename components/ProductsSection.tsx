import { Pill, Reveal, SectionHead } from "./ui";
import type { Content, Lang } from "@/lib/content";
import { ArrowUpRight01Icon, ArrowRight01Icon } from "hugeicons-react";

export default function ProductsSection({
  c,
  lang,
}: {
  c: Content;
  lang: Lang;
}) {
  const isEn = lang === "en";

  const loueurMsg = encodeURIComponent(
    isEn
      ? "Hello Programactor, I run a car rental business. I saw the BongoFleet demo and would like to receive the free preview for my agency.\nAgency name: \nCity: "
      : "Bonjour Programactor, je suis loueur de véhicules. J'ai vu la démo BongoFleet et je souhaite recevoir l'aperçu gratuit de mon agence.\nNom de l'agence : \nVille : "
  );
  const loueurWhatsappUrl = `https://wa.me/237692025552?text=${loueurMsg}`;

  return (
    <section
      id="produits"
      className="scroll-mt-24 border-t border-[color:var(--color-hairline)] py-20 md:py-32"
    >
      <div className="shell">
        <SectionHead
          label={isEn ? "Our Products" : "Nos produits"}
          title={
            isEn
              ? "Our products, built in Douala."
              : "Nos produits, conçus à Douala."
          }
          lead={
            isEn
              ? "We built them specifically for the industries we serve, and we install them directly at your venue."
              : "Nous les avons construits pour les métiers que nous servons, et nous les installons nous-mêmes chez vous."
          }
        />

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-2">
          {/* Carte Bongo Space */}
          <Reveal delay={60}>
            <div className="flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-signal/30 bg-surface-2 p-8 transition-colors md:p-10">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="t-mono text-xs font-semibold text-signal tracking-wider">
                    {isEn
                      ? "PROGRAMACTOR PRODUCT · RESTAURANTS & BARS"
                      : "PRODUIT PROGRAMACTOR · RESTAURANTS & BARS"}
                  </span>
                  <span className="t-mono text-xs text-[color:var(--color-muted-2)]">
                    SaaS & POS
                  </span>
                </div>

                <h3 className="t-sub mt-6 text-2xl font-bold text-paper">
                  Bongo Space.
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-muted)]">
                  {isEn
                    ? "The digital menu, till and stock system for your restaurant or bar. Customers order from the table QR code or on WhatsApp, and everything keeps working when the network drops."
                    : "Le menu digital, la caisse et les stocks de votre restaurant ou de votre bar. Vos clients commandent depuis le QR code de la table ou sur WhatsApp, et tout continue de fonctionner quand le réseau coupe."}
                </p>

                <div className="mt-6 rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface/60 p-4">
                  <p className="t-mono text-xs text-[color:var(--color-muted-2)] uppercase">
                    {isEn ? "Pricing" : "Tarifs"}
                  </p>
                  <p className="t-num mt-1 text-sm font-medium text-paper">
                    {isEn
                      ? "Digital menu from 90,000 FCFA · Installation pack 250,000 FCFA (12 months included)"
                      : "Menu digital dès 90 000 FCFA · Pack installation 250 000 FCFA (12 mois inclus)"}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(isEn
                    ? ["QR Menu", "POS Till", "Stock", "WhatsApp", "Offline-first"]
                    : ["Menu QR", "Caisse", "Stocks", "WhatsApp", "Hors-ligne"]
                  ).map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[color:var(--color-hairline)] pt-6">
                <a
                  href="https://chezmarco.bongospace.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-signal px-5 py-[11px] font-medium text-ink transition-colors hover:bg-paper"
                >
                  <span>{isEn ? "See a demo menu" : "Voir un menu en démo"}</span>
                  <ArrowUpRight01Icon size={16} />
                </a>
                <a
                  href={`https://bongospace.pro/${lang}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-mono inline-flex items-center gap-1.5 text-xs text-[color:var(--color-muted)] transition-colors hover:text-paper"
                >
                  <span>{isEn ? "Discover Bongo Space" : "Découvrir Bongo Space"}</span>
                  <ArrowRight01Icon size={14} />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Carte BongoFleet */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface p-8 transition-colors md:p-10">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="t-mono text-xs font-semibold text-signal tracking-wider">
                    {isEn
                      ? "PROGRAMACTOR PRODUCT · CAR RENTAL"
                      : "PRODUIT PROGRAMACTOR · LOUEURS DE VÉHICULES"}
                  </span>
                  <span className="t-mono text-xs text-[color:var(--color-muted-2)]">
                    Fleet Booking
                  </span>
                </div>

                <h3 className="t-sub mt-6 text-2xl font-bold text-paper">
                  BongoFleet.
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-muted)]">
                  {isEn
                    ? "The booking website for car rental businesses: your fleet in photos, daily rates, deposit rules and chauffeur option. Customers pick a vehicle and dates, and you receive the full request on WhatsApp."
                    : "Le site de réservation des loueurs de véhicules : votre flotte en photos, vos tarifs à la journée, la caution et la mise à disposition de chauffeur. Le client choisit son véhicule et ses dates, et vous recevez la demande complète sur WhatsApp."}
                </p>

                <div className="mt-6 rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface-2/60 p-4">
                  <p className="t-mono text-xs text-[color:var(--color-muted-2)] uppercase">
                    {isEn ? "Pricing" : "Tarifs"}
                  </p>
                  <p className="t-num mt-1 text-sm font-medium text-paper">
                    {isEn
                      ? "From 130,000 FCFA · Deposit calculator add-on available"
                      : "À partir de 130 000 FCFA · Option Calculateur de caution"}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(isEn
                    ? ["Fleet", "Booking", "Deposit", "WhatsApp"]
                    : ["Flotte", "Réservation", "Caution", "WhatsApp"]
                  ).map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[color:var(--color-hairline)] pt-6">
                <a
                  href="https://drivo-demo.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] px-5 py-[11px] font-medium text-paper transition-colors hover:border-signal hover:text-signal"
                >
                  <span>{isEn ? "See BongoFleet demo" : "Voir la démo BongoFleet"}</span>
                  <ArrowUpRight01Icon size={16} />
                </a>
                <a
                  href={loueurWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-mono inline-flex items-center gap-1.5 text-xs text-signal underline transition-colors hover:text-paper"
                >
                  <span>{isEn ? "Get my agency's free preview" : "Recevoir l'aperçu gratuit de mon agence"}</span>
                  <ArrowRight01Icon size={14} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
