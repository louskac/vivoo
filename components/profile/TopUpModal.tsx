'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, CreditCard, Apple, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const TopUpModal: React.FC = () => {
  const { activeModal, setActiveModal, userBalance, topupBalance } = useAppStore();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'benefits'>('apple_pay');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (activeModal !== 'topup') return null;

  const presets = [200, 500, 1000, 2000];

  const handleTopUp = () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!finalAmount || finalAmount <= 0) return;

    topupBalance(finalAmount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveModal(null);
      setCustomAmount('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
            <h2 className="text-2xl font-black text-white">Kredit dobito!</h2>
            <p className="text-sm text-neutral-400">
              Váš nový zůstatek je <strong className="text-white">{userBalance} Kč</strong>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-[#DE1D3E] font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Peňaženka & Kredit
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">Dobít kredit</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Aktuální zůstatek: <strong className="text-white">{userBalance} Kč</strong>
              </p>
            </div>

            {/* Preset Amount Chips */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Částka k dobití</label>
              <div className="grid grid-cols-4 gap-2">
                {presets.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-3 rounded-2xl text-sm font-extrabold border transition-all ${
                        isSelected
                          ? 'bg-[#DE1D3E] border-[#DE1D3E] text-white shadow-lg shadow-red-600/30'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      {amt} Kč
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="mt-2 relative">
                <input
                  type="number"
                  placeholder="Vlastní částka (Kč)..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Platební metoda</label>
              <div className="flex flex-col gap-2">
                <div
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-white/15 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Apple className="w-5 h-5" />
                    <span className="text-sm font-bold">Apple Pay</span>
                  </div>
                  {paymentMethod === 'apple_pay' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>

                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-white/15 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm font-bold">Platební karta (•••• 4921)</span>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 bg-white/5 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Platba je zabezpečena 256-bitovým šifrováním banking standartu.</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTopUp}
              className="w-full py-4 rounded-full bg-[#DE1D3E] text-white font-extrabold text-base shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Potvrdit dobití ({customAmount ? customAmount : selectedAmount} Kč)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
