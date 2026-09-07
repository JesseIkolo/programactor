import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LANGS = ["fr", "en"];
const DEFAULT_LANG = "fr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLang = LANGS.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLang) return NextResponse.next();

  // Négociation simple : on suit l'en-tête du navigateur, français par défaut.
  const accept = request.headers.get("accept-language") ?? "";
  const lang = accept.toLowerCase().startsWith("en") ? "en" : DEFAULT_LANG;

  return NextResponse.redirect(
    new URL(`/${lang}${pathname === "/" ? "" : pathname}`, request.url),
    308
  );
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\.).*)"],
};
