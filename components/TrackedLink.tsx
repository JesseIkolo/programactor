"use client";

/* ==========================================================================
   TRACKED LINK — un <Link> qui déclare un point de conversion au clic.
   Permet de mesurer un lien situé dans un composant serveur, sans faire
   passer toute la section côté client.
   ========================================================================== */

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type ConversionEvent, type TrackProps } from "@/lib/analytics";

export default function TrackedLink({
  href,
  event,
  eventProps,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  event: ConversionEvent;
  eventProps?: TrackProps;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={() => track(event, eventProps)}
    >
      {children}
    </Link>
  );
}
