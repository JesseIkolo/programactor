import { Mark, Pill, Reveal, SectionHead } from "./ui";
import type { Content } from "@/lib/content";

export default function Work({ c }: { c: Content }) {
  const projects = c.work.projects.map((p, i) => ({
    ...p,
    ...c.projectsMeta[i],
  }));

  return (
    <section id="realisations" className="scroll-mt-24 py-20 md:py-32">
      <div className="shell">
        <SectionHead label={c.work.label} title={c.work.title} lead={c.work.lead} />

        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.key} delay={(i % 2) * 90}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface transition-colors duration-300 hover:border-[color:var(--color-hairline-strong)]">
                {/* Visuel — TODO: remplacer par la photo/capture du projet */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-indigo-deep">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="grain absolute inset-0 flex items-center justify-center bg-indigo">
                      <Mark
                        className="h-9 w-auto text-white/25"
                        accent="var(--color-signal)"
                        accentOpacity={0.35}
                      />
                    </div>
                  )}
                  <span className="t-mono absolute left-5 top-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink/70 px-3 py-[6px] text-paper backdrop-blur">
                    <span className="inline-block h-[5px] w-[5px] rounded-full bg-signal" />
                    {c.work.statusLive}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:p-8">
                  <div>
                    <h3 className="t-sub">{p.name}.</h3>
                    <p className="t-mono mt-3 text-[color:var(--color-muted-2)]">
                      {p.sector} · {p.city}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>
                    <p className="t-mono text-[color:var(--color-muted-2)]">
                      {p.year} · {p.duration} {c.work.durationUnit}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
