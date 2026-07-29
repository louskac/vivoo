'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { SeatAllocation } from '@/lib/types';
import { X, Share2, Copy, Check, Send, Link, Smartphone, User, ArrowRight, RefreshCw, QrCode } from 'lucide-react';

export const TicketTransferModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const selectedTicket = useAppStore((state) => state.selectedTicket);
  const { user } = useUser();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSendSeat, setActiveSendSeat] = useState<SeatAllocation | null>(null);
  const [recipientContact, setRecipientContact] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize or fallback seats data for the selected ticket
  const defaultSeats: SeatAllocation[] = [
    {
      id: 'seat-11',
      seatNumber: '11',
      status: 'owner',
      recipientName: user?.fullName || 'Jan Novák',
      recipientAvatarUrl: user?.avatarUrl || '/images/avatar.jpg'
    },
    {
      id: 'seat-12',
      seatNumber: '12',
      status: 'pending',
      recipientName: 'Petr',
      transferCode: 'TR-98A72F-S12'
    },
    {
      id: 'seat-13',
      seatNumber: '13',
      status: 'free'
    },
    {
      id: 'seat-14',
      seatNumber: '14',
      status: 'free'
    }
  ];

  const [seats, setSeats] = useState<SeatAllocation[]>(selectedTicket?.seats || defaultSeats);

  if (activeModal !== 'ticket_transfer') return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = (code: string) => {
    const link = `https://vivoo.cz/claim?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    showToast('Odkaz byl zkopírován do schránky');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareWeb = (code: string, seatNum: number | string) => {
    const shareUrl = `https://vivoo.cz/claim?code=${code}`;
    const title = `Vstupenka na ${selectedTicket?.title || 'akci'}`;
    const text = `${user?.fullName || 'Jan Novák'} vám posílá vstupenku na ${selectedTicket?.title || 'akci'} (Místo ${seatNum}). Přijměte ji kliknutím na odkaz:`;

    if (navigator.share) {
      navigator.share({ title, text, url: shareUrl }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${shareUrl}`)}`, '_blank');
    }
  };

  const handleSendSeatSubmit = (seatId: string) => {
    const code = `TR-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${seatId}`;
    setSeats((prev) =>
      prev.map((s) =>
        s.id === seatId
          ? {
              ...s,
              status: 'pending',
              recipientContact: recipientContact || 'Odesláno přes odkaz',
              transferCode: code
            }
          : s
      )
    );
    showToast(`Pozvánka pro místo ${seatId.replace('seat-', '')} byla odeslána`);
    setActiveSendSeat(null);
    setRecipientContact('');
  };

  const handleCancelTransfer = (seatId: string) => {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === seatId
          ? {
              ...s,
              status: 'free',
              recipientName: undefined,
              recipientContact: undefined,
              transferCode: undefined
            }
          : s
      )
    );
    showToast('Odeslání vstupenky bylo zrušeno');
  };

  const handleSimulateClaim = (seatId: string) => {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === seatId
          ? {
              ...s,
              status: 'claimed',
              recipientName: 'Petr Svoboda',
              recipientAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              claimedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : s
      )
    );
    showToast('Kamarád (Petr Svoboda) právě přijal vstupenku!');
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1200] bg-[#1E202B] border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Bottom Sheet Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#16171E] border border-white/15 rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Top Drag Handle Indicator */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto shrink-0 -mt-1 mb-1" />

        {/* Header Title & Subtitle */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Rozdělit vstupenku
            </h2>
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-neutral-400 font-normal leading-relaxed">
            Každý dostane vlastní kód do své aplikace. Z tvé vstupenky místo zmizí — vrátit se dá jen přes kamaráda.
          </p>
        </div>

        {/* Seats Status List */}
        <div className="flex flex-col gap-3 my-1">
          {seats.map((seat) => {
            const isOwner = seat.status === 'owner';
            const isPending = seat.status === 'pending';
            const isClaimed = seat.status === 'claimed';
            const isFree = seat.status === 'free';

            return (
              <div
                key={seat.id}
                className="p-3.5 rounded-2xl bg-[#1C1E26] border border-white/10 flex items-center justify-between gap-3 shadow-md transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Left Avatar Circle */}
                  {isOwner || isClaimed ? (
                    <div className="w-11 h-11 rounded-full border-2 border-white/30 overflow-hidden shrink-0 shadow-md">
                      <img
                        src={seat.recipientAvatarUrl || user?.avatarUrl || '/images/avatar.jpg'}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/avatar.jpg';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#232632] border border-white/10 text-neutral-400 flex items-center justify-center font-extrabold text-base shrink-0 shadow-inner">
                      {seat.seatNumber}
                    </div>
                  )}

                  {/* Seat Title & Status Subtitle */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-black text-white tracking-tight">
                      Místo {seat.seatNumber}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium truncate">
                      {isOwner && `${user?.fullName || 'Jan Novák'} • ty`}
                      {isPending && (seat.recipientName ? `Odesláno (${seat.recipientName}) • čeká na přijetí` : 'Odesláno • čeká na přijetí')}
                      {isClaimed && `Přijato (${seat.recipientName || 'Kamarád'})`}
                      {isFree && 'Volné'}
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleCancelTransfer(seat.id)}
                        className="px-4 py-1.5 rounded-full border border-white/30 hover:border-white/50 text-white text-xs font-bold hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                      >
                        Zrušit
                      </button>
                      <button
                        onClick={() => handleSimulateClaim(seat.id)}
                        title="Simulovat přijetí kamarádem pro testování"
                        className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 active:scale-95 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {isFree && (
                    <button
                      onClick={() => setActiveSendSeat(seat)}
                      className="px-4 py-1.5 rounded-full border border-white/30 hover:border-white/50 text-white text-xs font-bold hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    >
                      Odeslat
                    </button>
                  )}

                  {isClaimed && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
                      Přijato
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Primary Done Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="w-full py-4 rounded-full bg-[#DE1D3E] hover:bg-red-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 active:scale-95 transition-all cursor-pointer mt-2"
        >
          Hotovo
        </button>

        {/* SEND SEAT SUB-MODAL / DRAWER */}
        {activeSendSeat && (
          <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-sm bg-[#1A1C26] border border-white/20 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-4 relative">
              <button
                onClick={() => setActiveSendSeat(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-1 pt-1">
                <span className="text-xs font-bold text-[#DE1D3E] uppercase tracking-wider">
                  Odeslat vstupenku
                </span>
                <h3 className="text-xl font-black text-white">
                  Místo {activeSendSeat.seatNumber}
                </h3>
                <p className="text-xs text-neutral-400">
                  Vyberte způsob doručení pro kamaráda. Funguje v aplikaci ViVoo i na webu bez registrace.
                </p>
              </div>

              {/* Direct Share Buttons */}
              <div className="grid grid-cols-2 gap-2.5 my-1">
                <button
                  onClick={() => handleShareWeb(activeSendSeat.transferCode || 'TR-77A91', activeSendSeat.seatNumber)}
                  className="p-3.5 rounded-2xl bg-[#232634] hover:bg-[#2C2F40] border border-white/10 flex flex-col items-center gap-2 text-center active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">WhatsApp / Zprávy</span>
                </button>

                <button
                  onClick={() => handleCopyLink(activeSendSeat.transferCode || 'TR-77A91')}
                  className="p-3.5 rounded-2xl bg-[#232634] hover:bg-[#2C2F40] border border-white/10 flex flex-col items-center gap-2 text-center active:scale-95 transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-blue-400" />}
                  <span className="text-xs font-bold text-white">Kopírovat odkaz</span>
                </button>
              </div>

              {/* Input for Phone / Email / Username */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-neutral-300">
                  Nebo zadat telefon / e-mail kamaráda:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={recipientContact}
                    onChange={(e) => setRecipientContact(e.target.value)}
                    placeholder="např. +420 777 123 456"
                    className="flex-grow bg-[#12131A] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#DE1D3E]"
                  />
                  <button
                    onClick={() => handleSendSeatSubmit(activeSendSeat.id)}
                    className="px-4 py-2.5 rounded-xl bg-[#DE1D3E] text-white text-xs font-bold shadow-lg hover:bg-red-600 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    Odeslat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
