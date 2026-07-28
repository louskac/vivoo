'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, Fingerprint, Smartphone, Apple, Sparkles, CheckCircle2, UserCheck, ShieldCheck, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const { loginWithPasskey, loginWithPhone, switchProfile, logoutToGuest } = useUser();

  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (activeModal !== 'auth') return null;

  const handlePasskeyAuth = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      const ok = await loginWithPasskey();
      setIsVerifying(false);
      if (ok) {
        setSuccessMessage('Biometrické ověření úspešné! Vítejte.');
        setTimeout(() => {
          setSuccessMessage(null);
          setActiveModal(null);
        }, 1000);
      }
    }, 800);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsVerifying(true);

    const fullCode = otpCode.join('');
    const ok = await loginWithPhone(phoneNumber, fullCode || '4921');
    setIsVerifying(false);
    if (ok) {
      setSuccessMessage(`Přihlášeno přes číslo ${phoneNumber}`);
      setTimeout(() => {
        setSuccessMessage(null);
        setActiveModal(null);
      }, 1000);
    }
  };

  const handleDemoSwitch = async (targetId: string) => {
    setIsVerifying(true);
    if (targetId === 'guest') {
      await logoutToGuest();
    } else {
      await switchProfile(targetId);
    }
    setIsVerifying(false);
    setSuccessMessage('Účet úspešně přepnut!');
    setTimeout(() => {
      setSuccessMessage(null);
      setActiveModal(null);
    }, 900);
  };

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0A0B0E]/95 border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up backdrop-blur-2xl cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 active:scale-90 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Přihlášení úspěšné</h2>
            <p className="text-xs text-neutral-400">{successMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DE1D3E]/15 border border-[#DE1D3E]/30 text-[11px] font-extrabold text-[#DE1D3E] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Rychlé přihlášení
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">Vítejte na ViVoo</h2>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Přihlaste se 1-klikem biometrií pro nákup lístků a dobíjení kreditu na akce.
              </p>
            </div>

            {/* Primary Option: 1-Tap Biometric / Passkey */}
            <button
              onClick={handlePasskeyAuth}
              disabled={isVerifying}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#DE1D3E] via-rose-600 to-red-600 text-white font-extrabold text-sm flex items-center justify-between shadow-xl shadow-red-600/30 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Fingerprint className={`w-6 h-6 text-white ${isVerifying ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-sm font-black leading-snug">
                    {isVerifying ? 'Ověřuji biometrii...' : 'Přihlásit s Touch ID / Face ID'}
                  </span>
                  <span className="block text-[11px] text-white/80 font-medium">Okamžitý 1-tap přístup bez hesla</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* 1-Click Social Sign-In */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handlePasskeyAuth}
                className="py-3 px-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Apple className="w-4 h-4" />
                Apple ID
              </button>
              <button
                onClick={handlePasskeyAuth}
                className="py-3 px-4 rounded-2xl bg-white text-black hover:bg-neutral-200 text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>
            </div>

            {/* Expandable Phone SMS Section */}
            <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setShowPhoneInput(!showPhoneInput)}
                className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-neutral-400" />
                  Přihlásit se přes SMS kód
                </span>
                {showPhoneInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>

              {showPhoneInput && (
                <form onSubmit={handlePhoneSubmit} className="p-4 pt-1 border-t border-white/10 flex flex-col gap-3 animate-fade-in">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Telefonní číslo</label>
                    <input
                      type="tel"
                      placeholder="+420 777 123 456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl py-2.5 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">4-Místný kód</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={otpCode[idx]}
                          onChange={(e) => {
                            const val = e.target.value;
                            const next = [...otpCode];
                            next[idx] = val;
                            setOtpCode(next);
                          }}
                          placeholder="•"
                          className="w-full h-10 bg-black/40 border border-white/15 rounded-lg text-center font-mono font-bold text-base text-white focus:outline-none focus:border-red-500"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all cursor-pointer mt-1"
                  >
                    {isVerifying ? 'Ověřuji...' : 'Ověřit SMS a vstoupit'}
                  </button>
                </form>
              )}
            </div>

            {/* Account Switcher Drawer */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full py-2.5 px-3.5 text-xs font-semibold text-neutral-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer bg-white/5 rounded-xl border border-white/10"
              >
                <span>Přepnout uživatelský profil</span>
                {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>

              {showDemoAccounts && (
                <div className="mt-2 flex flex-col gap-2 p-3 bg-black/40 border border-white/10 rounded-2xl animate-fade-in">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Dostupné účty:</span>
                  <button
                    onClick={() => handleDemoSwitch('usr-1')}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 active:scale-95 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src="/images/avatar.jpg" alt="Jan Novák" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Jan Novák</h4>
                        <p className="text-[10px] text-neutral-400">@novakjan · VIP Gold (2 360 Kč)</p>
                      </div>
                    </div>
                    <UserCheck className="w-4 h-4 text-neutral-300" />
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('usr-2')}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 active:scale-95 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src="/images/metronome_festival.jpg" alt="Klára Svobodová" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Klára Svobodová</h4>
                        <p className="text-[10px] text-neutral-400">@klarasvoboda · VIP Silver (1 200 Kč)</p>
                      </div>
                    </div>
                    <UserCheck className="w-4 h-4 text-neutral-300" />
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('guest')}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 active:scale-95 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-neutral-400 font-bold text-xs">
                        H
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Návštěvník (Guest)</h4>
                        <p className="text-[10px] text-neutral-400">Procházení akcí bez registrace</p>
                      </div>
                    </div>
                    <UserCheck className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Subtle Security Badge */}
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 justify-center font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Bezpečné biometrické ověření. Žádná hesla k úniku.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
