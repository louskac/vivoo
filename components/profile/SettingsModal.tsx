'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, Settings, Bell, Moon, Globe, LogOut, ShieldCheck, UserCheck } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const { isGuest, logoutToGuest } = useUser();
  const [notifications, setNotifications] = useState(true);

  if (activeModal !== 'settings') return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-10">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-white shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Nastavení účtu</h2>
            <p className="text-xs text-neutral-400">Předvolby aplikace a notifikace</p>
          </div>
        </div>

        {/* Settings Options */}
        <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 mb-6">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <Bell className="w-4 h-4 text-neutral-400" />
              <span>Push Notifikace akcí</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="w-5 h-5 accent-red-500 cursor-pointer"
            />
          </div>

          <div className="py-4 flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-neutral-400" />
              <span>Jazyk / Language</span>
            </div>
            <span className="text-xs text-neutral-400 font-bold">Čeština (CZ)</span>
          </div>

          <div className="py-4 flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-neutral-400" />
              <span>Vzhled aplikace</span>
            </div>
            <span className="text-xs text-neutral-400 font-bold">Tmavý režim (Dark)</span>
          </div>

          <div className="py-4 flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ochrana soukromí & GDPR</span>
            </div>
            <span className="text-xs text-neutral-500">Verze 1.2.0</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setActiveModal('auth')}
            className="w-full py-3 rounded-full bg-white/10 border border-white/15 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Přepnout účet / Přihlásit se
          </button>

          {!isGuest && (
            <button
              onClick={async () => {
                await logoutToGuest();
                setActiveModal(null);
              }}
              className="w-full py-3 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-red-600/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Odhlásit se
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

