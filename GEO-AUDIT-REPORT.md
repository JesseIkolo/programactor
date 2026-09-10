# GEO Audit Report: Programactor

**Audit Date:** 2026-09-07
**URL:** https://programactor.pro (www.programactor.pro 301-redirects here)
**Business Type:** Agency/Services (product design agency, Douala + Libreville, Africa-focused)
**Pages Analyzed:** 8 (`/fr`, `/fr/realisations`, `/fr/reserver`, `/fr/xpresite`, `/en`, `/en/realisations`, `/en/reserver`, `/en/xpresite`). No sitemap.xml exists, so pages were discovered via manual crawl of homepage nav/footer links; no additional pages (blog, about, FAQ, legal) exist beyond these 8.

---

## Executive Summary

**Overall GEO Score: 34/100 (Critical)**

Programactor has a genuine, well-written product and real case-study data — but almost none of it is currently visible or trustworthy to AI systems. The site has **zero structured data**, **no robots.txt/sitemap.xml/llms.txt**, and **no brand presence** on any platform AI models use for entity recognition (no Wikipedia, no confirmed LinkedIn page, absent from local agency directories). More urgently, the live site currently ships **unrendered placeholder text in testimonials** and a **stats block that shows "0 products / 0 countries"** — directly contradicting the 12 real case studies on `/realisations`. These aren't GEO nice-to-haves; they're live bugs actively damaging trust for every visitor and every crawler that hits the site today.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 58/100 | 25% | 14.5 |
| Brand Authority | 8/100 | 20% | 1.6 |
| Content E-E-A-T | 34/100 | 20% | 6.8 |
| Technical GEO | 52/100 | 15% | 7.8 |
| Schema & Structured Data | 2/100 | 10% | 0.2 |
| Platform Optimization | 29/100 | 10% | 2.9 |
| **Overall GEO Score** | | | **34/100** |

---

## Critical Issues (Fix Immediately)

1. **Homepage stat counters render as "0" in raw HTML.** The "Par les chiffres" block shows "0 Produits mis en ligne," "0 Pays," "0j Du kickoff au premier écran testé." Every AI crawler (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) reads static HTML without executing JS — they see zero shipped products, directly contradicting the 12 case studies on `/fr/realisations`. Likely a JS-animated counter with no server-rendered fallback value. **Fix:** server-render the real current numbers.

2. **Live placeholder/template text in testimonials.** The "Des founders qui ont livré." section on the homepage ships literal unfinished copy: `"> Verbatim client à insérer."` and `"Nom Prénom - Fondateur·rice · Entreprise"` (appears twice). **Fix:** populate with real testimonials or remove the section until they exist — do not ship placeholder copy live.

3. **Fabricated/composite case studies with precise unverifiable metrics.** `/fr/realisations` presents 6 "projects" with specific stats (-62% missed appointments, +210% frictionless orders, 99.2% delivery success) attached to generic/composite scenarios with no real client name, logo, or verification link. If an AI system cites these as fact, it's citing unsubstantiated numbers. **Fix:** convert to real, named, permissioned client case studies, or explicitly relabel as "exemples de projets types" and drop the precise percentages.

4. **Zero structured data anywhere (Schema score: 2/100).** No JSON-LD, no Microdata, no RDFa on any of the 8 pages. No Organization, Service, or FAQPage schema despite the content existing (FAQ accordion, priced Service offer). **Fix:** deploy the Organization/Service/FAQPage JSON-LD templates in the Schema deep-dive below — content already exists, only markup is missing.

5. **No robots.txt, sitemap.xml, or llms.txt** — all three return HTTP 404 via the Next.js catch-all 404 page, meaning these routes were never implemented (not misconfigured, just missing). No sitemap discovery path for any crawler; no documented AI-crawler policy. **Fix:** add `app/robots.ts` and `app/sitemap.ts` (code below) — roughly 30 minutes of engineering work.

6. **Dangling `programactor.com` domain serving stale, conflicting brand facts.** This legacy domain no longer resolves (DNS NXDOMAIN) but search/AI indexes still hold cached copy describing a different company: "digital brand studio," "10+ developers," "5+ years of experience," no mention of Libreville or the XpreSite product. An AI system doing retrieval could surface this stale, wrong entity description instead of (or blended with) the real `.pro` site. **Fix:** if you still control `.com`, 301-redirect it to `.pro`; otherwise request de-indexing via Google Search Console.

7. **No legal pages.** `/fr/mentions-legales` and `/fr/confidentialite` both 404. For a commercial site collecting contact/booking data in French-language markets, this is both a compliance gap and a trust signal AI systems (and regulators) penalize. **Fix:** publish both pages.

8. **No canonical tag on any page**, combined with an unmanaged `/` → `/fr` redirect chain — creates authority ambiguity for the homepage as content grows.

---

## High Priority Issues

- **Missing security headers**: no Content-Security-Policy, X-Frame-Options, Referrer-Policy, or Permissions-Policy. HSTS present but missing `includeSubDomains`/`preload`.
- **Apex redirect uses 307 (temporary) instead of 308 (permanent)** for `/` → `/fr`, and produces a 2-hop redirect chain from bare `http://`.
- **Render-blocking external font stylesheets** (api.fontshare.com, fonts.googleapis.com) — should self-host via `next/font`.
- **No About/team/founder page anywhere on the site.** Complete facelessness — no named individual, no photo, no credentials, no LinkedIn link. For a high-consideration, multi-week service, this is a major Expertise/Authoritativeness gap.
- **No confirmed LinkedIn company page** — only a founder's personal profile was found. For a B2B agency this is a significant `sameAs`/entity-graph gap.
- **Zero presence in local agency directories/listicles** (e.g., Sortlist "Best Design Agencies in Douala") where named competitors (HuginMboa, Krexora, Fotetsa, Jainli Consulting) already appear.
- **No FAQPage schema** despite genuine, clean Q&A content existing on both the homepage and `/fr/xpresite`.
- **Flagship "Sprint produit" service has no extractable price** ("Sur devis") — the highest-intent page on the site has nothing an LLM can quote, unlike XpreSite's clear "75,000 FCFA" figure.
- **No og:image or twitter:image anywhere** — link previews in AI chat citations, Slack, WhatsApp, and social platforms render with no visual.
- **No press mentions, awards, Reddit, or YouTube presence** — Authoritativeness currently rests entirely on self-description.

---

## Medium Priority Issues

- Case studies use anonymized project names, not real client attribution — reduces verifiability.
- Hreflang tags use relative paths (`/fr`, `/en`) instead of absolute URLs — non-standard per spec.
- No IndexNow implementation for fast re-crawl notification to Bing (which feeds Copilot/ChatGPT search).
- ~247KB homepage HTML with 61 script tags — needs a real Lighthouse/PSI run for field CWV data.
- No page-level freshness metadata (`dateModified`); only a footer copyright year.
- Thin topical authority — no blog or content hub beyond the 4 core pages per locale.
- "One Touch Labs" sub-brand's relationship to Programactor is never explicitly stated on-site, fragmenting entity signal across two names.
- No BreadcrumbList schema despite visible breadcrumb-style navigation.
- `og:locale:alternate` and `x-default` hreflang missing.

## Low Priority Issues

- WhatsApp number in footer (`+237 6 00 00 00 00`) has an all-zero suffix pattern that reads like a placeholder — verify it's a real, live number.
- Markdown content-negotiation not supported (not actionable on Netlify today).
- No `speakable` schema markup.
- No RFC 8288 `Link` header (not applicable — not an API-first site).

---

## Category Deep Dives

### AI Citability (58/100)

Content is unusually rich in quantified, structured claims for an agency site — well above typical baseline — but this is capped by the "0" stats bug and vague pricing on the core service.

**Strong, citation-ready passages (70+):**
- Pesée Cacao case study: "100% export audit compliance; zero data loss during disconnections; 18% quality premium redistribution increase" (~82/100)
- Consultation Réservée: "62% reduction in missed appointments... 180% increase in digitalized deposits" (~80/100)
- XpreSite pricing: "Starting at 75,000 FCFA (domain + 1-year hosting included), delivered in 72h" (~78/100)
- FAQ answer on timeline: "Un premier écran testé auprès de vrais utilisateurs sous quinze jours. Une première version en ligne entre quatre et huit semaines." (~74/100)

**Weak/citation-unlikely passages (<30):**
- Homepage stats block ("0 Produits," "0 Pays") — 5/100
- Generic single-phrase service bullets with no supporting data — ~22/100
- "Sur devis" pricing on the main Sprint produit tier — ~15/100

### Brand Authority (8/100)

The dominant weakness of the audit — Programactor is essentially an unrecognized entity to AI systems.

| Platform | Status |
|---|---|
| Wikipedia | Absent |
| LinkedIn | No confirmed company page (only a founder's personal profile) |
| Reddit | Absent |
| YouTube | Absent |
| Agency directories (Sortlist, Clutch, etc.) | Absent — competitors are listed, Programactor is not |
| Legacy `.com` domain | Dangling, stale-indexed with conflicting brand facts |

### Content E-E-A-T (34/100)

| Dimension | Score | Key Finding |
|---|---|---|
| Experience | 6/25 | Case studies read as composite/illustrative, not documented real client work |
| Expertise | 9/25 | Methodology is clearly and well explained; zero author/team credentials anywhere |
| Authoritativeness | 5/25 | No external validation, no named clients, no press, no about page |
| Trustworthiness | 8/25 | HTTPS + real contact info present, but live placeholder text, no legal pages, contradictory "0" stats |

Genuine strengths: locally-grounded specificity in problem statements (real references to 3G/EDGE instability in Douala markets, lack of street names in Libreville), a clearly articulated Lean Product methodology, and human-voiced copy with no generic AI phrasing.

### Technical GEO (52/100)

| Category | Score | Status |
|---|---|---|
| Crawlability | 5/15 | Fail |
| Indexability | 7/12 | Warn |
| Security | 5/10 | Warn |
| URL Structure | 7/8 | Pass |
| Mobile Optimization | 9/10 | Pass |
| Core Web Vitals (risk proxy) | 7/15 | Warn |
| Server-Side Rendering | 15/15 | Pass |
| Page Speed & Server | 8/15 | Warn |

The biggest technical asset: this is a genuine Next.js SSR/prerender setup — full text content is in the raw HTML, so AI crawlers see everything a browser sees. This makes every fix below (schema, robots.txt, sitemap) unusually low-risk to implement, since anything added server-side will be immediately visible to non-JS crawlers.

### Schema & Structured Data (2/100)

Zero schema blocks of any kind on any of the 8 pages. Ready-to-deploy JSON-LD templates below.

### Platform Optimization (29/100)

| Platform | Score | Status |
|---|---|---|
| Google AI Overviews | 34/100 | Poor |
| ChatGPT Web Search | 27/100 | Poor |
| Perplexity AI | 22/100 | Critical |
| Google Gemini | 31/100 | Poor |
| Bing Copilot | 32/100 | Poor |

Strongest on Google AI Overviews (thanks to SSR + correct hreflang + clean heading hierarchy). Weakest on Perplexity — zero freshness dates anywhere, zero external citations, no confirmed community validation.

---

## Ready-to-Deploy Code

### `app/robots.ts`
```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: 'https://programactor.pro/sitemap.xml',
  }
}
```

### `app/sitemap.ts`
```typescript
import type { MetadataRoute } from 'next'

const routes = ['', '/realisations', '/reserver', '/xpresite']
const locales = ['fr', 'en']

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://programactor.pro'
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      alternates: {
        languages: { fr: `${base}/fr${route}`, en: `${base}/en${route}` },
      },
    }))
  )
}
```

### Organization JSON-LD (add to root layout, every page)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://programactor.pro/#organization",
  "name": "Programactor",
  "url": "https://programactor.pro",
  "logo": { "@type": "ImageObject", "url": "https://programactor.pro/mark.svg" },
  "description": "Agence de design produit centrée humain à Douala et Libreville. Recherche terrain, design d'interface et build en sprints courts, pour des produits pensés pour l'Afrique.",
  "slogan": "L'agence qui transforme l'idée en produit",
  "email": "hello@programactor.pro",
  "telephone": "+237692025552",
  "areaServed": [
    { "@type": "City", "name": "Douala" },
    { "@type": "City", "name": "Libreville" }
  ],
  "sameAs": [
    "https://facebook.com/programactor",
    "https://instagram.com/programactor",
    "https://x.com/programactor"
  ]
}
```

### Service JSON-LD (add to `/fr/xpresite`)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://programactor.pro/fr/xpresite/#service",
  "name": "XpreSite — Site Web Métier Clé en Main en 72h",
  "serviceType": "Website design and development package",
  "description": "Formule de site web sur-mesure pour restaurants, livreurs, pressings, agences et loueurs de véhicules. Livraison garantie en 72h, 1 an de domaine + hébergement inclus.",
  "provider": { "@id": "https://programactor.pro/#organization" },
  "areaServed": [{ "@type": "City", "name": "Douala" }, { "@type": "City", "name": "Libreville" }],
  "offers": {
    "@type": "Offer",
    "url": "https://programactor.pro/fr/xpresite",
    "priceCurrency": "XAF",
    "price": "75000",
    "availability": "https://schema.org/InStock"
  }
}
```

### FAQPage JSON-LD (add to `/fr/xpresite`, content already published on-page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment fonctionne la garantie de livraison en 72 heures ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Le chrono de 72 heures démarre dès que vous nous transmettez vos éléments essentiels : logo, photos, grille de prix et coordonnées." }
    },
    {
      "@type": "Question",
      "name": "Comment se déroule le paiement échelonné en 2 ou 3 tranches ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Vous réglez un premier acompte au lancement par Mobile Money (Orange Money, MTN MoMo) ou virement. Le solde est versé à la livraison et validation de votre site." }
    }
  ]
}
```

### `netlify.toml` — security headers
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

---

## Quick Wins (Implement This Week)

1. Fix the homepage stats block so it server-renders real numbers instead of "0" — likely a one-line data-binding fix.
2. Remove or populate the placeholder testimonial text (`"Verbatim client à insérer"`).
3. Add `app/robots.ts` and `app/sitemap.ts` (code above) — ~30 minutes total.
4. Add the Organization JSON-LD block above to the root layout — the social profile links already exist, this is a zero-cost `sameAs` win.
5. Add an `og:image` + `twitter:image` across the site.

## 30-Day Action Plan

### Week 1: Stop the bleeding (live bugs + trust)
- [ ] Fix "0 products / 0 countries" stats bug
- [ ] Remove/populate placeholder testimonials
- [ ] Publish `/fr/mentions-legales` and `/fr/confidentialite`
- [ ] Ship `app/robots.ts` + `app/sitemap.ts`

### Week 2: Structured data + technical hardening
- [ ] Deploy Organization, Service, and FAQPage JSON-LD
- [ ] Add canonical tags + fix hreflang to absolute URLs
- [ ] Add security headers via `netlify.toml`
- [ ] Self-host fonts via `next/font`; change `/` → `/fr` redirect to permanent (308)

### Week 3: Brand authority
- [ ] Create and link a LinkedIn company page
- [ ] Submit to 2-3 relevant agency directories (Sortlist, Clutch)
- [ ] Resolve the dangling `programactor.com` domain (redirect or de-index)

### Week 4: Content credibility
- [ ] Add an About/team page with real founder name, photo, and credentials
- [ ] Convert 2-3 case studies to real, named, permissioned client work (or explicitly relabel as illustrative)
- [ ] Add real pricing or a price range to the "Sprint produit" tier
- [ ] Publish `llms.txt`

---

## Appendix: Pages Analyzed

| URL | Title | GEO Issues |
|---|---|---|
| /fr | Programactor — L'agence qui transforme l'idée en produit | Stats bug, placeholder testimonials, no schema |
| /fr/realisations | (case studies) | Unverified case study claims, no schema |
| /fr/reserver | (booking) | No schema |
| /fr/xpresite | XpreSite — Votre Site Web Métier Clé en Main en 72h | No Service/FAQ schema despite rich content |
| /en, /en/realisations, /en/reserver, /en/xpresite | English equivalents | Same issues as FR versions |

Fetch failures: none. `robots.txt`, `sitemap.xml`, `llms.txt` all resolved (as 404s, not fetch errors).
