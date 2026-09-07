'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar01Icon,
  Clock01Icon,
  Call02Icon,
  Mail01Icon,
  Building01Icon,
  Globe02Icon,
  Tick01Icon,
  WhatsappIcon,
  Video01Icon,
  ArrowRight01Icon,
  AlertCircleIcon,
  UserIcon,
} from 'hugeicons-react';
import { Mark, Wordmark } from '@/components/ui';

interface BookingFormProps {
  lang: 'fr' | 'en';
}

export default function BookingForm({ lang }: BookingFormProps) {
  const isEn = lang === 'en';

  // Calcul des dates disponibles (30 prochains jours, hors week-ends)
  const availableDates = useMemo(() => {
    const dates: { dateStr: string; label: string; weekday: string }[] = [];
    const today = new Date();
    let current = new Date(today);
    // Commencer à partir de demain pour laisser le temps de préparation
    current.setDate(current.getDate() + 1);

    while (dates.length < 20) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        // Lundi à Vendredi
        const dateStr = current.toISOString().slice(0, 10);
        const weekday = current.toLocaleDateString(isEn ? 'en-US' : 'fr-FR', { weekday: 'short' });
        const label = current.toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
          day: 'numeric',
          month: 'short',
        });
        dates.push({ dateStr, label, weekday: weekday.toUpperCase() });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [isEn]);

  // État du formulaire
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.dateStr || '');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [channel, setChannel] = useState<'EN_LIGNE' | 'PRESENTIEL'>('EN_LIGNE');

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [topic, setTopic] = useState('');
  const [locationDetails, setLocationDetails] = useState('');

  // Créneaux horaires disponibles pour la date sélectionnée
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    reference: string;
    whatsappUrl: string;
  } | null>(null);

  // Charger les créneaux lors du changement de date
  useEffect(() => {
    if (!selectedDate) return;
    let isCancelled = false;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedSlot('');
      try {
        const res = await fetch(`/api/bookings/slots?date=${selectedDate}`);
        const data = await res.json();
        if (!isCancelled && data.success && Array.isArray(data.slots)) {
          setSlots(data.slots);
          const firstAvail = data.slots.find((s: any) => s.available);
          if (firstAvail) {
            setSelectedSlot(firstAvail.time);
          }
        }
      } catch (err) {
        console.error('Erreur chargement créneaux:', err);
      } finally {
        if (!isCancelled) setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !selectedDate || !selectedSlot) {
      setErrorMessage(
        isEn
          ? 'Please fill in all mandatory fields and select a valid time slot.'
          : 'Veuillez renseigner tous les champs obligatoires et choisir un créneau.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        companyName,
        meetingType: channel,
        locationDetails: channel === 'PRESENTIEL' ? locationDetails : '',
        topic,
        date: selectedDate,
        timeSlot: selectedSlot,
        lang,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de la réservation.');
      }

      setBookingSuccess({
        reference: data.data?.booking?.reference || 'CONFIRMED',
        whatsappUrl: data.data?.whatsappUrl || '#',
      });

      // Redirection immédiate vers WhatsApp
      if (data.data?.whatsappUrl) {
        setTimeout(() => {
          window.location.href = data.data.whatsappUrl;
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible de confirmer le rendez-vous. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col selection:bg-[#EBFF72] selection:text-black">
      {/* Navigation Minimale */}
      <header className="border-b border-white/10 bg-[#141414]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <Mark className="h-5 w-auto text-white group-hover:text-[#EBFF72] transition-colors" accent="var(--color-signal)" accentOpacity={1} />
            <Wordmark className="text-lg leading-none" />
          </Link>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="hidden sm:inline-block text-white/50">
              {isEn ? 'Strategy Discovery Session · 30 min' : 'Session de cadrage · 30 min'}
            </span>
            <Link
              href={`/${lang}`}
              className="text-white/70 hover:text-white px-3 py-1 rounded-full border border-white/15 hover:border-white/40 transition-colors"
            >
              {isEn ? '← Back to Home' : '← Retour au site'}
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {bookingSuccess ? (
          /* Carte de Confirmation & Redirection */
          <div className="max-w-xl mx-auto bg-[#141414] border border-[#EBFF72]/40 rounded-3xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-16 h-16 rounded-full bg-[#EBFF72] text-[#0E0E0E] flex items-center justify-center mx-auto shadow-2xl shadow-[#EBFF72]/20">
              <Tick01Icon size={32} />
            </div>

            <div className="space-y-2">
              <span className="inline-block font-mono text-xs px-3 py-1 bg-[#EBFF72]/10 text-[#EBFF72] rounded-full border border-[#EBFF72]/20">
                {isEn ? 'Booking Confirmed' : 'Rendez-vous Confirmé'} · {bookingSuccess.reference}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {isEn ? 'Your session is locked in!' : 'Votre créneau est réservé !'}
              </h1>
              <p className="text-sm text-white/60 max-w-md mx-auto">
                {isEn
                  ? 'We are redirecting you to WhatsApp with your pre-filled summary to connect directly with the Programactor leadership team.'
                  : 'Redirection automatique en cours vers WhatsApp avec votre récapitulatif pour échanger directement avec la direction du studio.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-left space-y-2">
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Date & Time:' : 'Date & Heure :'}</span>
                <span className="text-[#EBFF72] font-semibold">{selectedDate} à {selectedSlot} (GMT+1)</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Format:' : 'Format :'}</span>
                <span className="text-white">{channel === 'PRESENTIEL' ? (isEn ? 'In-Person' : 'Présentiel') : (isEn ? 'Online Video' : 'Visio en ligne')}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Contact:' : 'Contact :'}</span>
                <span className="text-white">{clientName} ({clientPhone})</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={bookingSuccess.whatsappUrl}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-sm transition-all shadow-xl shadow-[#EBFF72]/20"
              >
                <WhatsappIcon size={20} />
                <span>{isEn ? 'Open WhatsApp Immediately' : 'Ouvrir WhatsApp immédiatement'}</span>
              </a>
              <p className="text-[11px] font-mono text-white/40 mt-3">
                {isEn ? 'Click the button if redirection did not trigger automatically.' : 'Cliquez sur le bouton si la redirection ne démarre pas.'}
              </p>
            </div>
          </div>
        ) : (
          /* Formulaire de Réservation */
          <div className="space-y-8">
            {/* En-tête éditorial */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/20 text-[#EBFF72] text-xs font-mono">
                <Calendar01Icon size={14} />
                <span>{isEn ? 'Studio Strategic Intake' : 'Cadrage Stratégique Studio'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {isEn ? 'Book your 30-min strategy call' : 'Planifiez votre session de 30 minutes'}
              </h1>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                {isEn
                  ? 'A dedicated 30-minute session with a Programactor lead to evaluate your technical roadmap, budget, and business timeline.'
                  : 'Un échange de cadrage direct avec la direction technique de Programactor pour analyser vos besoins, valider votre architecture et chiffrer votre délai de livraison.'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-3">
                <AlertCircleIcon size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Colonne Gauche : Calendrier & Créneaux (Option A) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Sélecteur de date (Lun-Ven) */}
                <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-2">
                      <Calendar01Icon size={15} className="text-[#EBFF72]" />
                      <span>1. {isEn ? 'Select a business day' : 'Choisissez un jour ouvré'}</span>
                    </label>
                    <span className="text-[11px] font-mono text-white/40">
                      {isEn ? 'Mon - Fri only' : 'Lun - Ven uniquement'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {availableDates.map((d) => {
                      const isSelected = selectedDate === d.dateStr;
                      return (
                        <button
                          key={d.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(d.dateStr)}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-[#EBFF72] text-[#0E0E0E] border-[#EBFF72] shadow-lg shadow-[#EBFF72]/15 font-bold scale-[1.02]'
                              : 'bg-black/40 text-white border-white/10 hover:border-white/30 hover:bg-white/5'
                          }`}
                        >
                          <span className="text-[10px] font-mono tracking-wider opacity-70">
                            {d.weekday}
                          </span>
                          <span className="text-xs font-mono font-semibold">{d.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sélecteur de créneau horaire (10h - 18h, 30 min) */}
                <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-2">
                      <Clock01Icon size={15} className="text-[#EBFF72]" />
                      <span>2. {isEn ? 'Select a 30-minute slot' : 'Choisissez votre tranche de 30 min'}</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#EBFF72]">
                      10h00 — 18h00 (WAT / GMT+1)
                    </span>
                  </div>

                  {loadingSlots ? (
                    <div className="py-8 text-center text-xs font-mono text-white/40 flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-[#EBFF72] border-t-transparent rounded-full animate-spin" />
                      <span>{isEn ? 'Checking slot availability...' : 'Vérification des disponibilités en temps réel...'}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                      {slots.map((s) => {
                        const isSelected = selectedSlot === s.time;
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            onClick={() => setSelectedSlot(s.time)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-mono transition-all text-center ${
                              !s.available
                                ? 'bg-black/20 text-white/20 border-white/5 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-[#EBFF72] text-[#0E0E0E] border-[#EBFF72] font-bold shadow-md shadow-[#EBFF72]/15'
                                : 'bg-black/40 text-white/80 border-white/10 hover:border-white/40 hover:bg-white/5'
                            }`}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sélecteur de canal : En ligne vs Présentiel */}
                <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 space-y-4">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-2">
                    <Globe02Icon size={15} className="text-[#EBFF72]" />
                    <span>3. {isEn ? 'Meeting Channel' : 'Modalité du rendez-vous'}</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setChannel('EN_LIGNE')}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        channel === 'EN_LIGNE'
                          ? 'bg-[#EBFF72]/10 border-[#EBFF72] text-white'
                          : 'bg-black/30 border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 ${channel === 'EN_LIGNE' ? 'bg-[#EBFF72] text-black' : 'bg-white/10 text-white'}`}>
                        <Video01Icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isEn ? 'Online Video Call' : 'Visio en ligne'}
                        </div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          Google Meet ou WhatsApp Vidéo
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setChannel('PRESENTIEL')}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        channel === 'PRESENTIEL'
                          ? 'bg-[#EBFF72]/10 border-[#EBFF72] text-white'
                          : 'bg-black/30 border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 ${channel === 'PRESENTIEL' ? 'bg-[#EBFF72] text-black' : 'bg-white/10 text-white'}`}>
                        <Building01Icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isEn ? 'In-Person Meeting' : 'En présentiel'}
                        </div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          Douala / Libreville (Bureaux ou chez vous)
                        </div>
                      </div>
                    </button>
                  </div>

                  {channel === 'PRESENTIEL' && (
                    <div className="pt-2 animate-in fade-in duration-200">
                      <label className="block text-xs font-mono text-white/50 mb-1.5">
                        {isEn ? 'Meeting location details' : 'Précisions sur le lieu (Ville, quartier, locaux)'}
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Douala, Bonanjo ou Libreville, Glass..."
                        value={locationDetails}
                        onChange={(e) => setLocationDetails(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/25 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Colonne Droite : Coordonnées du Prospect */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 sticky top-24">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white">
                      {isEn ? '4. Your Details' : '4. Vos Coordonnées'}
                    </h3>
                    <p className="text-xs text-white/50">
                      {isEn
                        ? 'We will send confirmation and prepare your strategic deck.'
                        : 'Permet de préparer le dossier technique avant le début du call.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <UserIcon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'FULL NAME *' : 'NOM & PRÉNOM *'}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Paul Mbarga"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Call02Icon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'WHATSAPP / PHONE NUMBER *' : 'TÉLÉPHONE / WHATSAPP *'}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+237 6 99 00 00 00"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Mail01Icon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'BUSINESS EMAIL *' : 'EMAIL PROFESSIONNEL *'}</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="paul@entreprise.cm"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Building01Icon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'COMPANY / PROJECT NAME' : 'ENTREPRISE / NOM DU PROJET'}</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Douala Logistics SARL"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1.5">
                        {isEn ? 'OBJECTIVE / PROBLEM SUMMARY' : 'OBJECTIF DU PROJET / SUJET'}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={isEn ? 'Tell us about your needs, timeline, or current bottlenecks...' : 'Décrivez brièvement votre projet, vos objectifs ou vos attentes...'}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>
                  </div>

                  {/* Récapitulatif sélectionné */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="text-white/40 uppercase tracking-wider">{isEn ? 'Summary' : 'Créneau choisi'}</div>
                    <div className="text-white font-bold flex items-center justify-between">
                      <span>{selectedDate || '—'} à {selectedSlot || '—'}</span>
                      <span className="text-[#EBFF72]">{channel === 'PRESENTIEL' ? 'Présentiel' : 'Visio'}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedSlot}
                    className="w-full py-4 px-6 rounded-2xl bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#EBFF72]/15 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                        <span>{isEn ? 'Confirming appointment...' : 'Confirmation en cours...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isEn ? 'Confirm & Open WhatsApp' : 'Confirmer & Ouvrir WhatsApp'}</span>
                        <ArrowRight01Icon size={18} />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] font-mono text-center text-white/40 leading-relaxed">
                    {isEn
                      ? 'No spam guaranteed. Immediate confirmation and reminder via WhatsApp & Email.'
                      : 'Confirmation immédiate. Le créneau est verrouillé et synchronisé avec le studio.'}
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
