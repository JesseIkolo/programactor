/* ==========================================================================
   WHATSAPP — liens avec message pré-rempli.

   Le premier message dit d'où vient le prospect : le lead arrive qualifié
   et le contexte sert de traçage même hors analytics.
   ========================================================================== */

import type { Lang } from "./content";

export const WHATSAPP_NUMBER = "237692025552";

export type WaContext = "agence" | "xpresite" | "projet" | "devis";

const MESSAGES: Record<Lang, Record<WaContext, string>> = {
  fr: {
    agence:
      "Bonjour Programactor. Je viens du site. Mon projet en une phrase : ",
    xpresite:
      "Bonjour Programactor. Je viens de la page XpreSite. Mon activité : ",
    projet:
      "Bonjour Programactor. J'ai vu une de vos réalisations sur le site. Ce que je voudrais faire : ",
    devis:
      "Bonjour Programactor. Je voudrais une idée de budget pour : ",
  },
  en: {
    agence:
      "Hello Programactor. I'm coming from your website. My project in one line: ",
    xpresite:
      "Hello Programactor. I'm coming from the XpreSite page. My business: ",
    projet:
      "Hello Programactor. I saw one of your case studies. What I'd like to build: ",
    devis: "Hello Programactor. I'd like a budget range for: ",
  },
};

/** Lien wa.me prêt à l'emploi, message pré-rempli selon le contexte. */
export function waLink(lang: Lang, context: WaContext = "agence"): string {
  const message = MESSAGES[lang]?.[context] ?? MESSAGES.fr.agence;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
