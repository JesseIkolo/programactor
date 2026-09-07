'use client';

import React, { useState, useMemo } from 'react';
import {
  XPRESITE_INDUSTRIES,
  XPRESITE_CONFIG,
  formatFCFA,
  XpreSiteIndustry,
} from '@/lib/xpresite-data';

import {
  Restaurant01Icon,
  DeliveryTruck01Icon,
  Shirt01Icon,
  Car01Icon,
  Airplane01Icon,
  Tick01Icon,
  WhatsappIcon,
  FlashIcon,
  Globe02Icon,
  ArrowRight01Icon,
} from 'hugeicons-react';

interface XpreSiteConfiguratorProps {
  lang?: 'fr' | 'en';
}

export function XpreSiteConfigurator({ lang = 'fr' }: XpreSiteConfiguratorProps) {
  const isEn = lang === 'en';

  // État du configurateur
  const [selectedIndustrySlug, setSelectedIndustrySlug] = useState<string>(
    XPRESITE_INDUSTRIES[0].slug
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [paymentSplits, setPaymentSplits] = useState<2 | 3>(2);

  // Informations de contact
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<{
    reference: string;
    whatsappUrl: string;
    totalFormatted: string;
    splitFormatted: string;
  } | null>(null);

  // Industrie active
  const activeIndustry: XpreSiteIndustry = useMemo(() => {
    return (
      XPRESITE_INDUSTRIES.find((i) => i.slug === selectedIndustrySlug) ||
      XPRESITE_INDUSTRIES[0]
    );
  }, [selectedIndustrySlug]);

  // Initialiser les options gratuites ou recommandées au changement de secteur
  const handleSelectIndustry = (slug: string) => {
    setSelectedIndustrySlug(slug);
    const ind = XPRESITE_INDUSTRIES.find((i) => i.slug === slug);
    if (ind) {
      // Sélectionne par défaut l'option incluse
      const defaultAddonIds = ind.addons
        .filter((a) => a.priceXAF === 0)
        .map((a) => a.id);
      setSelectedAddonIds(defaultAddonIds);
    }
  };

  // Toggle option additionnelle
  const handleToggleAddon = (addonId: string, price: number) => {
    if (price === 0) return; // L'option gratuite reste active
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Calcul du prix total et des tranches
  const basePrice = XPRESITE_CONFIG.defaultBasePriceXAF;

  const addonsTotal = useMemo(() => {
    return activeIndustry.addons
      .filter((addon) => selectedAddonIds.includes(addon.id))
      .reduce((sum, addon) => sum + addon.priceXAF, 0);
  }, [activeIndustry, selectedAddonIds]);

  const totalPrice = basePrice + addonsTotal;
  const splitAmount = Math.ceil(totalPrice / paymentSplits);

  // Soumission du devis
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMessage(
        isEn
          ? 'Please enter your name and WhatsApp phone number.'
          : 'Veuillez renseigner votre nom et votre numéro WhatsApp.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedAddonTitles = activeIndustry.addons
        .filter((a) => selectedAddonIds.includes(a.id))
        .map((a) => `${isEn ? a.title.en : a.title.fr} (${a.priceXAF === 0 ? (isEn ? 'Included' : 'Inclus') : formatFCFA(a.priceXAF)})`);

      const res = await fetch('/api/xpresite/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          companyName,
          city,
          industryId: activeIndustry.id,
          industryName: isEn ? activeIndustry.name.en : activeIndustry.name.fr,
          selectedAddonTitles,
          basePriceXAF: basePrice,
          addonsTotalXAF: addonsTotal,
          totalPriceXAF: totalPrice,
          paymentSplits,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération du devis.');
      }

      setQuoteResult({
        reference: data.quoteReference,
        whatsappUrl: data.whatsappUrl,
        totalFormatted: formatFCFA(totalPrice),
        splitFormatted: formatFCFA(splitAmount),
      });

      // Ouvrir WhatsApp dans un nouvel onglet
      if (typeof window !== 'undefined' && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icône dynamique par secteur
  const renderIcon = (name: string, active: boolean) => {
    const iconClass = active ? 'text-[#EBFF72]' : 'text-white/70';
    switch (name) {
      case 'utensils':
        return <Restaurant01Icon size={20} className={iconClass} />;
      case 'truck':
        return <DeliveryTruck01Icon size={20} className={iconClass} />;
      case 'shirt':
        return <Shirt01Icon size={20} className={iconClass} />;
      case 'car':
        return <Car01Icon size={20} className={iconClass} />;
      case 'plane':
        return <Airplane01Icon size={20} className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Modal de Confirmation / Succès */}
      {quoteResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] border border-[#EBFF72]/40 rounded-[28px] max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#EBFF72]/15 border border-[#EBFF72] flex items-center justify-center text-[#EBFF72] mb-4">
              <Tick01Icon size={24} className="text-[#EBFF72]" />
            </div>

            <span className="font-mono text-xs uppercase tracking-wider text-[#EBFF72] bg-[#EBFF72]/10 px-3 py-1 rounded-full">
              {isEn ? 'Instant Quote Generated' : 'Devis Instantané Validé'}
            </span>

            <h3 className="text-2xl font-bold mt-3 mb-2">
              {isEn ? 'Your XpreSite is configured!' : 'Votre XpreSite est prêt à démarrer !'}
            </h3>

            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {isEn
                ? `Quote reference ${quoteResult.reference} has been recorded. Complete the briefing with our design team on WhatsApp to start the 72h delivery sprint.`
                : `La référence de devis ${quoteResult.reference} a été enregistrée. Poursuivez sur WhatsApp pour transmettre vos éléments et lancer le sprint de livraison en 72h.`}
            </p>

            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>{isEn ? 'Reference' : 'Référence'}</span>
                <span className="font-mono text-white font-medium">{quoteResult.reference}</span>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>{isEn ? 'Estimated Total' : 'Montant Total'}</span>
                <span className="font-mono text-[#EBFF72] font-semibold">{quoteResult.totalFormatted}</span>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>{isEn ? 'Payment facility' : 'Facilité de paiement'}</span>
                <span className="font-mono text-white">
                  {paymentSplits} {isEn ? 'splits of' : 'tranches de'} ~{quoteResult.splitFormatted}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={quoteResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#EBFF72] text-[#0E0E0E] font-semibold text-sm py-3.5 px-6 rounded-full hover:bg-[#d6ec55] transition-colors"
              >
                <WhatsappIcon size={18} className="text-[#0E0E0E]" />
                {isEn ? 'Finalize on WhatsApp' : 'Finaliser sur WhatsApp'}
              </a>

              <button
                type="button"
                onClick={() => setQuoteResult(null)}
                className="inline-flex items-center justify-center text-sm py-3.5 px-5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
              >
                {isEn ? 'Close' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de navigation / étapes visuelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EBFF72] text-[#0E0E0E] flex items-center justify-center font-mono font-bold text-xs">
            01
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-mono">
              {isEn ? 'Industry' : 'Secteur'}
            </div>
            <div className="text-sm font-semibold text-white">
              {isEn ? activeIndustry.name.en : activeIndustry.name.fr}
            </div>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#212282] text-white flex items-center justify-center font-mono font-bold text-xs border border-white/20">
            02
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-mono">
              {isEn ? 'Add-ons Selected' : 'Options Métier'}
            </div>
            <div className="text-sm font-semibold text-white">
              {selectedAddonIds.length} {isEn ? 'modules selected' : 'modules activés'}
            </div>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#EBFF72]/30 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#EBFF72] font-mono">
              {isEn ? 'Live Price' : 'Estimation Directe'}
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {formatFCFA(totalPrice)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-white/60 block">
              {paymentSplits} {isEn ? 'splits' : 'tranches'}
            </span>
            <span className="text-xs font-mono text-[#EBFF72] font-semibold">
              ~{formatFCFA(splitAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Colonne Gauche : Sélecteur de Métier & Modules additionnels */}
        <div className="lg:col-span-7 space-y-8">
          {/* Étape 1 : Choix du Secteur */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#EBFF72] font-mono">1.</span>
                {isEn ? 'Select your business domain' : 'Sélectionnez votre domaine d\'activité'}
              </h3>
              <span className="text-xs font-mono text-white/50">
                {XPRESITE_INDUSTRIES.length} {isEn ? 'available packs' : 'packs disponibles'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {XPRESITE_INDUSTRIES.map((industry) => {
                const isSelected = industry.slug === selectedIndustrySlug;
                return (
                  <button
                    key={industry.id}
                    type="button"
                    onClick={() => handleSelectIndustry(industry.slug)}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-[#1C1C1C] border-[#EBFF72] shadow-lg shadow-[#EBFF72]/5'
                        : 'bg-[#141414] border-white/10 hover:border-white/20 hover:bg-[#181818]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#EBFF72]/15' : 'bg-white/5'}`}>
                        {renderIcon(industry.iconName, isSelected)}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        {isEn ? industry.badge.en : industry.badge.fr}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">
                      {isEn ? industry.name.en : industry.name.fr}
                    </div>
                    <div className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {isEn ? industry.tagline.en : industry.tagline.fr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Étape 2 : Modules & Fonctionnalités additionnelles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-[#EBFF72] font-mono">2.</span>
                {isEn ? 'Customize with domain add-ons' : 'Personnalisez avec vos options métier'}
              </h3>
              <span className="text-xs font-mono text-[#EBFF72]">
                {isEn ? 'Pick what you need' : 'À la carte'}
              </span>
            </div>

            {/* Base vitrine rappel */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EBFF72]/20 text-[#EBFF72] flex items-center justify-center text-xs">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {isEn ? 'Showcase Foundation + Domain + 1-Year Hosting' : 'Socle Vitrine + Nom de Domaine + 1 an d\'Hébergement'}
                  </div>
                  <div className="text-xs text-white/50">
                    {isEn ? 'Mobile-first design, local SEO, fast loading' : 'Design smartphone sur-mesure, SEO local, chargement ultra-léger'}
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-xs font-semibold text-[#EBFF72]">
                {formatFCFA(basePrice)}
              </div>
            </div>

            {/* Liste des add-ons du domaine */}
            <div className="space-y-2.5">
              {activeIndustry.addons.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                const isFree = addon.priceXAF === 0;

                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon.id, addon.priceXAF)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#1C1C1C] border-[#EBFF72]/60'
                        : 'bg-[#141414] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#EBFF72] text-[#0E0E0E]'
                            : 'border border-white/30 bg-transparent'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {isEn ? addon.title.en : addon.title.fr}
                          </span>
                          {addon.isRecommended && (
                            <span className="text-[9px] font-mono uppercase tracking-wider bg-[#EBFF72]/15 text-[#EBFF72] px-2 py-0.5 rounded-full">
                              {isEn ? 'Popular' : 'Recommandé'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">
                          {isEn ? addon.desc.en : addon.desc.fr}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 font-mono text-xs font-semibold">
                      {isFree ? (
                        <span className="text-[#EBFF72] bg-[#EBFF72]/10 px-2 py-1 rounded-md">
                          {isEn ? 'Included' : 'Inclus'}
                        </span>
                      ) : (
                        <span className="text-white/90">
                          +{formatFCFA(addon.priceXAF)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne Droite : Récapitulatif, Facilité de Paiement & Coordonnées */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-[#141414] border border-white/10 rounded-[24px] p-6 text-white space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#EBFF72] block mb-1">
                {isEn ? 'Instant Estimate' : 'Récapitulatif en direct'}
              </span>
              <h4 className="text-xl font-bold">
                {isEn ? 'Your Project Budget' : 'Budget de votre site'}
              </h4>
            </div>

            {/* Ventilation du prix */}
            <div className="space-y-3 pb-4 border-b border-white/10 text-sm">
              <div className="flex justify-between text-white/70">
                <span>{isEn ? 'Base Showcase Pack' : 'Socle Vitrine Clé en main'}</span>
                <span className="font-mono text-white">{formatFCFA(basePrice)}</span>
              </div>

              {addonsTotal > 0 && (
                <div className="flex justify-between text-white/70">
                  <span>{isEn ? 'Selected Add-ons' : 'Options spécifiques choisies'}</span>
                  <span className="font-mono text-white">+{formatFCFA(addonsTotal)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2 text-white">
                <span className="font-bold text-base">{isEn ? 'Total Net' : 'Total Net estimé'}</span>
                <span className="font-mono font-bold text-2xl text-[#EBFF72]">
                  {formatFCFA(totalPrice)}
                </span>
              </div>
            </div>

            {/* Sélecteur de Tranches de Paiement */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                  {isEn ? 'Payment facility' : 'Facilité de paiement'}
                </span>
                <span className="text-[11px] font-mono text-[#EBFF72]">
                  {isEn ? '0% Extra Fee' : 'Sans frais'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentSplits(2)}
                  className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                    paymentSplits === 2
                      ? 'bg-[#1C1C1C] border-[#EBFF72] text-white'
                      : 'bg-[#111] border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {isEn ? 'In 2 installments' : 'En 2 tranches'}
                  </div>
                  <div className="font-mono text-xs text-[#EBFF72]">
                    2 × {formatFCFA(Math.ceil(totalPrice / 2))}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentSplits(3)}
                  className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                    paymentSplits === 3
                      ? 'bg-[#1C1C1C] border-[#EBFF72] text-white'
                      : 'bg-[#111] border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {isEn ? 'In 3 installments' : 'En 3 tranches'}
                  </div>
                  <div className="font-mono text-xs text-[#EBFF72]">
                    3 × {formatFCFA(Math.ceil(totalPrice / 3))}
                  </div>
                </button>
              </div>
            </div>

            {/* Garanties clés */}
            <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-white/80">
                <FlashIcon size={16} className="text-[#EBFF72] shrink-0" />
                <span>
                  <strong>{isEn ? '72-Hour Delivery' : 'Livré en 72 heures chrono'}</strong>{' '}
                  {isEn ? 'upon receiving your elements' : 'dès réception de vos éléments (logo, photos, textes)'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/80">
                <Globe02Icon size={16} className="text-[#EBFF72] shrink-0" />
                <span>
                  {isEn ? '1 Year Domain & High-speed Hosting Included' : '1 an de Nom de Domaine & Hébergement haute vitesse inclus'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/80">
                <WhatsappIcon size={16} className="text-[#EBFF72] shrink-0" />
                <span>
                  {isEn ? 'Direct WhatsApp Ordering & Support' : 'Prise de contact & commande directe par WhatsApp'}
                </span>
              </div>
            </div>

            {/* Formulaire de Contact */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-white/60 mb-1">
                {isEn ? 'Your Contact Details' : 'Vos Coordonnées'}
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'Your full name *' : 'Votre nom complet *'}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={isEn ? 'Business name' : 'Nom de l\'entreprise'}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
                <input
                  type="text"
                  placeholder={isEn ? 'City (e.g. Douala)' : 'Ville (ex: Douala)'}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder={isEn ? 'WhatsApp Phone (+237 6...) *' : 'Numéro WhatsApp (+237 6...) *'}
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder={isEn ? 'Email address (optional)' : 'Adresse e-mail (facultative)'}
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-[#111] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              {errorMessage && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EBFF72] text-[#0E0E0E] font-bold text-sm py-4 px-6 rounded-full hover:bg-[#d8ed50] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#EBFF72]/10"
              >
                {isSubmitting ? (
                  <span>{isEn ? 'Generating your quote...' : 'Génération du devis en cours...'}</span>
                ) : (
                  <>
                    <span>
                      {isEn
                        ? 'Generate Quote & Finalize on WhatsApp'
                        : 'Générer mon devis & Finaliser sur WhatsApp'}
                    </span>
                    <ArrowRight01Icon size={16} className="text-[#0E0E0E]" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-white/40 text-center leading-relaxed">
                {isEn
                  ? 'No advance payment required for simulation. Instant quote sent directly to your WhatsApp.'
                  : 'Sans engagement immédiat. Votre devis chiffré vous est transmis instantanément sur WhatsApp.'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
