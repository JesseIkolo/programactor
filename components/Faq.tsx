import { Label, Reveal } from "./ui";
import type { Content } from "@/lib/content";

export default function Faq({ c }: { c: Content }) {
  return (
    <section className="py-20 md:py-32">
      <div className="shell grid gap-14 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-20">
        <div>
          <Reveal>
            <Label className="mb-8">{c.faq.label}</Label>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-section">{c.faq.title}</h2>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-12 rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] p-7">
              <p className="text-[15px] font-medium">{c.faq.skip.title}</p>
              <p className="t-mono mt-3 text-[color:var(--color-muted-2)]">
                {c.faq.skip.body}
              </p>
              <a
                href={`mailto:${c.contact.email}`}
                className="t-mono mt-6 inline-block rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] px-5 py-[11px] transition-colors hover:border-signal hover:text-signal"
              >
                {c.faq.skip.cta}
              </a>
            </div>
          </Reveal>
        </div>

        <div>
          {c.faq.items.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="faq group border-t border-[color:var(--color-hairline)] last:border-b">
                <summary className="flex items-start justify-between gap-8 py-7">
                  <span className="text-[clamp(1.0625rem,1.5vw,1.25rem)] font-medium leading-snug tracking-[-0.015em]">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="faq-plus mt-1 shrink-0 text-[18px] leading-none text-signal transition-transform duration-300"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-8 pr-10 text-[color:var(--color-muted)]">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
