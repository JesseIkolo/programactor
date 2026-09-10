/* ==========================================================================
   MESURE — couche unique pour Plausible, Meta Pixel et TikTok Pixel.

   Un seul appel dans les composants : track("cta_whatsapp").
   Chaque événement est traduit vers l'événement standard de chaque régie,
   pour que les campagnes puissent optimiser dessus.

   Aucun script ne se charge tant que l'identifiant correspondant n'est pas
   renseigné (voir .env.local.example) : le site fonctionne à l'identique
   sans aucune de ces variables.
   ========================================================================== */

/** Les points de conversion du site. Un identifiant = un endroit précis. */
export const CONVERSION_EVENTS = {
  cta_hero_reserver: { meta: "Schedule", tiktok: "ClickButton" },
  cta_header_reserver: { meta: "Schedule", tiktok: "ClickButton" },
  cta_sticky_reserver: { meta: "Schedule", tiktok: "ClickButton" },
  cta_whatsapp: { meta: "Contact", tiktok: "Contact" },
  cta_xpresite_configurer: { meta: "InitiateCheckout", tiktok: "InitiateCheckout" },
  cta_case_study: { meta: "ViewContent", tiktok: "ViewContent" },
  form_reserver_submit: { meta: "Lead", tiktok: "SubmitForm" },
  scroll_depth: { meta: null, tiktok: null },
} as const;

export type ConversionEvent = keyof typeof CONVERSION_EVENTS;

export type TrackProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (
      event: string,
      opts?: { props?: TrackProps; callback?: () => void }
    ) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, props?: TrackProps, opts?: { event_id?: string }) => void;
      page: () => void;
      load: (id: string) => void;
      identify: (data: Record<string, string>) => void;
    };
  }
}

export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

/**
 * Identifiant unique d'événement, partagé entre le pixel navigateur et
 * l'appel serveur (Conversions API / Events API). C'est ce qui évite que
 * Meta et TikTok comptent deux fois la même conversion.
 */
export function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* environnements sans crypto.randomUUID */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Envoie un événement de conversion à toutes les régies configurées.
 *
 * Passer `existingEventId` quand l'identifiant a déjà été créé en amont
 * (typiquement avant un appel serveur qui enverra le même événement) : c'est
 * ce qui permet à Meta et TikTok de dédoublonner au lieu de compter deux fois.
 * Sans argument, un identifiant est généré et retourné.
 */
export function track(
  event: ConversionEvent,
  props: TrackProps = {},
  existingEventId?: string
): string {
  const eventId = existingEventId || newEventId();
  if (typeof window === "undefined") return eventId;

  const mapping = CONVERSION_EVENTS[event];

  try {
    window.plausible?.(event, { props });
  } catch {
    /* la mesure ne doit jamais casser un clic */
  }

  try {
    if (mapping.meta) {
      window.fbq?.("track", mapping.meta, props, { eventID: eventId });
    }
  } catch {
    /* idem */
  }

  try {
    if (mapping.tiktok) {
      window.ttq?.track(mapping.tiktok, props, { event_id: eventId });
    }
  } catch {
    /* idem */
  }

  return eventId;
}
