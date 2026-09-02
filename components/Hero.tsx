import { Button, Mark } from "./ui";
import type { Content } from "@/lib/content";

export default function Hero({ c }: { c: Content }) {
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
            <div className="mb-12 flex items-center justify-between gap-6 md:mb-24">
              <Mark
                className="h-6 w-auto text-paper md:h-7"
                accent="var(--color-signal)"
                accentOpacity={1}
              />
              <p className="t-mono max-w-[42ch] text-right text-white/60">
                {c.hero.eyebrow}
              </p>
            </div>

            <h1 className="t-display max-w-[19ch] text-paper">
              {c.hero.titleBefore}
              <span className="mark-word">{c.hero.titleMark}</span>
              {c.hero.titleAfter}
            </h1>

            <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-end md:gap-16">
              <div className="flex flex-wrap items-center gap-3">
                <Button href={c.contact.booking} variant="signal">
                  {c.hero.ctaPrimary}
                </Button>
                <Button href="#realisations" variant="ghost">
                  {c.hero.ctaSecondary}
                </Button>
              </div>
              <p className="t-lead text-white/72 md:text-right">{c.hero.lead}</p>
            </div>
          </div>

          {/* barre de statut */}
          <div className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/15 px-6 py-4 sm:px-10 md:px-14 lg:px-16">
            <span className="t-mono flex items-center gap-2 text-white/75">
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-signal" />
              {c.hero.status}
            </span>
            <span className="t-mono text-white/50">{c.cities}</span>
            <span className="t-mono text-white/50">{c.hero.since}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
