"use client";

import React, { useEffect, useRef, useState } from "react";
import { PlayIcon } from "hugeicons-react";

/* ==========================================================================
   MARK — logo officiel Programactor (public/mark.svg)
   Construction vectorielle officielle avec support des props de
   personnalisation (className, accent, accentOpacity).
   ========================================================================== */
export function Mark({
  className = "",
  accent = "currentColor",
  accentOpacity = 1,
}: {
  className?: string;
  accent?: string;
  accentOpacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 263 263"
      className={className}
      role="img"
      aria-label="Programactor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M171.156 0C182.163 0 192.004 7.83275 195.811 19.624L261.355 222.624C267.679 242.21 254.984 263 236.7 263H202.616C180.473 263 165.96 239.832 175.623 219.909L196.97 175.894C204.867 159.611 197.606 140.02 180.976 132.884C172.657 129.314 165.211 126.144 162.611 125.105C155.636 122.314 152.851 114.643 152.851 114.643C152.851 114.643 149.708 116.38 149.708 111.5C149.709 106.621 152.851 114.642 155.994 95.8008C156.064 95.7806 164.692 93.2717 162.956 73.126H160.861L160.874 73.1143C160.874 73.1143 166.111 51.4867 160.874 44.1543C155.636 36.8344 153.553 31.9545 142.038 28.4609C130.522 24.9673 134.717 25.6631 126.343 26.0205C117.97 26.378 110.989 30.9074 110.989 33.3535C110.947 33.3563 105.744 33.7067 103.669 35.793C101.574 37.8879 98.0865 47.6477 98.0864 50.0879C98.0864 52.5279 99.83 68.9424 101.574 72.4238L99.4975 73.126C97.7476 93.3544 106.46 95.8008 106.46 95.8008C109.603 114.642 112.744 106.621 112.745 111.5C112.745 116.36 109.629 114.657 109.603 114.643C109.603 114.643 106.817 122.314 99.8422 125.105C97.2426 126.146 89.7978 129.317 81.4799 132.886C64.8491 140.021 57.5861 159.612 65.4819 175.896L86.8242 219.911C96.4848 239.835 81.9724 263 59.8302 263H26.2993C8.08189 263 -4.60782 242.351 1.5903 222.793L34.0737 120.293C37.8384 108.414 47.7177 100.5 58.7827 100.5H80.8579L65.7905 53.835C57.3586 27.7198 74.2856 0.000174775 98.6645 0H171.156Z"
        fill={accent || "currentColor"}
        fillOpacity={accentOpacity}
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
  // SSR & Crawlers fallback : rendu direct de la vraie valeur dans le HTML brut
  const [value, setValue] = useState(to);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (raw || animated) return;
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Réinitialise à 0 côté client uniquement pour déclencher l'animation visuelle
    setValue(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setAnimated(true);
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, raw, animated]);

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
      <PlayIcon size={11} className="text-signal fill-signal" aria-hidden />
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
