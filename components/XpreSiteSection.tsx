import Link from 'next/link';
import { Reveal, SectionHead } from './ui';
import { FlashIcon, CreditCardIcon, Globe02Icon, ArrowRight01Icon, WhatsappIcon } from 'hugeicons-react';

export default function XpreSiteSection({
  lang = 'fr',
}: {
  lang?: 'fr' | 'en';
  config?: any;
}) {
  const isEn = lang === 'en';

  const label = isEn ? 'Transparent Pricing · Single Grid' : 'Nos Tarifs · Grille Unique 2026';
  const title = isEn ? (
    <>
      Clear pricing before we start,{' '}
      <span className="mark-word">no surprises</span>.
    </>
  ) : (
    <>
      Un prix clair avant de commencer,{' '}
      <span className="mark-word">sans surprise</span>.
    </>
  );

  const lead = isEn
    ? 'All-inclusive packages for restaurants, hotels, car rentals and businesses. 50% deposit upon order, balance upon delivery.'
    : 'Des formules clés en main pour restaurants, hôtels, loueurs et commerces. Acompte de 50 % à la commande, solde à la livraison.';

  const waNumber = '237692025552';

  const cards = [
    {
      id: 'essentiel',
      title: isEn ? 'Site Essentiel' : 'Site Essentiel',
      pitch: isEn ? 'Get found and contacted.' : 'Pour être trouvé et contacté.',
      price: '75 000 FCFA',
      features: isEn
        ? [
            '1-page mobile-optimised website',
            'Direct WhatsApp button at every step',
            'Opening hours, address & one-tap map',
            'Domain & hosting for 1 year included',
            'Live in 72 hours guaranteed',
          ]
        : [
            'Site 1 page adapté au téléphone',
            'Bouton WhatsApp direct sur chaque section',
            'Horaires, adresse et lien d\'itinéraire',
            'Nom de domaine et hébergement 1 an inclus',
            'En ligne en 72 h chrono',
          ],
      ctaText: isEn ? 'I want Essentiel' : 'Je veux l\'Essentiel',
      ctaHref: `https://wa.me/${waNumber}?text=${encodeURIComponent(
        isEn
          ? 'Hello Programactor, I am interested in the "Essentiel Website" offer (75,000 FCFA).\nBusiness name:\nCity:'
          : 'Bonjour Programactor, l\'offre « Site Essentiel » (75 000 FCFA) m\'intéresse.\nNom de l\'établissement :\nVille :'
      )}`,
      badge: null,
      highlight: false,
    },
    {
      id: 'complet',
      title: isEn ? 'Site Complet' : 'Site Complet',
      pitch: isEn
        ? 'Get found on Google and get inquiries every week.'
        : 'Pour être trouvé sur Google et recevoir des demandes chaque semaine.',
      price: '130 000 FCFA',
      features: isEn
        ? [
            'Everything included in Essentiel site',
            'Multi-page custom structure',
            'Local SEO, Google listing and Yango Maps',
            '10 business email addresses included',
            'WhatsApp booking or quotation form',
          ]
        : [
            'Tout ce qui est inclus dans l\'Essentiel',
            'Structure personnalisée multi-pages',
            'SEO local, fiche Google et présence Yango',
            '10 adresses e-mail professionnelles',
            'Réservation ou formulaire vers WhatsApp',
          ],
      ctaText: isEn ? 'I want Complet' : 'Je veux le Complet',
      ctaHref: `https://wa.me/${waNumber}?text=${encodeURIComponent(
        isEn
          ? 'Hello Programactor, I am interested in the "Complet Website" offer (130,000 FCFA).\nBusiness name:\nCity:'
          : 'Bonjour Programactor, l\'offre « Site Complet » (130 000 FCFA) m\'intéresse.\nNom de l\'établissement :\nVille :'
      )}`,
      badge: isEn ? 'RECOMMENDED' : 'RECOMMANDÉ',
      highlight: true,
    },
    {
      id: 'menu-digital',
      title: isEn ? 'Menu digital QR' : 'Menu digital QR',
      pitch: isEn
        ? 'Your menu on mobile, orders on WhatsApp.'
        : 'Votre carte sur téléphone, la commande sur WhatsApp.',
      price: isEn ? '90,000 to 130,000 FCFA' : 'de 90 000 à 130 000 FCFA',
      features: isEn
        ? [
            'Digital menu accessible on all smartphones',
            'QR code on tables to order in 1 tap',
            'Full cart and instant WhatsApp order',
            'Easy price & dish updates',
          ]
        : [
            'Carte complète consultable sur smartphone',
            'QR code personnalisé sur chaque table',
            'Commande WhatsApp avec panier intégré',
            'Mise à jour rapide des plats et des prix',
          ],
      ctaText: isEn ? 'Free menu preview' : 'Voir mon menu (aperçu gratuit)',
      ctaHref: `https://wa.me/${waNumber}?text=${encodeURIComponent(
        isEn
          ? 'Hello Programactor, I run a restaurant or bar and would like a free preview of my digital menu.\nBusiness name:\nCity:'
          : 'Bonjour Programactor, je gère un restaurant ou un bar et je souhaite recevoir l\'aperçu gratuit de mon menu digital.\nNom de l\'établissement :\nVille :'
      )}`,
      badge: null,
      highlight: false,
    },
    {
      id: 'bongo-space',
      title: 'Pack Bongo Space',
      pitch: isEn
        ? 'Menu, till and stock set up at your venue.'
        : 'Menu, caisse et stocks installés chez vous.',
      price: '250 000 FCFA',
      features: isEn
        ? [
            'System setup & initial menu entry',
            'Table QR codes and signage',
            'Staff training in your venue',
            '12 months of subscription included',
          ]
        : [
            'Paramétrage complet et saisie du menu',
            'Génération des QR codes de table',
            'Formation de vos serveurs et gérants',
            '12 mois d\'abonnement complet inclus',
          ],
      ctaText: isEn ? 'Discover Bongo Space' : 'Découvrir Bongo Space',
      ctaHref: 'https://bongospace.pro/fr',
      badge: isEn ? 'RESTAURANTS & BARS' : 'RESTAURANTS & BARS',
      highlight: false,
      isExternal: true,
    },
  ];

  return (
    <section id="tarifs" className="scroll-mt-24 py-20 md:py-32 border-t border-[color:var(--color-hairline)]">
      <div className="shell">
        <SectionHead
          label={label}
          title={title}
          lead={lead}
          action={
            <Link
              href={`/${lang}/xpresite`}
              className="t-mono inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-5 py-3 text-xs font-medium text-paper transition-colors hover:border-signal hover:text-signal"
            >
              <span>{isEn ? 'Online Configurator' : 'Configurateur en ligne'}</span>
              <span aria-hidden>→</span>
            </Link>
          }
        />

        {/* 3 Atouts de réassurance */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/25 flex items-center justify-center text-signal shrink-0">
              <FlashIcon size={20} className="text-signal stroke-[1.5]" />
            </div>
            <div>
              <div className="t-mono text-xs text-signal font-medium">
                {isEn ? '72H EXPRESS' : '72 H CHRONO'}
              </div>
              <div className="text-sm text-paper/80 font-medium">
                {isEn ? 'Essentiel website live upon assets reception' : 'Site Essentiel en ligne dès réception de vos éléments'}
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/25 flex items-center justify-center text-signal shrink-0">
              <CreditCardIcon size={20} className="text-signal stroke-[1.5]" />
            </div>
            <div>
              <div className="t-mono text-xs text-signal font-medium">
                {isEn ? '50% DEPOSIT' : 'ACOMPTE 50 %'}
              </div>
              <div className="text-sm text-paper/80 font-medium">
                {isEn ? 'Balance paid upon final delivery' : 'Le solde versé à la livraison'}
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-tile)] border border-[color:var(--color-hairline)] bg-surface p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/25 flex items-center justify-center text-signal shrink-0">
              <Globe02Icon size={20} className="text-signal stroke-[1.5]" />
            </div>
            <div>
              <div className="t-mono text-xs text-signal font-medium">
                {isEn ? 'DOMAIN + HOSTING' : 'DOMAINE + HÉBERGEMENT'}
              </div>
              <div className="text-sm text-paper/80 font-medium">
                {isEn ? '1 year included (.com or .pro)' : '1 an inclus avec nom de domaine'}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cartes de la grille officielle */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 60} className="min-w-0">
              <div
                className={`flex h-full min-w-0 flex-col justify-between rounded-[var(--radius-card)] border p-6 transition-all duration-300 ${
                  card.highlight
                    ? 'border-signal/60 bg-gradient-to-b from-[#1C1C1C] to-surface shadow-lg shadow-signal/5 ring-1 ring-signal/40'
                    : 'border-[color:var(--color-hairline)] bg-surface hover:border-white/25 hover:bg-surface-2'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 min-h-[24px]">
                    <span className="t-mono text-[11px] font-bold tracking-wider text-white">
                      {card.title}
                    </span>
                    {card.badge && (
                      <span className="t-mono text-[9px] font-bold tracking-wider bg-signal text-ink px-2 py-0.5 rounded-full uppercase">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-bold font-mono text-signal mb-2">
                    {card.price}
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed mb-5 min-h-[36px]">
                    {card.pitch}
                  </p>

                  <div className="space-y-2 border-t border-white/5 pt-4">
                    {card.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2 text-xs text-white/80">
                        <span className="text-signal font-bold shrink-0">✓</span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href={card.ctaHref}
                    target={card.isExternal ? '_blank' : undefined}
                    rel={card.isExternal ? 'noopener noreferrer' : undefined}
                    className={`t-mono text-xs font-bold py-2.5 px-4 rounded-xl w-full flex items-center justify-center gap-1.5 transition-all text-center ${
                      card.highlight
                        ? 'bg-signal text-ink hover:bg-signal-hover shadow-md shadow-signal/20'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight01Icon size={14} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bandeaux Options & Conditions de Paiement */}
        <div className="mt-8 space-y-3">
          {/* Ligne des options */}
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="t-mono font-bold text-signal uppercase tracking-wider">
                {isEn ? 'ADD-ONS:' : 'OPTIONS :'}
              </span>
              <span className="text-white/80">
                {isEn
                  ? 'Smart quote +60,000 · Rate & deposit calculator +80,000 · Marketplace +80,000 FCFA'
                  : 'Devis intelligent + 60 000 · Calculateur de tarif & caution + 80 000 · Marketplace + 80 000 FCFA'}
              </span>
            </div>
            <Link
              href={`/${lang}/xpresite#configurateur`}
              className="t-mono text-signal hover:underline inline-flex items-center gap-1 shrink-0 font-medium"
            >
              <span>{isEn ? 'Customize in configurator' : 'Personnaliser dans le configurateur'}</span>
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Ligne des conditions */}
          <div className="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-white/70">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="t-mono font-bold text-white uppercase tracking-wider">
                {isEn ? 'PAYMENTS:' : 'RÈGLEMENT :'}
              </span>
              <span><strong>Acompte 50 %</strong> à la commande, solde à la livraison</span>
              <span>•</span>
              <span><strong>Cameroun :</strong> Orange Money, MTN MoMo</span>
              <span>•</span>
              <span><strong>Gabon :</strong> Airtel Money</span>
              <span>•</span>
              <span>Virement bancaire</span>
            </div>
            <a
              href="#studio"
              className="t-mono text-white/50 hover:text-white inline-flex items-center gap-1 shrink-0"
            >
              <span>{isEn ? '★ Bespoke apps & SaaS →' : '★ Applications & Studio →'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
