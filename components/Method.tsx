import { Label, Reveal } from "./ui";
import type { Content } from "@/lib/content";

export default function Method({ c }: { c: Content }) {
  return (
    <section id="methode" className="scroll-mt-24 py-20 md:py-32">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <div className="hidden md:block" />
          <div>
            <Reveal>
              <Label className="mb-8">{c.method.label}</Label>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="t-section max-w-[16ch]">
                {c.method.titleBefore}
                <span className="mark-word">{c.method.titleMark}</span>
                {c.method.titleAfter}
              </h2>
            </Reveal>
          </div>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-[color:var(--color-hairline)] md:mt-24 md:grid-cols-2 xl:grid-cols-4">
          {c.method.steps.map((s, i) => (
            <li key={s.title} className="bg-ink">
              <Reveal delay={i * 80}>
                <div className="flex h-full min-h-[280px] flex-col gap-10 p-8 md:p-10">
                  <span className="t-num text-[13px] text-signal">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <div className="mt-auto">
                    <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] font-medium leading-tight tracking-[-0.02em]">
                      {s.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-muted)]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
