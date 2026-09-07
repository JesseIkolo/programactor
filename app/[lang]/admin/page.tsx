'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Mark, Wordmark } from '@/components/ui';
import { XPRESITE_CONFIG, formatFCFA } from '@/lib/xpresite-data';

interface QuoteItem {
  reference: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  companyName?: string;
  city?: string;
  industryId: string;
  industryName: string;
  selectedAddonTitles?: string[];
  basePriceXAF: number;
  addonsTotalXAF: number;
  totalPriceXAF: number;
  paymentSplits: number;
  splitAmount: number;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';
  internalNotes?: string;
  createdAt: string;
  lang?: string;
}

export default function AdminDashboardPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'fr';
  const isEn = lang === 'en';

  const [activeTab, setActiveTab] = useState<'quotes' | 'bookings' | 'projects' | 'settings'>('quotes');
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Charger les devis depuis l'API
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/quotes');
      const data = await res.json();
      if (data.success && Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
        if (data.quotes.length > 0 && !selectedQuote) {
          setSelectedQuote(data.quotes[0]);
          setNoteText(data.quotes[0].internalNotes || '');
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des devis :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Mettre à jour le statut d'un devis
  const handleUpdateStatus = async (reference: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.reference === reference ? { ...q, status: newStatus as any } : q))
        );
        if (selectedQuote && selectedQuote.reference === reference) {
          setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error('Erreur mise à jour statut :', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Sauvegarder les notes internes
  const handleSaveNotes = async () => {
    if (!selectedQuote) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: selectedQuote.reference, internalNotes: noteText }),
      });
      const data = await res.json();
      if (data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.reference === selectedQuote.reference ? { ...q, internalNotes: noteText } : q))
        );
        setSelectedQuote((prev) => (prev ? { ...prev, internalNotes: noteText } : null));
      }
    } catch (err) {
      console.error('Erreur sauvegarde notes :', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtrage des devis
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.companyName && q.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.city && q.city.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchQuery, statusFilter]);

  // Statistiques rapides
  const stats = useMemo(() => {
    const totalQuotes = quotes.length;
    const newQuotes = quotes.filter((q) => q.status === 'NEW').length;
    const totalVolumeXAF = quotes.reduce((sum, q) => sum + (q.totalPriceXAF || 0), 0);
    return { totalQuotes, newQuotes, totalVolumeXAF };
  }, [quotes]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#EBFF72]/15 text-[#EBFF72] border border-[#EBFF72]/40">NOUVEAU</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">CONTACTÉ</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">EN DEV (72H)</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">LIVRÉ</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-red-500/15 text-red-400 border border-red-500/30">ANNULÉ</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-white/70">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col">
      {/* Header Admin */}
      <header className="border-b border-white/10 bg-[#141414] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}`} className="flex items-center gap-3">
              <Mark className="h-5 w-auto text-white" accent="var(--color-signal)" accentOpacity={1} />
              <Wordmark className="text-lg leading-none" />
            </Link>
            <span className="hidden sm:inline-block text-xs font-mono text-white/40">/</span>
            <span className="text-xs font-mono font-semibold tracking-wider text-[#EBFF72] bg-[#EBFF72]/10 px-2.5 py-1 rounded-md">
              STUDIO ADMIN
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-white/60">
              <span className="inline-block w-2 h-2 rounded-full bg-[#EBFF72] animate-pulse" />
              <span>Douala UTC+1</span>
            </div>
            <Link
              href={`/${lang}`}
              className="text-white/60 hover:text-white px-3 py-1.5 rounded-full border border-white/10 transition-colors"
            >
              {isEn ? 'View Public Site ↗' : 'Voir le site public ↗'}
            </Link>
          </div>
        </div>
      </header>

      {/* Barre de navigation interne de l'admin */}
      <div className="border-b border-white/10 bg-[#111] px-6">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`py-3.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'quotes'
                ? 'border-[#EBFF72] text-[#EBFF72]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <span>{isEn ? 'XpreSite Quotes' : 'Devis XpreSite'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">
              {quotes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`py-3.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-[#EBFF72] text-[#EBFF72]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <span>{isEn ? 'Appointments' : 'Rendez-vous Studio'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">0</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`py-3.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-[#EBFF72] text-[#EBFF72]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <span>{isEn ? 'Case Studies CMS' : 'Réalisations CMS'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">6</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-[#EBFF72] text-[#EBFF72]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {isEn ? 'Config & Pricing' : 'Paramètres & Tarifs'}
          </button>
        </div>
      </div>

      {/* Contenu de l'Admin */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* ====================================================================
            ONGLET 1 : DEVIS XPRESITE
        ==================================================================== */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {/* Cartes de métriques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
                <div className="text-xs font-mono uppercase text-white/50 mb-1">
                  {isEn ? 'Total Quotes Received' : 'Total Devis Reçus'}
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {stats.totalQuotes}
                </div>
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
                <div className="text-xs font-mono uppercase text-[#EBFF72] mb-1">
                  {isEn ? 'New Leads to contact' : 'Nouveaux Leads à traiter'}
                </div>
                <div className="text-2xl font-mono font-bold text-[#EBFF72]">
                  {stats.newQuotes}
                </div>
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
                <div className="text-xs font-mono uppercase text-white/50 mb-1">
                  {isEn ? 'Total Pipeline Value' : 'Volume Pipeline Estimé'}
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {formatFCFA(stats.totalVolumeXAF)}
                </div>
              </div>
            </div>

            {/* Barre de filtres et recherche */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] border border-white/10 p-3 rounded-2xl">
              <div className="flex flex-wrap items-center gap-1">
                {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'DELIVERED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                      statusFilter === st
                        ? 'bg-[#EBFF72] text-[#0E0E0E] font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {st === 'ALL' ? (isEn ? 'All' : 'Tous') : st}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder={isEn ? 'Search by name, ref, city...' : 'Recherche par nom, réf, ville...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-white/15 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>
            </div>

            {/* Grille principale : Liste des devis + Fiche détaillée */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Liste des devis */}
              <div className="lg:col-span-6 space-y-3">
                {loading ? (
                  <div className="text-center py-12 text-white/40 font-mono text-sm">
                    {isEn ? 'Loading quotes...' : 'Chargement des devis...'}
                  </div>
                ) : filteredQuotes.length === 0 ? (
                  <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-center text-white/50">
                    <span className="text-3xl block mb-2">📋</span>
                    {isEn ? 'No quotes matching your filters.' : 'Aucun devis ne correspond aux critères.'}
                  </div>
                ) : (
                  filteredQuotes.map((quote) => {
                    const isSelected = selectedQuote?.reference === quote.reference;
                    return (
                      <div
                        key={quote.reference}
                        onClick={() => {
                          setSelectedQuote(quote);
                          setNoteText(quote.internalNotes || '');
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C1C1C] border-[#EBFF72] shadow-lg shadow-[#EBFF72]/5'
                            : 'bg-[#141414] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-[#EBFF72]">
                            {quote.reference}
                          </span>
                          {getStatusBadge(quote.status)}
                        </div>

                        <div className="flex items-baseline justify-between mb-1">
                          <h4 className="text-sm font-bold text-white">
                            {quote.clientName}
                            {quote.companyName && (
                              <span className="text-white/60 font-normal"> · {quote.companyName}</span>
                            )}
                          </h4>
                          <span className="font-mono text-xs font-bold text-white">
                            {formatFCFA(quote.totalPriceXAF)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                          <span>
                            {quote.industryName} {quote.city && `· ${quote.city}`}
                          </span>
                          <span>
                            {new Date(quote.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Fiche détaillée du devis sélectionné */}
              <div className="lg:col-span-6">
                {selectedQuote ? (
                  <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 sticky top-6 space-y-6">
                    {/* Header devis */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-mono text-white/40 uppercase block">
                          Détails du Devis
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span>{selectedQuote.reference}</span>
                        </h3>
                      </div>

                      <div>{getStatusBadge(selectedQuote.status)}</div>
                    </div>

                    {/* Coordonnées & Actions rapides WhatsApp */}
                    <div className="bg-[#1C1C1C] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/50 font-mono">Client :</span>
                        <span className="font-semibold text-white">{selectedQuote.clientName}</span>
                      </div>
                      {selectedQuote.companyName && (
                        <div className="flex justify-between">
                          <span className="text-white/50 font-mono">Entreprise :</span>
                          <span className="text-white">{selectedQuote.companyName}</span>
                        </div>
                      )}
                      {selectedQuote.city && (
                        <div className="flex justify-between">
                          <span className="text-white/50 font-mono">Ville :</span>
                          <span className="text-white">{selectedQuote.city}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-1 border-t border-white/5">
                        <span className="text-white/50 font-mono">WhatsApp :</span>
                        <a
                          href={`https://wa.me/${selectedQuote.clientPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#EBFF72] hover:underline font-mono font-semibold flex items-center gap-1"
                        >
                          <span>{selectedQuote.clientPhone}</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      </div>
                      {selectedQuote.clientEmail && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/50 font-mono">Email :</span>
                          <span className="text-white/80">{selectedQuote.clientEmail}</span>
                        </div>
                      )}
                    </div>

                    {/* Détail du projet & Chiffrage */}
                    <div>
                      <div className="text-xs font-mono text-white/50 uppercase mb-2">
                        {isEn ? 'Package & Selected Modules' : 'Formule & Options retenues'}
                      </div>
                      <div className="bg-[#1C1C1C] rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between text-white font-medium">
                          <span>Secteur : {selectedQuote.industryName}</span>
                          <span className="font-mono text-[#EBFF72]">{formatFCFA(selectedQuote.basePriceXAF)}</span>
                        </div>

                        {selectedQuote.selectedAddonTitles && selectedQuote.selectedAddonTitles.length > 0 ? (
                          <div className="pt-2 border-t border-white/5 space-y-1">
                            {selectedQuote.selectedAddonTitles.map((addon, i) => (
                              <div key={i} className="text-white/70 flex items-center gap-2">
                                <span className="text-[#EBFF72] text-[10px]">●</span>
                                <span>{addon}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-white/40 italic">Pack Vitrine standard uniquement</div>
                        )}

                        <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-mono">
                          <span className="font-bold text-white">Montant Total Net :</span>
                          <span className="text-base font-bold text-[#EBFF72]">
                            {formatFCFA(selectedQuote.totalPriceXAF)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-white/50">
                          <span>Facilité :</span>
                          <span>
                            {selectedQuote.paymentSplits} tranches de ~{formatFCFA(selectedQuote.splitAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sélecteur de statut d'avancement */}
                    <div>
                      <label className="text-xs font-mono text-white/50 uppercase block mb-2">
                        {isEn ? 'Update Status' : 'Faire évoluer le statut'}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['NEW', 'CONTACTED', 'IN_PROGRESS', 'DELIVERED'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(selectedQuote.reference, st)}
                            className={`py-2 px-2 rounded-xl text-[11px] font-mono transition-colors border ${
                              selectedQuote.status === st
                                ? 'bg-[#EBFF72] text-[#0E0E0E] font-bold border-[#EBFF72]'
                                : 'bg-[#1C1C1C] border-white/10 text-white/70 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Espace de notes internes de cadrage */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono text-white/50 uppercase">
                          {isEn ? 'Internal Scoping Notes' : 'Notes internes de cadrage'}
                        </label>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={handleSaveNotes}
                          className="text-[11px] font-mono font-bold text-[#EBFF72] hover:underline"
                        >
                          {isUpdating ? 'Sauvegarde...' : 'Enregistrer les notes'}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Ex: Client relancé sur WhatsApp. Doit envoyer les photos du restaurant et le menu avant mercredi..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-white/40">
                    Sélectionnez un devis pour afficher les détails.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            ONGLET 2 : RENDEZ-VOUS STUDIO
        ==================================================================== */}
        {activeTab === 'bookings' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EBFF72]/15 border border-[#EBFF72] text-[#EBFF72] flex items-center justify-center mx-auto text-xl">
              📅
            </div>
            <h3 className="text-xl font-bold text-white">Module Prise de Rendez-vous</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Le tunnel de prise de rendez-vous de cadrage 30 minutes est configuré sur l&apos;API. Dès qu&apos;un visiteur planifie un appel via le formulaire dédié, la fiche apparaîtra ici avec la détection anti-collision et le lien visio Google Meet / WhatsApp.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs text-[#EBFF72] bg-[#EBFF72]/10 px-3 py-1 rounded-full">
                Prêt pour la synchronisation VPS
              </span>
            </div>
          </div>
        )}

        {/* ====================================================================
            ONGLET 3 : RÉALISATIONS CMS
        ==================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Études de Cas en Ligne</h3>
                <p className="text-xs text-white/60">
                  Projets affichés sur la page d&apos;accueil et la page Réalisations (`/[lang]/realisations`).
                </p>
              </div>
              <Link
                href={`/${lang}/realisations`}
                className="text-xs font-mono px-3 py-1.5 rounded-full border border-[#EBFF72] text-[#EBFF72] hover:bg-[#EBFF72]/10"
              >
                Voir en direct ↗
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'MoMo Pay Terminal', sector: 'Fintech', city: 'Douala', year: '2025', status: 'En ligne' },
                { name: 'Yamo Delivery', sector: 'Logistique', city: 'Yaoundé', year: '2025', status: 'En ligne' },
                { name: 'Kribi Logistics Portal', sector: 'Fret Maritime', city: 'Kribi', year: '2024', status: 'En ligne' },
                { name: 'Maître Pro', sector: 'Services B2B', city: 'Libreville', year: '2025', status: 'En ligne' },
                { name: 'AgriLink Cameroon', sector: 'Agritech', city: 'Bafoussam', year: '2024', status: 'En ligne' },
                { name: 'Bantu Learn', sector: 'Éducation', city: 'Douala', year: '2024', status: 'En ligne' },
              ].map((p, i) => (
                <div key={i} className="bg-[#141414] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#EBFF72] bg-[#EBFF72]/10 px-2 py-0.5 rounded-full">
                      ● {p.status}
                    </span>
                    <span className="text-xs font-mono text-white/40">{p.year}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{p.name}</h4>
                  <div className="text-xs text-white/60 font-mono">
                    {p.sector} · {p.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            ONGLET 4 : PARAMÈTRES & TARIFS
        ==================================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Paramètres de l&apos;Offre XpreSite</h3>
              <p className="text-xs text-white/60">
                Configuration par défaut utilisée dans le simulateur public.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-[#1C1C1C] rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Tarif socle Vitrine de base</div>
                  <div className="text-white/50 text-[11px]">Prix d&apos;appel standard en FCFA</div>
                </div>
                <div className="text-base font-bold text-[#EBFF72]">
                  {formatFCFA(XPRESITE_CONFIG.defaultBasePriceXAF)}
                </div>
              </div>

              <div className="p-4 bg-[#1C1C1C] rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Promesse d&apos;exécution</div>
                  <div className="text-white/50 text-[11px]">Délai garanti dès réception des contenus</div>
                </div>
                <div className="text-base font-bold text-white">72 Heures</div>
              </div>

              <div className="p-4 bg-[#1C1C1C] rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Facilité de paiement</div>
                  <div className="text-white/50 text-[11px]">Calcul instantané dans le formulaire</div>
                </div>
                <div className="text-base font-bold text-white">2 ou 3 tranches</div>
              </div>

              <div className="p-4 bg-[#1C1C1C] rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">Hébergement & Domaine</div>
                  <div className="text-white/50 text-[11px]">Offert avec chaque pack</div>
                </div>
                <div className="text-base font-bold text-white">1 An Inclus</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
