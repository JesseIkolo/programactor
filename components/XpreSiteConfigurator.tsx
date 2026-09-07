'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Store01Icon,
  Hospital01Icon,
  Briefcase01Icon,
  LaptopIcon,
  Building01Icon,
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

  // Configuration dynamique avec fallback
  const [config, setConfig] = useState<any>({
    defaultBasePriceXAF: XPRESITE_CONFIG.defaultBasePriceXAF,
    deliveryDelay: '72h',
    allowThreeSplits: true,
    minAmountForThreeSplits: 100000,
    hostingIncludedYears: 1,
    industries: XPRESITE_INDUSTRIES,
  });

  // Charger la configuration dynamique depuis le backend
  useEffect(() => {
    fetch('/api/xpresite/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig(data.data);
          if (Array.isArray(data.data.industries) && data.data.industries.length > 0) {
            const activeInds = data.data.industries.filter((i: any) => i.isActive !== false);
            if (activeInds.length > 0) {
              const currentExists = activeInds.some((i: any) => i.slug === selectedIndustrySlug);
              if (!currentExists) {
                setSelectedIndustrySlug(activeInds[0].slug);
              }
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  // Liste des secteurs actifs
  const industries: any[] = useMemo(() => {
    if (Array.isArray(config.industries) && config.industries.length > 0) {
      const active = config.industries.filter((i: any) => i.isActive !== false);
      if (active.length > 0) return active;
    }
    return XPRESITE_INDUSTRIES;
  }, [config.industries]);

  // État du configurateur
  const [selectedIndustrySlug, setSelectedIndustrySlug] = useState<string>(
    XPRESITE_INDUSTRIES[0]?.slug || 'restaurant'
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
  const activeIndustry: any = useMemo(() => {
    return (
      industries.find((i) => i.slug === selectedIndustrySlug) ||
      industries[0] ||
      XPRESITE_INDUSTRIES[0]
    );
  }, [industries, selectedIndustrySlug]);

  // Initialiser les options gratuites ou recommandées au changement de secteur
  const handleSelectIndustry = (slug: string) => {
    setSelectedIndustrySlug(slug);
    const ind = industries.find((i) => i.slug === slug);
    if (ind && Array.isArray(ind.addons)) {
      const defaultAddonIds = ind.addons
        .filter((a: any) => a.isDefaultSelected || a.priceXAF === 0)
        .map((a: any) => a.id);
      setSelectedAddonIds(defaultAddonIds);
    }
  };

  // Initialisation des options pour le secteur par défaut
  useEffect(() => {
    if (activeIndustry && Array.isArray(activeIndustry.addons) && selectedAddonIds.length === 0) {
      const defaultAddonIds = activeIndustry.addons
        .filter((a: any) => a.isDefaultSelected || a.priceXAF === 0)
        .map((a: any) => a.id);
      setSelectedAddonIds(defaultAddonIds);
    }
  }, [activeIndustry]);

  // Toggle option additionnelle
  const handleToggleAddon = (addonId: string, price: number) => {
    if (price === 0) return; // L'option de base reste active
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Calcul du prix de base spécifique au secteur ou global
  const basePrice = Number(activeIndustry?.basePriceXAF) || Number(config.defaultBasePriceXAF) || 75000;

  const addonsTotal = useMemo(() => {
    if (!activeIndustry || !Array.isArray(activeIndustry.addons)) return 0;
    return activeIndustry.addons
      .filter((addon: any) => selectedAddonIds.includes(addon.id))
      .reduce((sum: number, addon: any) => sum + (Number(addon.priceXAF) || 0), 0);
  }, [activeIndustry, selectedAddonIds]);

  const totalPrice = basePrice + addonsTotal;

  // Règle d'éligibilité au paiement en 3 tranches
  const minThreeSplits = Number(config.minAmountForThreeSplits) || 100000;
  const isThreeSplitsAllowed = config.allowThreeSplits !== false && totalPrice >= minThreeSplits;

  // Si 3 tranches sélectionnées mais plus éligible, revenir à 2
  useEffect(() => {
    if (!isThreeSplitsAllowed && paymentSplits === 3) {
      setPaymentSplits(2);
    }
  }, [isThreeSplitsAllowed, paymentSplits]);

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
      const selectedAddonTitles = (activeIndustry.addons || [])
        .filter((a: any) => selectedAddonIds.includes(a.id))
        .map((a: any) => `${isEn ? a.title.en : a.title.fr} (${a.priceXAF === 0 ? (isEn ? 'Included' : 'Inclus') : formatFCFA(a.priceXAF)})`);

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
      case 'store':
        return <Store01Icon size={20} className={iconClass} />;
      case 'health':
        return <Hospital01Icon size={20} className={iconClass} />;
      case 'building':
        return <Building01Icon size={20} className={iconClass} />;
      case 'laptop':
        return <LaptopIcon size={20} className={iconClass} />;
      default:
        return <Briefcase01Icon size={20} className={iconClass} />;
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

            <p className="text-sm text-white/70 mb-4">
              {isEn
                ? 'Your project reference has been locked. A dedicated WhatsApp link has been generated to finalize your delivery directly with our team.'
                : 'Votre référence de devis est enregistrée. Un lien direct WhatsApp a été préparé pour finaliser les détails avec l\'équipe Programactor.'}
            </p>

            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2 mb-6">
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Reference' : 'Référence'} :</span>
                <span className="text-[#EBFF72] font-semibold">{quoteResult.reference}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Total Price' : 'Montant Total'} :</span>
                <span className="text-white font-semibold">{quoteResult.totalFormatted}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Payment facility' : 'Facilité'} :</span>
                <span className="text-white">
                  {paymentSplits} {isEn ? 'splits of' : 'tranches de'} ~{quoteResult.splitFormatted}
                </span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Guaranteed Turnaround' : 'Délai Garanti'} :</span>
                <span className="text-[#EBFF72] font-semibold">{config.deliveryDelay || '72h'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={quoteResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-sans font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <WhatsappIcon size={18} />
                <span>{isEn ? 'Open WhatsApp' : 'Ouvrir WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={() => setQuoteResult(null)}
                className="py-3.5 px-5 bg-white/10 hover:bg-white/15 text-white font-mono text-xs rounded-xl transition-colors"
              >
                {isEn ? 'Close' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de progression / Étapes rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EBFF72] text-[#0E0E0E] flex items-center justify-center font-mono font-bold text-xs">
            01
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-mono">
              {isEn ? 'Industry' : 'Secteur'}
            </div>
            <div className="text-sm font-semibold text-white">
              {isEn ? activeIndustry?.name?.en : activeIndustry?.name?.fr}
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
                {industries.length} {isEn ? 'available packs' : 'packs disponibles'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industries.map((industry: any) => {
                const isSelected = industry.slug === selectedIndustrySlug;
                const sectorBase = industry.basePriceXAF || config.defaultBasePriceXAF;
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
                      <span className="text-[10px] font-mono text-[#EBFF72] font-bold bg-[#EBFF72]/10 px-2 py-0.5 rounded-full">
                        {formatFCFA(sectorBase)}
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
              {(activeIndustry?.addons || []).map((addon: any) => {
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
                          {addon.isDefaultSelected && (
                            <span className="text-[9px] font-mono uppercase tracking-wider bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                              {isEn ? 'Default' : 'Par défaut'}
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
                {isEn ? 'Your Tailored Package' : 'Votre Pack Sur-Mesure'}
              </h4>
            </div>

            {/* Lignes de calcul */}
            <div className="space-y-3 font-mono text-xs border-b border-white/10 pb-4">
              <div className="flex justify-between text-white/70">
                <span>{isEn ? 'Industry Base' : 'Socle Métier'}</span>
                <span className="text-white">{formatFCFA(basePrice)}</span>
              </div>

              {selectedAddonIds.length > 0 && (
                <div className="flex justify-between text-white/70">
                  <span>
                    {isEn ? 'Add-on features' : 'Options activées'} ({selectedAddonIds.length})
                  </span>
                  <span className="text-white">+{formatFCFA(addonsTotal)}</span>
                </div>
              )}

              <div className="flex justify-between text-white/70">
                <span>{isEn ? 'Domain & Hosting 1 yr' : 'Domaine & Hébergement 1 an'}</span>
                <span className="text-[#EBFF72] font-bold">{isEn ? 'FREE' : 'OFFERT'}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                <span>{isEn ? 'TOTAL ESTIMATE' : 'TOTAL ESTIMÉ'}</span>
                <span className="text-base text-[#EBFF72]">{formatFCFA(totalPrice)}</span>
              </div>
            </div>

            {/* Facilité de paiement (2 ou 3 tranches selon éligibilité) */}
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
                  disabled={!isThreeSplitsAllowed}
                  onClick={() => isThreeSplitsAllowed && setPaymentSplits(3)}
                  className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                    !isThreeSplitsAllowed
                      ? 'bg-[#111]/40 border-white/5 text-white/25 cursor-not-allowed'
                      : paymentSplits === 3
                      ? 'bg-[#1C1C1C] border-[#EBFF72] text-white'
                      : 'bg-[#111] border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>{isEn ? 'In 3 installments' : 'En 3 tranches'}</span>
                    {!isThreeSplitsAllowed && (
                      <span className="text-[9px] font-mono text-white/40">
                        {isEn ? `Min ${minThreeSplits / 1000}k` : `Dès ${minThreeSplits / 1000}k`}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-[#EBFF72]">
                    {isThreeSplitsAllowed ? `3 × ${formatFCFA(Math.ceil(totalPrice / 3))}` : 'Inéligible'}
                  </div>
                </button>
              </div>
            </div>

            {/* Délai et garanties clés */}
            <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-white/80">
                <FlashIcon size={16} className="text-[#EBFF72] shrink-0" />
                <span>
                  <strong>
                    {isEn
                      ? `${config.deliveryDelay || '72-Hour'} Guaranteed Delivery`
                      : `Livré en ${config.deliveryDelay || '72h'} chrono`}
                  </strong>{' '}
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
                  className="w-full px-3.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder={isEn ? 'WhatsApp Phone (+237 / +241 ...) *' : 'Téléphone WhatsApp (+237 / +241 ...) *'}
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={isEn ? 'Company / Brand' : 'Entreprise / Enseigne'}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
                <input
                  type="text"
                  placeholder={isEn ? 'City (Douala, Libreville...)' : 'Ville (Douala, Libreville...)'}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder={isEn ? 'Email (Optional)' : 'Adresse email (Optionnel)'}
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-sans font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EBFF72]/10 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    <span>{isEn ? 'Generating quote...' : 'Génération du devis...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isEn ? 'Lock This Quote & Open WhatsApp' : 'Valider ce devis & Ouvrir WhatsApp'}</span>
                    <ArrowRight01Icon size={16} />
                  </>
                )}
              </button>

              <div className="text-[11px] font-mono text-white/40 text-center pt-1">
                {isEn
                  ? '🔒 Free estimate, no payment required upfront.'
                  : '🔒 Devis immédiat sans engagement, aucun paiement requis maintenant.'}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
