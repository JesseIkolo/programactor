'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Logout01Icon,
  SecurityLockIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Search01Icon,
  FilterIcon,
  RefreshIcon,
  Tick01Icon,
  Calendar01Icon,
  Globe02Icon,
} from 'hugeicons-react';
import { Mark, Wordmark } from '@/components/ui';
import { XPRESITE_CONFIG, formatFCFA } from '@/lib/xpresite-data';
import AdminLogin from '@/components/admin/AdminLogin';

interface QuoteItem {
  _id?: string;
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

  // État d'authentification
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // État UI & Navigation
  const [activeTab, setActiveTab] = useState<'quotes' | 'bookings' | 'projects' | 'settings'>('quotes');
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [vpsStatus, setVpsStatus] = useState<'connected' | 'checking' | 'fallback'>('checking');

  // Système de Toast Notifications UX
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    }
    return 'https://api.programactor.pro/api/v1';
  };

  // 1. Vérification de session persistée
  useEffect(() => {
    const savedToken = sessionStorage.getItem('programactor_admin_token');
    const savedUser = sessionStorage.getItem('programactor_admin_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          setCurrentUser({ email: 'admin@programactor.pro', name: 'Studio Admin', role: 'SUPER_ADMIN' });
        }
      }
    }
    setIsAuthChecking(false);
  }, []);

  // 2. Déconnexion
  const handleLogout = () => {
    sessionStorage.removeItem('programactor_admin_token');
    sessionStorage.removeItem('programactor_admin_user');
    setToken(null);
    setCurrentUser(null);
    showToast(isEn ? 'Signed out successfully.' : 'Déconnexion effectuée avec succès.', 'success');
  };

  // 3. Charger les devis (Priorité Backend VPS / MongoDB Atlas avec fallback local)
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      let loadedQuotes: QuoteItem[] = [];

      try {
        const res = await fetch(`${apiUrl}/quotes`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.quotes) {
            loadedQuotes = data.data.quotes;
            setVpsStatus('connected');
          }
        }
      } catch {
        setVpsStatus('fallback');
      }

      // Fallback local si l'API VPS n'a pas répondu
      if (loadedQuotes.length === 0) {
        const resLocal = await fetch('/api/admin/quotes');
        const dataLocal = await resLocal.json();
        if (dataLocal.success && Array.isArray(dataLocal.quotes)) {
          loadedQuotes = dataLocal.quotes;
        }
      }

      setQuotes(loadedQuotes);
      if (loadedQuotes.length > 0) {
        if (!selectedQuote || !loadedQuotes.find((q) => q.reference === selectedQuote.reference)) {
          setSelectedQuote(loadedQuotes[0]);
          setNoteText(loadedQuotes[0].internalNotes || '');
        }
      }
    } catch (err) {
      console.error('Erreur chargement devis :', err);
      showToast(isEn ? 'Could not load quotes.' : 'Impossible de charger les devis.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchQuotes();
    }
  }, [token]);

  // 4. Mettre à jour le statut d'un devis
  const handleUpdateStatus = async (reference: string, newStatus: string) => {
    setIsUpdating(true);
    const apiUrl = getApiUrl();

    try {
      let success = false;

      // Tentative VPS
      try {
        const res = await fetch(`${apiUrl}/quotes/${reference}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) success = true;
      } catch {}

      // Fallback local
      if (!success) {
        const res = await fetch('/api/admin/quotes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, status: newStatus }),
        });
        if (res.ok) success = true;
      }

      if (success) {
        setQuotes((prev) =>
          prev.map((q) => (q.reference === reference ? { ...q, status: newStatus as any } : q))
        );
        if (selectedQuote && selectedQuote.reference === reference) {
          setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
        showToast(
          isEn ? `Status updated to ${newStatus}` : `Statut mis à jour : ${newStatus}`,
          'success'
        );
      } else {
        showToast(isEn ? 'Error updating status' : 'Erreur de mise à jour du statut', 'error');
      }
    } catch {
      showToast(isEn ? 'Network error' : 'Erreur réseau', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Sauvegarder les notes internes
  const handleSaveNotes = async () => {
    if (!selectedQuote) return;
    setIsUpdating(true);
    const apiUrl = getApiUrl();

    try {
      let success = false;

      try {
        const res = await fetch(`${apiUrl}/quotes/${selectedQuote.reference}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ internalNotes: noteText }),
        });
        if (res.ok) success = true;
      } catch {}

      if (!success) {
        const res = await fetch('/api/admin/quotes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: selectedQuote.reference, internalNotes: noteText }),
        });
        if (res.ok) success = true;
      }

      if (success) {
        setQuotes((prev) =>
          prev.map((q) => (q.reference === selectedQuote.reference ? { ...q, internalNotes: noteText } : q))
        );
        setSelectedQuote((prev) => (prev ? { ...prev, internalNotes: noteText } : null));
        showToast(isEn ? 'Notes saved successfully' : 'Notes internes sauvegardées avec succès', 'success');
      } else {
        showToast(isEn ? 'Error saving notes' : 'Erreur lors de la sauvegarde', 'error');
      }
    } catch {
      showToast(isEn ? 'Network error' : 'Erreur réseau', 'error');
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

  // Statistiques
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

  // Écran de chargement initial de vérification de session
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-[#EBFF72]/30 border-t-[#EBFF72] rounded-full animate-spin" />
          <span className="text-xs font-mono text-white/50">Vérification de la session...</span>
        </div>
      </div>
    );
  }

  // BARRIÈRE DE SÉCURITÉ : Si aucun token n'est présent, forcer l'écran de connexion
  if (!token) {
    return (
      <AdminLogin
        lang={lang}
        onSuccess={(newToken, user) => {
          setToken(newToken);
          setCurrentUser(user);
          showToast(isEn ? 'Welcome to Studio Backoffice' : 'Bienvenue sur le Studio Backoffice', 'success');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col relative">
      {/* Toast Notification Flottante UX */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-mono backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#141414]/95 border-[#EBFF72]/40 text-[#EBFF72]'
                : 'bg-[#141414]/95 border-red-500/40 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckmarkCircle02Icon size={16} /> : <AlertCircleIcon size={16} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Admin */}
      <header className="border-b border-white/10 bg-[#141414] px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}`} className="flex items-center gap-3">
              <Mark className="h-5 w-auto text-white" accent="var(--color-signal)" accentOpacity={1} />
              <Wordmark className="text-lg leading-none" />
            </Link>
            <span className="hidden sm:inline-block text-xs font-mono text-white/40">/</span>
            <span className="text-xs font-mono font-semibold tracking-wider text-[#EBFF72] bg-[#EBFF72]/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <SecurityLockIcon size={14} />
              STUDIO ADMIN
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Statut VPS / Atlas */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-white/70 text-[11px]">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  vpsStatus === 'connected'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-[#EBFF72]'
                }`}
              />
              <span>{vpsStatus === 'connected' ? 'VPS Atlas : En ligne' : 'Atlas : Synchronisé'}</span>
            </div>

            {/* Profil connecté */}
            <span className="hidden lg:inline-block text-white/50 text-[11px]">
              {currentUser?.email || 'admin@programactor.pro'}
            </span>

            {/* Lien Site Public */}
            <Link
              href={`/${lang}`}
              className="text-white/60 hover:text-white px-3 py-1 rounded-full border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <Globe02Icon size={13} />
              <span className="hidden sm:inline">{isEn ? 'Public Site' : 'Site public'}</span>
            </Link>

            {/* Bouton de Déconnexion */}
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30 transition-colors flex items-center gap-1.5 font-bold"
              title={isEn ? 'Sign Out' : 'Se déconnecter'}
            >
              <Logout01Icon size={14} />
              <span>{isEn ? 'Logout' : 'Déconnexion'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Barre de navigation interne */}
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
            <Calendar01Icon size={14} />
            <span>{isEn ? 'Appointments' : 'Rendez-vous'}</span>
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
            {isEn ? 'Pricing Config' : 'Configuration Tarifs'}
          </button>
        </div>
      </div>

      {/* Contenu de l'Admin */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
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
                <div className="text-xs font-mono uppercase text-white/50 mb-1">
                  {isEn ? 'New Inquiries' : 'Nouveaux Devis'}
                </div>
                <div className="text-2xl font-mono font-bold text-[#EBFF72]">
                  {stats.newQuotes}
                </div>
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
                <div className="text-xs font-mono uppercase text-white/50 mb-1">
                  {isEn ? 'Estimated Pipeline Volume' : 'Volume Estimé du Pipeline'}
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {formatFCFA(stats.totalVolumeXAF)}
                </div>
              </div>
            </div>

            {/* Barre de Recherche et Filtres */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#141414] border border-white/10 p-3 rounded-2xl">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                  <Search01Icon size={15} />
                </div>
                <input
                  type="text"
                  placeholder={isEn ? 'Search by client, city, ref...' : 'Recherche par client, ville, réf...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 text-white/40 text-xs font-mono pl-1">
                  <FilterIcon size={14} />
                  <span>Statut :</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-black/50 border border-white/10 text-xs font-mono rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#EBFF72]"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="NEW">NOUVEAU</option>
                  <option value="CONTACTED">CONTACTÉ</option>
                  <option value="IN_PROGRESS">EN DEV (72H)</option>
                  <option value="DELIVERED">LIVRÉ</option>
                  <option value="CANCELLED">ANNULÉ</option>
                </select>

                <button
                  type="button"
                  onClick={fetchQuotes}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
                  title="Actualiser la liste"
                >
                  <RefreshIcon size={15} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Grille : Liste Devis (Gauche) + Détail (Droite) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Colonne Liste */}
              <div className="lg:col-span-5 space-y-3">
                {loading ? (
                  <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-xs font-mono text-white/50">
                    <span className="w-6 h-6 border-2 border-[#EBFF72]/40 border-t-[#EBFF72] rounded-full animate-spin inline-block mb-3" />
                    <div>Chargement des devis...</div>
                  </div>
                ) : filteredQuotes.length === 0 ? (
                  <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-xs font-mono text-white/40">
                    Aucun devis ne correspond aux critères.
                  </div>
                ) : (
                  filteredQuotes.map((q) => {
                    const isSelected = selectedQuote?.reference === q.reference;
                    return (
                      <div
                        key={q.reference}
                        onClick={() => {
                          setSelectedQuote(q);
                          setNoteText(q.internalNotes || '');
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C1C1C] border-[#EBFF72]/70 shadow-lg shadow-[#EBFF72]/5'
                            : 'bg-[#141414] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-[#EBFF72]">
                            {q.reference}
                          </span>
                          {getStatusBadge(q.status)}
                        </div>

                        <div className="text-sm font-bold text-white mb-1">
                          {q.clientName}
                          {q.companyName && (
                            <span className="text-white/50 font-normal ml-1">
                              ({q.companyName})
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-mono text-white/60 mb-2">
                          {q.industryName} {q.city ? `· ${q.city}` : ''}
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5 text-white/50">
                          <span>{formatFCFA(q.totalPriceXAF)}</span>
                          <span>{new Date(q.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Colonne Détail */}
              <div className="lg:col-span-7">
                {selectedQuote ? (
                  <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 sticky top-20">
                    {/* Header fiche */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-mono font-bold text-[#EBFF72]">
                            {selectedQuote.reference}
                          </span>
                          {getStatusBadge(selectedQuote.status)}
                        </div>
                        <div className="text-xs font-mono text-white/40 mt-0.5">
                          Enregistré le {new Date(selectedQuote.createdAt).toLocaleString('fr-FR')}
                        </div>
                      </div>

                      {/* Sélecteur de statut rapide */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/50">Modifier état :</span>
                        <select
                          disabled={isUpdating}
                          value={selectedQuote.status}
                          onChange={(e) => handleUpdateStatus(selectedQuote.reference, e.target.value)}
                          className="bg-black border border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:border-[#EBFF72]"
                        >
                          <option value="NEW">NOUVEAU</option>
                          <option value="CONTACTED">CONTACTÉ</option>
                          <option value="IN_PROGRESS">EN DEV (72H)</option>
                          <option value="DELIVERED">LIVRÉ</option>
                          <option value="CANCELLED">ANNULÉ</option>
                        </select>
                      </div>
                    </div>

                    {/* Coordonnées Client */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                      <div>
                        <span className="text-white/40 block mb-1">CLIENT</span>
                        <span className="text-white font-bold">{selectedQuote.clientName}</span>
                        {selectedQuote.companyName && (
                          <span className="block text-white/60">{selectedQuote.companyName}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-white/40 block mb-1">CONTACT WHATSAPP</span>
                        <a
                          href={`https://wa.me/${selectedQuote.clientPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#EBFF72] font-bold hover:underline flex items-center gap-1.5"
                        >
                          <span>{selectedQuote.clientPhone}</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                        {selectedQuote.clientEmail && (
                          <span className="block text-white/60">{selectedQuote.clientEmail}</span>
                        )}
                      </div>

                      <div>
                        <span className="text-white/40 block mb-1">VILLE / MARCHÉ</span>
                        <span className="text-white">{selectedQuote.city || 'Non spécifiée'}</span>
                      </div>

                      <div>
                        <span className="text-white/40 block mb-1">SECTEUR D&apos;ACTIVITÉ</span>
                        <span className="text-white font-bold">{selectedQuote.industryName}</span>
                      </div>
                    </div>

                    {/* Options XpreSite Choisies */}
                    <div>
                      <div className="text-xs font-mono text-white/50 mb-2 uppercase">
                        Fonctionnalités & Options Configurées
                      </div>
                      <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
                        {selectedQuote.selectedAddonTitles && selectedQuote.selectedAddonTitles.length > 0 ? (
                          selectedQuote.selectedAddonTitles.map((t, idx) => (
                            <div key={idx} className="text-xs font-mono text-white flex items-center gap-2">
                              <Tick01Icon size={14} className="text-[#EBFF72]" />
                              <span>{t}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs font-mono text-white/50">
                            Pack Vitrine Express Standard (Sans modules additionnels)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Synthèse Financière */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-white/60">
                        <span>Pack Socle Vitrine (72h)</span>
                        <span>{formatFCFA(selectedQuote.basePriceXAF)}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Modules Additionnels</span>
                        <span>{formatFCFA(selectedQuote.addonsTotalXAF || 0)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                        <span>Total Devis</span>
                        <span className="text-[#EBFF72]">{formatFCFA(selectedQuote.totalPriceXAF)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#EBFF72]/80 pt-1">
                        <span>Facilité appliquée</span>
                        <span>
                          {selectedQuote.paymentSplits} tranches de ~
                          {formatFCFA(selectedQuote.splitAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Notes Internes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-white/50 uppercase">
                          Notes internes de cadrage studio
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
                        placeholder="Ex: Client relancé sur WhatsApp. Doit envoyer le menu et les photos du restaurant avant mercredi..."
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

        {/* ONGLET 2 : RENDEZ-VOUS STUDIO */}
        {activeTab === 'bookings' && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EBFF72]/15 border border-[#EBFF72] text-[#EBFF72] flex items-center justify-center mx-auto text-xl">
              <Calendar01Icon size={24} />
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

        {/* ONGLET 3 : RÉALISATIONS CMS */}
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

        {/* ONGLET 4 : CONFIGURATION TARIFS */}
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
