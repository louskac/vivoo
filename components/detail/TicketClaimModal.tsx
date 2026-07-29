'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, Check, Download, Smartphone, Sparkles, User, Ticket } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export const TicketClaimModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const selectedTicket = useAppStore((state) => state.selectedTicket);
  const { user, isGuest } = useUser();

  const [claimed, setClaimed] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  if (activeModal !== 'ticket_claim') return null;

  const senderName = 'Jan Novák';
  const eventTitle = selectedTicket?.title || 'Sparta x Slavia';
  const seatDetail = 'Severní tribuna A3 · Řada 9 · Místo 12';
  const dateVenue = selectedTicket?.date || 'Pá 20. 10. · 18:00 · epet ARENA';

  const handleClaimInApp = () => {
    setClaimed(true);
    setTimeout(() => {
      setActiveModal('ticket_qr');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1150] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#16171F] border border-white/20 rounded-[32px] p-6 text-white shadow-2xl relative flex flex-col gap-5 text-center overflow-hidden"
      >
        {/* Top Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sender Avatar & Header */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-[#DE1D3E] overflow-hidden shadow-xl bg-black/40">
              <img src="/images/avatar.jpg" alt={senderName} className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#DE1D3E] text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-[#16171F]">
              ✓
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#DE1D3E] uppercase tracking-wider">
              Darovaná vstupenka
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              {senderName} vám posílá vstupenku!
            </h2>
          </div>
        </div>

        {/* Ticket Summary Box */}
        <div className="p-4 rounded-2xl bg-[#1D1F2B] border border-white/10 flex flex-col gap-2.5 text-left shadow-lg">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#DE1D3E]" />
            <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
              {eventTitle}
            </span>
          </div>
          <span className="text-base font-extrabold text-white leading-snug">
            {seatDetail}
          </span>
          <span className="text-xs text-neutral-400">
            {dateVenue}
          </span>
        </div>

        {/* Claim Actions */}
        {claimed ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center gap-2 animate-fade-in">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Vstupenka byla úspěšně přidána do vaší peněženky!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {/* Primary Claim in ViVoo App */}
            <button
              onClick={handleClaimInApp}
              className="w-full py-3.5 rounded-full bg-[#DE1D3E] hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Přijmout do aplikace ViVoo</span>
            </button>

            {/* Apple / Google Wallet Option */}
            <button
              onClick={() => setWalletAdded(true)}
              className="w-full py-3 rounded-full bg-[#222532] hover:bg-[#2A2E3E] text-white font-bold text-xs border border-white/15 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>{walletAdded ? '✓ Přidáno do Apple Wallet' : 'Přidat do Apple / Google Wallet'}</span>
            </button>

            {/* Direct Web PDF Download */}
            <button
              onClick={() => alert("PDF Vstupenka byla stažena do vašeho zařízení.")}
              className="text-xs text-neutral-400 hover:text-white font-semibold py-1 transition-colors cursor-pointer"
            >
              Stáhnout PDF Vstupenku bez registrace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
