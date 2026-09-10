'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tick01Icon,
  WhatsappIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  LaptopIcon,
  Store01Icon,
  UserIcon,
  CreditCardIcon,
  ChartBarLineIcon,
  Layers01Icon,
  Globe02Icon,
  Calendar03Icon,
  Notification03Icon,
  PaintBoardIcon,
  FlashIcon,
  Building01Icon,
  CheckmarkCircle01Icon,
} from 'hugeicons-react';

interface CustomSiteWizardProps {
  lang?: 'fr' | 'en';
}

export function CustomSiteWizard({ lang = 'fr' }: CustomSiteWizardProps) {
  const isEn = lang === 'en';
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Étape 1 : Type de projet
  const [projectType, setProjectType] = useState<string>('Site Vitrine d\'Envergure');

  // Étape 2 : Fonctionnalités
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    isEn ? 'Direct WhatsApp Conversion' : 'Conversion & Leads WhatsApp Direct',
    isEn ? 'Mobile-First UI/UX Design' : 'Design Mobile-First Ultra-Rapide',
  ]);

  // Étape 3 : Design & Délais
  const [designPreference, setDesignPreference] = useState<string>(
    isEn
      ? 'I have a logo & basic identity; studio designs full UI/UX'
      : 'J\'ai un logo et une identité de base, le studio conçoit l\'UI/UX complète'
  );
  const [timeline, setTimeline] = useState<string>(
    isEn ? 'Standard (3 to 5 weeks)' : 'Standard (3 à 5 semaines)'
  );

  // Étape 4 : Budget & Coordonnées
  const [budgetRange, setBudgetRange] = useState<string>('350.000 – 750.000 FCFA');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<{
    reference: string;
    whatsappUrl: string;
  } | null>(null);

  // Types de projets proposés
  const projectTypes = [
    {
      id: 'vitrine-prestige',
      name: {
        fr: 'Site Vitrine d\'Envergure & Corporate',
        en: 'Corporate & High-End Showcase Site',
      },
      desc: {
        fr: 'Storytelling de marque, design interactif, animations soignées et référencement Google maximal.',
        en: 'Brand storytelling, interactive design, refined animations, and high Google visibility.',
      },
      icon: LaptopIcon,
    },
    {
      id: 'ecommerce-marketplace',
      name: {
        fr: 'E-Commerce & Catalogue Avancé',
        en: 'Advanced E-Commerce & Catalog',
      },
      desc: {
        fr: 'Boutique en ligne avec paiements Mobile Money/Carte, gestion de stocks et suivi de commandes.',
        en: 'Online store with Mobile Money/Card payments, inventory tracking, and order workflows.',
      },
      icon: Store01Icon,
    },
    {
      id: 'saas-platform',
      name: {
        fr: 'Plateforme Web / SaaS / Espace Membre',
        en: 'Web Platform / SaaS / Client Portal',
      },
      desc: {
        fr: 'Authentification sécurisée, tableau de bord client, gestion d\'abonnements et espace privatif.',
        en: 'Secure login, member dashboard, subscription plans, and proprietary data processing.',
      },
      icon: Layers01Icon,
    },
    {
      id: 'app-metier',
      name: {
        fr: 'Application Métier & Outil de Gestion',
        en: 'Custom Internal Tool & Operations App',
      },
      desc: {
        fr: 'Numérisation des opérations (logistique, devis, réservations complexes, CRM sur-mesure).',
        en: 'Digitization of operations (logistics, automated quotes, custom booking engines, CRM).',
      },
      icon: Building01Icon,
    },
    {
      id: 'redesign-scale',
      name: {
        fr: 'Refonte & Modernisation Haute Performance',
        en: 'High-Performance Redesign & Scale',
      },
      desc: {
        fr: 'Transformation complète d\'un site existant devenu lent ou obsolète avec stack moderne Next.js.',
        en: 'Complete overhaul of an outdated or sluggish website with lightning-fast Next.js stack.',
      },
      icon: FlashIcon,
    },
    {
      id: 'other-custom',
      name: {
        fr: 'Autre Projet Sur-Mesure / Hybride',
        en: 'Other Bespoke / Hybrid Project',
      },
      desc: {
        fr: 'Projet hybride combinant plusieurs technologies, intelligence artificielle ou APIs tierces.',
        en: 'Hybrid product combining custom integrations, AI capabilities, or proprietary workflows.',
      },
      icon: PaintBoardIcon,
    },
  ];

  // Options de fonctionnalités (Étape 2)
  const availableFeatures = [
    {
      id: 'feat-momo-pay',
      title: {
        fr: 'Paiement en Ligne (Mobile Money & Cartes)',
        en: 'Online Payments (Mobile Money & Cards)',
      },
      desc: {
        fr: 'Intégration Orange Money, MTN MoMo, Visa/Mastercard sécurisée.',
        en: 'Secure integration of MTN MoMo, Orange Money, and Visa/Mastercard.',
      },
      icon: CreditCardIcon,
    },
    {
      id: 'feat-auth-portal',
      title: {
        fr: 'Espace Membre & Authentification',
        en: 'Member Area & Authentication',
      },
      desc: {
        fr: 'Comptes utilisateurs, profils sécurisés et gestion de permissions.',
        en: 'User accounts, role-based permissions, and client portal.',
      },
      icon: UserIcon,
    },
    {
      id: 'feat-dashboard',
      title: {
        fr: 'Dashboard d\'Administration & Statistiques',
        en: 'Custom Admin Dashboard & Analytics',
      },
      desc: {
        fr: 'Suivi de vos ventes, leads, clients et exports de rapports en 1 clic.',
        en: 'Live monitoring of sales, leads, clients, and 1-click reports export.',
      },
      icon: ChartBarLineIcon,
    },
    {
      id: 'feat-api-connect',
      title: {
        fr: 'Connexion APIs & Outils Métier Tiers',
        en: 'Third-Party APIs & CRM Sync',
      },
      desc: {
        fr: 'Synchronisation CRM, ERP, WhatsApp Cloud API, logiciels de caisse.',
        en: 'Sync with your CRM, ERP, WhatsApp Cloud API, or POS systems.',
      },
      icon: Layers01Icon,
    },
    {
      id: 'feat-multilingual',
      title: {
        fr: 'Multilingue & Multi-Devises',
        en: 'Multilingual & Multi-Currency',
      },
      desc: {
        fr: 'Architecture multilingue sans traduction machine, conversion XAF / EUR / USD.',
        en: 'Handcrafted bilingual pages and dynamic currency conversions.',
      },
      icon: Globe02Icon,
    },
    {
      id: 'feat-booking-engine',
      title: {
        fr: 'Moteur de Réservation & Prise de RDV',
        en: 'Advanced Booking & Scheduling Engine',
      },
      desc: {
        fr: 'Calendrier interactif synchronisé, blocage de créneaux et rappels.',
        en: 'Interactive synced calendar, slot management, and automated reminders.',
      },
      icon: Calendar03Icon,
    },
    {
      id: 'feat-notifications',
      title: {
        fr: 'Notifications SMS, WhatsApp & Emails Automatisés',
        en: 'Automated WhatsApp, SMS & Email Alerts',
      },
      desc: {
        fr: 'Alertes instantanées à chaque commande, réservation ou message entrant.',
        en: 'Instant notifications on new orders, confirmed bookings, or inbound leads.',
      },
      icon: Notification03Icon,
    },
    {
      id: 'feat-seo-advanced',
      title: {
        fr: 'Référencement SEO & Balisage GEO / Local',
        en: 'Advanced Local & Generative AI SEO',
      },
      desc: {
        fr: 'Optimisation Google, Google Maps et moteurs IA (Schema.org, OpenGraph).',
        en: 'Google Maps, Search, and AI engine indexing (Schema.org, OpenGraph).',
      },
      icon: FlashIcon,
    },
  ];

  // Options de design (Étape 3)
  const designOptions = [
    {
      id: 'design-figma-ready',
      label: {
        fr: 'J\'ai déjà des maquettes UI prêtes (Figma / Adobe XD)',
        en: 'I already have Figma / UI mockups ready to code',
      },
      desc: {
        fr: 'Intégration fidèle au pixel près, responsive et animée.',
        en: 'Pixel-perfect frontend development, responsive and interactive.',
      },
    },
    {
      id: 'design-identity-exists',
      label: {
        fr: 'J\'ai un logo et des couleurs, le studio conçoit toute l\'UI/UX',
        en: 'I have a logo & basic colors; studio designs the full UI/UX',
      },
      desc: {
        fr: 'Direction artistique sur-mesure respectant votre univers de marque.',
        en: 'Tailored art direction crafted around your existing brand assets.',
      },
    },
    {
      id: 'design-from-scratch',
      label: {
        fr: 'Création globale de marque (Logo, Typo, Charte, Design System)',
        en: 'Full brand creation (Logo, Typography, Guidelines, Design System)',
      },
      desc: {
        fr: 'Conception complète de l\'identité visuelle et du produit digital.',
        en: 'Complete branding foundation and digital product identity.',
      },
    },
  ];

  // Options de délais (Étape 3)
  const timelineOptions = [
    {
      id: 'time-urgent',
      label: isEn ? 'Sprint Urgent (< 3 weeks)' : 'Sprint Urgent (< 3 semaines)',
      badge: isEn ? 'Express' : 'Prioritaire',
    },
    {
      id: 'time-standard',
      label: isEn ? 'Standard (4 to 6 weeks)' : 'Standard (4 à 6 semaines)',
      badge: isEn ? 'Recommended' : 'Recommandé',
    },
    {
      id: 'time-medium',
      label: isEn ? 'Medium Term (2 to 3 months)' : 'Moyen terme (2 à 3 mois)',
      badge: isEn ? 'Phased' : 'Évolutif',
    },
    {
      id: 'time-flexible',
      label: isEn ? 'Flexible according to roadmap' : 'Flexible selon la roadmap',
      badge: isEn ? 'Open' : 'Libre',
    },
  ];

  // Fourchettes de budget (Étape 4)
  const budgetOptions = [
    '150.000 – 350.000 FCFA',
    '350.000 – 750.000 FCFA',
    '750.000 – 1.500.000 FCFA',
    '1.500.000 – 3.000.000 FCFA',
    '3.000.000+ FCFA (Plateforme SaaS / Grand Compte)',
    isEn ? 'To be defined together during scoping' : 'À définir ensemble lors du cadrage',
  ];

  // Toggle fonctionnalité
  const toggleFeature = (title: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(title) ? prev.filter((f) => f !== title) : [...prev, title]
    );
  };

  // Validation par étape
  const handleNextStep = () => {
    setErrorMessage(null);
    if (currentStep === 1 && !projectType) {
      setErrorMessage(isEn ? 'Please select a project type.' : 'Veuillez sélectionner un type de projet.');
      return;
    }
    if (currentStep === 2 && selectedFeatures.length === 0) {
      setErrorMessage(isEn ? 'Please select at least one feature.' : 'Veuillez sélectionner au moins une fonctionnalité.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Soumission finale du formulaire
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
      const payload = {
        quoteType: 'CUSTOM_BESPOKE',
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        companyName: companyName.trim(),
        city: city.trim(),
        projectType,
        features: selectedFeatures,
        designPreference,
        timeline,
        budgetRange,
        description: description.trim(),
        lang,
      };

      const res = await fetch('/api/xpresite/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission.');
      }

      setQuoteResult({
        reference: data.quoteReference,
        whatsappUrl: data.whatsappUrl,
      });

      // Ouvrir automatiquement WhatsApp si généré
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Modal de Confirmation / Succès */}
      {quoteResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#141414] border border-signal/50 rounded-[28px] max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-signal/15 border border-signal flex items-center justify-center text-signal mb-5">
              <CheckmarkCircle01Icon size={32} className="text-signal" />
            </div>

            <span className="font-mono text-xs uppercase tracking-wider text-signal bg-signal/10 px-3 py-1 rounded-full inline-block">
              {isEn ? 'Custom Project Request Received' : 'Demande Sur-Mesure Enregistrée'}
            </span>

            <h3 className="text-2xl font-bold mt-3 mb-2">
              {isEn ? 'Your Project is Locked!' : 'Votre projet est bien transmis !'}
            </h3>

            <p className="text-sm text-white/70 mb-5 leading-relaxed">
              {isEn
                ? 'Your scoping dossier has been created. A direct WhatsApp channel has been prepared with your exact project specifics for our lead engineers.'
                : 'Votre cahier des charges initial a été enregistré. Un canal direct WhatsApp a été préparé avec les spécificités de votre projet pour échanger avec notre équipe technique.'}
            </p>

            <div className="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2 mb-6">
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Reference' : 'Référence Dossier'} :</span>
                <span className="text-signal font-semibold">{quoteResult.reference}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Project Type' : 'Type de Projet'} :</span>
                <span className="text-white truncate max-w-[200px]">{projectType}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Features' : 'Modules choisis'} :</span>
                <span className="text-signal">{selectedFeatures.length} fonctionnalités</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Target Budget' : 'Budget Indicatif'} :</span>
                <span className="text-white">{budgetRange}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={quoteResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 bg-signal hover:bg-signal-hover text-ink font-sans font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <WhatsappIcon size={18} />
                <span>{isEn ? 'Open WhatsApp & Connect' : 'Ouvrir WhatsApp & Discuter'}</span>
              </a>

              <Link
                href={`/${lang}/xpresite`}
                className="py-3.5 px-5 bg-white/10 hover:bg-white/15 text-white font-mono text-xs rounded-xl transition-colors text-center"
              >
                {isEn ? 'Back to XpreSite' : 'Retour à XpreSite'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Barre de Progression en 4 Étapes */}
      <div className="mb-10">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { step: 1, label: isEn ? 'Project Type' : 'Type de Projet' },
            { step: 2, label: isEn ? 'Features' : 'Fonctionnalités' },
            { step: 3, label: isEn ? 'Design & Timeline' : 'Design & Délais' },
            { step: 4, label: isEn ? 'Contact & Scope' : 'Coordonnées & Budget' },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <div
                key={s.step}
                onClick={() => isDone && setCurrentStep(s.step)}
                className={`p-3 rounded-2xl border transition-all ${
                  isDone ? 'cursor-pointer hover:border-signal/40' : ''
                } ${
                  isActive
                    ? 'bg-[#181818] border-signal shadow-lg shadow-signal/5'
                    : isDone
                    ? 'bg-[#141414] border-signal/30'
                    : 'bg-[#111] border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-medium ${
                      isDone
                        ? 'bg-signal text-ink'
                        : isActive
                        ? 'bg-signal/20 text-signal border border-signal'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {isDone ? '✓' : `0${s.step}`}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-white truncate">
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conteneur Principal de l'Étape Active */}
      <div className="bg-[#141414] border border-white/10 rounded-[28px] p-6 sm:p-10 text-white">
        {/* ==================================================================
            ÉTAPE 1 : TYPE DE PROJET
        ================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="t-mono text-xs uppercase tracking-widest text-signal block mb-1">
                {isEn ? 'Step 1 of 4' : 'Étape 1 sur 4'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {isEn ? 'What type of project are you building?' : 'Quel type de produit ou projet souhaitez-vous créer ?'}
              </h2>
              <p className="text-sm text-white/60 mt-2">
                {isEn
                  ? 'Select the primary ambition for your bespoke digital platform.'
                  : 'Sélectionnez la catégorie qui décrit le mieux votre besoin sur-mesure.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {projectTypes.map((pt) => {
                const isSelected = projectType === (isEn ? pt.name.en : pt.name.fr);
                const IconComponent = pt.icon;
                return (
                  <div
                    key={pt.id}
                    onClick={() => setProjectType(isEn ? pt.name.en : pt.name.fr)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1C1C1C] border-signal shadow-lg shadow-signal/5'
                        : 'bg-[#111] border-white/10 hover:border-white/20 hover:bg-[#161616]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`p-2.5 rounded-xl ${
                            isSelected ? 'bg-signal/20 text-signal' : 'bg-white/5 text-white/70'
                          }`}
                        >
                          <IconComponent size={22} />
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-signal text-ink flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mb-1.5">
                        {isEn ? pt.name.en : pt.name.fr}
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {isEn ? pt.desc.en : pt.desc.fr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================
            ÉTAPE 2 : FONCTIONNALITÉS & BESOINS TECHNIQUES
        ================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="t-mono text-xs uppercase tracking-widest text-signal block mb-1">
                  {isEn ? 'Step 2 of 4' : 'Étape 2 sur 4'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {isEn ? 'What features does your project need?' : 'Quelles fonctionnalités clés devez-vous intégrer ?'}
                </h2>
                <p className="text-sm text-white/60 mt-2">
                  {isEn
                    ? 'Select all the modules required for your product ecosystem.'
                    : 'Activez les modules indispensables à votre modèle économique.'}
                </p>
              </div>
              <div className="t-mono text-xs text-signal font-medium bg-signal/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
                {selectedFeatures.length} {isEn ? 'selected' : 'sélectionnées'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {availableFeatures.map((feat) => {
                const featTitle = isEn ? feat.title.en : feat.title.fr;
                const isSelected = selectedFeatures.includes(featTitle);
                const IconComponent = feat.icon;

                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeature(featTitle)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#1C1C1C] border-signal/80'
                        : 'bg-[#111] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-signal text-ink font-bold'
                          : 'border border-white/30 bg-transparent'
                      }`}
                    >
                      {isSelected && <Tick01Icon size={14} className="text-ink stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <IconComponent size={18} className={isSelected ? 'text-signal' : 'text-white/60'} />
                        <h4 className="text-sm font-semibold text-white">
                          {isEn ? feat.title.en : feat.title.fr}
                        </h4>
                      </div>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">
                        {isEn ? feat.desc.en : feat.desc.fr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================
            ÉTAPE 3 : DESIGN, IDENTITÉ & DÉLAIS
        ================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <span className="t-mono text-xs uppercase tracking-widest text-signal block mb-1">
                {isEn ? 'Step 3 of 4' : 'Étape 3 sur 4'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {isEn ? 'Design maturity & timeline targets' : 'Niveau de design & délais souhaités'}
              </h2>
              <p className="text-sm text-white/60 mt-2">
                {isEn
                  ? 'Tell us about your brand assets and delivery horizon.'
                  : 'Précisez l\'état de vos maquettes et votre horizon de lancement.'}
              </p>
            </div>

            {/* Maturité Design */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-signal mb-3">
                {isEn ? '1. Brand Assets & UI/UX Design' : '1. Identité Visuelle & Maquettes'}
              </h3>
              <div className="space-y-2.5">
                {designOptions.map((opt) => {
                  const optLabel = isEn ? opt.label.en : opt.label.fr;
                  const isSelected = designPreference === optLabel;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setDesignPreference(optLabel)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-signal shadow-md shadow-signal/5'
                          : 'bg-[#111] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{optLabel}</div>
                        <div className="text-xs text-white/60 mt-0.5">
                          {isEn ? opt.desc.en : opt.desc.fr}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center border ${
                          isSelected ? 'border-signal bg-signal text-ink' : 'border-white/30'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Délais visés */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-signal mb-3">
                {isEn ? '2. Target Delivery Horizon' : '2. Délai Visé de Mise en Ligne'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timelineOptions.map((t) => {
                  const isSelected = timeline === t.label;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setTimeline(t.label)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-signal shadow-md shadow-signal/5'
                          : 'bg-[#111] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold text-white">{t.label}</div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-signal/20 text-signal font-medium' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {t.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            ÉTAPE 4 : BUDGET & COORDONNÉES DU PROJET
        ================================================================== */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="t-mono text-xs uppercase tracking-widest text-signal block mb-1">
                {isEn ? 'Step 4 of 4' : 'Étape 4 sur 4'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {isEn ? 'Budget estimation & your contact details' : 'Budget indicatif & vos coordonnées'}
              </h2>
              <p className="text-sm text-white/60 mt-2">
                {isEn
                  ? 'Lock your request to receive a tailored scoping blueprint and open direct WhatsApp dialogue.'
                  : 'Finalisez votre demande pour recevoir un cadrage chiffré et échanger directement sur WhatsApp.'}
              </p>
            </div>

            {/* Fourchette de budget */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-signal block mb-2">
                {isEn ? 'Target Investment Range' : 'Fourchette Budgétaire Envisagée'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {budgetOptions.map((b) => {
                  const isSelected = budgetRange === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetRange(b)}
                      className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-signal text-signal font-medium shadow-sm shadow-signal/5'
                          : 'bg-[#111] border-white/10 text-white/70 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coordonnées */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    {isEn ? 'Your Full Name *' : 'Votre Nom Complet *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? 'Jean Dupont' : 'Jean Dupont'}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-signal"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    {isEn ? 'WhatsApp Phone Number (+237 / +241 / +33...) *' : 'Téléphone WhatsApp (+237 / +241 / +33...) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 690 00 00 00"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-signal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    {isEn ? 'Email Address' : 'Adresse Email'}
                  </label>
                  <input
                    type="email"
                    placeholder="contact@entreprise.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-signal"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    {isEn ? 'Company / Brand' : 'Entreprise / Marque'}
                  </label>
                  <input
                    type="text"
                    placeholder={isEn ? 'Acme Corp' : 'Ma Société'}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-signal"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/60 block mb-1.5">
                    {isEn ? 'City & Country' : 'Ville & Pays'}
                  </label>
                  <input
                    type="text"
                    placeholder="Douala, Cameroun"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-signal"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  {isEn ? 'Project Details / Special Requirements' : 'Précisions sur votre projet / Cahier des charges libre'}
                </label>
                <textarea
                  rows={4}
                  placeholder={
                    isEn
                      ? 'Describe your target audience, main user flow, or existing references...'
                      : 'Décrivez votre public cible, les fonctionnalités prioritaires ou vos inspirations...'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-signal leading-relaxed"
                />
              </div>
            </div>

            {/* Récapitulatif condensé */}
            <div className="p-4 rounded-2xl bg-[#181818] border border-white/5 font-mono text-xs space-y-1.5 text-white/70">
              <div className="flex justify-between">
                <span className="text-white/50">{isEn ? 'Project :' : 'Projet :'}</span>
                <span className="text-white font-semibold">{projectType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">{isEn ? 'Features :' : 'Modules :'}</span>
                <span className="text-signal">{selectedFeatures.length} fonctionnalités sélectionnées</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">{isEn ? 'Timeline :' : 'Délai :'}</span>
                <span className="text-white">{timeline}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-signal hover:bg-signal-hover text-ink font-sans font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-signal/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
                  <span>{isEn ? 'Transmitting bespoke request...' : 'Transmission de votre demande sur-mesure...'}</span>
                </>
              ) : (
                <>
                  <span>{isEn ? 'Submit Bespoke Scope & Open WhatsApp' : 'Valider ce cadrage & Ouvrir WhatsApp'}</span>
                  <ArrowRight01Icon size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        {/* Boutons de Navigation (Étapes 1, 2, 3) */}
        {currentStep < 4 && (
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="t-mono inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft01Icon size={16} />
                <span>{isEn ? 'Previous Step' : 'Étape précédente'}</span>
              </button>
            ) : (
              <Link
                href={`/${lang}/xpresite`}
                className="t-mono text-xs text-white/50 hover:text-white transition-colors"
              >
                ← {isEn ? 'Back to XpreSite packs' : 'Retour aux packs XpreSite'}
              </Link>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="t-mono inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-signal hover:bg-signal-hover text-ink font-medium text-xs transition-all shadow-lg shadow-signal/10"
            >
              <span>{isEn ? 'Continue' : 'Continuer'}</span>
              <ArrowRight01Icon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
