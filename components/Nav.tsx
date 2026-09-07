"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark, Wordmark } from "./ui";
import type { Content, Lang } from "@/lib/content";

export default function Nav({ c, lang }: { c: Content; lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isRealisations = pathname?.includes("/realisations");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const other: Lang = lang === "fr" ? "en" : "fr";
  const otherLangHref = isRealisations ? `/${other}/realisations` : `/${other}`;

  const getLinkHref = (rawHref: string) => {
    if (rawHref === "#realisations") {
      return `/${lang}/realisations`;
    }
    if (rawHref.startsWith("#")) {
      return isRealisations ? `/${lang}${rawHref}` : rawHref;
    }
    return rawHref;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-[color:var(--color-hairline)] bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[68px] items-center justify-between gap-6">
        {/* Marque */}
        <Link href={`/${lang}`} className="flex items-center gap-3">
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
            const isCurrent = l.href === "#realisations" && isRealisations;
            return (
              <a
                key={l.href}
                href={href}
                className={`t-mono transition-colors ${
                  isCurrent
                    ? "text-signal font-semibold"
                    : "text-[color:var(--color-muted)] hover:text-paper"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Sélecteur de langue */}
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
            className="t-mono hidden rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] px-4 py-[9px] text-paper transition-colors hover:border-signal hover:text-signal md:inline-block"
          >
            {c.nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="t-mono flex items-center gap-2 text-paper lg:hidden"
            aria-expanded={open}
            aria-label={open ? c.nav.close : c.nav.menu}
          >
            <span className="text-signal" aria-hidden>
              ▶
            </span>
            {open ? c.nav.close : c.nav.menu}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="fixed inset-0 top-[68px] z-40 bg-ink lg:hidden">
          <div className="shell flex flex-col gap-1 py-10">
            {c.nav.links.map((l) => {
              const href = getLinkHref(l.href);
              return (
                <a
                  key={l.href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="t-sub border-b border-[color:var(--color-hairline)] py-5"
                >
                  {l.label}
                </a>
              );
            })}
            <div className="mt-8 flex items-center gap-4">
              <a
                href={c.contact.booking}
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-[var(--radius-pill)] bg-signal px-6 py-[14px] text-[15px] font-medium text-ink"
              >
                {c.nav.cta}
              </a>
              <Link href={otherLangHref} className="t-mono text-[color:var(--color-muted)]">
                {other.toUpperCase()}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
