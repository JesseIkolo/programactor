'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar01Icon,
  Clock01Icon,
  Search01Icon,
  FilterIcon,
  RefreshIcon,
  Tick01Icon,
  AlertCircleIcon,
  WhatsappIcon,
  Mail01Icon,
  Globe02Icon,
  Building01Icon,
  Video01Icon,
} from 'hugeicons-react';

export type BookingStatus =
  | 'CONFIRMÉ'
  | 'EN ATTENTE'
  | 'HONORÉ'
  | 'ANNULÉ'
  | 'REPORTÉ'
  | 'EN ATTENTE DE PAIEMENT'
  | 'A RELANCER';

export interface BookingItem {
  _id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  sector?: string;
  topic?: string;
  meetingType: 'EN_LIGNE' | 'PRESENTIEL';
  locationDetails?: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  internalNotes?: string;
  lang?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; border: string }> = {
  CONFIRMÉ: {
    label: 'Confirmé',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  'EN ATTENTE': {
    label: 'En attente',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  HONORÉ: {
    label: 'Honoré',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  ANNULÉ: {
    label: 'Annulé',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  REPORTÉ: {
    label: 'Reporté',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  'EN ATTENTE DE PAIEMENT': {
    label: 'En attente de paiement',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  'A RELANCER': {
    label: 'À relancer',
    color: 'text-[#EBFF72]',
    bg: 'bg-[#EBFF72]/10',
    border: 'border-[#EBFF72]/30',
  },
};

interface AdminBookingsTabProps {
  token: string | null;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isEn?: boolean;
}

export default function AdminBookingsTab({ token, showToast, isEn = false }: AdminBookingsTabProps) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBookings(data.data);
        if (selectedBooking) {
          const updated = data.data.find((b: BookingItem) => b._id === selectedBooking._id);
          if (updated) setSelectedBooking(updated);
        }
      }
    } catch (err) {
      console.error('Erreur chargement bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      setInternalNotes(selectedBooking.internalNotes || '');
    }
  }, [selectedBooking]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        b.clientName.toLowerCase().includes(q) ||
        b.clientPhone.toLowerCase().includes(q) ||
        b.clientEmail.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        (b.companyName && b.companyName.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'CONFIRMÉ').length,
      pending: bookings.filter((b) => b.status === 'EN ATTENTE').length,
      followUp: bookings.filter((b) => b.status === 'A RELANCER').length,
    };
  }, [bookings]);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: selectedBooking._id,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBooking._id ? { ...b, status: newStatus } : b))
        );
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
        showToast(isEn ? 'Status updated.' : 'Statut mis à jour avec succès.', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: selectedBooking._id,
          internalNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBooking._id ? { ...b, internalNotes } : b))
        );
        setSelectedBooking((prev) => (prev ? { ...prev, internalNotes } : null));
        showToast(isEn ? 'Notes saved.' : 'Notes enregistrées avec succès.', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l’enregistrement.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cartes de métriques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
          <div className="text-xs font-mono uppercase text-white/50 mb-1">
            {isEn ? 'Total Appointments' : 'Total Rendez-vous'}
          </div>
          <div className="text-2xl font-mono font-medium text-white">{stats.total}</div>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
          <div className="text-xs font-mono uppercase text-white/50 mb-1">
            {isEn ? 'Confirmed' : 'Confirmés'}
          </div>
          <div className="text-2xl font-mono font-medium text-emerald-400">{stats.confirmed}</div>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
          <div className="text-xs font-mono uppercase text-white/50 mb-1">
            {isEn ? 'Pending' : 'En Attente'}
          </div>
          <div className="text-2xl font-mono font-medium text-amber-400">{stats.pending}</div>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
          <div className="text-xs font-mono uppercase text-white/50 mb-1">
            {isEn ? 'Follow Up' : 'À Relancer'}
          </div>
          <div className="text-2xl font-mono font-medium text-[#EBFF72]">{stats.followUp}</div>
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
            placeholder={isEn ? 'Search by name, ref, phone...' : 'Recherche par nom, réf, téléphone...'}
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
            className="bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white px-3 py-2 focus:outline-none focus:border-[#EBFF72]"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="CONFIRMÉ">Confirmé</option>
            <option value="EN ATTENTE">En attente</option>
            <option value="HONORÉ">Honoré</option>
            <option value="ANNULÉ">Annulé</option>
            <option value="REPORTÉ">Reporté</option>
            <option value="EN ATTENTE DE PAIEMENT">En attente de paiement</option>
            <option value="A RELANCER">À relancer</option>
          </select>

          <button
            type="button"
            onClick={fetchBookings}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-colors"
            title="Rafraîchir"
          >
            <RefreshIcon size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Grille principale : Liste des RDV + Détail du RDV sélectionné */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Liste des rendez-vous */}
        <div className="lg:col-span-7 space-y-3">
          {loading && bookings.length === 0 ? (
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
              Chargement des réservations...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
              Aucun rendez-vous ne correspond à vos critères.
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isSelected = selectedBooking?._id === b._id;
              const statusCfg = STATUS_CONFIG[b.status] || STATUS_CONFIG['CONFIRMÉ'];
              return (
                <div
                  key={b._id}
                  onClick={() => setSelectedBooking(b)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-[#1C1C1C] border-[#EBFF72] shadow-lg shadow-[#EBFF72]/5'
                      : 'bg-[#141414] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-white/40">{b.reference}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs font-mono text-white/70 flex items-center gap-1">
                        <Calendar01Icon size={13} className="text-[#EBFF72]" />
                        {b.date} à {b.timeSlot}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
                    >
                      ● {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{b.clientName}</span>
                        {b.companyName && (
                          <span className="text-xs text-white/40 font-normal">({b.companyName})</span>
                        )}
                      </h4>
                      <div className="text-xs text-white/60 font-mono mt-0.5">{b.clientPhone}</div>
                    </div>

                    <div className="text-right flex items-center gap-1.5 text-xs font-mono text-white/60 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
                      {b.meetingType === 'PRESENTIEL' ? (
                        <>
                          <Building01Icon size={14} className="text-[#EBFF72]" />
                          <span>Présentiel</span>
                        </>
                      ) : (
                        <>
                          <Video01Icon size={14} className="text-blue-400" />
                          <span>Visio</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panneau de détails */}
        <div className="lg:col-span-5">
          {selectedBooking ? (
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
                    Fiche Rendez-vous
                  </span>
                  <h3 className="text-base font-bold text-white">{selectedBooking.reference}</h3>
                </div>

                {/* Changement de statut 1-clic */}
                <div>
                  <select
                    disabled={isUpdating}
                    value={selectedBooking.status}
                    onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
                    className="bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white px-3 py-1.5 focus:outline-none focus:border-[#EBFF72]"
                  >
                    <option value="CONFIRMÉ">CONFIRMÉ</option>
                    <option value="EN ATTENTE">EN ATTENTE</option>
                    <option value="HONORÉ">HONORÉ</option>
                    <option value="ANNULÉ">ANNULÉ</option>
                    <option value="REPORTÉ">REPORTÉ</option>
                    <option value="EN ATTENTE DE PAIEMENT">EN ATTENTE DE PAIEMENT</option>
                    <option value="A RELANCER">A RELANCER</option>
                  </select>
                </div>
              </div>

              {/* Infos Contact Prospect */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-black/40 rounded-xl space-y-1.5">
                  <div className="text-white/40 text-[10px] uppercase">Client / Entreprise</div>
                  <div className="text-white font-bold text-sm">{selectedBooking.clientName}</div>
                  {selectedBooking.companyName && (
                    <div className="text-white/70">{selectedBooking.companyName}</div>
                  )}
                  <div className="text-white/60">{selectedBooking.clientEmail}</div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl space-y-1.5">
                  <div className="text-white/40 text-[10px] uppercase">Créneau Réservé</div>
                  <div className="text-[#EBFF72] font-semibold">
                    {selectedBooking.date} à {selectedBooking.timeSlot} (30 min)
                  </div>
                  <div className="text-white/70">
                    Format :{' '}
                    {selectedBooking.meetingType === 'PRESENTIEL'
                      ? 'Présentiel (Bureaux / Locaux client)'
                      : 'En ligne (Google Meet / WhatsApp)'}
                  </div>
                  {selectedBooking.locationDetails && (
                    <div className="text-white/50 text-[11px]">
                      Lieu : {selectedBooking.locationDetails}
                    </div>
                  )}
                </div>

                {selectedBooking.topic && (
                  <div className="p-3 bg-black/40 rounded-xl space-y-1">
                    <div className="text-white/40 text-[10px] uppercase">Sujet / Problème</div>
                    <div className="text-white/80 font-sans text-xs">{selectedBooking.topic}</div>
                  </div>
                )}
              </div>

              {/* Bouton d'action directe WhatsApp */}
              <div className="pt-1">
                <a
                  href={`https://wa.me/${selectedBooking.clientPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <WhatsappIcon size={16} />
                  <span>Contacter sur WhatsApp ({selectedBooking.clientPhone})</span>
                </a>
              </div>

              {/* Notes internes de suivi */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-white/50 uppercase">
                    Notes internes de cadrage
                  </label>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleSaveNotes}
                    className="text-[11px] font-mono font-medium text-[#EBFF72] hover:underline"
                  >
                    {isUpdating ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Ex: Cadrage effectué sur Meet. Client intéressé par XpreSite avec option panier. Relance prévue vendredi..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
              Sélectionnez un rendez-vous pour afficher et gérer sa fiche.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
