'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, CreditCard, Apple, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';

export const TopUpModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const { user, topupBalance } = useUser();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'benefits'>('apple_pay');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (activeModal !== 'topup') return null;

  const presets = [200, 500, 1000, 2000];

  const handleTopUp = async () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!finalAmount || finalAmount <= 0) return;

    await topupBalance(finalAmount, paymentMethod);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveModal(null);
      setCustomAmount('');
    }, 1500);
  };

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0B0E]/95 border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up backdrop-blur-2xl cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 active:scale-90 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
            <h2 className="text-2xl font-black text-white">Kredit dobito!</h2>
            <p className="text-sm text-neutral-400">
              Váš nový zůstatek je <strong className="text-white">{user.cashlessCredit.toLocaleString('cs-CZ')} Kč</strong>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-start gap-1.5 pr-10">
              <Badge text="PENĚŽENKA & KREDIT" variant="red" />
              <h2 className="text-2xl font-extrabold text-white mt-1 leading-tight">Dobít kredit</h2>
              <p className="text-xs text-neutral-400 font-medium">
                Aktuální zůstatek: <strong className="text-emerald-400 font-extrabold">{user.cashlessCredit.toLocaleString('cs-CZ')} Kč</strong>
              </p>
            </div>

            {/* Preset Amount Chips */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Částka k dobití</label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {presets.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`fast-filter-pill ${isSelected ? 'active' : ''}`}
                    >
                      {amt} Kč
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="mt-1 relative">
                <input
                  type="number"
                  placeholder="Vlastní částka (Kč)..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full glass-panel border border-white/15 rounded-2xl py-3 px-4 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-red-500 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Platební metoda</label>
              <div className="flex flex-col gap-2.5">
                <div
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-gradient-to-r from-red-950/40 to-red-900/20 border-[#DE1D3E] text-white shadow-[0_0_20px_rgba(222,29,62,0.25)]'
                      : 'glass-panel border-white/10 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Apple className="w-5 h-5" />
                    <span className="text-sm font-extrabold">Apple Pay</span>
                  </div>
                  {paymentMethod === 'apple_pay' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>

                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-gradient-to-r from-red-950/40 to-red-900/20 border-[#DE1D3E] text-white shadow-[0_0_20px_rgba(222,29,62,0.25)]'
                      : 'glass-panel border-white/10 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm font-extrabold">Platební karta (•••• 4921)</span>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 glass-panel p-3.5 rounded-2xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Platba je zabezpečena 256-bitovým šifrováním banking standartu.</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTopUp}
              className="w-full py-4 rounded-full bg-[#DE1D3E] text-white font-extrabold text-base shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Potvrdit dobití ({customAmount ? customAmount : selectedAmount} Kč)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
