'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  XpreSiteConfig,
  XPRESITE_CONFIG,
  XPRESITE_PLANS,
  XPRESITE_OPTIONS,
  XPRESITE_INDUSTRIES,
  XpreSitePlan,
  XpreSiteOption,
} from '@/lib/xpresite-data';
import {
  Restaurant01Icon,
  Car01Icon,
  Building01Icon,
  Store01Icon,
  FlashIcon,
  Globe02Icon,
  WhatsappIcon,
  CheckmarkCircle02Icon,
  UserIcon,
  Call02Icon,
  Mail01Icon,
  Building02Icon,
  ArrowRight01Icon,
  AlertCircleIcon,
  SparklesIcon,
} from 'hugeicons-react';

interface XpreSiteConfiguratorProps {
  initialConfig?: XpreSiteConfig;
  lang?: 'fr' | 'en';
}

function formatFCFA(val: number): string {
  return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
}

export default function XpreSiteConfigurator({
  initialConfig,
  lang = 'fr',
}: XpreSiteConfiguratorProps) {
  const isEn = lang === 'en';
  const [config, setConfig] = useState<XpreSiteConfig>(initialConfig || XPRESITE_CONFIG);

  // Charger config backend si dispo
  useEffect(() => {
    fetch('/api/xpresite/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch(() => {});
  }, []);

  const industries = useMemo(() => {
    if (Array.isArray(config.industries) && config.industries.length > 0) {
      return config.industries.filter((i) => i.isActive !== false);
    }
    return XPRESITE_INDUSTRIES;
  }, [config.industries]);

  const plans: XpreSitePlan[] = useMemo(() => {
    return config.plans && config.plans.length > 0 ? config.plans : XPRESITE_PLANS;
  }, [config.plans]);

  const options: XpreSiteOption[] = useMemo(() => {
    return config.globalOptions && config.globalOptions.length > 0
      ? config.globalOptions
      : XPRESITE_OPTIONS;
  }, [config.globalOptions]);

  // État du configurateur
  const [selectedIndustrySlug, setSelectedIndustrySlug] = useState<string>(
    industries[0]?.slug || 'restaurant'
  );
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<'essentiel' | 'complet'>('complet');
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);

  // Coordonnées du prospect
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('Douala');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<{
    reference: string;
    whatsappUrl: string;
    totalFormatted: string;
    depositFormatted: string;
    balanceFormatted: string;
  } | null>(null);

  // Industrie active
  const activeIndustry = useMemo(() => {
    return (
      industries.find((i) => i.slug === selectedIndustrySlug) ||
      industries[0] ||
      XPRESITE_INDUSTRIES[0]
    );
  }, [industries, selectedIndustrySlug]);

  // Formule active
  const activePlan = useMemo(() => {
    return plans.find((p) => p.slug === selectedPlanSlug) || plans[0] || XPRESITE_PLANS[0];
  }, [plans, selectedPlanSlug]);

  // Toggle option
  const handleToggleOption = (optId: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
    );
  };

  // Calculs financiers
  const planPrice = Number(activePlan.priceXAF) || 75000;
  const optionsTotal = useMemo(() => {
    return options
      .filter((opt) => selectedOptionIds.includes(opt.id))
      .reduce((sum, opt) => sum + (Number(opt.priceXAF) || 0), 0);
  }, [options, selectedOptionIds]);

  const totalPrice = planPrice + optionsTotal;
  const depositAmount = Math.round(totalPrice * 0.5);
  const balanceAmount = totalPrice - depositAmount;

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMessage(
        isEn
          ? 'Please provide your name and WhatsApp phone number.'
          : 'Veuillez renseigner votre nom et votre numéro WhatsApp.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedOptionNames = options
        .filter((opt) => selectedOptionIds.includes(opt.id))
        .map((opt) => `${isEn ? opt.name.en : opt.name.fr} (+${formatFCFA(opt.priceXAF)})`);

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
          planSlug: selectedPlanSlug,
          planName: isEn ? activePlan.name.en : activePlan.name.fr,
          selectedAddonTitles: selectedOptionNames,
          basePriceXAF: planPrice,
          addonsTotalXAF: optionsTotal,
          totalPriceXAF: totalPrice,
          depositXAF: depositAmount,
          balanceXAF: balanceAmount,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération du devis.');
      }

      setQuoteResult({
        reference: data.quoteReference || `DEV-${Date.now().toString().slice(-4)}`,
        whatsappUrl: data.whatsappUrl,
        totalFormatted: formatFCFA(totalPrice),
        depositFormatted: formatFCFA(depositAmount),
        balanceFormatted: formatFCFA(balanceAmount),
      });

      // Redirection immédiate et sécurisée vers WhatsApp (pas de window.open bloqué par iOS)
      if (typeof window !== 'undefined' && data.whatsappUrl) {
        setTimeout(() => {
          window.location.href = data.whatsappUrl;
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIndustryIcon = (name: string, active: boolean) => {
    const iconClass = active ? 'text-[#EBFF72]' : 'text-white/70';
    switch (name) {
      case 'utensils':
        return <Restaurant01Icon size={20} className={iconClass} />;
      case 'building':
        return <Building01Icon size={20} className={iconClass} />;
      case 'car':
        return <Car01Icon size={20} className={iconClass} />;
      default:
        return <Store01Icon size={20} className={iconClass} />;
    }
  };

  return (
    <div id="configurateur" className="scroll-mt-24">
      {quoteResult ? (
        /* Écran de confirmation après soumission */
        <div className="bg-[#141414] border border-[#EBFF72]/40 rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto space-y-6 shadow-2xl shadow-[#EBFF72]/10 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-[#EBFF72]/15 border border-[#EBFF72] text-[#EBFF72] flex items-center justify-center mx-auto">
            <CheckmarkCircle02Icon size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#EBFF72]">
              {isEn ? 'Quote Recorded' : 'Devis enregistré avec succès'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {isEn ? 'Opening your WhatsApp...' : 'Ouverture de votre WhatsApp en cours...'}
            </h3>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              {isEn
                ? `Reference #${quoteResult.reference} · Total: ${quoteResult.totalFormatted}. 50% deposit: ${quoteResult.depositFormatted}.`
                : `Réf. #${quoteResult.reference} · Total : ${quoteResult.totalFormatted}. Acompte 50 % : ${quoteResult.depositFormatted}.`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-left font-mono text-xs space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between text-white/60">
              <span>{isEn ? 'Total:' : 'Montant total :'}</span>
              <span className="text-white font-bold">{quoteResult.totalFormatted}</span>
            </div>
            <div className="flex justify-between text-[#EBFF72]">
              <span>{isEn ? '50% deposit upon order:' : 'Acompte à la commande (50 %) :'}</span>
              <span className="font-bold">{quoteResult.depositFormatted}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>{isEn ? 'Balance upon delivery:' : 'Solde à la livraison :'}</span>
              <span className="text-white">{quoteResult.balanceFormatted}</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={quoteResult.whatsappUrl}
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-sm transition-all shadow-xl shadow-[#EBFF72]/20"
            >
              <WhatsappIcon size={20} />
              <span>{isEn ? 'Click here if WhatsApp didn\'t open' : 'Cliquez ici si WhatsApp ne s\'est pas ouvert'}</span>
            </a>
          </div>

          <p className="text-[11px] font-mono text-white/40">
            {isEn
              ? 'Jesse will confirm your quote on WhatsApp in under 2 hours (Mon–Sat).'
              : 'Jesse vous confirme le devis sur WhatsApp en moins de 2 h (lun.–sam.).'}
          </p>
        </div>
      ) : (
        /* Formulaire du configurateur */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonne Gauche : Étape 1 (Secteur) + Étape 2 (Formule & Options) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Étape 1 : Choix du Secteur */}
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#EBFF72] font-mono">1.</span>
                  {isEn ? 'Select your business type' : 'Votre secteur d\'activité'}
                </h3>
                <span className="text-xs font-mono text-white/50">
                  {isEn ? 'from 75,000 FCFA' : 'dès 75 000 FCFA'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industries.map((ind: any) => {
                  const isSelected = ind.slug === selectedIndustrySlug;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setSelectedIndustrySlug(ind.slug)}
                      className={`p-4 rounded-2xl text-left transition-all border ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#EBFF72] shadow-lg shadow-[#EBFF72]/5'
                          : 'bg-black/30 border-white/10 hover:border-white/25 hover:bg-[#181818]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#EBFF72]/15' : 'bg-white/5'}`}>
                          {renderIndustryIcon(ind.iconName, isSelected)}
                        </div>
                        <span className="text-[11px] font-mono text-[#EBFF72] font-medium bg-[#EBFF72]/10 px-2.5 py-0.5 rounded-full">
                          {isEn ? 'from 75k' : 'dès 75k'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">
                        {isEn ? ind.name.en : ind.name.fr}
                      </div>
                      <div className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                        {isEn ? ind.tagline.en : ind.tagline.fr}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Passerelles produits spécifiques (Restaurant & Loueurs) */}
              {activeIndustry.productBridges && activeIndustry.productBridges.length > 0 && (
                <div className="pt-2 space-y-2 border-t border-white/5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                    {isEn ? 'Related turnkey products:' : 'Produits associés recommandés :'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeIndustry.productBridges.map((b: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{b.title}</div>
                          <div className="text-[11px] font-mono text-[#EBFF72] mt-0.5">{b.price}</div>
                        </div>
                        {b.url ? (
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="t-mono text-[11px] text-white/70 hover:text-[#EBFF72] inline-flex items-center gap-1 font-medium"
                          >
                            <span>{b.cta}</span>
                            <span>→</span>
                          </a>
                        ) : (
                          <a
                            href={`https://wa.me/237692025552?text=${encodeURIComponent(
                              isEn
                                ? 'Hello Programactor, I would like to receive the free preview for my restaurant digital menu.'
                                : 'Bonjour Programactor, je gère un restaurant ou un bar et je souhaite recevoir l\'aperçu gratuit de mon menu digital.'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="t-mono text-[11px] text-[#EBFF72] hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <span>{b.cta}</span>
                            <span>→</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Étape 2 : Choix de la Formule (Essentiel 75k vs Complet 130k) */}
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#EBFF72] font-mono">2.</span>
                  {isEn ? 'Choose your base package' : 'Choisissez votre formule'}
                </h3>
                <span className="text-xs font-mono text-[#EBFF72]">
                  {isEn ? 'Exclusive choice' : 'Choix unique'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plans.map((p) => {
                  const isSelected = p.slug === selectedPlanSlug;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanSlug(p.slug)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#EBFF72] shadow-xl shadow-[#EBFF72]/10 ring-1 ring-[#EBFF72]'
                          : 'bg-black/30 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-white">
                            {isEn ? p.name.en : p.name.fr}
                          </span>
                          {p.badge && (
                            <span className="text-[10px] font-mono uppercase tracking-wider bg-[#EBFF72] text-[#0E0E0E] font-bold px-2 py-0.5 rounded-full">
                              {isEn ? p.badge.en : p.badge.fr}
                            </span>
                          )}
                        </div>

                        <div className="text-2xl font-bold font-mono text-[#EBFF72] mb-1">
                          {formatFCFA(p.priceXAF)}
                        </div>
                        <div className="text-xs font-mono text-white/50 mb-3">
                          {isEn ? p.delay.en : p.delay.fr}
                        </div>

                        <p className="text-xs text-white/70 leading-relaxed mb-4">
                          {isEn ? p.description.en : p.description.fr}
                        </p>

                        <div className="space-y-1.5 border-t border-white/10 pt-3">
                          {(isEn ? p.features.en : p.features.fr).map((feat, fidx) => (
                            <div key={fidx} className="flex items-start gap-2 text-xs text-white/80">
                              <span className="text-[#EBFF72] font-bold">✓</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-mono text-white/60">
                          {isSelected ? (isEn ? 'Selected' : 'Formule choisie') : (isEn ? 'Select this plan' : 'Choisir cette formule')}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? 'bg-[#EBFF72] border-[#EBFF72] text-[#0E0E0E]'
                              : 'border-white/30'
                          }`}
                        >
                          {isSelected && <span className="text-[10px] font-bold">●</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Étape 3 : Options à la carte */}
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#EBFF72] font-mono">3.</span>
                  {isEn ? 'Optional add-ons' : 'Options à la carte (facultatif)'}
                </h3>
                <span className="text-xs font-mono text-white/50">
                  {isEn ? 'Cumulable' : 'Cumulable'}
                </span>
              </div>

              <div className="space-y-3">
                {options.map((opt) => {
                  const isSelected = selectedOptionIds.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleOption(opt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#EBFF72]/70 shadow-md shadow-[#EBFF72]/5'
                          : 'bg-black/30 border-white/10 hover:border-white/20'
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
                          {isSelected && <span className="text-xs font-bold">✓</span>}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {isEn ? opt.name.en : opt.name.fr}
                          </div>
                          <p className="text-xs text-white/60 mt-1 leading-relaxed">
                            {isEn ? opt.desc.en : opt.desc.fr}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 font-mono text-xs font-bold text-[#EBFF72]">
                        +{formatFCFA(opt.priceXAF)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne Droite : Récapitulatif, Modalités de Paiement & Formulaire */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-7 text-white space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#EBFF72] block mb-1">
                  {isEn ? 'Instant Estimate' : 'Grille officielle Programactor'}
                </span>
                <h4 className="text-xl font-bold">
                  {isEn ? 'Your Estimate' : 'Votre Devis Chiffré'}
                </h4>
              </div>

              {/* Lignes de calcul */}
              <div className="space-y-3 font-mono text-xs border-b border-white/10 pb-4">
                <div className="flex justify-between text-white/70">
                  <span>{isEn ? activePlan.name.en : activePlan.name.fr}</span>
                  <span className="text-white font-bold">{formatFCFA(planPrice)}</span>
                </div>

                {selectedOptionIds.length > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>
                      {isEn ? 'Add-on features' : 'Options activées'} ({selectedOptionIds.length})
                    </span>
                    <span className="text-[#EBFF72]">+{formatFCFA(optionsTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/70">
                  <span>{isEn ? 'Domain & Hosting 1 yr' : 'Domaine & Hébergement 1 an'}</span>
                  <span className="text-[#EBFF72] font-bold">{isEn ? 'INCLUDED' : 'INCLUS'}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-white/10">
                  <span>{isEn ? 'TOTAL' : 'TOTAL'}</span>
                  <span className="text-base text-[#EBFF72]">{formatFCFA(totalPrice)}</span>
                </div>
              </div>

              {/* Acompte 50 % et solde à la livraison (décision non négociable) */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 font-mono text-xs">
                <div className="text-white/50 uppercase tracking-wider text-[10px]">
                  {isEn ? 'Payment breakdown (50% deposit)' : 'Conditions de règlement'}
                </div>
                <div className="flex justify-between text-[#EBFF72] font-bold text-sm">
                  <span>{isEn ? 'Deposit upon order (50%):' : 'Acompte à la commande (50 %) :'}</span>
                  <span>{formatFCFA(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>{isEn ? 'Balance upon delivery:' : 'Solde à la livraison :'}</span>
                  <span>{formatFCFA(balanceAmount)}</span>
                </div>
              </div>

              {/* Moyens de paiement par pays */}
              <div className="space-y-1.5 text-xs text-white/60">
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {isEn ? 'Payment methods accepted:' : 'Moyens de paiement acceptés :'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EBFF72]" />
                  <span><strong>Cameroun :</strong> Orange Money, MTN MoMo, virement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EBFF72]" />
                  <span><strong>Gabon :</strong> Airtel Money, virement bancaire</span>
                </div>
              </div>

              {/* Formulaire de coordonnées */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/10">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertCircleIcon size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="quoteName" className="block text-xs font-mono text-white/70 mb-1 flex items-center gap-1.5">
                    <UserIcon size={13} className="text-[#EBFF72]" />
                    <span>{isEn ? 'YOUR NAME *' : 'VOTRE NOM & PRÉNOM *'}</span>
                  </label>
                  <input
                    id="quoteName"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Ex: Jean-Paul Ngo"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                <div>
                  <label htmlFor="quotePhone" className="block text-xs font-mono text-white/70 mb-1 flex items-center gap-1.5">
                    <Call02Icon size={13} className="text-[#EBFF72]" />
                    <span>{isEn ? 'WHATSAPP NUMBER *' : 'NUMÉRO WHATSAPP *'}</span>
                  </label>
                  <input
                    id="quotePhone"
                    name="tel"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    placeholder="6 XX XX XX XX ou +237 6..."
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="quoteCompany" className="block text-xs font-mono text-white/70 mb-1 flex items-center gap-1.5">
                      <Building02Icon size={13} className="text-[#EBFF72]" />
                      <span>{isEn ? 'ESTABLISHMENT' : 'ÉTABLISSEMENT'}</span>
                    </label>
                    <input
                      id="quoteCompany"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="Ex: Le Grill Douala"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                    />
                  </div>
                  <div>
                    <label htmlFor="quoteCity" className="block text-xs font-mono text-white/70 mb-1">
                      {isEn ? 'CITY' : 'VILLE'}
                    </label>
                    <input
                      id="quoteCity"
                      name="city"
                      type="text"
                      placeholder="Douala / Libreville"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quoteEmail" className="block text-xs font-mono text-white/70 mb-1 flex items-center gap-1.5">
                    <Mail01Icon size={13} className="text-[#EBFF72]" />
                    <span>{isEn ? 'EMAIL (OPTIONAL)' : 'EMAIL (FACULTATIF)'}</span>
                  </label>
                  <input
                    id="quoteEmail"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="contact@etablissement.cm"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#EBFF72]/15 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                      <span>{isEn ? 'Generating quote...' : 'Validation en cours...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isEn ? 'Validate Quote & Open WhatsApp' : 'Valider ce devis & Ouvrir WhatsApp'}</span>
                      <ArrowRight01Icon size={18} />
                    </>
                  )}
                </button>

                <p className="text-[10px] font-mono text-center text-white/40 leading-relaxed">
                  {isEn
                    ? 'Free quote without commitment. Jesse confirms your order on WhatsApp within 2 hours.'
                    : 'Devis gratuit sans engagement. Jesse vous confirme le devis sur WhatsApp sous 2 h.'}
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
