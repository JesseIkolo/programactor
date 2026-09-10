/* ==========================================================================
   CONVERSIONS SERVEUR — Meta Conversions API + TikTok Events API.

   Pourquoi : le pixel navigateur perd une part des conversions (bloqueurs,
   ATT sur iOS, plafonnement des cookies sur Safari, réseaux qui compriment).
   Cet envoi part du serveur, donc rien ne peut l'arrêter côté visiteur.

   Déduplication : le navigateur et le serveur envoient le MÊME nom
   d'événement et le MÊME event_id. Les régies n'en gardent qu'un.

   Ce module est destiné au serveur uniquement (il lit des jetons secrets).
   Ne jamais l'importer depuis un composant client.
   ========================================================================== */

import crypto from "node:crypto";
import { CONVERSION_EVENTS, type ConversionEvent } from "./analytics";

const META_VERSION = process.env.META_GRAPH_API_VERSION || "v25.0";
const META_DATASET_ID = process.env.META_CAPI_DATASET_ID;
const META_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_TEST_CODE = process.env.META_CAPI_TEST_EVENT_CODE;

const TIKTOK_VERSION = process.env.TIKTOK_API_VERSION || "v1.3";
const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID;
const TIKTOK_TOKEN = process.env.TIKTOK_EVENTS_API_TOKEN;
const TIKTOK_TEST_CODE = process.env.TIKTOK_TEST_EVENT_CODE;

/** Indicatif à préfixer quand le prospect a saisi un numéro national. */
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_PHONE_COUNTRY_CODE || "237";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Email normalisé (minuscules, sans espaces) puis haché. */
export function hashEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const normalized = email.trim().toLowerCase();
  return normalized ? sha256(normalized) : undefined;
}

/**
 * Téléphone normalisé en chiffres avec indicatif pays, sans « + » ni espaces,
 * puis haché. C'est l'identifiant le plus fort dans notre cas : c'est ce que
 * les prospects donnent réellement.
 */
export function hashPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2); // 00237… → 237…
  digits = digits.replace(/^0+/, ""); // zéro de tête à la gabonaise : 074… → 74…
  if (!digits) return undefined;

  const alreadyInternational =
    digits.length > 9 || digits.startsWith(DEFAULT_COUNTRY_CODE);
  if (!alreadyInternational) {
    digits = DEFAULT_COUNTRY_CODE + digits;
  }
  return sha256(digits);
}

/** Exposé pour vérifier la normalisation sans avoir à hacher. */
export function normalizePhoneForTest(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "");
  if (!digits) return "";
  const alreadyInternational =
    digits.length > 9 || digits.startsWith(DEFAULT_COUNTRY_CODE);
  return alreadyInternational ? digits : DEFAULT_COUNTRY_CODE + digits;
}

export type ServerConversionInput = {
  event: ConversionEvent;
  /** Le même identifiant que celui utilisé par le pixel navigateur. */
  eventId: string;
  eventSourceUrl?: string;
  email?: string;
  phone?: string;
  /** IP DU VISITEUR, jamais celle du serveur. */
  clientIp?: string;
  userAgent?: string;
  /** Cookies first-party posés par les pixels. Envoyés en clair, jamais hachés. */
  fbp?: string;
  fbc?: string;
  ttp?: string;
  ttclid?: string;
  customData?: Record<string, unknown>;
};

type Outcome = "ok" | "skipped" | `error:${string}`;

async function sendToMeta(input: ServerConversionInput): Promise<Outcome> {
  const eventName = CONVERSION_EVENTS[input.event].meta;
  if (!eventName) return "skipped";
  if (!META_DATASET_ID || !META_TOKEN) return "skipped";

  const userData: Record<string, unknown> = {};
  const em = hashEmail(input.email);
  const ph = hashPhone(input.phone);
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
        user_data: userData,
        ...(input.customData ? { custom_data: input.customData } : {}),
      },
    ],
  };
  if (META_TEST_CODE) payload.test_event_code = META_TEST_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${META_VERSION}/${META_DATASET_ID}/events?access_token=${encodeURIComponent(
        META_TOKEN
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2500),
      }
    );
    if (!res.ok) {
      const detail = await res.text();
      return `error:${res.status} ${detail.slice(0, 200)}`;
    }
    return "ok";
  } catch (err) {
    return `error:${err instanceof Error ? err.message : String(err)}`;
  }
}

async function sendToTikTok(input: ServerConversionInput): Promise<Outcome> {
  const eventName = CONVERSION_EVENTS[input.event].tiktok;
  if (!eventName) return "skipped";
  if (!TIKTOK_PIXEL_ID || !TIKTOK_TOKEN) return "skipped";

  const user: Record<string, unknown> = {};
  const em = hashEmail(input.email);
  const ph = hashPhone(input.phone);
  if (em) user.email = em;
  if (ph) user.phone = ph;
  if (input.clientIp) user.ip = input.clientIp;
  if (input.userAgent) user.user_agent = input.userAgent;
  if (input.ttp) user.ttp = input.ttp;
  if (input.ttclid) user.ttclid = input.ttclid;

  const payload: Record<string, unknown> = {
    event_source: "web",
    event_source_id: TIKTOK_PIXEL_ID,
    data: [
      {
        event: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        user,
        ...(input.eventSourceUrl ? { page: { url: input.eventSourceUrl } } : {}),
        ...(input.customData ? { properties: input.customData } : {}),
      },
    ],
  };
  if (TIKTOK_TEST_CODE) payload.test_event_code = TIKTOK_TEST_CODE;

  try {
    const res = await fetch(
      `https://business-api.tiktok.com/open_api/${TIKTOK_VERSION}/event/track/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": TIKTOK_TOKEN,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2500),
      }
    );
    const body = await res.json().catch(() => ({}) as Record<string, unknown>);
    // TikTok répond 200 avec un code non nul en cas de rejet applicatif.
    const code = (body as { code?: number }).code;
    if (!res.ok || (typeof code === "number" && code !== 0)) {
      return `error:${res.status} ${JSON.stringify(body).slice(0, 200)}`;
    }
    return "ok";
  } catch (err) {
    return `error:${err instanceof Error ? err.message : String(err)}`;
  }
}

/**
 * Envoie la conversion aux deux régies. Ne lève jamais : une panne de
 * mesure ne doit pas faire échouer une réservation.
 */
export async function sendServerConversion(
  input: ServerConversionInput
): Promise<{ meta: Outcome; tiktok: Outcome }> {
  const [meta, tiktok] = await Promise.all([sendToMeta(input), sendToTikTok(input)]);
  if (meta.startsWith("error") || tiktok.startsWith("error")) {
    console.warn("[conversions] meta=%s tiktok=%s", meta, tiktok);
  }
  return { meta, tiktok };
}
