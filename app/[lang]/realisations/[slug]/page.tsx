import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent, LANGS, type Lang } from "@/lib/content";
import {
  getProjectBySlug,
  getPublishedProjects,
  getAllProjectSlugs,
} from "@/lib/projects-data";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Label, Mark, Pill, Reveal } from "@/components/ui";
import ProjectVisual from "@/components/ProjectVisual";
import ProjectGallery from "@/components/ProjectGallery";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  const params: { lang: string; slug: string }[] = [];

  for (const lang of LANGS) {
    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!LANGS.includes(lang as Lang)) return {};

  const l = lang as Lang;
  const project = await getProjectBySlug(slug, l);
  if (!project) return {};

  const title = `${project.name} · Étude de cas ${project.sector} — Programactor`;
  const description = `${project.tagline} Déploiement à ${project.city} (${project.year}). Recherche terrain, design UI et build par Programactor.`;
  const canonicalUrl = `https://programactor.pro/${l}/realisations/${slug}`;
  const coverImage = project.heroCoverImageUrl || project.cardCoverImageUrl || project.image || "/og-image.png";

  return {
    title,
    description,
    icons: { icon: "/mark.svg" },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: l === "fr" ? "fr_CM" : "en_GB",
      type: "article",
      images: [
        {
          url: coverImage.startsWith("http") ? coverImage : `https://programactor.pro${coverImage}`,
          width: 1000,
          height: 500,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `https://programactor.pro/fr/realisations/${slug}`,
        en: `https://programactor.pro/en/realisations/${slug}`,
      },
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;
  const c = getContent(l);
  const project = await getProjectBySlug(slug, l);

  if (!project) {
    notFound();
  }

  // Trouver le projet suivant pour la navigation
  const allProjects = await getPublishedProjects(l);
  const currentIndex = allProjects.findIndex((p) => p.id === project.id || p.key === project.key);
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0] || null;

  const isEn = l === "en";

  // Données structurées Schema.org pour le SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.tagline,
    description: project.challenge,
    image: project.heroCoverImageUrl || project.cardCoverImageUrl || "https://programactor.pro/og-image.png",
    author: {
      "@type": "Organization",
      name: "Programactor",
      url: "https://programactor.pro",
    },
    locationCreated: {
      "@type": "Place",
      name: project.city,
    },
    datePublished: `${project.year}-01-01`,
    keywords: project.tags.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Programactor",
        item: `https://programactor.pro/${l}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isEn ? "Work" : "Réalisations",
        item: `https://programactor.pro/${l}/realisations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `https://programactor.pro/${l}/realisations/${project.id || project.key}`,
      },
    ],
  };

  return (
    <>
      {/* Balise JSON-LD injectée pour Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Nav c={c} lang={l} />

      <main className="pt-28 md:pt-36">
        {/* ====================================================================
            1. HERO DE L'ÉTUDE DE CAS
            ==================================================================== */}
        <section className="relative overflow-hidden pb-10">
          <div className="shell relative z-10">
            {/* Fil d'Ariane */}
            <Reveal>
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
                <Link
                  href={`/${l}`}
                  className="t-mono text-[color:var(--color-muted-2)] transition-colors hover:text-paper"
                >
                  {isEn ? "Home" : "Accueil"}
                </Link>
                <span className="text-[color:var(--color-hairline-strong)]">/</span>
                <Link
                  href={`/${l}/realisations`}
                  className="t-mono text-[color:var(--color-muted-2)] transition-colors hover:text-paper"
                >
                  {isEn ? "Case studies" : "Réalisations"}
                </Link>
                <span className="text-[color:var(--color-hairline-strong)]">/</span>
                <Label className="text-xs">{project.sector}</Label>
              </div>
            </Reveal>

            {/* Titre & Accroche */}
            <div className="max-w-4xl">
              <Reveal delay={60}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="t-mono rounded-[var(--radius-pill)] bg-signal px-3 py-1 text-xs font-medium text-ink">
                    {project.status}
                  </span>
                  <span className="t-mono text-xs text-[color:var(--color-muted-2)]">
                    {project.city} · {project.year} · {project.duration}
                  </span>
                </div>
                <h1 className="t-display mt-4 text-paper">{project.name}.</h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="t-lead mt-6 max-w-[55ch] text-paper/90">
                  {project.tagline}
                </p>
              </Reveal>
            </div>

            {/* Bandeau de Métadonnées du Projet */}
            <Reveal delay={180}>
              <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-[color:var(--color-hairline)] bg-surface/40 p-4 sm:grid-cols-4 md:gap-6 md:p-6 backdrop-blur">
                <div>
                  <span className="t-mono text-[10px] text-[color:var(--color-muted-2)]">
                    {isEn ? "CLIENT" : "COMMANDITAIRE"}
                  </span>
                  <p className="mt-1 text-xs font-semibold text-paper truncate">
                    {project.client || (isEn ? "Confidential" : "Confidentiel")}
                  </p>
                </div>
                <div>
                  <span className="t-mono text-[10px] text-[color:var(--color-muted-2)]">
                    {isEn ? "SECTOR" : "SECTEUR"}
                  </span>
                  <p className="mt-1 text-xs font-semibold text-signal truncate">
                    {project.sector}
                  </p>
                </div>
                <div>
                  <span className="t-mono text-[10px] text-[color:var(--color-muted-2)]">
                    {isEn ? "TIMELINE" : "DURÉE DU SPRINT"}
                  </span>
                  <p className="mt-1 text-xs font-semibold text-paper">
                    {project.duration}
                  </p>
                </div>
                <div>
                  <span className="t-mono text-[10px] text-[color:var(--color-muted-2)]">
                    {isEn ? "DEPLOYMENT" : "DÉPLOIEMENT"}
                  </span>
                  <p className="mt-1 text-xs font-semibold text-paper truncate">
                    {project.city}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ================================================================
                2. COVER VISUEL HERO RATIO 1000×500 (2:1)
                ================================================================ */}
            <Reveal delay={240}>
              <div className="mt-10 overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline-strong)] bg-surface shadow-2xl">
                {/* Ratio 2:1 calibré 1000x500 */}
                <div className="relative aspect-[2/1] w-full overflow-hidden bg-indigo-deep">
                  <ProjectVisual
                    id={project.id}
                    name={project.name}
                    sector={project.sector}
                    city={project.city}
                    image={project.heroCoverImageUrl || project.cardCoverImageUrl || project.image}
                    accentTone={project.accentTone}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ====================================================================
            3. MÉTRIQUES CLÉS D'IMPACT
            ==================================================================== */}
        {project.metrics && project.metrics.length > 0 && (
          <section className="py-12 border-y border-[color:var(--color-hairline)] bg-surface/20">
            <div className="shell">
              <Reveal>
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-2 w-2 rounded-full bg-signal" />
                  <span className="t-mono text-xs text-signal">
                    {isEn ? "MEASURED FIELD IMPACT" : "IMPACT MESURÉ SUR LE TERRAIN"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-6 transition-all hover:border-signal/40"
                    >
                      <span className="t-num font-bold text-3xl md:text-4xl text-signal">
                        {m.value}
                      </span>
                      <p className="t-mono mt-2 text-xs text-[color:var(--color-muted)] leading-relaxed">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ====================================================================
            4. RÉCIT DÉTAILLÉ : LE DÉFI TERRAIN VS LA RÉPONSE PRODUIT
            ==================================================================== */}
        <section className="py-16 md:py-24">
          <div className="shell">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Le Défi Terrain */}
              <Reveal>
                <div className="h-full rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface/50 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm">⚠️</span>
                      <h3 className="t-mono text-xs font-medium text-[color:var(--color-muted-2)]">
                        {isEn ? "THE FIELD CHALLENGE" : "LE DÉFI TERRAIN"}
                      </h3>
                    </div>
                    <p className="text-base text-[color:var(--color-muted)] leading-relaxed whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-[color:var(--color-muted-2)]">
                    <span className="t-mono">Contraintes réseau & usage</span>
                    <span className="t-mono text-paper">3G / Informel / MoMo</span>
                  </div>
                </div>
              </Reveal>

              {/* La Réponse Produit */}
              <Reveal delay={100}>
                <div className="h-full rounded-[var(--radius-card)] border border-signal/30 bg-signal/[0.03] p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm">💡</span>
                      <h3 className="t-mono text-xs font-medium text-signal">
                        {isEn ? "THE PRODUCT ANSWER" : "LA RÉPONSE PRODUIT"}
                      </h3>
                    </div>
                    <p className="text-base text-paper leading-relaxed whitespace-pre-line">
                      {project.solution}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-signal/15 flex items-center justify-between text-xs text-signal">
                    <span className="t-mono">Ingénierie & Design UI</span>
                    <span className="t-mono font-medium">Offline-First ✓</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Livrables Finaux */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="mt-16">
                <Reveal>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-2 w-2 rounded-full bg-signal" />
                    <h3 className="t-mono text-xs text-[color:var(--color-muted-2)]">
                      {isEn ? "FINAL DELIVERABLES" : "LIVRABLES FINAUX"}
                    </h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {project.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-hairline)] bg-surface/60 p-5 text-sm text-paper"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/20 text-signal font-bold text-xs mt-0.5">
                          ✓
                        </span>
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================================
            5. GALERIE PHOTO HORIZONTALE EN DIRECT
            ==================================================================== */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="py-16 border-t border-[color:var(--color-hairline)] bg-surface/10">
            <div className="shell">
              <Reveal>
                <ProjectGallery
                  images={project.gallery}
                  projectName={project.name}
                />
              </Reveal>
            </div>
          </section>
        )}

        {/* ====================================================================
            6. NAVIGATION PROJET SUIVANT & CTA
            ==================================================================== */}
        <section className="py-20 border-t border-[color:var(--color-hairline)]">
          <div className="shell space-y-12">
            {/* Bannière CTA Métier */}
            <Reveal>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-[var(--radius-card)] border border-[color:var(--color-hairline-strong)] bg-gradient-to-r from-indigo-deep via-surface to-surface p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <span className="t-mono text-xs text-signal font-medium">
                    {isEn ? "PROJECT SCOPING" : "CADRAGE PROJET"}
                  </span>
                  <h3 className="t-section mt-2 text-paper">
                    {isEn
                      ? "Have a product to launch in this market?"
                      : "Un produit à concevoir dans ce secteur ?"}
                  </h3>
                  <p className="t-mono mt-2 text-xs text-[color:var(--color-muted)]">
                    {isEn
                      ? "2-week iterations · Zero friction · Shipped and tested live"
                      : "Boucles de 2 semaines · Zéro dépendance · En ligne sur vos vraies données"}
                  </p>
                </div>
                <div className="relative z-10 flex flex-wrap items-center gap-4">
                  <a
                    href={c.contact.booking}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-signal px-7 py-4 text-xs font-bold text-ink transition-colors hover:bg-paper"
                  >
                    <span>{isEn ? "Book scoping call" : "Réserver un appel"}</span>
                    <span aria-hidden>→</span>
                  </a>
                  <Link
                    href={`/${l}/realisations`}
                    className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-white/20 bg-surface px-6 py-4 text-xs text-paper transition-colors hover:border-signal"
                  >
                    <span>{isEn ? "All case studies" : "Toutes les réalisations"}</span>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Lien vers le projet suivant */}
            {nextProject && nextProject.id !== project.id && (
              <Reveal delay={80}>
                <div className="flex items-center justify-between border-t border-[color:var(--color-hairline)] pt-8">
                  <Link
                    href={`/${l}/realisations`}
                    className="t-mono inline-flex items-center gap-2 text-xs text-[color:var(--color-muted-2)] hover:text-paper"
                  >
                    <span aria-hidden>←</span>
                    <span>{isEn ? "Back to all work" : "Retour au portfolio"}</span>
                  </Link>
                  <Link
                    href={`/${l}/realisations/${nextProject.id}`}
                    className="group inline-flex items-center gap-3 text-right"
                  >
                    <div>
                      <p className="t-mono text-[10px] text-[color:var(--color-muted-2)]">
                        {isEn ? "NEXT CASE STUDY" : "ÉTUDE SUIVANTE"}
                      </p>
                      <p className="text-sm font-semibold text-paper group-hover:text-signal transition-colors">
                        {nextProject.name} →
                      </p>
                    </div>
                  </Link>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </main>

      <Footer c={c} lang={l} />
    </>
  );
}
