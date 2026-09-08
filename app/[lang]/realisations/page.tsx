import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent, LANGS, type Lang } from "@/lib/content";
import { getPublishedProjects } from "@/lib/projects-data";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Label, Reveal } from "@/components/ui";
import ProjectShowcase from "@/components/ProjectShowcase";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) return {};
  const c = getContent(lang as Lang);
  const t = c.realisationsPage;

  return {
    title: t.meta.title,
    description: t.meta.description,
    icons: { icon: "/mark.svg" },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "fr" ? "fr_CM" : "en_GB",
      type: "website",
    },
    alternates: {
      canonical: `https://programactor.pro/${lang}/realisations`,
      languages: {
        fr: "https://programactor.pro/fr/realisations",
        en: "https://programactor.pro/en/realisations",
      },
    },
  };
}

export default async function RealisationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;
  const c = getContent(l);
  const t = c.realisationsPage;
  const projects = await getPublishedProjects(l);

  return (
    <>
      <Nav c={c} lang={l} />

      <main className="pt-28 md:pt-36">
        {/* ====================================================================
            HERO DE LA PAGE RÉALISATIONS
            ==================================================================== */}
        <section className="relative overflow-hidden pb-12">
          {/* Grille technique de fond subtile */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden
          />

          <div className="shell relative z-10">
            {/* Fil d'ariane / retour */}
            <Reveal>
              <div className="mb-8 flex items-center gap-3">
                <Link
                  href={`/${l}`}
                  className="t-mono inline-flex items-center gap-2 text-xs text-[color:var(--color-muted-2)] transition-colors hover:text-paper"
                >
                  <span aria-hidden>←</span>
                  <span>{t.backHome}</span>
                </Link>
                <span className="text-[color:var(--color-hairline-strong)]" aria-hidden>
                  /
                </span>
                <Label className="text-xs">{t.badge}</Label>
              </div>
            </Reveal>

            {/* Titre avec surlignage Signal (règle de charte : un mot à la fois) */}
            <div className="max-w-4xl">
              <Reveal delay={60}>
                <h1 className="t-display text-paper">
                  {t.titleBefore}
                  <span className="mark-word">{t.titleMark}</span>
                  {t.titleAfter}
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="t-lead mt-8 max-w-[54ch] text-[color:var(--color-muted)]">
                  {t.lead}
                </p>
              </Reveal>
            </div>

            {/* Statistiques rapides de production */}
            <Reveal delay={180}>
              <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-[color:var(--color-hairline)] pt-8 md:gap-16">
                <div>
                  <span className="t-num font-bold text-2xl text-paper md:text-3xl">
                    12
                  </span>
                  <span className="t-mono ml-2 text-xs text-[color:var(--color-muted-2)]">
                    {l === "fr" ? "produits livrés" : "products shipped"}
                  </span>
                </div>
                <div>
                  <span className="t-num font-bold text-2xl text-signal md:text-3xl">
                    100%
                  </span>
                  <span className="t-mono ml-2 text-xs text-[color:var(--color-muted-2)]">
                    {l === "fr" ? "en ligne & testés" : "live & in use"}
                  </span>
                </div>
                <div>
                  <span className="t-num font-bold text-2xl text-paper md:text-3xl">
                    15j
                  </span>
                  <span className="t-mono ml-2 text-xs text-[color:var(--color-muted-2)]">
                    {l === "fr" ? "kickoff au premier écran" : "kickoff to first test"}
                  </span>
                </div>
                <div>
                  <span className="t-num font-bold text-2xl text-paper md:text-3xl">
                    3
                  </span>
                  <span className="t-mono ml-2 text-xs text-[color:var(--color-muted-2)]">
                    {l === "fr" ? "pays couverts" : "countries running"}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ====================================================================
            EXPLORATEUR ET ÉTUDES DE CAS
            ==================================================================== */}
        <section className="pb-24">
          <ProjectShowcase c={c} initialProjects={projects} />
        </section>

        {/* ====================================================================
            BANNIÈRE MÉTHODE : LA PROMESSE TERRAIN
            ==================================================================== */}
        <section className="border-t border-[color:var(--color-hairline)] py-20 md:py-28 bg-surface/30">
          <div className="shell">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <Reveal>
                  <Label className="mb-6">{t.methodBanner.label}</Label>
                </Reveal>
                <Reveal delay={60}>
                  <h2 className="t-section text-paper">
                    {t.methodBanner.title}
                  </h2>
                </Reveal>
                <Reveal delay={120}>
                  <p className="t-lead mt-6 max-w-[48ch] text-[color:var(--color-muted)]">
                    {t.methodBanner.body}
                  </p>
                </Reveal>
              </div>
              <div className="flex md:justify-end">
                <Reveal delay={180}>
                  <Link
                    href={`/${l}#methode`}
                    className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] bg-ink px-6 py-4 text-xs font-semibold text-paper transition-all hover:border-signal hover:text-signal"
                  >
                    <span>{t.methodBanner.cta}</span>
                    <span aria-hidden>→</span>
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CALL TO ACTION FINAL
            ==================================================================== */}
        <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-b from-transparent to-surface/80">
          <div className="shell">
            <div className="rounded-[var(--radius-card)] border border-[color:var(--color-hairline-strong)] bg-indigo-deep p-8 md:p-16 lg:p-20 relative overflow-hidden">
              <div className="grain pointer-events-none absolute inset-0 bg-indigo opacity-80" />

              <div className="relative z-10 max-w-2xl">
                <Reveal>
                  <Label className="mb-8 text-signal">▶ {t.cta.label}</Label>
                </Reveal>
                <Reveal delay={60}>
                  <h2 className="t-section text-paper">
                    {t.cta.titleBefore}
                    <span className="mark-word text-ink">{t.cta.titleMark}</span>
                    {t.cta.titleAfter}
                  </h2>
                </Reveal>
                <Reveal delay={120}>
                  <p className="t-lead mt-6 text-paper/85">
                    {t.cta.body}
                  </p>
                </Reveal>
                <Reveal delay={180}>
                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <a
                      href={c.contact.booking}
                      className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-signal px-7 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-paper"
                    >
                      {t.cta.button}
                    </a>
                    <a
                      href={`mailto:${c.contact.email}`}
                      className="t-mono inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-white/25 px-6 py-4 text-xs text-paper transition-colors hover:border-paper"
                    >
                      {c.contact.email}
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer c={c} lang={l} />
    </>
  );
}
