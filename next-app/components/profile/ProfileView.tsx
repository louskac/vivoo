'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockActivities } from '@/lib/data';
import { Settings, Bookmark, Video, Gift, History, ChevronRight, CreditCard } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { userBalance, topupBalance } = useAppStore();

  const menuRows = [
    { id: 'saved', label: 'Uložené akce', count: '2', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'videos', label: 'Moje videa', count: '8', icon: <Video className="w-5 h-5" /> },
    { id: 'rewards', label: 'Odměny', count: '', icon: <Gift className="w-5 h-5" /> },
    { id: 'history', label: 'Historie transakcí', count: '', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pb-32 pt-10 px-5">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-white">Profil</h1>
        <button className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Row matching Figma point 5 */}
      <div className="flex items-center gap-4 py-3 mb-6">
        <div className="w-18 h-18 rounded-full overflow-hidden border border-white/20 shrink-0">
          <img src="/images/avatar.jpg" alt="Jan Novák" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white mb-0.5">Jan Novák</h2>
          <p className="text-xs text-neutral-400 font-medium">@novakjan</p>
        </div>
      </div>

      {/* Cashless Credit Section */}
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">Aktuální kredit</span>
        <div className="text-4xl font-black text-white">{userBalance.toLocaleString()} Kč</div>
        <button
          onClick={() => topupBalance(500)}
          className="mt-2 w-full h-12 rounded-full bg-[#DE1D3E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
        >
          <CreditCard className="w-4 h-4" />
          Dobít kredit
        </button>
      </div>

      {/* 4 Figma Menu Rows */}
      <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 my-6">
        {menuRows.map((row) => (
          <div key={row.id} className="flex items-center justify-between py-4 cursor-pointer group hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              <span className="text-neutral-400">{row.icon}</span>
              <span>{row.label}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
              {row.count && <span>{row.count}</span>}
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
            <div key={act.id} className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-bold text-white">{act.title}</h4>
                <p className="text-xs text-neutral-400">{act.dateStr}</p>
              </div>
              <div className="text-sm font-extrabold text-white">
                +{act.amount} Kč
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
