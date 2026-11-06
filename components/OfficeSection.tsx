import { Button, Reveal } from "./ui";
import type { Content, Lang } from "@/lib/content";
import {
  Location01Icon,
  VideoReplayIcon,
  Clock01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";

export default function OfficeSection({
  c,
  lang,
}: {
  c: Content;
  lang: Lang;
}) {
  const isEn = lang === "en";

  const previewWhatsappUrl =
    lang === "fr" ? c.contact.whatsappPreviewFr : c.contact.whatsappPreviewEn;

  const points = [
    {
      icon: Location01Icon,
      tag: isEn ? "AT YOUR PLACE IN DOUALA" : "CHEZ VOUS À DOUALA",
      desc: isEn
        ? "Akwa, Bonapriso, Bonanjo, Bonamoussadi, Makepe, Bonabéri, Logpom…"
        : "Akwa, Bonapriso, Bonanjo, Bonamoussadi, Makepe, Bonabéri, Logpom…",
    },
    {
      icon: VideoReplayIcon,
      tag: isEn ? "BY VIDEO CALL" : "EN VISIO",
      desc: isEn
        ? "Libreville, Port-Gentil, Yaoundé, and anywhere else via WhatsApp or Google Meet"
        : "Libreville, Port-Gentil, Yaoundé, et partout ailleurs via WhatsApp ou Google Meet",
    },
    {
      icon: Clock01Icon,
      tag: isEn ? "REPLY IN UNDER 2 HOURS" : "RÉPONSE EN MOINS DE 2 H",
      desc: isEn
        ? "On WhatsApp, Monday to Saturday, 8am to 7pm"
        : "Sur WhatsApp, du lundi au samedi, de 8 h à 19 h",
    },
  ];

  return (
    <section
      id="chez-vous"
      className="scroll-mt-24 border-t border-[color:var(--color-hairline)] py-20 md:py-32"
    >
      <div className="shell">
        <div className="rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface p-8 sm:p-12 md:p-16">
          <div className="max-w-[48rem]">
            <Reveal>
              <span className="t-mono text-xs font-semibold uppercase tracking-wider text-signal">
                {isEn ? "On-site presence" : "Présence terrain"}
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h2 className="t-section mt-4 text-paper">
                {isEn
                  ? "Our office is your venue."
                  : "Notre bureau, c'est votre établissement."}
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="t-lead mt-6 leading-relaxed text-[color:var(--color-muted)]">
                {isEn
                  ? "In Douala, we come to you: your restaurant, your hotel or your vehicle yard. In 30 minutes we see how your customers order or book, take the photos and leave with everything we need. Nothing to prepare, and you never leave your business."
                  : "À Douala, nous venons vous voir : dans votre restaurant, votre hôtel ou votre parc de véhicules. En 30 minutes, nous voyons comment vos clients commandent ou réservent, nous prenons les photos et nous repartons avec tout ce qu'il faut. Vous n'avez rien à préparer et vous ne quittez pas votre établissement."}
              </p>
              <p className="mt-4 text-[15px] text-[color:var(--color-muted-2)]">
                {isEn
                  ? "In Libreville and abroad, the same meeting happens by video, on WhatsApp or Google Meet."
                  : "À Libreville et à l'international, le même rendez-vous se fait en visio, sur WhatsApp ou Google Meet."}
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 border-t border-[color:var(--color-hairline)] pt-12 md:grid-cols-3">
            {points.map((pt, i) => {
              const Icon = pt.icon;
              return (
                <Reveal key={pt.tag} delay={180 + i * 80}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <Icon size={18} className="text-signal" />
                      <span className="t-mono text-xs font-bold tracking-wider text-paper">
                        {pt.tag}
                      </span>
                    </div>
                    <p className="text-[14px] leading-relaxed text-[color:var(--color-muted)]">
                      {pt.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-[color:var(--color-hairline)] pt-8">
            <Button href={`/${lang}/reserver`} variant="signal">
              {isEn ? "Book a visit at my place" : "Prendre rendez-vous chez moi"}
            </Button>
            <a
              href={previewWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="t-mono inline-flex items-center gap-1.5 text-xs text-[color:var(--color-muted)] underline transition-colors hover:text-signal"
            >
              <span>{isEn ? "Write on WhatsApp" : "Écrire sur WhatsApp"}</span>
              <ArrowRight01Icon size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
