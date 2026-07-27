'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { ActiveModal } from '@/lib/types';
import { Settings, Bookmark, Video, Gift, History, ChevronRight, CreditCard, Ticket, LogIn, Fingerprint, UserCheck } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const { user, isGuest, savedEventIds, userVideos, transactions } = useUser();

  const menuRows: { id: ActiveModal; label: string; count?: string; icon: React.ReactNode }[] = [
    { id: 'saved_events', label: 'Uložené akce', count: savedEventIds.length.toString(), icon: <Bookmark className="w-5 h-5" /> },
    { id: 'my_videos', label: 'Moje videa', count: userVideos.length.toString(), icon: <Video className="w-5 h-5" /> },
    { id: 'rewards', label: 'Odměny', count: isGuest ? 'Guest' : user.memberTier || 'VIP', icon: <Gift className="w-5 h-5" /> },
    { id: 'transaction_receipt', label: 'Historie transakcí', count: transactions.length ? `${transactions.length}` : '', icon: <History className="w-5 h-5" /> },
  ];

  const recentActivities = transactions.length > 0 ? transactions.slice(0, 3) : [
    {
      id: 'tx-default-1',
      title: 'Nákup Vstupenky – Metronome Festival',
      dateStr: 'Dnes, 14:12',
      amount: 1890,
      isPositive: false
    },
    {
      id: 'tx-default-2',
      title: 'Bonus od pořadatele BrainZone',
      dateStr: 'Úterý 12.2.',
      amount: 300,
      isPositive: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pb-32 pt-10 px-5 animate-fade-in max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-white">Profil</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('auth')}
            className="px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            {isGuest ? 'Přihlásit' : 'Přepnout'}
          </button>
          <button
            onClick={() => setActiveModal('settings')}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Guest Mode Banner or User Info Row */}
      {isGuest ? (
        <div className="mb-6 bg-gradient-to-r from-red-950/40 via-neutral-900 to-purple-950/40 p-5 rounded-2xl border border-red-500/30 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-neutral-300 font-bold text-lg">
              H
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DE1D3E] block">TikTok Guest Mode</span>
              <h2 className="text-lg font-extrabold text-white">Procházíte jako Návštěvník</h2>
            </div>
          </div>
          <p className="text-xs text-neutral-300">
            Můžete sledovat videa a akce bez registrácie. Pro zakoupení lístků a dobíjení kreditu se přihlaste 1-klikem biometrií Passkey.
          </p>
          <button
            onClick={() => setActiveModal('auth')}
            className="w-full py-3 rounded-full bg-[#DE1D3E] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
          >
            <Fingerprint className="w-4 h-4" />
            Přihlásit se bez hesla (Passkey / SMS)
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4 py-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500/80 shrink-0 shadow-lg">
            <img src={user.avatarUrl || '/images/avatar.jpg'} alt={user.fullName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white mb-0.5">{user.fullName}</h2>
            <p className="text-xs text-neutral-400 font-medium">{user.handle} · {user.memberTier}</p>
          </div>
        </div>
      )}

      {/* Cashless Credit Section matching Figma penezenka.png */}
      <div className="mb-6 glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-2 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
        <span className="text-xs text-neutral-400 font-bold tracking-wider uppercase">NFC Cashless Kredit</span>
        <div className="text-4xl font-black text-white tracking-tight">{user.cashlessCredit.toLocaleString('cs-CZ')} Kč</div>
        <button
          onClick={() => setActiveModal('topup')}
          className="mt-3 w-full h-12 rounded-full bg-[#DE1D3E] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 hover:bg-red-600 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          Dobít kredit
        </button>
      </div>

      {/* 4 Figma Menu Rows */}
      <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 my-6">
        {menuRows.map((row) => (
          <div
            key={row.id}
            onClick={() => row.id && setActiveModal(row.id)}
            className="flex items-center justify-between py-4 cursor-pointer group hover:opacity-80 transition-opacity"
          >
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white">Poslední aktivita</h3>
          <button
            onClick={() => setActiveModal('transaction_receipt')}
            className="text-xs font-bold text-[#DE1D3E] hover:underline cursor-pointer"
          >
            Zobrazit vše
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => setActiveModal('transaction_receipt')}
              className="flex items-center justify-between p-3.5 glass-panel rounded-2xl border border-white/10 cursor-pointer hover:border-white/20 transition-all bg-white/5 group"
            >
              {/* Activity Type Icon */}
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-neutral-300 group-hover:text-white transition-colors">
                {act.isPositive ? (
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Ticket className="w-5 h-5 text-red-500" />
                )}
              </div>

              {/* Title & Date */}
              <div className="flex-1 min-w-0 px-3">
                <h4 className="text-xs font-bold text-white truncate leading-snug">{act.title}</h4>
                <p className="text-[11px] text-neutral-400 font-medium mt-0.5">{act.dateStr}</p>
              </div>

              {/* Amount - Single Line Guaranteed */}
              <div className={`text-xs font-black shrink-0 whitespace-nowrap text-right ${act.isPositive ? 'text-emerald-400' : 'text-white'}`}>
                {act.isPositive ? '+' : '-'}{act.amount.toLocaleString('cs-CZ')} Kč
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


