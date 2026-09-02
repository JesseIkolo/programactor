"use client";

import React, { useEffect, useRef, useState } from "react";

/* ==========================================================================
   MARK — logo Programactor
   ⚠️  RECONSTRUCTION GÉOMÉTRIQUE PROVISOIRE.
   Le PDF de charte n'embarque le mark qu'en bitmap 51×51, non vectorisable.
   Remplace cette géométrie par le fichier officiel
   (Vessa · « Primary logo · SVG · 643×643 ») — et public/mark.svg avec.
   Construction respectée : deux traits identiques en symétrie de rotation 180°.
   ========================================================================== */
export function Mark({
  className = "",
  accent = "currentColor",
  accentOpacity = 0.45,
}: {
  className?: string;
  accent?: string;
  accentOpacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 46 44"
      className={className}
      role="img"
      aria-label="Programactor"
      fill="none"
    >
      <path
        d="M43 3 V27 H23 V11 H31"
        stroke={accent}
        strokeOpacity={accentOpacity}
        strokeWidth={6}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <path
        d="M3 41 V17 H23 V33 H15"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-display)] font-bold tracking-[-0.03em] ${className}`}
    >
      Programactor
    </span>
  );
}

/* ==========================================================================
   REVEAL — apparition au scroll (respecte prefers-reduced-motion via CSS)
   ========================================================================== */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ==========================================================================
   COUNTER — compteur animé
   ========================================================================== */
export function Counter({
  to,
  suffix = "",
  raw = false,
  className = "",
}: {
  to: number;
  suffix?: string;
  raw?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(raw ? to : 0);

  useEffect(() => {
    if (raw) return;
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 1300;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, raw]);

  return (
    <span ref={ref} className={`t-num ${className}`}>
      {value}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   PRIMITIVES
   ========================================================================== */
export function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`t-mono flex items-center gap-2 text-[color:var(--color-muted)] ${className}`}>
      <span aria-hidden className="text-signal">
        ▶
      </span>
      <span>{children}</span>
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="t-mono inline-flex items-center rounded-[var(--radius-pill)] border border-[color:var(--color-hairline)] bg-white/[0.03] px-3 py-[7px] text-[color:var(--color-muted)]">
      {children}
    </span>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "signal";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 py-[14px] text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200";
  const styles = {
    primary:
      "bg-paper text-ink hover:bg-signal",
    signal: "bg-signal text-ink hover:bg-paper",
    ghost:
      "border border-[color:var(--color-hairline-strong)] text-paper hover:border-signal hover:text-signal",
  }[variant];
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}

/* ==========================================================================
   MARQUEE
   ========================================================================== */
export function Marquee({
  items,
  slow = false,
  tone = "signal",
}: {
  items: string[];
  slow?: boolean;
  tone?: "signal" | "line";
}) {
  const row = [...items, ...items];
  const isSignal = tone === "signal";
  return (
    <div
      className={`relative w-full overflow-hidden border-y ${
        isSignal
          ? "border-signal bg-signal text-ink"
          : "border-[color:var(--color-hairline)] text-[color:var(--color-muted)]"
      }`}
    >
      <div className={`marquee-track ${slow ? "marquee-slow" : ""} py-3`}>
        {row.map((item, i) => (
          <span key={i} className="t-mono flex shrink-0 items-center gap-8 px-8">
            {item}
            <span aria-hidden className="opacity-40">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   SECTION — en-tête à deux colonnes (colonne gauche vide, comme la référence)
   ========================================================================== */
export function SectionHead({
  label,
  title,
  lead,
  action,
}: {
  label: string;
  title: React.ReactNode;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-16">
      <div className="hidden md:block" />
      <div>
        <Reveal>
          <Label className="mb-8">{label}</Label>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="t-section max-w-[16ch]">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={120}>
            <p className="t-lead mt-7 max-w-[46ch] text-[color:var(--color-muted)]">
              {lead}
            </p>
          </Reveal>
        )}
        {action && (
          <Reveal delay={180}>
            <div className="mt-9">{action}</div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
