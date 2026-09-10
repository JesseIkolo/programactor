import Link from "next/link";
import TrackedLink from "./TrackedLink";
import { Mark, Pill, Reveal, SectionHead } from "./ui";
import ProjectVisual from "./ProjectVisual";
import type { Content, DetailedProject } from "@/lib/content";

interface WorkProps {
  c: Content;
  projects?: DetailedProject[];
}

export default function Work({ c, projects: incomingProjects }: WorkProps) {
  const projects =
    incomingProjects && incomingProjects.length > 0
      ? incomingProjects
      : c.work.projects.map((p, i) => {
          const meta = c.projectsMeta[i] || {};
          const key = (meta as any).key || `project-${i}`;
          return {
            ...p,
            ...meta,
            key,
            id: key,
          };
        });

  const exploreLabel =
    c.lang === "fr"
      ? "Explorer toutes les réalisations"
      : "Explore all case studies";

  return (
    <section id="realisations" className="scroll-mt-24 py-20 md:py-32">
      <div className="shell">
        <SectionHead
          label={c.work.label}
          title={c.work.title}
          lead={c.work.lead}
          action={
            <Link
              href={`/${c.lang}/realisations`}
              className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-5 py-3 text-xs font-semibold text-paper transition-colors hover:border-signal hover:text-signal"
            >
              <span>{exploreLabel}</span>
              <span aria-hidden>→</span>
            </Link>
          }
        />

        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.key || p.id} delay={(i % 2) * 90}>
              <TrackedLink
                event="cta_case_study"
                eventProps={{ project: p.id || p.key }}
                href={`/${c.lang}/realisations/${p.id || p.key}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface transition-colors duration-300 hover:border-[color:var(--color-hairline-strong)] block"
              >
                {/* Visuel immersif interactif */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-indigo-deep">
                  <ProjectVisual
                    id={p.key}
                    name={p.name}
                    sector={p.sector}
                    city={p.city}
                    image={p.image}
                  />
                  <span className="t-mono absolute left-5 top-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink/80 px-3 py-[6px] text-paper backdrop-blur border border-white/10">
                    <span className="inline-block h-[5px] w-[5px] rounded-full bg-signal" />
                    {c.work.statusLive}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:p-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="t-sub text-paper group-hover:text-white">
                        {p.name}.
                      </h3>
                      <span className="t-mono text-xs text-signal opacity-0 transition-opacity group-hover:opacity-100">
                        Étude complète →
                      </span>
                    </div>
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
                      {p.year} ·{" "}
                      {p.duration?.includes(c.work.durationUnit)
                        ? p.duration
                        : `${p.duration} ${c.work.durationUnit}`}
                    </p>
                  </div>
                </div>
              </TrackedLink>
            </Reveal>
          ))}
        </div>

        {/* Bouton bas de section */}
        <div className="mt-12 flex justify-center md:mt-16">
          <Link
            href={`/${c.lang}/realisations`}
            className="t-mono inline-flex items-center gap-3 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] bg-surface px-7 py-4 text-xs font-semibold text-paper transition-all hover:border-signal hover:bg-signal hover:text-ink"
          >
            <span>{exploreLabel}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
