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
  accentOpacity = 0.45,
}: {
  className?: string;
  accent?: string;
  accentOpacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 349 298"
      className={className}
      role="img"
      aria-label="Programactor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M272 0C297.037 4.53501e-05 317.334 20.2965 317.334 45.3334V155.833C317.334 168.352 327.482 178.5 340 178.5H348.5L317.334 218.167H300.334C293.777 218.167 287.873 215.381 283.735 210.931C276.468 215.616 267.953 218.167 259.173 218.167H184.358C159.358 218.167 139.076 197.927 139.024 172.928L138.872 98.1651C138.848 86.1099 143.626 74.5405 152.151 66.0162L165.222 52.9452C173.723 44.4439 185.254 39.667 197.277 39.6667H238L209.667 0H272ZM238 56.6667C238 69.1852 227.852 79.3334 215.333 79.3334H201.452C188.933 79.3334 178.785 89.4816 178.785 102V155.833C178.785 168.352 188.933 178.5 201.452 178.5H255C267.519 178.5 277.667 168.352 277.667 155.833V62.3334C277.667 49.8149 267.519 39.6667 255 39.6667H238V56.6667Z"
        fill={accent}
        fillOpacity={accentOpacity}
      />
      <path
        d="M133.167 79.3334C158.204 79.3334 178.5 99.6298 178.5 124.667V199.389C178.5 211.412 173.724 222.943 165.222 231.445L152.111 244.556C143.61 253.057 132.079 257.834 120.056 257.834H79.3334V240.833C79.3334 228.315 89.4816 218.167 102 218.167H116.167C128.685 218.167 138.833 208.019 138.833 195.5V141.667C138.833 129.148 128.685 119 116.167 119H0L39.6667 79.3334H133.167Z"
        fill="currentColor"
      />
      <path
        d="M39.6671 235.167C39.6671 247.685 49.8153 257.833 62.3338 257.833L79.3334 257.834L79.3338 297.5H45.3338C20.2969 297.5 0.000418925 277.204 0.000421024 252.167L0.000428865 158.667L39.6671 119L39.6671 235.167Z"
        fill="currentColor"
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
