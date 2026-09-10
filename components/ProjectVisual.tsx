"use client";

import { useState } from "react";
import { Mark } from "./ui";

interface ProjectVisualProps {
  id: string;
  name: string;
  sector: string;
  city: string;
  image?: string;
  accentTone?: "indigo" | "signal" | "surface";
  className?: string;
}

export default function ProjectVisual({
  id,
  name,
  sector,
  city,
  image,
  accentTone = "indigo",
  className = "",
}: ProjectVisualProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Si une image est fournie et n'a pas échoué au chargement
  if (image && !imageError) {
    const webpSrc = image.endsWith(".webp")
      ? image
      : image.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    return (
      <div className={`relative h-full w-full overflow-hidden bg-indigo-deep ${className}`}>
        {/* Skeleton placeholder pendant le chargement */}
        {!imageLoaded && (
          <div
            className="absolute inset-0 animate-pulse bg-gradient-to-r from-surface via-white/5 to-surface"
            aria-hidden="true"
          />
        )}
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      </div>
    );
  }

  const cleanId = (id || "").toLowerCase();
  const cleanSector = (sector || "").toLowerCase();

  return (
    <div
      className={`grain relative flex h-full w-full select-none items-center justify-center overflow-hidden border-b border-[color:var(--color-hairline)] bg-gradient-to-br from-[#12133b] via-[#0e0e1e] to-surface p-6 md:p-8 ${className}`}
    >
      {/* Filigrane Logo Programactor */}
      <div className="pointer-events-none absolute -right-6 -top-6 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
        <Mark
          className="h-44 w-auto text-white"
          accent="var(--color-signal)"
          accentOpacity={0.6}
        />
      </div>

      {/* Grille technique de fond */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      {/* Rendu spécifique par projet */}
      <div className="relative z-10 flex w-full max-w-[340px] flex-col items-center">
        {/* 1. Bimaround & Beauté / POS */}
        {(cleanId.includes("bimaround") || cleanId.includes("beauty") || cleanSector.includes("beaut")) && (
          <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                <span className="t-mono text-[11px] text-paper">Bimaround POS · Salon</span>
              </div>
              <span className="t-mono rounded bg-signal/20 px-2 py-0.5 text-[10px] text-signal font-semibold">LIVE CAISSE</span>
            </div>
            <div className="my-3 rounded-xl border border-white/5 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-paper">Coupe VIP & Soin Barbe</p>
                  <p className="t-mono text-[10px] text-[color:var(--color-muted-2)]">Fauteuil 02 · Styliste Eric</p>
                </div>
                <div className="text-right">
                  <p className="t-num text-sm font-bold text-signal">8 500 FCFA</p>
                  <span className="t-mono text-[9px] text-paper/80">Cash + MoMo</span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
                <span className="t-mono text-[color:var(--color-muted)]">Split Commission</span>
                <span className="t-mono text-paper font-medium">Coiffeur 40% · Salon 60%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="t-mono text-signal">💬 Rappel WhatsApp prêt</span>
              <span className="t-mono text-[color:var(--color-muted-2)]">&lt; 5 min clôture</span>
            </div>
          </div>
        )}

        {/* 2. Fintech & MoMo */}
        {cleanId.includes("fintech") && (
          <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                <span className="t-mono text-[11px] text-paper">MoMo / OM Gateway</span>
              </div>
              <span className="t-mono text-[10px] text-[color:var(--color-muted-2)]">OFFLINE-FIRST</span>
            </div>
            <div className="my-4 flex items-center justify-between rounded-xl bg-white/[0.04] p-3">
              <div>
                <p className="t-mono text-[10px] text-[color:var(--color-muted-2)]">MONTANT ENCAISSÉ</p>
                <p className="t-num font-bold text-lg text-paper">25 000 FCFA</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-signal/30 bg-signal/10 text-signal">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[color:var(--color-muted)]">
              <span className="t-mono">QR Code généré</span>
              <span className="t-mono text-signal">Audio bilingue prêt ▶</span>
            </div>
          </div>
        )}

        {/* 3. Logistique Coursier */}
        {cleanId.includes("logistique") && (
          <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="t-mono text-[11px] text-paper">Dispatch Coursier</span>
              <span className="t-mono rounded bg-signal/20 px-2 py-0.5 text-[10px] text-signal">Libreville</span>
            </div>
            <div className="my-4 space-y-2">
              <div className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-signal" />
                <div>
                  <p className="t-mono text-[10px] text-[color:var(--color-muted-2)]">REPÈRE DÉPART</p>
                  <p className="text-xs font-medium text-paper">Carrefour Gigi · Pharmacie</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/40" />
                <div>
                  <p className="t-mono text-[10px] text-[color:var(--color-muted-2)]">DESTINATION CLIENT</p>
                  <p className="text-xs font-medium text-paper">Face École Publique Batavéa</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[color:var(--color-muted)]">
              <span className="t-mono">Lien SMS client actif</span>
              <span className="t-mono text-paper">12 min restant</span>
            </div>
          </div>
        )}

        {/* 4. Santé RDV */}
        {cleanId.includes("sante") && (
          <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="t-mono text-[11px] text-paper">Consultation Réservée</span>
              <span className="t-mono text-[10px] text-signal">● Confirmé</span>
            </div>
            <div className="my-4 rounded-xl border border-white/5 bg-white/[0.04] p-3.5">
              <p className="text-sm font-semibold text-paper">Dr. E. Ngando · Pédiatrie</p>
              <p className="t-mono mt-1 text-[11px] text-[color:var(--color-muted-2)]">Mardi · 09:30 · Salle 4</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                <span className="t-mono text-[10px] text-[color:var(--color-muted)]">Acompte MoMo</span>
                <span className="t-num font-bold text-xs text-signal">5 000 FCFA reçu</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="t-mono text-[color:var(--color-muted-2)]">Rappel WhatsApp</span>
              <span className="t-mono text-paper">J-1 programmé</span>
            </div>
          </div>
        )}

        {/* 5. Commerce Catalogue */}
        {cleanId.includes("commerce") && (
          <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="t-mono text-[11px] text-paper">Catalogue WhatsApp</span>
              <span className="t-mono text-[10px] text-signal">&lt; 1s sur 3G</span>
            </div>
            <div className="my-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-indigo flex items-center justify-center text-paper font-bold text-sm">
                BAG
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-semibold text-paper">Sac Cuir Artisanal</p>
                <p className="t-num text-xs font-bold text-signal">18 500 FCFA</p>
                <p className="t-mono text-[10px] text-[color:var(--color-muted-2)]">En stock · 4 restants</p>
              </div>
            </div>
            <div className="rounded-full bg-signal px-3 py-1.5 text-center text-[11px] font-bold text-ink">
              Envoyer la commande sur WhatsApp 💬
            </div>
          </div>
        )}

        {/* 6. Agritech */}
        {cleanId.includes("agritech") && (
          <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="t-mono text-[11px] text-paper">Pesée Cacao · Coopérative</span>
              <span className="t-mono rounded bg-white/10 px-2 py-0.5 text-[10px] text-paper">QR Sack #0492</span>
            </div>
            <div className="my-4 rounded-xl border border-white/5 bg-white/[0.04] p-3">
              <div className="flex items-baseline justify-between">
                <span className="t-mono text-[10px] text-[color:var(--color-muted-2)]">POIDS NET LOT</span>
                <span className="t-num font-bold text-xl text-signal">64.5 KG</span>
              </div>
              <p className="t-mono mt-1 text-[10px] text-[color:var(--color-muted-2)]">Qualité Grade 1 · Humidité 7.2%</p>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[color:var(--color-muted)]">
              <span className="t-mono text-signal">● Stocké localement</span>
              <span className="t-mono">Sync auto en zone 3G</span>
            </div>
          </div>
        )}

        {/* 7. Education */}
        {cleanId.includes("education") && (
          <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="t-mono text-[11px] text-paper">Audio Micro-Lesson</span>
              <span className="t-mono text-[10px] text-signal">3 min · 450 Ko</span>
            </div>
            <div className="my-4 rounded-xl border border-white/5 bg-white/[0.04] p-3">
              <p className="text-xs font-semibold text-paper">Module 03 : Négociation B2B</p>
              <div className="mt-3 flex h-6 items-center justify-between gap-[3px]">
                {[4, 12, 18, 8, 22, 14, 24, 16, 20, 10, 18, 24, 14, 8, 16, 6].map((h, idx) => (
                  <span
                    key={idx}
                    className="w-1 rounded-full bg-signal"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[color:var(--color-muted)]">
              <span className="t-mono">Téléchargé hors-ligne ✓</span>
              <span className="t-mono text-paper">Écouter ▶</span>
            </div>
          </div>
        )}

        {/* 8. Fallback universel */}
        {!cleanId.includes("fintech") &&
          !cleanId.includes("logistique") &&
          !cleanId.includes("sante") &&
          !cleanId.includes("commerce") &&
          !cleanId.includes("agritech") &&
          !cleanId.includes("education") &&
          !cleanId.includes("bimaround") &&
          !cleanId.includes("beauty") &&
          !cleanSector.includes("beaut") && (
            <div className="w-full rounded-[var(--radius-tile)] border border-[color:var(--color-hairline-strong)] bg-ink/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                  <span className="t-mono text-[11px] text-paper">{name}</span>
                </div>
                <span className="t-mono text-[10px] text-signal font-semibold">EN LIGNE</span>
              </div>
              <div className="my-4 rounded-xl border border-white/5 bg-white/[0.04] p-3 text-center">
                <p className="text-xs font-semibold text-paper">{sector}</p>
                <p className="t-mono mt-1 text-[11px] text-signal font-bold">{city}</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[color:var(--color-muted)]">
                <span className="t-mono">Étude terrain validée</span>
                <span className="t-mono text-paper">Produit live →</span>
              </div>
            </div>
          )}
      </div>

      {/* Badge de secteur en bas à droite */}
      <div className="t-mono absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] text-[color:var(--color-muted)] backdrop-blur border border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        <span>{sector}</span>
      </div>
    </div>
  );
}
