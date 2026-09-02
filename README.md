# Programactor — site d'agence

Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
Bilingue FR / EN · statique (SSG) · une seule page longue par langue.

Structure et langage visuel transposés de `tbdstudio.framer.ai`, habillés
avec la charte Programactor (`Design—Programactor.pdf`, v1 · 2026).

---

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000  →  redirige vers /fr
npm run build    # build de production
npm start
```

`/` redirige vers `/fr` ou `/en` selon l'en-tête `Accept-Language`
(voir `middleware.ts`). Le sélecteur FR/EN est dans la nav et le pied de page.

---

## ⚠️ À faire avant la mise en ligne

Tout est regroupé dans **`lib/content.ts`**, cherche les `TODO`.

| # | Quoi | Où |
|---|------|-----|
| 1 | **Logo officiel** — le mark actuel est une reconstruction géométrique. Le PDF de charte n'embarque le logo qu'en bitmap 51×51, non vectorisable. | `public/mark.svg` + `components/ui.tsx` → `<Mark />` |
| 2 | **Projets** — 6 cartes avec secteur/ville génériques. Remplace par les vrais clients + visuels (Instagram @programactor). | `lib/content.ts` → `work.projects` + `public/work/*.jpg` |
| 3 | **Chiffres** — les 3 statistiques et les 2 chiffres « agence » sont des espaces réservés. | `lib/content.ts` → `stats.items`, `about.figures` |
| 4 | **Témoignages** — livrés **vides** volontairement. Aucun faux verbatim n'a été écrit. Les cartes s'affichent en pointillés tant qu'elles sont vides. | `lib/content.ts` → `testimonials.items` |
| 5 | **Tarifs** — « Sur devis » par défaut. Mets un montant si tu veux afficher des prix. | `lib/content.ts` → `pricing.items[].price` |
| 6 | **Contact** — e-mail, WhatsApp, lien de prise de rendez-vous (Cal.com / Calendly). | `lib/content.ts` → `shared.contact` |

### Remplacer le logo

Récupère `Primary logo · SVG · 643×643` depuis tes guidelines Vessa, puis :

1. écrase `public/mark.svg` ;
2. dans `components/ui.tsx`, remplace le contenu de `<Mark />` par les `path`
   du fichier officiel, en gardant `currentColor` sur la forme principale et la
   prop `accent` sur la forme secondaire — le reste du site s'adapte tout seul.

---

## Charte appliquée

| Token | Valeur | Usage |
|---|---|---|
| `--color-indigo` | `#212282` | Surfaces primaires : hero, bloc Labs, CTA final, visuels projets |
| `--color-signal` | `#EBFF72` | Accent — **un mot à la fois** (`.mark-word`), pastilles, marqueurs |
| `--color-ink` | `#0E0E0E` | Fond du site |
| `--color-paper` | `#FFFFFF` | Texte principal |

Typographie : **Satoshi** (display 700), **Switzer** (texte 400/500),
**DM Mono** (chiffres et micro-labels 500). Les trois sont libres d'usage
commercial — Satoshi et Switzer via Fontshare, DM Mono en OFL.

Contrastes vérifiés : Paper/Indigo 13:1 · Signal/Indigo 11,8:1 ·
Signal/Ink 17,6:1 · Ink/Signal 17,6:1. Tous au-dessus du seuil AA.

### Auto-héberger les fontes (recommandé en production)

Elles sont pour l'instant chargées depuis les CDN Fontshare et Google
(`app/[lang]/layout.tsx`). Pour t'en affranchir :

1. télécharge les `.woff2` sur [fontshare.com](https://www.fontshare.com) et
   [fonts.google.com](https://fonts.google.com/specimen/DM+Mono) ;
2. dépose-les dans `public/fonts/` ;
3. remplace les `<link>` du layout par des `@font-face` dans `globals.css`,
   avec `font-display: swap`.

---

## Arborescence

```
app/
  [lang]/layout.tsx     layout racine, métadonnées, fontes
  [lang]/page.tsx       assemblage des sections
  globals.css           tokens de charte + utilitaires
components/
  ui.tsx                Mark, Reveal, Counter, Label, Pill, Button, Marquee
  Nav.tsx  Hero.tsx  Work.tsx  Services.tsx  Method.tsx
  Labs.tsx  Pricing.tsx  Faq.tsx  Footer.tsx
  Misc.tsx              Manifesto, Stats, Rhythm, About, Testimonials, FinalCta
lib/content.ts          tout le texte, FR et EN
middleware.ts           redirection de langue
public/mark.svg         logo (à remplacer)
```

## Déploiement

Vercel (zéro configuration) ou n'importe quel hébergeur Node. Pour un export
100 % statique, retire `middleware.ts`, ajoute `output: "export"` dans
`next.config.mjs` et crée une redirection `/` → `/fr` côté hébergeur.
