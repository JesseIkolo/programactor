"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ProjectGalleryProps {
  images: string[];
  projectName: string;
  className?: string;
}

export default function ProjectGallery({
  images,
  projectName,
  className = "",
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filtrer les images valides
  const validImages = images.filter((img) => Boolean(img && img.trim()));

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    if (offsetWidth === 0) return;
    const newIndex = Math.round(scrollLeft / (offsetWidth * 0.85));
    setActiveIndex(Math.min(Math.max(newIndex, 0), validImages.length - 1));
  }, [validImages.length]);

  const scrollToImage = (index: number) => {
    if (!scrollRef.current) return;
    const target = scrollRef.current.children[index] as HTMLElement | undefined;
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveIndex(index);
    }
  };

  const scrollPrev = () => {
    const nextIdx = Math.max(activeIndex - 1, 0);
    scrollToImage(nextIdx);
  };

  const scrollNext = () => {
    const nextIdx = Math.min(activeIndex + 1, validImages.length - 1);
    scrollToImage(nextIdx);
  };

  // Fermer la lightbox avec la touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, validImages.length]);

  if (validImages.length === 0) {
    return null;
  }

  return (
    <section className={`relative ${className}`}>
      {/* En-tête de la galerie */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <span className="t-mono text-xs text-signal">
            ● CAPTURES & PROTOTYPES EN DIRECT
          </span>
          <h3 className="t-section mt-1 text-paper">
            Galerie Visuelle du Produit.
          </h3>
          <p className="t-mono mt-1 text-xs text-[color:var(--color-muted-2)]">
            Défilement horizontal · Cliquez sur une image pour l'agrandir
          </p>
        </div>

        {/* Boutons de contrôle Précédent / Suivant */}
        {validImages.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={activeIndex === 0}
              aria-label="Image précédente"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-hairline-strong)] bg-surface text-paper transition-all hover:border-signal hover:bg-signal hover:text-ink disabled:opacity-30 disabled:hover:border-[color:var(--color-hairline-strong)] disabled:hover:bg-surface disabled:hover:text-paper"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={activeIndex === validImages.length - 1}
              aria-label="Image suivante"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-hairline-strong)] bg-surface text-paper transition-all hover:border-signal hover:bg-signal hover:text-ink disabled:opacity-30 disabled:hover:border-[color:var(--color-hairline-strong)] disabled:hover:bg-surface disabled:hover:text-paper"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Conteneur de défilement horizontal */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {validImages.map((src, index) => {
          const webpSrc = src.endsWith(".webp") ? src : src.replace(/\.(png|jpg|jpeg)$/i, ".webp");
          return (
            <div
              key={index}
              onClick={() => setSelectedImage(src)}
              className="group relative shrink-0 cursor-zoom-in overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface transition-all duration-300 hover:border-signal hover:shadow-2xl snap-center w-[85vw] sm:w-[70vw] md:w-[600px] lg:w-[680px]"
            >
              {/* Ratio standard de présentation 16:10 */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-indigo-deep">
                <picture>
                  <source srcSet={webpSrc} type="image/webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${projectName} - Visuel ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </picture>

                {/* Badge d'indice */}
                <span className="t-mono absolute left-4 top-4 rounded-[var(--radius-pill)] bg-ink/80 px-2.5 py-1 text-[11px] text-paper backdrop-blur border border-white/10">
                  {index + 1} / {validImages.length}
                </span>

                {/* Bouton d'agrandissement en hover */}
                <div className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink/80 text-paper opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 border border-white/15">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicateurs / Puces de pagination */}
      {validImages.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToImage(idx)}
              aria-label={`Aller au visuel ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-8 bg-signal"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modale Plein Écran */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
        >
          {/* Backdrop */}
          <div
            onClick={() => setSelectedImage(null)}
            className="absolute inset-0 bg-ink/95 backdrop-blur-lg transition-opacity"
            aria-hidden="true"
          />

          {/* Conteneur de l'image agrandie */}
          <div className="relative z-10 max-h-[90vh] max-w-6xl overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-hairline-strong)] bg-ink shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-surface px-6 py-4">
              <span className="t-mono text-xs text-paper">
                {projectName} · Vue Plein Écran
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="t-mono rounded-[var(--radius-pill)] border border-[color:var(--color-hairline)] px-3 py-1 text-xs text-paper transition-colors hover:border-signal hover:text-signal"
              >
                ✕ Fermer (Esc)
              </button>
            </div>
            <div className="p-2 sm:p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt={projectName}
                className="max-h-[75vh] w-auto rounded-lg object-contain mx-auto shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
