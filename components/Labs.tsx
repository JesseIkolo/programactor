import { Button, Label, Mark, Reveal } from "./ui";
import type { Content } from "@/lib/content";

export default function Labs({ c }: { c: Content }) {
  return (
    <section id="labs" className="scroll-mt-24 py-20 md:py-32">
      <div className="shell">
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface">
          <div className="grid md:grid-cols-2">
            {/* Panneau visuel */}
            <div className="grain relative min-h-[260px] bg-indigo p-8 md:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-[20%] top-[10%] h-[70%] w-[70%] rounded-full opacity-70 blur-[100px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(235,255,114,0.28) 0%, rgba(33,34,130,0) 70%)",
                }}
              />
              <div className="relative flex h-full flex-col justify-between gap-12">
                <Mark
                  className="h-8 w-auto text-paper"
                  accent="var(--color-signal)"
                  accentOpacity={1}
                />
                <div>
                  <p className="t-mono mb-5 text-white/60">{c.labs.label}</p>
                  <h2 className="t-section text-paper">{c.labs.title}</h2>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
              <div>
                <Reveal>
                  <p className="t-lead max-w-[42ch]">{c.labs.lead}</p>
                </Reveal>
                <Reveal delay={80}>
                  <p className="mt-5 max-w-[46ch] text-[color:var(--color-muted)]">
                    {c.labs.body}
                  </p>
                </Reveal>
              </div>

              <div className="grid gap-px bg-[color:var(--color-hairline)] sm:grid-cols-3">
                {c.labs.points.map((p, i) => (
                  <Reveal key={p.title} delay={i * 80}>
                    <div className="h-full bg-surface pr-4 pt-6 sm:px-4 sm:pt-6">
                      <p className="t-mono text-signal">{p.title}</p>
                      <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-muted)]">
                        {p.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={200}>
                <Button href={c.contact.booking} variant="ghost">
                  {c.labs.cta}
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
