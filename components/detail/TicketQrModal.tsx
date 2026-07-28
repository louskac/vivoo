'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, ShieldCheck, Share2, Wallet, Check, Radio } from 'lucide-react';


import { Badge } from '@/components/ui/Badge';

export const TicketQrModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const selectedTicket = useAppStore((state) => state.selectedTicket);
  const setSelectedTicket = useAppStore((state) => state.setSelectedTicket);
  const { user } = useUser();
  const [transferred, setTransferred] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  if (activeModal !== 'ticket_qr' || !selectedTicket) return null;

  return (
    <div
      onClick={() => setSelectedTicket(null)}
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0B0E]/95 border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 pb-8 text-white shadow-2xl relative animate-slide-up flex flex-col gap-5 cursor-default backdrop-blur-2xl"
      >
        {/* Close Button Disc */}
        <button
          onClick={() => setSelectedTicket(null)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 active:scale-90 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-start gap-1.5 pr-10">
          <Badge text="DIGITÁLNÍ VSTUPENKA" variant="red" />
          <h2 className="text-2xl font-extrabold text-white mt-1 leading-tight">{selectedTicket.title}</h2>
          <p className="text-xs text-neutral-400 font-medium">{selectedTicket.date}</p>
        </div>

        {/* High Contrast QR Code Display */}
        <div className="bg-white p-6 rounded-3xl flex flex-col items-center justify-center text-black shadow-2xl shadow-red-950/40 border border-white/20 mx-auto w-full max-w-[260px]">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${selectedTicket.qrCode}`}
            alt="QR Code"
            className="w-48 h-48"
          />
          <span className="text-xs font-mono font-bold mt-3 text-neutral-700 tracking-wider">
            {selectedTicket.qrCode}
          </span>
        </div>

        {/* Gate Scan Status & Seat Details */}
        <div className="glass-panel p-4.5 rounded-2xl border border-white/10 flex flex-col gap-2.5 bg-white/[0.03]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Sektor / Místo:</span>
            <span className="font-bold text-white">{selectedTicket.seatDetail}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Držitel:</span>
            <span className="font-bold text-white">{user.fullName}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/10">
            <span className="text-neutral-400">Stav:</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Aktivní pro Gate Scan</span>
            </div>
          </div>
        </div>

        {/* Action Row: Transfer & Apple Wallet */}
        {transferred ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between">
            <span>Vstupenka byla předána uživateli @klara_s!</span>
            <Check className="w-4 h-4" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setWalletAdded(true)}
              className="py-3 px-4 rounded-full glass-panel border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              {walletAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">V Apple Wallet</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 text-white" />
                  <span>Apple Wallet</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const handle = prompt('Zadejte @username nebo telefon kamaráda pro předání lístku:');
                if (handle) {
                  setTransferred(true);
                }
              }}
              className="py-3 px-4 rounded-full glass-panel border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-white" />
              <span>Předat lístek</span>
            </button>
          </div>
        )}

        {/* Live Aréna Mód Entry Button */}
        <button
          onClick={() => {
            if (selectedTicket.eventId) {
              useAppStore.getState().setActiveLiveEventId(selectedTicket.eventId);
            } else {
              useAppStore.getState().setActiveLiveEventId('hradec_pardubice');
            }
            useAppStore.getState().setActiveModal('live_mode');
            setSelectedTicket(null);
          }}
          className="w-full py-3.5 rounded-full bg-[#DE1D3E] text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:bg-red-600 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Vstoupit do Aréna Módu</span>
        </button>

        {/* Dismiss Text Link */}
        <button
          onClick={() => setSelectedTicket(null)}
          className="text-xs text-neutral-400 hover:text-white font-bold text-center py-1 transition-colors cursor-pointer"
        >
          Zavřít detail vstupenky
        </button>

      </div>
    </div>
  );
};
