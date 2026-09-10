'use client';

import React, { useState, useEffect } from 'react';
import {
  Add01Icon,
  Delete02Icon,
  Edit01Icon,
  Tick01Icon,
  Cancel01Icon,
  RefreshIcon,
  FlashIcon,
  CreditCardIcon,
  Store01Icon,
  Layers01Icon,
} from 'hugeicons-react';
import { formatFCFA } from '@/lib/xpresite-data';

interface AddonConfig {
  id: string;
  slug: string;
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
  priceXAF: number;
  isDefaultSelected?: boolean;
}

interface IndustryConfig {
  id: string;
  slug: string;
  name: { fr: string; en: string };
  tagline: { fr: string; en: string };
  iconName: string;
  basePriceXAF?: number;
  isActive: boolean;
  addons: AddonConfig[];
}

interface XpreSiteGlobalConfig {
  defaultBasePriceXAF: number;
  deliveryDelay: string;
  allowThreeSplits: boolean;
  minAmountForThreeSplits: number;
  hostingIncludedYears: number;
  whatsappContactNumber: string;
  industries: IndustryConfig[];
}

interface AdminSettingsTabProps {
  token: string | null;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isEn?: boolean;
}

const AVAILABLE_ICONS = [
  { value: 'utensils', label: 'Restaurant & Traiteur (Fourchette/Couteau)' },
  { value: 'shirt', label: 'Pressing & Blanchisserie (Vêtement)' },
  { value: 'car', label: 'Location Véhicules (Voiture)' },
  { value: 'truck', label: 'Transport & Fret (Camion)' },
  { value: 'plane', label: 'Voyage & Tourisme (Avion)' },
  { value: 'store', label: 'Boutique & Commerce (Magasin)' },
  { value: 'health', label: 'Santé & Médical (Hôpital)' },
  { value: 'building', label: 'Immobilier & BTP (Bâtiment)' },
  { value: 'laptop', label: 'Tech & Digital (Ordinateur)' },
  { value: 'briefcase', label: 'Services Pro / Conseil (Mallette)' },
];

export default function AdminSettingsTab({ token, showToast, isEn = false }: AdminSettingsTabProps) {
  const [config, setConfig] = useState<XpreSiteGlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Industrie sélectionnée pour configurer ses options
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('');

  // Modals
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<IndustryConfig | null>(null);

  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonConfig | null>(null);

  // Formulaire Métier
  const [indNameFr, setIndNameFr] = useState('');
  const [indNameEn, setIndNameEn] = useState('');
  const [indTaglineFr, setIndTaglineFr] = useState('');
  const [indTaglineEn, setIndTaglineEn] = useState('');
  const [indIcon, setIndIcon] = useState('store');
  const [indBasePrice, setIndBasePrice] = useState<number>(75000);
  const [indIsActive, setIndIsActive] = useState(true);

  // Formulaire Addon
  const [addonTitleFr, setAddonTitleFr] = useState('');
  const [addonTitleEn, setAddonTitleEn] = useState('');
  const [addonDescFr, setAddonDescFr] = useState('');
  const [addonDescEn, setAddonDescEn] = useState('');
  const [addonPrice, setAddonPrice] = useState<number>(15000);
  const [addonDefaultSelected, setAddonDefaultSelected] = useState(false);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/xpresite/config');
      const data = await res.json();
      if (data.success && data.data) {
        setConfig(data.data);
        if (data.data.industries && data.data.industries.length > 0 && !selectedIndustryId) {
          setSelectedIndustryId(data.data.industries[0].id);
        }
      }
    } catch (err) {
      console.error('Erreur chargement config xpresite:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveGlobalConfig = async (newConfig: XpreSiteGlobalConfig) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/xpresite/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newConfig),
      });

      const data = await res.json();
      if (data.success) {
        setConfig(newConfig);
        showToast(isEn ? 'Settings updated successfully.' : 'Paramètres XpreSite enregistrés avec succès.', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // --- GESTION MÉTIERS ---
  const openNewIndustryModal = () => {
    setEditingIndustry(null);
    setIndNameFr('');
    setIndNameEn('');
    setIndTaglineFr('');
    setIndTaglineEn('');
    setIndIcon('store');
    setIndBasePrice(config?.defaultBasePriceXAF || 75000);
    setIndIsActive(true);
    setIsIndustryModalOpen(true);
  };

  const openEditIndustryModal = (ind: IndustryConfig) => {
    setEditingIndustry(ind);
    setIndNameFr(ind.name.fr);
    setIndNameEn(ind.name.en);
    setIndTaglineFr(ind.tagline.fr);
    setIndTaglineEn(ind.tagline.en);
    setIndIcon(ind.iconName);
    setIndBasePrice(ind.basePriceXAF || config?.defaultBasePriceXAF || 75000);
    setIndIsActive(ind.isActive !== false);
    setIsIndustryModalOpen(true);
  };

  const handleSaveIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    const slug = (indNameFr || indNameEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updatedIndustries = [...config.industries];

    if (editingIndustry) {
      const idx = updatedIndustries.findIndex((i) => i.id === editingIndustry.id);
      if (idx !== -1) {
        updatedIndustries[idx] = {
          ...updatedIndustries[idx],
          name: { fr: indNameFr, en: indNameEn },
          tagline: { fr: indTaglineFr, en: indTaglineEn },
          iconName: indIcon,
          basePriceXAF: Number(indBasePrice),
          isActive: indIsActive,
        };
      }
    } else {
      const newId = `ind-${slug}-${Date.now()}`;
      updatedIndustries.push({
        id: newId,
        slug,
        name: { fr: indNameFr, en: indNameEn },
        tagline: { fr: indTaglineFr, en: indTaglineEn },
        iconName: indIcon,
        basePriceXAF: Number(indBasePrice),
        isActive: indIsActive,
        addons: [],
      });
      setSelectedIndustryId(newId);
    }

    const newConfig = { ...config, industries: updatedIndustries };
    handleSaveGlobalConfig(newConfig);
    setIsIndustryModalOpen(false);
  };

  const handleDeleteIndustry = (id: string, name: string) => {
    if (!config) return;
    if (!window.confirm(`Supprimer le secteur "${name}" et toutes ses options ?`)) return;

    const updatedIndustries = config.industries.filter((i) => i.id !== id);
    const newConfig = { ...config, industries: updatedIndustries };
    if (selectedIndustryId === id && updatedIndustries.length > 0) {
      setSelectedIndustryId(updatedIndustries[0].id);
    }
    handleSaveGlobalConfig(newConfig);
  };

  // --- GESTION ADDONS PAR MÉTIER ---
  const currentIndustry = config?.industries.find((i) => i.id === selectedIndustryId) || config?.industries[0];

  const openNewAddonModal = () => {
    setEditingAddon(null);
    setAddonTitleFr('');
    setAddonTitleEn('');
    setAddonDescFr('');
    setAddonDescEn('');
    setAddonPrice(15000);
    setAddonDefaultSelected(false);
    setIsAddonModalOpen(true);
  };

  const openEditAddonModal = (a: AddonConfig) => {
    setEditingAddon(a);
    setAddonTitleFr(a.title.fr);
    setAddonTitleEn(a.title.en);
    setAddonDescFr(a.desc.fr);
    setAddonDescEn(a.desc.en);
    setAddonPrice(a.priceXAF);
    setAddonDefaultSelected(Boolean(a.isDefaultSelected));
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !currentIndustry) return;

    const slug = (addonTitleFr || addonTitleEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const currentAddons = [...(currentIndustry.addons || [])];

    if (editingAddon) {
      const idx = currentAddons.findIndex((a) => a.id === editingAddon.id);
      if (idx !== -1) {
        currentAddons[idx] = {
          ...currentAddons[idx],
          title: { fr: addonTitleFr, en: addonTitleEn },
          desc: { fr: addonDescFr, en: addonDescEn },
          priceXAF: Number(addonPrice),
          isDefaultSelected: addonDefaultSelected,
        };
      }
    } else {
      currentAddons.push({
        id: `addon-${currentIndustry.slug}-${slug}-${Date.now()}`,
        slug,
        title: { fr: addonTitleFr, en: addonTitleEn },
        desc: { fr: addonDescFr, en: addonDescEn },
        priceXAF: Number(addonPrice),
        isDefaultSelected: addonDefaultSelected,
      });
    }

    const updatedIndustries = config.industries.map((ind) =>
      ind.id === currentIndustry.id ? { ...ind, addons: currentAddons } : ind
    );

    const newConfig = { ...config, industries: updatedIndustries };
    handleSaveGlobalConfig(newConfig);
    setIsAddonModalOpen(false);
  };

  const handleDeleteAddon = (addonId: string) => {
    if (!config || !currentIndustry) return;
    const updatedAddons = currentIndustry.addons.filter((a) => a.id !== addonId);
    const updatedIndustries = config.industries.map((ind) =>
      ind.id === currentIndustry.id ? { ...ind, addons: updatedAddons } : ind
    );
    const newConfig = { ...config, industries: updatedIndustries };
    handleSaveGlobalConfig(newConfig);
  };

  if (loading || !config) {
    return (
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
        Chargement de la configuration tarifaire XpreSite...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SECTION 1 : RÈGLES COMMERCIALES GLOBALES */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FlashIcon size={18} className="text-[#EBFF72]" />
            <span>Paramètres Globaux de l'Offre</span>
          </h3>
          <p className="text-xs text-white/60">
            Délai d'exécution garanti et règles de paiement par tranche appliquées sur tout le configurateur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          {/* Délai d'exécution 72h modifiable */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2">
            <label className="text-white/50 text-[11px] block">DÉLAI D'EXÉCUTION GARANTI</label>
            <input
              type="text"
              value={config.deliveryDelay}
              onChange={(e) => setConfig({ ...config, deliveryDelay: e.target.value })}
              placeholder="72h"
              className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-bold focus:outline-none focus:border-[#EBFF72]"
            />
            <span className="text-[10px] text-white/40 block">Ex: 72h, 48h, 3 jours ouvrés</span>
          </div>

          {/* Activer / Désactiver les 3 tranches */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2">
            <label className="text-white/50 text-[11px] block">PAIEMENT EN 3 TRANCHES</label>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="three-splits-toggle"
                checked={config.allowThreeSplits}
                onChange={(e) => setConfig({ ...config, allowThreeSplits: e.target.checked })}
                className="w-4 h-4 rounded accent-[#EBFF72]"
              />
              <label htmlFor="three-splits-toggle" className="text-white text-xs cursor-pointer">
                {config.allowThreeSplits ? 'Activé pour les clients' : 'Désactivé (2 tranches max)'}
              </label>
            </div>
            <span className="text-[10px] text-white/40 block">Facilité de paiement sans frais</span>
          </div>

          {/* Montant minimum pour les 3 tranches */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2">
            <label className="text-white/50 text-[11px] block">SEUIL MINIMUM POUR 3 TRANCHES</label>
            <input
              type="number"
              step={5000}
              value={config.minAmountForThreeSplits}
              onChange={(e) => setConfig({ ...config, minAmountForThreeSplits: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-bold focus:outline-none focus:border-[#EBFF72]"
            />
            <span className="text-[10px] text-white/40 block">
              En FCFA (actuel: {formatFCFA(config.minAmountForThreeSplits)})
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveGlobalConfig(config)}
            className="py-2.5 px-5 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#EBFF72]/10"
          >
            <Tick01Icon size={15} />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les règles globales'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 2 : GESTION DES MÉTIERS / SECTEURS */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Store01Icon size={18} className="text-[#EBFF72]" />
              <span>Métiers & Secteurs d'Activité</span>
            </h3>
            <p className="text-xs text-white/60">
              Chaque secteur possède son tarif de base spécifique en FCFA et sa liste d'options illimitées.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewIndustryModal}
            className="py-2 px-3.5 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Add01Icon size={15} />
            <span>Nouveau Métier</span>
          </button>
        </div>

        {/* Liste des métiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {config.industries.map((ind) => {
            const isCurrent = ind.id === selectedIndustryId;
            return (
              <div
                key={ind.id}
                onClick={() => setSelectedIndustryId(ind.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isCurrent
                    ? 'bg-[#1C1C1C] border-[#EBFF72] shadow-lg shadow-[#EBFF72]/5'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      ind.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    ● {ind.isActive !== false ? 'Actif' : 'Inactif'}
                  </span>

                  <span className="font-mono text-xs font-medium text-[#EBFF72]">
                    {formatFCFA(ind.basePriceXAF || config.defaultBasePriceXAF)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{ind.name.fr}</h4>
                  <div className="text-[11px] text-white/40 font-mono">{ind.name.en}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-2 border-t border-white/5">
                  <span>{ind.addons?.length || 0} options incluses</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditIndustryModal(ind);
                      }}
                      className="text-white/70 hover:text-white"
                      title="Modifier"
                    >
                      <Edit01Icon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIndustry(ind.id, ind.name.fr);
                      }}
                      className="text-red-400/70 hover:text-red-400"
                      title="Supprimer"
                    >
                      <Delete02Icon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3 : OPTIONS & ADDONS DU MÉTIER SÉLECTIONNÉ */}
      {currentIndustry && (
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#EBFF72]">
                Options Spécifiques au Métier
              </div>
              <h3 className="text-base font-bold text-white">
                Catalogue d'options pour : <span className="text-[#EBFF72]">{currentIndustry.name.fr}</span>
              </h3>
            </div>

            <button
              type="button"
              onClick={openNewAddonModal}
              className="py-2 px-3.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Add01Icon size={14} />
              <span>Ajouter une option</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(!currentIndustry.addons || currentIndustry.addons.length === 0) ? (
              <div className="p-8 text-center text-xs font-mono text-white/40 border border-dashed border-white/10 rounded-2xl">
                Aucune option configurée pour ce métier. Cliquez sur "Ajouter une option".
              </div>
            ) : (
              currentIndustry.addons.map((addon) => (
                <div
                  key={addon.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{addon.title.fr}</span>
                      {addon.isDefaultSelected && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBFF72]/10 text-[#EBFF72] border border-[#EBFF72]/20">
                          Sélectionné par défaut
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60">{addon.desc.fr}</p>
                    <div className="text-[11px] text-white/40 font-mono">EN : {addon.title.en}</div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="font-mono text-xs font-medium text-[#EBFF72]">
                      {addon.priceXAF === 0 ? '0 FCFA (Inclus)' : formatFCFA(addon.priceXAF)}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditAddonModal(addon)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                        title="Modifier"
                      >
                        <Edit01Icon size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddon(addon.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Supprimer"
                      >
                        <Delete02Icon size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL AJOUT / ÉDITION MÉTIER */}
      {isIndustryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#141414] border border-white/15 rounded-3xl max-w-lg w-full p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingIndustry ? 'Modifier le métier' : 'Créer un nouveau métier'}
              </h3>
              <button
                type="button"
                onClick={() => setIsIndustryModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <Cancel01Icon size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveIndustry} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">NOM DU MÉTIER (FR) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Restaurant & Bar"
                    value={indNameFr}
                    onChange={(e) => setIndNameFr(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">NAME (EN) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Restaurant & Bar"
                    value={indNameEn}
                    onChange={(e) => setIndNameEn(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">DESCRIPTION COURTE (FR)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Sublimez vos plats, facilitez les commandes..."
                  value={indTaglineFr}
                  onChange={(e) => setIndTaglineFr(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">SHORT DESCRIPTION (EN)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Showcase your dishes, streamline orders..."
                  value={indTaglineEn}
                  onChange={(e) => setIndTaglineEn(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">ICÔNE ASSOCIÉE</label>
                  <select
                    value={indIcon}
                    onChange={(e) => setIndIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none text-[11px]"
                  >
                    {AVAILABLE_ICONS.map((ico) => (
                      <option key={ico.value} value={ico.value}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">TARIF DE BASE SPÉCIFIQUE (FCFA)</label>
                  <input
                    type="number"
                    step={5000}
                    value={indBasePrice}
                    onChange={(e) => setIndBasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-bold focus:border-[#EBFF72] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="ind-active-check"
                  checked={indIsActive}
                  onChange={(e) => setIndIsActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#EBFF72]"
                />
                <label htmlFor="ind-active-check" className="text-white text-xs cursor-pointer">
                  Métier actif (visible dans le configurateur public)
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-xs rounded-xl"
                >
                  Enregistrer le métier
                </button>
                <button
                  type="button"
                  onClick={() => setIsIndustryModalOpen(false)}
                  className="py-2.5 px-4 bg-white/10 text-white text-xs rounded-xl"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUT / ÉDITION ADDON */}
      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#141414] border border-white/15 rounded-3xl max-w-lg w-full p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingAddon ? 'Modifier l’option' : 'Ajouter une option au secteur'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddonModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <Cancel01Icon size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAddon} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">TITRE DE L'OPTION (FR) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Menu QR Code sur table"
                    value={addonTitleFr}
                    onChange={(e) => setAddonTitleFr(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">TITLE (EN) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Table QR Code Menu"
                    value={addonTitleEn}
                    onChange={(e) => setAddonTitleEn(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">DESCRIPTION (FR)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: QR code personnalisé à imprimer pour consultation immédiate..."
                  value={addonDescFr}
                  onChange={(e) => setAddonDescFr(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">DESCRIPTION (EN)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Custom printable QR code for fast table browsing..."
                  value={addonDescEn}
                  onChange={(e) => setAddonDescEn(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:border-[#EBFF72] outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">PRIX EN FCFA (0 = Inclus / Gratuit)</label>
                <input
                  type="number"
                  step={5000}
                  value={addonPrice}
                  onChange={(e) => setAddonPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-bold focus:border-[#EBFF72] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="addon-default-check"
                  checked={addonDefaultSelected}
                  onChange={(e) => setAddonDefaultSelected(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#EBFF72]"
                />
                <label htmlFor="addon-default-check" className="text-white text-xs cursor-pointer">
                  Sélectionné par défaut lors de l'ouverture du configurateur
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-xs rounded-xl"
                >
                  Enregistrer l'option
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddonModalOpen(false)}
                  className="py-2.5 px-4 bg-white/10 text-white text-xs rounded-xl"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
