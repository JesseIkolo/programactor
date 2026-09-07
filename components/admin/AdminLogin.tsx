'use client';

import React, { useState } from 'react';
import {
  LockKeyIcon,
  Mail01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight01Icon,
  SecurityLockIcon,
  FlashIcon,
} from 'hugeicons-react';
import { Mark, Wordmark } from '@/components/ui';

interface AdminLoginProps {
  onSuccess: (token: string, user: { email: string; name: string; role: string }) => void;
  lang?: string;
}

export default function AdminLogin({ onSuccess, lang = 'fr' }: AdminLoginProps) {
  const isEn = lang === 'en';
  const [email, setEmail] = useState('admin@programactor.pro');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    }
    return 'https://api.programactor.pro/api/v1';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const apiUrl = getApiUrl();

    try {
      // 1. Tenter l'authentification sur l'API VPS principale
      let res: Response;
      try {
        res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } catch (networkErr) {
        // Fallback local en développement si le VPS est indisponible
        res = await fetch('/api/admin/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await res.json();

      if (res.ok && data.success && data.data?.tokens?.accessToken) {
        const token = data.data.tokens.accessToken;
        const user = data.data.user;

        // Stocker la session dans sessionStorage
        sessionStorage.setItem('programactor_admin_token', token);
        sessionStorage.setItem('programactor_admin_user', JSON.stringify(user));

        onSuccess(token, user);
      } else {
        setErrorMessage(
          data.message || (isEn ? 'Invalid credentials. Please try again.' : 'Identifiants invalides. Vérifiez votre mot de passe.')
        );
      }
    } catch (err: any) {
      setErrorMessage(
        isEn
          ? 'Network error. Please check backend connection.'
          : 'Erreur réseau. Vérifiez que le serveur API est opérationnel.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Halo d'ambiance en arrière-plan */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#EBFF72]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header Marque */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Mark className="h-6 w-auto text-white" accent="var(--color-signal)" accentOpacity={1} />
            <Wordmark className="text-xl leading-none" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-[#EBFF72] bg-[#EBFF72]/10 border border-[#EBFF72]/30">
              <SecurityLockIcon size={14} />
              STUDIO BACKOFFICE
            </span>
          </div>
        </div>

        {/* Boîte de Connexion */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 text-left">
            <h1 className="text-lg font-bold font-sans tracking-tight text-white mb-1">
              {isEn ? 'Administrator Access' : 'Accès Administrateur'}
            </h1>
            <p className="text-xs text-white/50 font-sans">
              {isEn
                ? 'Sign in to manage client quotes, bookings, and live projects.'
                : 'Identifiez-vous pour gérer les devis, rendez-vous et réalisations.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2.5 animate-in fade-in duration-200">
              <span className="text-sm font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Email */}
            <div>
              <label className="block text-xs font-mono text-white/70 mb-2">
                {isEn ? 'ADMIN EMAIL' : 'EMAIL ADMINISTRATEUR'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail01Icon size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@programactor.pro"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#EBFF72] focus:ring-1 focus:ring-[#EBFF72] transition-colors"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-xs font-mono text-white/70 mb-2">
                {isEn ? 'PASSWORD' : 'MOT DE PASSE'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <LockKeyIcon size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#EBFF72] focus:ring-1 focus:ring-[#EBFF72] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <ViewOffSlashIcon size={16} /> : <ViewIcon size={16} />}
                </button>
              </div>
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-sans font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EBFF72]/10 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>{isEn ? 'Authenticating...' : 'Vérification...'}</span>
                </>
              ) : (
                <>
                  <span>{isEn ? 'Unlock Dashboard' : 'Déverrouiller l’espace'}</span>
                  <ArrowRight01Icon size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer de Sécurité */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              TLS 1.3 End-to-End
            </span>
            <span className="flex items-center gap-1 text-[#EBFF72]/80">
              <FlashIcon size={12} />
              JWT Cluster
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
