'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockActivities } from '@/lib/data';
import { Settings, Bookmark, Video, Gift, History, ChevronRight, CreditCard } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const userBalance = useAppStore((state) => state.userBalance);
  const topupBalance = useAppStore((state) => state.topupBalance);

  const menuRows = [
    { id: 'saved', label: 'Uložené akce', count: '2', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'videos', label: 'Moje videa', count: '8', icon: <Video className="w-5 h-5" /> },
    { id: 'rewards', label: 'Odměny', count: '', icon: <Gift className="w-5 h-5" /> },
    { id: 'history', label: 'Historie transakcí', count: '', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pb-32 pt-10 px-5 animate-fade-in max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-white">Profil</h1>
        <button className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Row matching Figma point 5 */}
      <div className="flex items-center gap-4 py-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500/80 shrink-0 shadow-lg">
          <img src="/images/avatar.jpg" alt="Jan Novák" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white mb-0.5">Jan Novák</h2>
          <p className="text-xs text-neutral-400 font-medium">@novakjan</p>
        </div>
      </div>

      {/* Cashless Credit Section matching Figma penezenka.png */}
      <div className="mb-6 glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-2 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
        <span className="text-xs text-neutral-400 font-bold tracking-wider uppercase">NFC Cashless Kredit</span>
        <div className="text-4xl font-black text-white tracking-tight">{userBalance.toLocaleString()} Kč</div>
        <button
          onClick={() => topupBalance(500)}
          className="mt-3 w-full h-12 rounded-full bg-[#DE1D3E] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 hover:bg-red-600 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          Dobít kredit +500 Kč
        </button>
      </div>

      {/* 4 Figma Menu Rows */}
      <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 my-6">
        {menuRows.map((row) => (
          <div key={row.id} className="flex items-center justify-between py-4 cursor-pointer group hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              <span className="text-neutral-400 group-hover:text-red-400 transition-colors">{row.icon}</span>
              <span>{row.label}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
              {row.count && <span className="bg-white/10 px-2 py-0.5 rounded-full text-[11px] text-white">{row.count}</span>}
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Poslední aktivita */}
      <div className="flex flex-col gap-3 mt-8">
        <h3 className="text-lg font-extrabold text-white">Poslední aktivita</h3>
        <div className="flex flex-col gap-3">
          {mockActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between py-3 px-4 glass-panel rounded-xl border border-white/5">
              <div>
                <h4 className="text-sm font-bold text-white">{act.title}</h4>
                <p className="text-xs text-neutral-400">{act.dateStr}</p>
              </div>
              <div className={`text-sm font-extrabold ${act.isPositive ? 'text-emerald-400' : 'text-white'}`}>
                {act.isPositive ? '+' : '-'}{act.amount.toLocaleString()} Kč
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
