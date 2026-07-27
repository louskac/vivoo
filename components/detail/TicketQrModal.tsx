'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { X, ShieldCheck, Share2, Wallet, Check } from 'lucide-react';

export const TicketQrModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const selectedTicket = useAppStore((state) => state.selectedTicket);
  const setSelectedTicket = useAppStore((state) => state.setSelectedTicket);
  const { user } = useUser();
  const [transferred, setTransferred] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  if (activeModal !== 'ticket_qr' || !selectedTicket) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 pb-10 text-white shadow-2xl relative animate-slide-up flex flex-col gap-5">
        {/* Close Button */}
        <button
          onClick={() => setSelectedTicket(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <span className="text-xs font-bold text-[#DE1D3E] uppercase tracking-wider">DIGITÁLNÍ VSTUPENKA</span>
          <h2 className="text-2xl font-black text-white mt-1 leading-tight">{selectedTicket.title}</h2>
          <p className="text-xs text-neutral-400 mt-1 font-medium">{selectedTicket.date}</p>
        </div>

        {/* High Contrast QR Code Display */}
        <div className="bg-white p-6 rounded-3xl flex flex-col items-center justify-center text-black shadow-2xl mx-auto w-full max-w-[260px]">
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
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-2.5 bg-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Sektor / Místo:</span>
            <span className="font-bold text-white">{selectedTicket.seatDetail}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Držitel:</span>
            <span className="font-bold text-white">{user.fullName}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
            <span className="text-neutral-400">Stav:</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Aktivní pro Gate Scan</span>
            </div>
          </div>
        </div>

        {/* Action Row: Transfer & Apple Wallet */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setWalletAdded(true)}
            className="py-3 px-3 rounded-2xl bg-black border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer"
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
            onClick={() => setTransferred(true)}
            className="py-3 px-3 rounded-2xl bg-white/10 border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            {transferred ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Předáno</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-white" />
                <span>Předat lístek</span>
              </>
            )}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedTicket(null)}
          className="w-full py-3.5 rounded-full bg-[#DE1D3E] text-white font-extrabold text-sm shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
        >
          Zavřít detail vstupenky
        </button>
      </div>
    </div>
  );
};
