'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { SeatAllocation } from '@/lib/types';
import { Share2, Copy, Check, X } from 'lucide-react';

export const TicketTransferModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const selectedTicket = useAppStore((state) => state.selectedTicket);
  const { user } = useUser();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSendSeat, setActiveSendSeat] = useState<SeatAllocation | null>(null);
  const [recipientContact, setRecipientContact] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Default seats data matching Figma layout (Seats 11, 12, 13, 14)
  const defaultSeats: SeatAllocation[] = [
    {
      id: 'seat-11',
      seatNumber: '11',
      status: 'owner',
      recipientName: user?.fullName || 'Jan Novák',
      recipientAvatarUrl: '/images/avatar.jpg'
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

  return (
    <div 
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1200] bg-[#22242D] border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Bottom Sheet Container (100% Figma Parity) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#252528] rounded-t-[36px] sm:rounded-[36px] px-6 pt-3 pb-8 text-white shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto border-t border-white/10"
      >
        {/* Top Drag Handle Bar (Figma Exact) */}
        <div className="w-16 h-1 bg-[#5D5E69] rounded-full mx-auto shrink-0 my-3" />

        {/* Header Title & Subtitle (Figma Exact) */}
        <div className="flex flex-col gap-1.5 mt-2 mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Rozdělit vstupenku
          </h2>
          <p className="text-[13px] text-[#9E9EA8] font-normal leading-relaxed max-w-xs sm:max-w-sm">
            Každý dostane vlastní kód do své aplikace. Z tvé vstupenky místo zmizí — vrátit se dá jen přes kamaráda.
          </p>
        </div>

        {/* Seats Status List (Clean Figma Layout — NO Inner Boxes!) */}
        <div className="flex flex-col gap-4 my-2">
          {seats.map((seat) => {
            const isOwner = seat.status === 'owner';
            const isPending = seat.status === 'pending';
            const isClaimed = seat.status === 'claimed';
            const isFree = seat.status === 'free';

            return (
              <div
                key={seat.id}
                className="flex items-center justify-between py-1 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar Circle (54px x 54px) */}
                  {isOwner || isClaimed ? (
                    <div className="w-[54px] h-[54px] rounded-full overflow-hidden shrink-0 shadow-md">
                      <img
                        src={seat.recipientAvatarUrl || '/images/avatar.jpg'}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/avatar.jpg';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-[54px] h-[54px] rounded-full bg-[#1A1A22] text-[#808595] flex items-center justify-center font-black text-2xl shrink-0 shadow-inner">
                      {seat.seatNumber}
                    </div>
                  )}

                  {/* Seat Title & Status Subtitle */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xl font-extrabold text-white tracking-tight">
                      Místo {seat.seatNumber}
                    </span>
                    <span className="text-sm text-[#9E9EA8] font-normal truncate mt-0.5">
                      {isOwner && `${user?.fullName || 'Jan Novák'} · ty`}
                      {isPending && 'Odesláno · čeká na přijetí'}
                      {isClaimed && `Přijato (${seat.recipientName || 'Kamarád'})`}
                      {isFree && 'Volné'}
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons (Figma Pill Outline) */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPending && (
                    <button
                      onClick={() => handleCancelTransfer(seat.id)}
                      className="px-5 py-1.5 rounded-full border border-white/60 text-white text-sm font-bold bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    >
                      Zrušit
                    </button>
                  )}

                  {isFree && (
                    <button
                      onClick={() => setActiveSendSeat(seat)}
                      className="px-5 py-1.5 rounded-full border border-white/60 text-white text-sm font-bold bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    >
                      Odeslat
                    </button>
                  )}

                  {isClaimed && (
                    <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
                      Přijato
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Primary Done Button (100% Figma Parity: Titlecase "Hotovo" & Red Crimson Background) */}
        <button
          onClick={() => setActiveModal(null)}
          className="w-full py-4 rounded-full bg-[#D20F26] hover:bg-[#B80C20] text-white font-bold text-base shadow-xl active:scale-95 transition-all cursor-pointer mt-6"
        >
          Hotovo
        </button>

        {/* SEND SEAT SUB-MODAL / DRAWER */}
        {activeSendSeat && (
          <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-sm bg-[#1F2028] border border-white/20 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-4 relative">
              <button
                onClick={() => setActiveSendSeat(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-1 pt-1">
                <span className="text-xs font-bold text-[#D20F26] uppercase tracking-wider">
                  Odeslat vstupenku
                </span>
                <h3 className="text-xl font-black text-white">
                  Místo {activeSendSeat.seatNumber}
                </h3>
                <p className="text-xs text-[#9E9EA8]">
                  Vyberte způsob doručení pro kamaráda. Funguje v aplikaci ViVoo i na webu bez registrace.
                </p>
              </div>

              {/* Direct Share Buttons */}
              <div className="grid grid-cols-2 gap-2.5 my-1">
                <button
                  onClick={() => handleShareWeb(activeSendSeat.transferCode || 'TR-77A91', activeSendSeat.seatNumber)}
                  className="p-3.5 rounded-2xl bg-[#292A36] hover:bg-[#323342] border border-white/10 flex flex-col items-center gap-2 text-center active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">WhatsApp / Zprávy</span>
                </button>

                <button
                  onClick={() => handleCopyLink(activeSendSeat.transferCode || 'TR-77A91')}
                  className="p-3.5 rounded-2xl bg-[#292A36] hover:bg-[#323342] border border-white/10 flex flex-col items-center gap-2 text-center active:scale-95 transition-all cursor-pointer"
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
                    className="flex-grow bg-[#14151C] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D20F26]"
                  />
                  <button
                    onClick={() => handleSendSeatSubmit(activeSendSeat.id)}
                    className="px-4 py-2.5 rounded-xl bg-[#D20F26] text-white text-xs font-bold shadow-lg hover:bg-[#B80C20] active:scale-95 transition-all shrink-0 cursor-pointer"
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
