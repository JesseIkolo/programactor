import { Button, Pill, Reveal, SectionHead } from "./ui";
import type { Content } from "@/lib/content";

export default function Services({ c }: { c: Content }) {
  return (
    <section
      id="services"
      className="scroll-mt-24 border-t border-[color:var(--color-hairline)] py-20 md:py-32"
    >
      <div className="shell">
        <SectionHead
          label={c.services.label}
          title={c.services.title}
          lead={c.services.lead}
          action={
            <Button href={c.contact.booking} variant="signal">
              {c.services.cta}
            </Button>
          }
        />

        <div className="mt-20 md:mt-28">
          {c.services.items.map((s, i) => (
            <Reveal key={s.title}>
              <div className="grid gap-6 border-t border-[color:var(--color-hairline)] py-10 md:grid-cols-2 md:gap-16 md:py-14">
                <div className="flex items-start gap-6">
                  <span className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.05em] text-[color:var(--color-muted-2)]">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="mt-3 hidden h-[52px] w-[100px] shrink-0 opacity-30 lg:block"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                      backgroundSize: "10px 10px",
                    }}
                  />
                </div>

                <div>
                  <h3 className="t-sub">{s.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-[color:var(--color-muted)]">
                    {s.body}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="rule" />
        </div>
      </div>
    </section>
  );
}
