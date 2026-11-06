import { Label, Pill, Reveal, SectionHead } from "./ui";
import type { Content, Lang } from "@/lib/content";
import { ArrowUpRight01Icon } from "hugeicons-react";

export default function DemosSection({
  c,
  lang,
}: {
  c: Content;
  lang: Lang;
}) {
  const isEn = lang === "en";

  const demos = [
    {
      sector: isEn ? "Restaurant & Bar" : "Restaurant & Bar",
      badge: isEn ? "DEMO MENU · BONGO SPACE" : "MENU DE DÉMONSTRATION · BONGO SPACE",
      title: isEn
        ? "Demo menu, Chez Marco restaurant (Bonamoussadi)"
        : "Menu de démonstration, restaurant Chez Marco (Bonamoussadi)",
      body: isEn
        ? "Full digital menu on phone, item cart, WhatsApp order sending. Try adding a dish and see the result."
        : "Carte complète sur téléphone, panier, commande transmise directement sur WhatsApp. Testez l'ajout d'un plat sur votre téléphone.",
      disclaimer: isEn
        ? "Demo mockup created to showcase our service; Chez Marco is not (yet) a client."
        : "Maquette préparée pour présenter notre offre ; Chez Marco n'est pas (encore) client.",
      url: "https://chezmarco.bongospace.pro",
      actionLabel: isEn ? "Open demo menu" : "Ouvrir le menu en démo",
      tags: isEn
        ? ["QR Menu", "WhatsApp Cart", "Mobile-First"]
        : ["Menu QR", "Panier WhatsApp", "Mobile-First"],
    },
    {
      sector: isEn ? "Car Rental" : "Location de véhicules",
      badge: isEn ? "DEMO RENTAL SITE · BONGOFLEET" : "SITE LOUEUR EN DÉMO · BONGOFLEET",
      title: isEn
        ? "BongoFleet demo, fictional car rental agency"
        : "Démo BongoFleet, agence de location fictive",
      body: isEn
        ? "Vehicle fleet showcase with daily rates, security deposit rules, chauffeur option and instant booking request on WhatsApp."
        : "Présentation de flotte avec tarifs à la journée, calcul de caution, mise à disposition de chauffeur et demande de réservation sur WhatsApp.",
      disclaimer: isEn
        ? "Fictional demo showing vehicle fleet reservation flow."
        : "Agence fictive illustrant le parcours complet de réservation de véhicule.",
      url: "https://drivo-demo.netlify.app",
      actionLabel: isEn ? "Open BongoFleet demo" : "Ouvrir la démo BongoFleet",
      tags: isEn
        ? ["Fleet", "Deposit Calculator", "WhatsApp Booking"]
        : ["Flotte", "Calculateur caution", "Réservation WhatsApp"],
    },
  ];

  return (
    <section
      id="demos"
      className="scroll-mt-24 border-t border-[color:var(--color-hairline)] py-20 md:py-32"
    >
      <div className="shell">
        <SectionHead
          label={isEn ? "Live Demos" : "Démos en ligne"}
          title={
            isEn
              ? "Try a live demo on your phone."
              : "Testez une démo sur votre téléphone."
          }
          lead={
            isEn
              ? "Here is what your customers will experience. Open it, scroll, and test ordering: nothing is billed, and nothing is actually dispatched."
              : "Voici exactement ce que vos clients verront. Ouvrez sur votre smartphone, faites défiler et passez une commande test : rien n'est envoyé."
          }
        />

        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2">
          {demos.map((d, i) => (
            <Reveal key={d.title} delay={i * 90}>
              <div className="flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface p-8 transition-colors hover:border-[color:var(--color-hairline-strong)] md:p-10">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="t-mono text-xs text-signal font-medium tracking-wider">
                      {d.badge}
                    </span>
                    <span className="t-mono text-xs text-[color:var(--color-muted-2)]">
                      {d.sector}
                    </span>
                  </div>

                  <h3 className="t-sub mt-6 text-paper">{d.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-muted)]">
                    {d.body}
                  </p>
                  <p className="mt-3 text-xs italic text-[color:var(--color-muted-2)]">
                    {d.disclaimer}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {d.tags.map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-[color:var(--color-hairline)] pt-6">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-signal px-5 py-[11px] font-medium text-ink transition-colors hover:bg-paper"
                  >
                    <span>{d.actionLabel}</span>
                    <ArrowUpRight01Icon size={16} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
