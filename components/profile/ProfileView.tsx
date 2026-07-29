'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { ActiveModal } from '@/lib/types';
import { Settings, Bookmark, Video, Gift, History, ChevronRight, CreditCard, Ticket, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

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
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-5">
        <Logo height={32} />
        <div className="flex items-center gap-2">
          {isGuest ? (
            <button
              onClick={() => setActiveModal('auth')}
              className="px-4 py-2 rounded-full bg-[#DE1D3E] text-xs font-bold text-white hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
            >
              Přihlásit se
            </button>
          ) : (
            <button
              onClick={() => setActiveModal('settings')}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
              title="Nastavení"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      {isGuest ? (
        <div className="mb-6 bg-white/[0.04] border border-white/10 p-5 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-neutral-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white leading-snug">Vítejte ve ViVoo</h2>
              <p className="text-xs text-neutral-400 truncate">Procházejte akce bez registrace</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('auth')}
            className="px-4 py-2 rounded-full bg-[#DE1D3E] text-xs font-bold text-white hover:bg-red-600 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            Přihlásit se
          </button>
        </div>
      ) : (
        <div className="p-4 mb-6 bg-white/[0.04] rounded-2xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 shrink-0">
              <img src={user.avatarUrl || '/images/avatar.jpg'} alt={user.fullName} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white truncate leading-snug">{user.fullName}</h2>
              <p className="text-xs text-neutral-400 font-medium truncate mt-0.5">{user.handle} · {user.memberTier || 'VIP Member'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={() => setActiveModal('edit_profile')}
              className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-neutral-200 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            >
              Upravit
            </button>
            <button
              onClick={() => setActiveModal('auth')}
              className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-neutral-200 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            >
              Přepnout
            </button>
          </div>
        </div>
      )}

      {/* Cashless Credit Section */}
      <div className="mb-6 p-5 rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col gap-2">
        <span className="text-xs text-neutral-400 font-bold tracking-wider uppercase">NFC CASHLESS KREDIT</span>
        <div className="text-4xl font-black text-white tracking-tight my-1">{user.cashlessCredit.toLocaleString('cs-CZ')} Kč</div>
        <button
          onClick={() => {
            if (isGuest) {
              setActiveModal('auth');
            } else {
              setActiveModal('topup');
            }
          }}
          className="mt-2 w-full h-12 rounded-full bg-[#DE1D3E] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-red-600 transition-all cursor-pointer shadow-lg shadow-red-950/40"
        >
          <CreditCard className="w-4 h-4" />
          Dobít kredit
        </button>
      </div>

      {/* Menu Rows */}
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
              className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 cursor-pointer hover:border-white/20 transition-all bg-white/5 group"
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

              {/* Amount */}
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
