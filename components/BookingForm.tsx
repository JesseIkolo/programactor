'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { track, newEventId } from '@/lib/analytics';
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
import { generateGoogleCalendarUrl } from '@/lib/calendar';

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
    googleCalendarUrl?: string;
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
    if (!clientName || !clientPhone || !selectedDate || !selectedSlot) {
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
      // Créé avant l'appel : le serveur enverra le même événement avec le
      // même identifiant, ce qui permet la déduplication chez Meta et TikTok.
      const eventId = newEventId();

      const payload = {
        eventId,
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

      track(
        'form_reserver_submit',
        { meeting_type: channel, lang },
        eventId
      );

      const gCalUrl =
        data.data?.googleCalendarUrl ||
        generateGoogleCalendarUrl({
          title: isEn
            ? `Programactor meeting · ${clientName}`
            : `Rendez-vous Programactor · ${clientName}`,
          description: isEn
            ? `Programactor meeting (30 min)\n\nClient: ${clientName} (${companyName || 'Business'})\nPhone: ${clientPhone}\nEmail: ${clientEmail || '-'}\nTopic: ${topic || 'Website'}\nFormat: ${channel === 'PRESENTIEL' ? 'At your place (Douala)' : 'Video call'}\nRef: ${data.data?.booking?.reference || 'CONFIRMED'}`
            : `Rendez-vous Programactor (30 min)\n\nClient : ${clientName} (${companyName || 'Établissement'})\nTéléphone : ${clientPhone}\nEmail : ${clientEmail || '-'}\nSujet : ${topic || 'Site internet'}\nFormat : ${channel === 'PRESENTIEL' ? 'Chez vous (Douala)' : 'Visio'}\nRéf : ${data.data?.booking?.reference || 'CONFIRMED'}`,
          location: channel === 'PRESENTIEL' ? (locationDetails || 'Chez le client, Douala') : 'Google Meet / WhatsApp',
          date: selectedDate,
          timeSlot: selectedSlot,
        });

      setBookingSuccess({
        reference: data.data?.booking?.reference || 'CONFIRMED',
        whatsappUrl: data.data?.whatsappUrl || '#',
        googleCalendarUrl: gCalUrl,
      });

      // Redirection WhatsApp après délai pour laisser le client voir la confirmation
      if (data.data?.whatsappUrl) {
        setTimeout(() => {
          window.location.href = data.data.whatsappUrl;
        }, 2500);
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
              {isEn ? 'Meeting · 30 min' : 'Rendez-vous · 30 min'}
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
                {isEn ? 'Your meeting request is sent!' : 'Votre demande de rendez-vous est envoyée !'}
              </h1>
              <p className="text-sm text-white/60 max-w-md mx-auto">
                {isEn
                  ? 'We are opening WhatsApp with your summary so we can confirm the meeting with you.'
                  : 'Nous ouvrons WhatsApp avec votre récapitulatif pour confirmer le rendez-vous avec vous.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-left space-y-2">
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Date & Time:' : 'Date & Heure :'}</span>
                <span className="text-[#EBFF72] font-semibold">{selectedDate} {isEn ? 'at' : 'à'} {selectedSlot} (GMT+1)</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Format:' : 'Format :'}</span>
                <span className="text-white">{channel === 'PRESENTIEL' ? (isEn ? 'At your place (Douala)' : 'Chez vous (Douala)') : (isEn ? 'Video call' : 'Visio')}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>{isEn ? 'Contact:' : 'Contact :'}</span>
                <span className="text-white">{clientName} ({clientPhone})</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={bookingSuccess.whatsappUrl}
                className="inline-flex items-center justify-center gap-2 flex-1 py-3.5 px-6 rounded-2xl bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-sm transition-all shadow-xl shadow-[#EBFF72]/20"
              >
                <WhatsappIcon size={20} />
                <span>{isEn ? 'Open WhatsApp' : 'Ouvrir WhatsApp'}</span>
              </a>
              {bookingSuccess.googleCalendarUrl && (
                <a
                  href={bookingSuccess.googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 flex-1 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
                >
                  <Calendar01Icon size={20} className="text-[#EBFF72]" />
                  <span>{isEn ? 'Add to Google Calendar' : 'Ajouter à Google Agenda'}</span>
                </a>
              )}
            </div>
            <p className="text-[11px] font-mono text-white/40 mt-3">
              {isEn ? 'Automatic WhatsApp redirection in progress...' : 'Redirection WhatsApp automatique en cours...'}
            </p>
          </div>
        ) : (
          /* Formulaire de Réservation */
          <div className="space-y-8">
            {/* En-tête éditorial */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBFF72]/10 border border-[#EBFF72]/20 text-[#EBFF72] text-xs font-mono">
                <Calendar01Icon size={14} />
                <span>{isEn ? 'Free meeting · 30 min' : 'Rendez-vous gratuit · 30 min'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {isEn ? 'Book a meeting (30 min, free)' : 'Prendre rendez-vous (30 min, gratuit)'}
              </h1>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                {isEn
                  ? 'We come to your place in Douala, or meet by video. We look at your business and what customers see online, then send you a written offer with its price.'
                  : 'Nous venons chez vous à Douala, ou nous faisons le point en visio. Nous regardons ensemble votre établissement et ce que vos clients voient en ligne, puis nous vous proposons une offre écrite avec son prix.'}
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
                          <span className="text-xs font-mono font-medium">{d.label}</span>
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
                                ? 'bg-[#EBFF72] text-[#0E0E0E] border-[#EBFF72] font-medium shadow-md shadow-[#EBFF72]/15'
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
                    <span>3. {isEn ? 'Meeting format' : 'Modalité du rendez-vous'}</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          {isEn ? 'At your place in Douala' : 'Chez vous, à Douala'}
                        </div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          {isEn ? 'We travel to your venue' : 'Nous nous déplaçons chez vous'}
                        </div>
                      </div>
                    </button>

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
                          {isEn ? 'WhatsApp or Google Meet video' : 'Visio WhatsApp ou Google Meet'}
                        </div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          {isEn ? 'Libreville, abroad & remote' : 'Libreville, international ou à distance'}
                        </div>
                      </div>
                    </button>
                  </div>

                  {channel === 'PRESENTIEL' && (
                    <div className="pt-2 animate-in fade-in duration-200">
                      <label htmlFor="bookingLocation" className="block text-xs font-mono text-white/50 mb-1.5">
                        {isEn ? 'Your address or neighborhood in Douala' : 'Votre adresse ou quartier à Douala (ex. Akwa, Bonamoussadi, Bonapriso...)'}
                      </label>
                      <input
                        id="bookingLocation"
                        name="location"
                        type="text"
                        placeholder={isEn ? 'e.g. Bonapriso, near Pharmacie du Rond-Point' : 'Ex: Bonapriso, près de la pharmacie du Rond-Point'}
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
                        ? 'We prepare your tailored preview before our call.'
                        : 'Permet de préparer votre aperçu personnalisé avant notre échange.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="clientName" className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <UserIcon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'FULL NAME *' : 'NOM & PRÉNOM *'}</span>
                      </label>
                      <input
                        id="clientName"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Ex: Paul Mbarga"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label htmlFor="clientPhone" className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Call02Icon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'WHATSAPP NUMBER *' : 'NUMÉRO WHATSAPP *'}</span>
                      </label>
                      <input
                        id="clientPhone"
                        name="tel"
                        type="tel"
                        inputMode="tel"
                        required
                        autoComplete="tel"
                        placeholder="6 XX XX XX XX ou +237 6..."
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label htmlFor="companyName" className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Building01Icon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'BUSINESS NAME *' : "NOM DE L'ÉTABLISSEMENT *"}</span>
                      </label>
                      <input
                        id="companyName"
                        name="organization"
                        type="text"
                        required
                        autoComplete="organization"
                        placeholder={isEn ? 'e.g. Restaurant Le Gourmet, Douala Auto...' : 'Ex: Le Gourmet Resto, Douala Auto...'}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label htmlFor="clientEmail" className="block text-xs font-mono text-white/70 mb-1.5 flex items-center gap-1.5">
                        <Mail01Icon size={14} className="text-[#EBFF72]" />
                        <span>{isEn ? 'EMAIL (OPTIONAL)' : 'EMAIL (FACULTATIF)'}</span>
                      </label>
                      <input
                        id="clientEmail"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="contact@etablissement.cm"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label htmlFor="bookingTopic" className="block text-xs font-mono text-white/70 mb-1.5">
                        {isEn ? 'WHAT YOU WANT TO IMPROVE (OPTIONAL)' : 'CE QUE VOUS VOULEZ AMÉLIORER (FACULTATIF)'}
                      </label>
                      <textarea
                        id="bookingTopic"
                        name="topic"
                        rows={3}
                        placeholder={isEn ? 'e.g. Digital menu on tables, new website, WhatsApp booking...' : 'Ex: Menu digital sur les tables, nouveau site internet, réservations sur WhatsApp...'}
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
                      <span className="text-[#EBFF72]">{channel === 'PRESENTIEL' ? (isEn ? 'At your place (Douala)' : 'Chez vous (Douala)') : 'Visio'}</span>
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

                  <p className="text-[10px] font-mono text-center text-white/50 leading-relaxed">
                    {isEn
                      ? 'Jesse confirms on WhatsApp in under 2 hours (Mon–Sat). Questions? +237 692 02 55 52'
                      : 'Jesse vous confirme le rendez-vous sur WhatsApp en moins de 2 h (lun.–sam.). Une question ? +237 692 02 55 52'}
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
