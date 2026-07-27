'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, Fingerprint, Phone, Smartphone, Apple, Sparkles, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const { loginWithPasskey, loginWithPhone, switchProfile, logoutToGuest } = useUser();

  const [authTab, setAuthTab] = useState<'passkey' | 'phone' | 'demo'>('passkey');
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
        }, 1200);
      }
    }, 900);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsVerifying(true);

    const fullCode = otpCode.join('');
    const ok = await loginWithPhone(phoneNumber, fullCode || '4921');
    setIsVerifying(false);
    if (ok) {
      setSuccessMessage(`Přihlášeno přes mobilní číslo ${phoneNumber}`);
      setTimeout(() => {
        setSuccessMessage(null);
        setActiveModal(null);
      }, 1200);
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
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
            <h2 className="text-2xl font-black text-white">Přihlášení úspešné</h2>
            <p className="text-sm text-neutral-400">{successMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-[#DE1D3E] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Moderní přihlášení bez hesla
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">Vítejte ve ViVoo</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Přihlaste se biometrií Passkey nebo SMS kódem bez zadávání hesel.
              </p>
            </div>

            {/* Auth Method Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setAuthTab('passkey')}
                className={`py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  authTab === 'passkey' ? 'bg-[#DE1D3E] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Fingerprint className="w-4 h-4" />
                Passkey
              </button>
              <button
                onClick={() => setAuthTab('phone')}
                className={`py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  authTab === 'phone' ? 'bg-[#DE1D3E] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                SMS Kód
              </button>
              <button
                onClick={() => setAuthTab('demo')}
                className={`py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  authTab === 'demo' ? 'bg-[#DE1D3E] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Demo Profil
              </button>
            </div>

            {/* Tab 1: Passkey / Biometrics */}
            {authTab === 'passkey' && (
              <div className="flex flex-col items-center text-center gap-5 py-4 animate-fade-in">
                <div
                  onClick={handlePasskeyAuth}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-600/30 to-purple-600/30 border border-red-500/40 flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl group"
                >
                  <Fingerprint className={`w-12 h-12 text-[#DE1D3E] group-hover:text-white transition-colors ${isVerifying ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Přihlásit se přes Touch ID / Face ID</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                    Použijte biometrii svého zařízení pro okamžitý 1-tap přístup bez zadávání hesla.
                  </p>
                </div>
                <button
                  onClick={handlePasskeyAuth}
                  disabled={isVerifying}
                  className="w-full py-4 rounded-full bg-[#DE1D3E] text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Fingerprint className="w-5 h-5" />
                  {isVerifying ? 'Ověřuji biometrii...' : 'Pokračovat s Passkey'}
                </button>
              </div>
            )}

            {/* Tab 2: Phone SMS OTP */}
            {authTab === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Telefonní číslo</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      placeholder="+420 777 123 456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">4-Místny SMS Kód</label>
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
                        className="w-full h-12 bg-white/10 border border-white/15 rounded-xl text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-[#DE1D3E]"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-4 rounded-full bg-[#DE1D3E] text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Phone className="w-4 h-4" />
                  {isVerifying ? 'Ověřuji SMS Kód...' : 'Ověřit a Přihlásit'}
                </button>
              </form>
            )}

            {/* Tab 3: Demo Profile Switcher */}
            {authTab === 'demo' && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Rychlé přepnutí pro testování</label>
                <button
                  onClick={() => handleDemoSwitch('usr-1')}
                  className="p-3.5 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-between hover:bg-white/10 active:scale-95 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img src="/images/avatar.jpg" alt="Jan Novák" className="w-10 h-10 rounded-full object-cover border border-red-500" />
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Jan Novák</h4>
                      <p className="text-xs text-neutral-400 font-medium">@novakjan · VIP Gold (2,360 Kč)</p>
                    </div>
                  </div>
                  <UserCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => handleDemoSwitch('usr-2')}
                  className="p-3.5 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-between hover:bg-white/10 active:scale-95 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img src="/images/metronome_festival.jpg" alt="Klára Svobodová" className="w-10 h-10 rounded-full object-cover border border-purple-500" />
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Klára Svobodová</h4>
                      <p className="text-xs text-neutral-400 font-medium">@klarasvoboda · VIP Silver (1,200 Kč)</p>
                    </div>
                  </div>
                  <UserCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => handleDemoSwitch('guest')}
                  className="p-3.5 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-between hover:bg-white/10 active:scale-95 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-neutral-400 font-bold">
                      H
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Host (Guest Mode)</h4>
                      <p className="text-xs text-neutral-400 font-medium">Procházení akcí bez profilu</p>
                    </div>
                  </div>
                  <UserCheck className="w-5 h-5 text-neutral-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}

            {/* Quick 1-Click Social Sign-In Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-neutral-400 text-center block">Nebo 1-klikem přes</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePasskeyAuth}
                  className="py-3 rounded-2xl bg-black border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer"
                >
                  <Apple className="w-4 h-4" />
                  Apple
                </button>
                <button
                  onClick={handlePasskeyAuth}
                  className="py-3 rounded-2xl bg-white text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
                >
                  Google
                </button>
              </div>
            </div>

            {/* Security Footer */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Chráněno biometrickým protokolem WebAuthn. Žádná hesla k úniku.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
