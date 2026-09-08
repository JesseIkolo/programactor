import Link from 'next/link';
import { Pill, Reveal, SectionHead } from './ui';
import { XPRESITE_INDUSTRIES, XPRESITE_CONFIG, formatFCFA, type XpreSiteConfig } from '@/lib/xpresite-data';
import { FlashIcon, CreditCardIcon, Globe02Icon } from 'hugeicons-react';

export default function XpreSiteSection({
  lang = 'fr',
  config: incomingConfig,
}: {
  lang?: 'fr' | 'en';
  config?: XpreSiteConfig;
}) {
  const isEn = lang === 'en';
  const cfg = incomingConfig || XPRESITE_CONFIG;
  const basePrice = cfg.defaultBasePriceXAF || XPRESITE_CONFIG.defaultBasePriceXAF;
  const formattedPrice = formatFCFA(basePrice);

  const label = isEn ? 'Express Offer · XpreSite' : 'Formule Express · XpreSite';
  const title = isEn ? (
    <>
      A tailored website for your business, ready in{' '}
      <span className="mark-word">72h</span>.
    </>
  ) : (
    <>
      Un site web taillé pour votre métier, livré en{' '}
      <span className="mark-word">72h</span>.
    </>
  );
  const lead = isEn
    ? `Designed specifically for African SMBs, restaurants, logistics, and service providers. Starting at ${formattedPrice} with 1-year hosting included and payment in 2 or 3 installments.`
    : `Conçu spécifiquement pour les commerces, restaurants, livreurs et prestataires en Afrique. À partir de ${formattedPrice} avec hébergement 1 an inclus et facilité de paiement en 2 ou 3 tranches.`;

  const ctaLabel = isEn ? 'Configure my XpreSite' : 'Configurer mon XpreSite';
  const startingAt = isEn ? 'Starting from' : 'À partir de';
  const installmentsText = isEn ? 'Pay in 2 or 3 installments' : 'Paiement en 2 ou 3 tranches';

  return (
    <section id="xpresite" className="scroll-mt-24 py-20 md:py-32 border-t border-[color:var(--color-hairline)]">
      <div className="shell">
        <SectionHead
          label={label}
          title={title}
          lead={lead}
          action={
            <Link
              href={`/${lang}/xpresite`}
              className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-5 py-3 text-xs font-semibold text-paper transition-colors hover:border-signal hover:text-signal"
            >
              <span>{ctaLabel}</span>
              <span aria-hidden>→</span>
            </Link>
          }
        />

        {/* Bannière de réassurance XpreSite */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/25 flex items-center justify-center text-signal shrink-0">
              <FlashIcon size={20} className="text-signal stroke-[1.5]" />
            </div>
            <div>
              <div className="t-mono text-xs text-signal font-semibold">
                {isEn ? '72h Sprint' : '72h Chrono'}
              </div>
              <div className="text-sm text-paper/80 font-medium">
                {isEn ? 'Ready as soon as assets are received' : 'En ligne dès réception des éléments'}
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/25 flex items-center justify-center text-signal shrink-0">
              <CreditCardIcon size={20} className="text-signal stroke-[1.5]" />
            </div>
            <div>
              <div className="t-mono text-xs text-signal font-semibold">
                {isEn ? 'Cashflow friendly' : 'Facilité de trésorerie'}
              </div>
              <div className="text-sm text-paper/80 font-medium">
                {installmentsText}
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/25 flex items-center justify-center text-signal shrink-0">
              <Globe02Icon size={20} className="text-signal stroke-[1.5]" />
            </div>
            <div>
              <div className="t-mono text-xs text-signal font-semibold">
                {isEn ? '100% Turnkey' : 'Pack Clé en main'}
              </div>
              <div className="text-sm text-paper/80 font-medium">
                {isEn ? 'Domain & hosting included (1 year)' : 'Domaine + hébergement inclus (1 an)'}
              </div>
            </div>
          </div>
        </div>

        {/* Grille des secteurs XpreSite */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {XPRESITE_INDUSTRIES.map((industry, i) => (
            <Reveal key={industry.id} delay={i * 60}>
              <Link
                href={`/${lang}/xpresite#configurateur`}
                className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-[color:var(--color-hairline)] bg-surface p-6 transition-all duration-300 hover:border-signal/40 hover:bg-surface-2 block"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="t-mono text-[10px] uppercase tracking-wider text-white/50 bg-white/5 px-2.5 py-1 rounded-full">
                      {isEn ? industry.badge.en : industry.badge.fr}
                    </span>
                    <span className="t-mono text-xs text-signal">
                      {industry.addons.length} {isEn ? 'modules' : 'add-ons'}
                    </span>
                  </div>

                  <h3 className="t-sub text-paper group-hover:text-signal transition-colors mb-2 text-lg">
                    {isEn ? industry.name.en : industry.name.fr}
                  </h3>

                  <p className="text-xs text-white/60 leading-relaxed mb-6">
                    {isEn ? industry.tagline.en : industry.tagline.fr}
                  </p>

                  <div className="space-y-1.5 border-t border-white/5 pt-4">
                    {industry.addons.slice(0, 3).map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between text-xs text-white/70">
                        <span className="truncate pr-2">
                          • {isEn ? addon.title.en : addon.title.fr}
                        </span>
                        <span className="t-mono text-[11px] shrink-0 text-white/40">
                          {addon.priceXAF === 0 ? (isEn ? 'Free' : 'Inclus') : `+${formatFCFA(addon.priceXAF)}`}
                        </span>
                      </div>
                    ))}
                    {industry.addons.length > 3 && (
                      <div className="text-[11px] t-mono text-white/40 pt-1">
                        +{industry.addons.length - 3} {isEn ? 'more options available' : 'autres options au choix'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="t-mono text-[10px] uppercase tracking-wider text-white/40 block">
                      {startingAt}
                    </span>
                    <span className="t-mono text-sm font-bold text-signal">
                      {formattedPrice}
                    </span>
                  </div>

                  <span className="t-mono text-xs font-semibold text-paper group-hover:text-signal flex items-center gap-1">
                    <span>{isEn ? 'Customize' : 'Personnaliser'}</span>
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* Carte CTA direct vers le configurateur */}
          <Reveal delay={300}>
            <Link
              href={`/${lang}/xpresite`}
              className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-signal/30 bg-gradient-to-br from-indigo-deep/40 to-surface p-6 transition-all duration-300 hover:border-signal block"
            >
              <div>
                <span className="t-mono text-[10px] uppercase tracking-wider text-signal bg-signal/15 px-2.5 py-1 rounded-full inline-block mb-4">
                  {isEn ? 'Custom sector' : 'Autre secteur'}
                </span>
                <h3 className="t-sub text-paper group-hover:text-signal transition-colors mb-2 text-lg">
                  {isEn ? 'Have a different business?' : 'Votre activité n\'est pas dans la liste ?'}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {isEn
                    ? 'Launch our interactive simulator. We adapt the base showcase to any trade with customized direct conversion features.'
                    : 'Lancez notre simulateur en direct. Nous adaptons le socle vitrine à tout corps de métier avec des fonctionnalités de conversion sur-mesure.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="t-mono text-xs text-white/60">
                  {isEn ? 'Free instant estimate' : 'Devis instantané gratuit'}
                </span>
                <span className="t-mono text-xs font-bold text-signal flex items-center gap-1">
                  <span>{ctaLabel}</span>
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
