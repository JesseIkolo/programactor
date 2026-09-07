"use client";

import { useMemo, useState, useEffect } from "react";
import { Mark, Pill, Reveal } from "./ui";
import ProjectVisual from "./ProjectVisual";
import type { Content, DetailedProject } from "@/lib/content";

interface ProjectShowcaseProps {
  c: Content;
}

export default function ProjectShowcase({ c }: ProjectShowcaseProps) {
  const t = c.realisationsPage;
  const [liveProjects, setLiveProjects] = useState<DetailedProject[] | null>(null);

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
  const [activeProject, setActiveProject] = useState<DetailedProject | null>(null);

  // Fermer le tiroir avec la touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Bloquer le scroll du body quand le tiroir de détail est ouvert
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

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
          BARRE DE CONTRÔLES : FILTRES SECTEURS, VILLES ET VUE
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
                  ? "bg-signal text-ink font-semibold"
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
                    ? "bg-signal text-ink font-semibold"
                    : "border border-[color:var(--color-hairline)] text-[color:var(--color-muted)] hover:border-white/30 hover:text-paper"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Filtre Villes & Vue */}
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
                    ? "bg-white/20 text-paper font-semibold"
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
                      ? "bg-white/20 text-paper font-semibold"
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
          AFFICHAGE DES PROJETS : VUE CARTES DÉTAILLÉES (STORY CARDS)
          ---------------------------------------------------------------------- */}
      {viewMode === "cards" && (
        <div className="shell mt-10 space-y-12">
          {filteredProjects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 80}>
              <article className="group relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface transition-all duration-300 hover:border-[color:var(--color-hairline-strong)]">
                <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
                  {/* Visuel interactif */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-indigo-deep lg:aspect-auto">
                    <ProjectVisual
                      id={p.id}
                      name={p.name}
                      sector={p.sector}
                      city={p.city}
                      accentTone={p.accentTone}
                    />
                    <span className="t-mono absolute left-5 top-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink/80 px-3 py-[6px] text-paper backdrop-blur border border-white/10">
                      <span className="inline-block h-[5px] w-[5px] rounded-full bg-signal" />
                      {p.status}
                    </span>
                  </div>

                  {/* Contenu et Récit Produit */}
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
                      <h3 className="t-sub mt-4 text-paper group-hover:text-white">
                        {p.name}.
                      </h3>
                      <p className="t-lead mt-3 text-[color:var(--color-muted)]">
                        {p.tagline}
                      </p>

                      {/* Défi vs Solution */}
                      <div className="mt-8 space-y-4 border-t border-[color:var(--color-hairline)] pt-6">
                        <div>
                          <p className="t-mono text-[10px] text-[color:var(--color-muted-2)]">
                            {t.challengeLabel.toUpperCase()}
                          </p>
                          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                            {p.challenge}
                          </p>
                        </div>
                        <div>
                          <p className="t-mono text-[10px] text-signal">
                            {t.solutionLabel.toUpperCase()}
                          </p>
                          <p className="mt-1 text-sm text-paper">
                            {p.solution}
                          </p>
                        </div>
                      </div>

                      {/* Métriques clés */}
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
                    </div>

                    {/* Pied de carte : Tags + Bouton d'action */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-hairline)] pt-6">
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <Pill key={tag}>{tag}</Pill>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveProject(p)}
                        className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] bg-white/[0.04] px-4 py-2 text-xs font-medium text-paper transition-all hover:border-signal hover:bg-signal hover:text-ink"
                      >
                        <span>{t.viewDetails}</span>
                        <span aria-hidden>→</span>
                      </button>
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
              <article
                onClick={() => setActiveProject(p)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-hairline-strong)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-indigo-deep">
                  <ProjectVisual
                    id={p.id}
                    name={p.name}
                    sector={p.sector}
                    city={p.city}
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
                    <h3 className="t-sub mt-2 text-lg text-paper">{p.name}.</h3>
                    <p className="mt-2 line-clamp-2 text-xs text-[color:var(--color-muted)] leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-[color:var(--color-hairline)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="t-mono text-[11px] text-[color:var(--color-muted-2)]">
                        {p.duration}
                      </span>
                      <span className="t-mono text-xs font-semibold text-signal group-hover:underline">
                        Détails →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------------------
          TIROIR / MODALE DE DÉTAIL D'ÉTUDE DE CAS (DEEP DIVE MODAL)
          ---------------------------------------------------------------------- */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
        >
          {/* Backdrop */}
          <div
            onClick={() => setActiveProject(null)}
            className="absolute inset-0 bg-ink/85 backdrop-blur-md transition-opacity"
            aria-hidden
          />

          {/* Fenêtre modale */}
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline-strong)] bg-ink shadow-2xl">
            {/* Header de la modale */}
            <div className="flex items-center justify-between border-b border-[color:var(--color-hairline)] bg-surface px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <Mark className="h-5 w-auto text-paper" accent="var(--color-signal)" accentOpacity={1} />
                <span className="t-mono text-xs text-[color:var(--color-muted)]">
                  {t.badge} · {activeProject.sector}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="t-mono rounded-[var(--radius-pill)] border border-[color:var(--color-hairline)] px-3 py-1.5 text-xs text-paper transition-colors hover:border-signal hover:text-signal"
              >
                ✕ {t.closeDetails}
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-10">
              {/* Entête du projet */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="t-mono rounded-[var(--radius-pill)] bg-signal px-3 py-1 text-xs font-bold text-ink">
                    {activeProject.status}
                  </span>
                  <span className="t-mono text-xs text-[color:var(--color-muted-2)]">
                    {activeProject.city} · {activeProject.year} · {activeProject.duration}
                  </span>
                </div>
                <h2 className="t-section mt-4 text-paper">{activeProject.name}.</h2>
                <p className="t-lead mt-3 text-paper/90 max-w-[55ch]">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Visuel immersif */}
              <div className="overflow-hidden rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface">
                <div className="aspect-[16/8] w-full">
                  <ProjectVisual
                    id={activeProject.id}
                    name={activeProject.name}
                    sector={activeProject.sector}
                    city={activeProject.city}
                    accentTone={activeProject.accentTone}
                  />
                </div>
              </div>

              {/* Métriques d'impact */}
              <div>
                <h4 className="t-mono text-xs text-signal mb-4">
                  {t.metricsLabel.toUpperCase()}
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  {activeProject.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-5"
                    >
                      <span className="t-num font-bold text-2xl text-signal">
                        {m.value}
                      </span>
                      <p className="t-mono mt-2 text-xs text-[color:var(--color-muted)]">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deux colonnes Défi & Solution */}
              <div className="grid gap-8 md:grid-cols-2">
                <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface/60 p-6">
                  <h4 className="t-mono text-xs text-[color:var(--color-muted-2)] mb-3">
                    {t.challengeLabel.toUpperCase()}
                  </h4>
                  <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                    {activeProject.challenge}
                  </p>
                </div>
                <div className="rounded-[var(--radius-tile)] border border-signal/30 bg-signal/[0.04] p-6">
                  <h4 className="t-mono text-xs text-signal mb-3">
                    {t.solutionLabel.toUpperCase()}
                  </h4>
                  <p className="text-sm text-paper leading-relaxed">
                    {activeProject.solution}
                  </p>
                </div>
              </div>

              {/* Livrables finaux */}
              <div>
                <h4 className="t-mono text-xs text-[color:var(--color-muted-2)] mb-4">
                  {t.deliverablesLabel.toUpperCase()}
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeProject.deliverables.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-[color:var(--color-hairline)] bg-surface/40 p-3.5 text-xs text-paper"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/20 text-signal font-bold text-[10px]">
                        ✓
                      </span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA dans la modale */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-gradient-to-r from-indigo-deep to-surface p-6 sm:p-8">
                <div>
                  <p className="text-base font-bold text-paper">
                    Un produit à lancer dans ce secteur ?
                  </p>
                  <p className="t-mono mt-1 text-xs text-[color:var(--color-muted)]">
                    Kickoff rapide · Boucles de 2 semaines · Zéro dépendance
                  </p>
                </div>
                <a
                  href={c.contact.booking}
                  className="t-mono shrink-0 rounded-[var(--radius-pill)] bg-signal px-6 py-3 text-xs font-bold text-ink transition-colors hover:bg-paper"
                >
                  {t.cta.button}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
