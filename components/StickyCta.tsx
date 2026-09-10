"use client";

/* ==========================================================================
   STICKY CTA — accès permanent au contact.

   Mobile : barre d'action en bas d'écran (Réserver + WhatsApp).
   Desktop : pastille WhatsApp flottante en bas à droite.

   Les deux apparaissent une fois le hero passé, pour ne pas doubler les
   boutons déjà visibles en haut de page.
   ========================================================================== */

import { useEffect, useState } from "react";
import { WhatsappIcon } from "hugeicons-react";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/whatsapp";
import type { Lang } from "@/lib/content";

export default function StickyCta({
  lang,
  bookingHref,
  bookingLabel,
}: {
  lang: Lang;
  bookingHref: string;
  bookingLabel: string;
}) {
  const [shown, setShown] = useState(false);
  const wa = waLink(lang, "agence");

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ---------- Mobile : barre d'action ---------- */}
      <div
        aria-hidden={!shown}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-hairline-strong)] bg-ink/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${
          shown ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch gap-2 px-4 py-3">
          <a
            href={bookingHref}
            onClick={() => track("cta_sticky_reserver", { surface: "mobile" })}
            tabIndex={shown ? 0 : -1}
            className="flex flex-1 items-center justify-center rounded-[var(--radius-pill)] bg-signal px-5 py-[13px] text-[15px] font-bold text-ink transition-colors hover:bg-paper"
          >
            {bookingLabel}
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("cta_whatsapp", { surface: "mobile_sticky" })}
            tabIndex={shown ? 0 : -1}
            aria-label="WhatsApp"
            className="flex items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] px-5 py-[13px] text-[15px] font-medium text-paper transition-colors hover:border-signal hover:text-signal"
          >
            <WhatsappIcon size={17} aria-hidden />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ---------- Desktop : pastille WhatsApp ---------- */}
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("cta_whatsapp", { surface: "desktop_float" })}
        aria-hidden={!shown}
        tabIndex={shown ? 0 : -1}
        className={`fixed bottom-7 right-7 z-40 hidden items-center gap-2.5 rounded-[var(--radius-pill)] border border-signal/40 bg-signal px-5 py-[13px] text-[15px] font-bold text-ink shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:bg-paper md:flex ${
          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <WhatsappIcon size={18} aria-hidden />
        <span>WhatsApp</span>
      </a>

      {/* Réserve la hauteur de la barre mobile pour ne pas masquer le pied de page */}
      <div aria-hidden className="h-[76px] md:hidden" />
    </>
  );
}
