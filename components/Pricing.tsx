import { Label, Reveal } from "./ui";
import type { Content } from "@/lib/content";

export default function Pricing({ c }: { c: Content }) {
  return (
    <section
      id="tarifs"
      className="scroll-mt-24 border-t border-[color:var(--color-hairline)] py-20 md:py-32"
    >
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <div className="hidden md:block" />
          <div>
            <Reveal>
              <Label className="mb-8">{c.pricing.label}</Label>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="t-section max-w-[14ch]">
                {c.pricing.titleBefore}
                <span className="mark-word">{c.pricing.titleMark}</span>
                {c.pricing.titleAfter}
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:mt-24 lg:grid-cols-3">
          {c.pricing.items.map((p, i) => {
            const popular = "popular" in p && p.popular;
            return (
              <Reveal key={p.n} delay={i * 90}>
                <div
                  className={`flex h-full flex-col rounded-[var(--radius-card)] border p-8 md:p-10 ${
                    popular
                      ? "border-signal/40 bg-surface-2"
                      : "border-[color:var(--color-hairline)] bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="t-num text-[13px] text-[color:var(--color-muted-2)]">
                      {p.n}
                    </span>
                    {popular && (
                      <span className="t-mono rounded-[var(--radius-pill)] bg-signal px-3 py-[6px] text-ink">
                        {c.pricing.popular}
                      </span>
                    )}
                  </div>

                  <div className="mt-10">
                    <p className="text-[14px] text-[color:var(--color-muted)]">
                      {c.pricing.timeline} · {p.timeline}
                    </p>
                    <h3 className="t-sub mt-4">{p.title}</h3>
                    <p className="mt-3 text-[color:var(--color-muted)]">{p.subtitle}</p>
                  </div>

                  <ul className="mt-8 flex flex-col gap-3 border-t border-[color:var(--color-hairline)] pt-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 text-[15px] leading-relaxed">
                        <span aria-hidden className="mt-[7px] block h-[5px] w-[5px] shrink-0 bg-signal" />
                        <span className="text-[color:var(--color-muted)]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 flex items-end justify-between gap-4 border-t border-[color:var(--color-hairline)] pt-7">
                    <a
                      href={c.contact.booking}
                      className={`t-mono rounded-[var(--radius-pill)] px-5 py-[11px] transition-colors ${
                        popular
                          ? "bg-signal text-ink hover:bg-paper"
                          : "border border-[color:var(--color-hairline-strong)] text-paper hover:border-signal hover:text-signal"
                      }`}
                    >
                      {p.cta}
                    </a>
                    <div className="text-right">
                      {p.priceLabel ? (
                        <p className="t-mono mb-1 text-[color:var(--color-muted-2)]">
                          {p.priceLabel}
                        </p>
                      ) : null}
                      <span className="t-num block text-[21px] font-medium leading-none text-paper">
                        {p.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="t-mono mx-auto mt-14 max-w-[46rem] text-center leading-[2.1] text-[color:var(--color-muted-2)]">
            {c.pricing.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
