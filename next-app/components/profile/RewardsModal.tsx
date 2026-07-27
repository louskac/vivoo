'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { X, Gift, Award, Zap, Ticket, CheckCircle2 } from 'lucide-react';

export const RewardsModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();

  if (activeModal !== 'rewards') return null;

  const rewardsList = [
    { id: 'r-1', title: 'Free Welcome Drink (Riegrovy Sady)', category: 'Voucher', code: 'DRINK-FREE-2026', expires: '31. 8. 2026' },
    { id: 'r-2', title: '15% Sleva na Metronome Festival', category: 'Festival Pass', code: 'METRO15VIP', expires: '15. 6. 2026' },
    { id: 'r-3', title: 'Cashback 5% ViVoo Kredit', category: 'Loyalty Bonus', code: 'Aktivní', expires: 'Trvale' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Odměny & VIP Klub</h2>
            <p className="text-xs text-neutral-400">Získejte exkluzivní výhody za účast na akcích</p>
          </div>
        </div>

        {/* VIP Status Card */}
        <div className="bg-gradient-to-r from-amber-600/30 via-yellow-500/20 to-amber-700/30 border border-amber-500/30 p-4 rounded-2xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">Členství</span>
              <h4 className="text-base font-extrabold text-white">VIP Gold Member</h4>
            </div>
          </div>
          <span className="text-xs bg-amber-500 text-black font-black px-3 py-1 rounded-full">LEVEL 3</span>
        </div>

        {/* Available Vouchers List */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Aktivní kupony a výhody</label>
          {rewardsList.map((rw) => (
            <div key={rw.id} className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DE1D3E] block">{rw.category}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{rw.title}</h4>
                <span className="text-xs text-neutral-400 block mt-1">Platnost do: {rw.expires}</span>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-mono font-bold text-emerald-400">
                {rw.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
