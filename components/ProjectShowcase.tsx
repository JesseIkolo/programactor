"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Mark, Pill, Reveal } from "./ui";
import ProjectVisual from "./ProjectVisual";
import type { Content, DetailedProject } from "@/lib/content";

interface ProjectShowcaseProps {
  c: Content;
  initialProjects?: DetailedProject[];
}

export default function ProjectShowcase({ c, initialProjects }: ProjectShowcaseProps) {
  const t = c.realisationsPage;
  const [liveProjects, setLiveProjects] = useState<DetailedProject[] | null>(
    initialProjects && initialProjects.length > 0 ? initialProjects : null
  );

  useEffect(() => {
    fetch('/api/projects?status=PUBLISHED')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const isEn = c.lang === 'en';
          const mapped: DetailedProject[] = d.data.map((p: any) => ({
            key: p.slug || p._id,
            id: p.slug || p._id,
            name: p.name,
            client: p.client || '',
            sector: p.sector,
            city: p.city,
            year: p.year || '2026',
            duration: p.duration || '3 semaines',
            status: p.status === 'PUBLISHED' ? (isEn ? 'Live' : 'En ligne') : p.status,
            tags: p.tags || [],
            tagline: isEn ? (p.contentEn?.tagline || p.contentFr?.tagline) : (p.contentFr?.tagline || p.contentEn?.tagline),
            challenge: isEn ? (p.contentEn?.challenge || p.contentFr?.challenge) : (p.contentFr?.challenge || p.contentEn?.challenge),
            solution: isEn ? (p.contentEn?.solution || p.contentFr?.solution) : (p.contentFr?.solution || p.contentEn?.solution),
            deliverables: (isEn ? p.contentEn?.deliverables : p.contentFr?.deliverables) || [],
            metrics: (p.metrics || []).map((m: any) => ({
              value: m.value,
              label: isEn ? (m.labelEn || m.labelFr) : (m.labelFr || m.labelEn),
            })),
            accentTone: 'signal' as const,
            image: p.cardCoverImageUrl || p.coverImageUrl || p.image,
            coverImageUrl: p.cardCoverImageUrl || p.coverImageUrl || p.image,
            cardCoverImageUrl: p.cardCoverImageUrl || p.coverImageUrl || p.image,
            heroCoverImageUrl: p.heroCoverImageUrl || p.coverImageUrl || p.image,
            gallery: p.gallery || [],
          }));
          setLiveProjects(mapped);
        }
      })
      .catch(() => {});
  }, [c.lang]);

  const projects = (liveProjects && liveProjects.length > 0)
    ? liveProjects
    : (c.detailedProjects as DetailedProject[]);

  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "grid">("cards");

  // Extraction unique des secteurs et villes
  const sectors = useMemo(() => {
    const set = new Set(projects.map((p) => p.sector));
    return Array.from(set);
  }, [projects]);

  const cities = useMemo(() => {
    const set = new Set(projects.map((p) => p.city));
    return Array.from(set);
  }, [projects]);

  // Filtrage
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSector = selectedSector === "all" || p.sector === selectedSector;
      const matchCity = selectedCity === "all" || p.city === selectedCity;
      return matchSector && matchCity;
    });
  }, [projects, selectedSector, selectedCity]);

  return (
    <div className="mt-12 md:mt-20">
      {/* ----------------------------------------------------------------------
          BARRE DE CONTRÔLES : FILTRES SECTEURS, VILLES ET COMMUTATEUR DE VUE
          ---------------------------------------------------------------------- */}
      <div className="border-y border-[color:var(--color-hairline)] bg-surface/40 py-6 backdrop-blur-md">
        <div className="shell flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Filtre Secteurs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="t-mono mr-2 hidden text-[11px] text-[color:var(--color-muted-2)] sm:inline">
              {t.filterSectorLabel} :
            </span>
            <button
              type="button"
              onClick={() => setSelectedSector("all")}
              className={`t-mono rounded-[var(--radius-pill)] px-3.5 py-1.5 text-xs transition-all ${
                selectedSector === "all"
                  ? "bg-signal text-ink font-medium"
                  : "border border-[color:var(--color-hairline)] text-[color:var(--color-muted)] hover:border-white/30 hover:text-paper"
              }`}
            >
              {t.filterAllSectors}
            </button>
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                className={`t-mono rounded-[var(--radius-pill)] px-3.5 py-1.5 text-xs transition-all ${
                  selectedSector === sec
                    ? "bg-signal text-ink font-medium"
                    : "border border-[color:var(--color-hairline)] text-[color:var(--color-muted)] hover:border-white/30 hover:text-paper"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Filtre Villes & Commutateur de Vue */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 lg:border-t-0 lg:pt-0">
            {/* Villes */}
            <div className="flex items-center gap-2">
              <span className="t-mono text-[11px] text-[color:var(--color-muted-2)]">
                {t.filterCityLabel} :
              </span>
              <button
                type="button"
                onClick={() => setSelectedCity("all")}
                className={`t-mono rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] transition-all ${
                  selectedCity === "all"
                    ? "bg-white/20 text-paper font-medium"
                    : "text-[color:var(--color-muted-2)] hover:text-paper"
                }`}
              >
                {t.filterAllCities}
              </button>
              {cities.map((ct) => (
                <button
                  key={ct}
                  type="button"
                  onClick={() => setSelectedCity(ct)}
                  className={`t-mono rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] transition-all ${
                    selectedCity === ct
                      ? "bg-white/20 text-paper font-medium"
                      : "text-[color:var(--color-muted-2)] hover:text-paper"
                  }`}
                >
                  {ct}
                </button>
              ))}
            </div>

            {/* Commutateur de vue */}
            <div className="flex items-center rounded-[var(--radius-pill)] border border-[color:var(--color-hairline)] bg-ink/70 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`t-mono flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1 text-[11px] transition-all ${
                  viewMode === "cards"
                    ? "bg-white/15 text-paper"
                    : "text-[color:var(--color-muted-2)] hover:text-paper"
                }`}
                aria-label={t.viewCards}
              >
                <span>▣</span>
                <span className="hidden sm:inline">{t.viewCards}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`t-mono flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1 text-[11px] transition-all ${
                  viewMode === "grid"
                    ? "bg-white/15 text-paper"
                    : "text-[color:var(--color-muted-2)] hover:text-paper"
                }`}
                aria-label={t.viewGrid}
              >
                <span>▦</span>
                <span className="hidden sm:inline">{t.viewGrid}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="shell mt-6 flex items-center justify-between text-xs text-[color:var(--color-muted-2)]">
        <p className="t-mono">
          <span className="t-num font-bold text-signal">{filteredProjects.length}</span> {t.resultsCount}
        </p>
        {(selectedSector !== "all" || selectedCity !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSelectedSector("all");
              setSelectedCity("all");
            }}
            className="t-mono underline hover:text-paper"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* ----------------------------------------------------------------------
          AFFICHAGE DES PROJETS : VUE CARTES DÉTAILLÉES (RATIO 1000×750, ÉPURÉES)
          ---------------------------------------------------------------------- */}
      {viewMode === "cards" && (
        <div className="shell mt-10 space-y-12">
          {filteredProjects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 80}>
              <article className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface transition-all duration-300 hover:border-[color:var(--color-hairline-strong)]">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
                  {/* Visuel immersif (Ratio 4:3 / 1000x750) */}
                  <Link
                    href={`/${c.lang}/realisations/${p.id}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-indigo-deep block"
                  >
                    <ProjectVisual
                      id={p.id}
                      name={p.name}
                      sector={p.sector}
                      city={p.city}
                      image={p.cardCoverImageUrl || p.image || p.coverImageUrl}
                      accentTone={p.accentTone}
                    />
                    <span className="t-mono absolute left-5 top-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink/80 px-3 py-[6px] text-paper backdrop-blur border border-white/10">
                      <span className="inline-block h-[5px] w-[5px] rounded-full bg-signal" />
                      {p.status}
                    </span>
                  </Link>

                  {/* Contenu de la carte (Épuré : sans blocs défi/solution, orienté clic vers la page) */}
                  <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
                    <div>
                      {/* Métadonnées hautes */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="t-mono text-xs text-signal">
                          {p.sector} · {p.city}
                        </span>
                        <span className="t-mono text-xs text-[color:var(--color-muted-2)]">
                          {p.year} · {p.duration}
                        </span>
                      </div>

                      {/* Titre & Accroche */}
                      <Link href={`/${c.lang}/realisations/${p.id}`}>
                        <h3 className="t-sub mt-4 text-paper transition-colors group-hover:text-white">
                          {p.name}.
                        </h3>
                      </Link>
                      <p className="t-lead mt-3 text-[color:var(--color-muted)] leading-relaxed">
                        {p.tagline}
                      </p>

                      {/* Métriques clés d'impact */}
                      {p.metrics && p.metrics.length > 0 && (
                        <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-[color:var(--color-hairline)] bg-white/[0.02] p-4">
                          {p.metrics.map((m, idx) => (
                            <div key={idx} className="text-center">
                              <span className="t-num block text-base font-bold text-signal md:text-lg">
                                {m.value}
                              </span>
                              <span className="t-mono mt-1 block text-[9px] text-[color:var(--color-muted-2)] leading-tight">
                                {m.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pied de carte : Tags + Bouton d'accès vers la page dédiée */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-hairline)] pt-6">
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <Pill key={tag}>{tag}</Pill>
                        ))}
                      </div>
                      <Link
                        href={`/${c.lang}/realisations/${p.id}`}
                        className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-paper transition-all hover:border-signal hover:bg-signal hover:text-ink"
                      >
                        <span>{t.viewDetails}</span>
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------------------
          AFFICHAGE DES PROJETS : VUE GRILLE COMPACTE (PRODUCT GRID)
          ---------------------------------------------------------------------- */}
      {viewMode === "grid" && (
        <div className="shell mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
              <Link
                href={`/${c.lang}/realisations/${p.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-hairline-strong)] block"
              >
                {/* Visuel 4:3 */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-indigo-deep">
                  <ProjectVisual
                    id={p.id}
                    name={p.name}
                    sector={p.sector}
                    city={p.city}
                    image={p.cardCoverImageUrl || p.image || p.coverImageUrl}
                    accentTone={p.accentTone}
                  />
                  <span className="t-mono absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-ink/80 px-2.5 py-1 text-[11px] text-paper backdrop-blur border border-white/10">
                    <span className="inline-block h-[5px] w-[5px] rounded-full bg-signal" />
                    {p.status}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[color:var(--color-muted-2)]">
                      <span className="t-mono text-signal">{p.sector}</span>
                      <span className="t-mono">{p.city}</span>
                    </div>
                    <h3 className="t-sub mt-2 text-lg text-paper group-hover:text-white transition-colors">
                      {p.name}.
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-[color:var(--color-muted)] leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-[color:var(--color-hairline)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="t-mono text-[11px] text-[color:var(--color-muted-2)]">
                        {p.duration}
                      </span>
                      <span className="t-mono text-xs font-medium text-signal group-hover:underline">
                        {t.viewDetails} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
