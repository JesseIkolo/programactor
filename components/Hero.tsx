import { Button, Mark } from "./ui";
import type { Content } from "@/lib/content";

export default function Hero({ c }: { c: Content }) {
  const isEn = c.lang === "en";

  const waHeroMessage = isEn
    ? "Hello Programactor, I would like to receive the free preview for my business.\nBusiness name:\nType (restaurant, bar, hotel, car rental…):\nCity:"
    : "Bonjour Programactor, je souhaite recevoir l'aperçu gratuit de mon établissement.\nNom de l'établissement :\nType (restaurant, bar, hôtel, location de véhicules…) :\nVille :";

  const heroWaUrl = `https://wa.me/237692025552?text=${encodeURIComponent(waHeroMessage)}`;

  return (
    <section className="pt-[68px]">
      <div className="shell">
        <div className="grain relative overflow-hidden rounded-[var(--radius-card)] bg-indigo">
          {/* halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[10%] -top-[30%] h-[70%] w-[60%] rounded-full opacity-70 blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, rgba(43,44,156,0.9) 0%, rgba(33,34,130,0) 70%)",
            }}
          />

          <div className="relative px-6 pb-8 pt-10 sm:px-10 md:px-14 md:pb-12 md:pt-16 lg:px-16 lg:pt-20">
            <div className="mb-12 flex items-center justify-between gap-6 md:mb-20">
              <Mark
                className="h-6 w-auto text-paper md:h-7"
                accent="var(--color-signal)"
                accentOpacity={1}
              />
              <p className="t-mono text-xs max-w-[48ch] text-right text-white/70 tracking-wider">
                {c.hero.eyebrow}
              </p>
            </div>

            <h1 className="t-display max-w-[21ch] text-paper">
              {c.hero.titleBefore}
              <span className="mark-word">{c.hero.titleMark}</span>
              {c.hero.titleAfter}
            </h1>

            <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-end md:gap-16">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    href={heroWaUrl}
                    variant="signal"
                    event="cta_whatsapp"
                    eventProps={{ position: "hero", lang: c.lang }}
                  >
                    {c.hero.ctaPrimary}
                  </Button>
                  <Button href="#demos" variant="ghost">
                    {c.hero.ctaSecondary}
                  </Button>
                </div>
                <p className="t-mono mt-3 text-[11px] text-white/60 tracking-wider">
                  {isEn
                    ? "Free, no commitment. WhatsApp reply in under 2 hours, Mon–Sat."
                    : "Gratuit, sans engagement. Réponse sur WhatsApp en moins de 2 h, du lundi au samedi."}
                </p>
              </div>

              <p className="t-lead text-white/80 md:text-right leading-relaxed">{c.hero.lead}</p>
            </div>
          </div>

          {/* barre de statut */}
          <div className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/15 px-6 py-4 sm:px-10 md:px-14 lg:px-16">
            <span className="t-mono text-xs flex items-center gap-2 text-white/85">
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-signal" />
              {c.hero.status}
            </span>
            <span className="t-mono text-xs text-signal font-medium">{c.hero.since}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
