"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark, Wordmark } from "./ui";
import type { Content, Lang } from "@/lib/content";
import { Menu01Icon, Cancel01Icon, ArrowRight01Icon } from "hugeicons-react";
import { track } from "@/lib/analytics";

export default function Nav({ c, lang }: { c: Content; lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isRealisations = pathname?.includes("/realisations");
  const isXpreSite = pathname?.includes("/xpresite");
  const isSubpage = isRealisations || isXpreSite;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquer le scroll d'arrière-plan quand le menu mobile est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Fermer le menu mobile lors d'un appui sur Échap
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const other: Lang = lang === "fr" ? "en" : "fr";
  const otherLangHref = isRealisations
    ? `/${other}/realisations`
    : isXpreSite
    ? `/${other}/xpresite`
    : `/${other}`;

  const getLinkHref = (rawHref: string) => {
    if (rawHref === "#realisations") {
      return `/${lang}/realisations`;
    }
    if (rawHref === "#xpresite") {
      return `/${lang}/xpresite`;
    }
    if (rawHref.startsWith("#")) {
      return isSubpage ? `/${lang}${rawHref}` : rawHref;
    }
    return rawHref;
  };

  const handleMobileNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, rawHref: string) => {
      setOpen(false);

      // Si ancre sur la même page (ex: #services sur l'accueil)
      if (!isSubpage && rawHref.startsWith("#")) {
        e.preventDefault();
        const targetId = rawHref.replace("#", "");
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }, 80);
        }
      }
    },
    [isSubpage]
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        open
          ? "border-b border-[color:var(--color-hairline-strong)] bg-ink"
          : scrolled
          ? "border-b border-[color:var(--color-hairline)] bg-ink/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-[68px] items-center justify-between gap-6">
        {/* Marque */}
        <Link
          href={`/${lang}`}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Mark className="h-[18px] w-auto text-paper" accent="var(--color-signal)" accentOpacity={1} />
          <Wordmark className="text-[17px] leading-none" />
          <span className="t-mono ml-2 hidden text-[color:var(--color-muted-2)] lg:inline">
            {c.nav.tagline}
          </span>
        </Link>

        {/* Liens desktop */}
        <nav className="hidden items-center gap-8 lg:flex">
          {c.nav.links.map((l) => {
            const href = getLinkHref(l.href);
            const isCurrent =
              (l.href === "#realisations" && isRealisations) ||
              (l.href === "#xpresite" && isXpreSite);
            return (
              <a
                key={l.href}
                href={href}
                className={`t-mono transition-colors ${
                  isCurrent
                    ? "text-signal font-medium"
                    : "text-[color:var(--color-muted)] hover:text-paper"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Sélecteur de langue desktop */}
          <div className="t-mono hidden items-center gap-1 text-[color:var(--color-muted-2)] sm:flex">
            <span className="text-paper">{lang.toUpperCase()}</span>
            <span aria-hidden>/</span>
            <Link
              href={otherLangHref}
              className="transition-colors hover:text-paper"
              aria-label={other === "fr" ? "Version française" : "English version"}
            >
              {other.toUpperCase()}
            </Link>
          </div>

          <a
            href={c.contact.booking}
            onClick={() => track("cta_header_reserver", { surface: "header" })}
            className="t-mono rounded-[var(--radius-pill)] bg-signal px-4 py-[9px] font-medium text-ink transition-colors hover:bg-paper"
          >
            <span className="sm:hidden">{c.nav.ctaShort}</span>
            <span className="hidden sm:inline">{c.nav.cta}</span>
          </a>

          {/* Bouton Hamburger Mobile amélioré */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="t-mono flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline)] bg-white/[0.04] px-3 py-1.5 text-xs text-paper transition-all hover:border-signal hover:text-signal lg:hidden"
            aria-expanded={open}
            aria-label={open ? c.nav.close : c.nav.menu}
          >
            <span className="text-signal font-bold" aria-hidden>
              {open ? <Cancel01Icon size={14} /> : <Menu01Icon size={14} />}
            </span>
            <span>{open ? c.nav.close : c.nav.menu}</span>
          </button>
        </div>
      </div>

      {/* Menu mobile plein écran */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-[68px] z-40 flex flex-col justify-between overflow-y-auto overscroll-contain bg-ink lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="shell flex flex-col py-8">
            {/* Liens de navigation */}
            <nav className="flex flex-col">
              {c.nav.links.map((l) => {
                const href = getLinkHref(l.href);
                const isCurrent =
                  (l.href === "#realisations" && isRealisations) ||
                  (l.href === "#xpresite" && isXpreSite);
                return (
                  <a
                    key={l.href}
                    href={href}
                    onClick={(e) => handleMobileNavClick(e, l.href)}
                    className={`t-sub flex items-center justify-between border-b border-[color:var(--color-hairline)] py-5 text-xl transition-colors ${
                      isCurrent ? "text-signal font-bold" : "text-paper hover:text-signal"
                    }`}
                  >
                    <span>{l.label}</span>
                    <ArrowRight01Icon size={16} className="text-[color:var(--color-muted-2)]" />
                  </a>
                );
              })}
            </nav>

            {/* Actions et contact */}
            <div className="mt-10 flex flex-col gap-6">
              <a
                href={c.contact.booking}
                onClick={() => {
                  track("cta_header_reserver", { surface: "menu_mobile" });
                  setOpen(false);
                }}
                className="flex items-center justify-center rounded-[var(--radius-pill)] bg-signal px-6 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-paper"
              >
                {c.nav.cta}
              </a>

              {/* Barre langue & réseaux */}
              <div className="flex items-center justify-between border-t border-[color:var(--color-hairline)] pt-6">
                <div className="t-mono flex items-center gap-2">
                  <span className="text-xs text-[color:var(--color-muted-2)]">Langue :</span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-paper font-semibold">
                    {lang.toUpperCase()}
                  </span>
                  <Link
                    href={otherLangHref}
                    onClick={() => setOpen(false)}
                    className="rounded px-2 py-0.5 text-xs text-[color:var(--color-muted)] transition-colors hover:text-paper"
                  >
                    {other.toUpperCase()}
                  </Link>
                </div>

                <div className="t-mono text-xs text-[color:var(--color-muted-2)]">
                  {c.cities}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
