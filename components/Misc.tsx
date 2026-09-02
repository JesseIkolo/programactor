import { Button, Counter, Label, Marquee, Reveal, SectionHead } from "./ui";
import type { Content } from "@/lib/content";

/* -------------------------------------------------------------------------- */
export function Manifesto({ c }: { c: Content }) {
  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <p className="t-mono max-w-[74ch] text-[13px] leading-[1.9] tracking-[0.06em] text-[color:var(--color-muted)] md:text-[15px] md:leading-[2]">
            {c.manifesto}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
export function Stats({ c }: { c: Content }) {
  return (
    <section className="border-t border-[color:var(--color-hairline)] py-16 md:py-24">
      <div className="shell">
        <Reveal>
          <Label className="mb-12">{c.stats.label}</Label>
        </Reveal>
        <div className="grid gap-12 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-20">
          <Reveal>
            <h2 className="t-sub max-w-[14ch]">{c.stats.title}</h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-3">
            {c.stats.items.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div>
                  <div className="mb-3 flex h-[10px] items-end gap-[3px]" aria-hidden>
                    {Array.from({ length: 14 }).map((_, k) => (
                      <span
                        key={k}
                        className={`block w-[3px] ${
                          k < 9 ? "h-[10px] bg-signal" : "h-[6px] bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,4.5vw,3.5rem)] font-bold leading-none tracking-[-0.04em]">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="t-mono mt-4 max-w-[22ch] text-[color:var(--color-muted-2)]">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
export function Rhythm({ c }: { c: Content }) {
  return (
    <section className="overflow-hidden py-20 md:py-32">
      <div className="shell mb-16 md:mb-24">
        <Reveal>
          <Label className="mb-10">{c.rhythm.label}</Label>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="t-section mx-auto max-w-[22ch] text-center">
            {c.rhythm.title}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="t-lead mx-auto mt-10 max-w-[62ch] text-center text-[color:var(--color-muted)]">
            {c.rhythm.body}
          </p>
        </Reveal>
      </div>
      <Marquee items={c.rhythm.marquee} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
export function About({ c }: { c: Content }) {
  return (
    <section id="agence" className="scroll-mt-24 py-20 md:py-32">
      <div className="shell grid gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <Reveal>
            <Label className="mb-10">{c.about.label}</Label>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-section max-w-[10ch]">{c.about.title}</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-8">
            {c.about.figures.map((f, i) => (
              <Reveal key={f.label} delay={120 + i * 80}>
                <div className="border-t border-[color:var(--color-hairline)] pt-5">
                  <div className="font-[family-name:var(--font-display)] text-[clamp(2rem,3.4vw,2.75rem)] font-bold leading-none tracking-[-0.04em]">
                    <Counter
                      to={f.value}
                      suffix={f.suffix}
                      raw={"raw" in f ? Boolean(f.raw) : false}
                    />
                  </div>
                  <p className="t-mono mt-3 text-[color:var(--color-muted-2)]">
                    {f.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-end gap-6">
          {c.about.body.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className="t-lead text-[color:var(--color-muted)]">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
export function Testimonials({ c }: { c: Content }) {
  return (
    <section className="border-t border-[color:var(--color-hairline)] py-20 md:py-32">
      <div className="shell">
        <SectionHead
          label={c.testimonials.label}
          title={
            <>
              {c.testimonials.titleBefore}
              <span className="mark-word">{c.testimonials.titleMark}</span>
              {c.testimonials.titleAfter}
            </>
          }
          lead={c.testimonials.lead}
        />

        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2">
          {c.testimonials.items.map((t, i) => {
            const empty = !t.quote;
            return (
              <Reveal key={i} delay={i * 100}>
                <figure
                  className={`flex h-full flex-col justify-between rounded-[var(--radius-card)] border p-8 md:p-10 ${
                    empty
                      ? "border-dashed border-[color:var(--color-hairline-strong)] bg-transparent"
                      : "border-[color:var(--color-hairline)] bg-surface"
                  }`}
                >
                  <blockquote
                    className={`t-sub ${
                      empty ? "text-[color:var(--color-muted-2)]" : "text-paper"
                    }`}
                  >
                    {empty ? c.testimonials.placeholder : `« ${t.quote} »`}
                  </blockquote>
                  <figcaption className="mt-10 flex items-end justify-between gap-6 border-t border-[color:var(--color-hairline)] pt-6">
                    <div>
                      <p className="text-[15px] font-medium">{t.author}</p>
                      <p className="t-mono mt-2 text-[color:var(--color-muted-2)]">
                        {t.role} · {t.company}
                      </p>
                    </div>
                    {t.date && (
                      <p className="t-mono text-[color:var(--color-muted-2)]">{t.date}</p>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
export function FinalCta({ c }: { c: Content }) {
  return (
    <section id="contact" className="scroll-mt-24 pb-8 pt-20 md:pb-12 md:pt-32">
      <div className="shell">
        <div className="grain relative overflow-hidden rounded-[var(--radius-card)] bg-indigo px-6 py-16 sm:px-10 md:px-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[40%] -left-[10%] h-[80%] w-[60%] rounded-full opacity-60 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(43,44,156,0.95) 0%, rgba(33,34,130,0) 70%)",
            }}
          />
          <div className="relative">
            <Reveal>
              <p className="t-mono mb-10 flex items-center gap-2 text-white/60">
                <span className="text-signal" aria-hidden>
                  ▶
                </span>
                {c.cta.label}
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="t-section max-w-[18ch] text-paper">
                {c.cta.titleBefore}
                <span className="mark-word">{c.cta.titleMark}</span>
                {c.cta.titleAfter}
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-end md:gap-20">
              <Reveal delay={120}>
                <p className="t-lead max-w-[52ch] text-white/72">{c.cta.body}</p>
              </Reveal>
              <Reveal delay={180}>
                <div className="flex flex-wrap items-center gap-4 md:justify-end">
                  <Button href={c.contact.booking} variant="signal">
                    {c.cta.button}
                  </Button>
                  <a
                    href={`mailto:${c.contact.email}`}
                    className="t-mono text-white/70 underline underline-offset-4 transition-colors hover:text-signal"
                  >
                    {c.cta.or} — {c.contact.email}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
