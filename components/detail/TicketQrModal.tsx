'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { ChevronLeft, DoorClosed, LayoutGrid, User, ChevronDown, ChevronUp, Maximize2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const TicketQrModal: React.FC = () => {
  const selectedTicket = useAppStore((state) => state.selectedTicket);
  const setSelectedTicket = useAppStore((state) => state.setSelectedTicket);
  const { user } = useUser();

  const [copied, setCopied] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  // Accordion states
  const [openBeforeYouGo, setOpenBeforeYouGo] = useState(false);
  const [openHowToGetThere, setOpenHowToGetThere] = useState(false);
  const [openOrganizerTerms, setOpenOrganizerTerms] = useState(true);

  if (!selectedTicket) return null;

  const handleCopyCode = () => {
    const code = selectedTicket.qrCode || 'VV0-2026-145344';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if this ticket is a group ticket (purchased for > 1 person)
  const isGroupMode = (selectedTicket.ticketCount && selectedTicket.ticketCount > 1) || 
                      (selectedTicket.seatDetail?.includes('–') || selectedTicket.seatDetail?.includes('-'));
  const ticketCount = selectedTicket.ticketCount || (isGroupMode ? 4 : 1);

  const ticketCode = selectedTicket.qrCode || 'VV0-2026-145344';
  const categoryTag = selectedTicket.categoryTag || selectedTicket.badge || 'HUDBA';
  const gateText = selectedTicket.gateInfo || 'Brána 23 · otevřeno od 17:30';
  const holderText = selectedTicket.holderName || user?.fullName || 'Jan Novák';

  // Seats string depending on single vs group ticket
  const seatText = isGroupMode
    ? (selectedTicket.groupSeats || selectedTicket.seatDetail || 'Severní tribuna A3 · Ř.9 · 11–14')
    : (selectedTicket.seatDetail || 'Severní tribuna A3 · Ř.9 · 11');

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A0B0E] overflow-y-auto text-white animate-fade-in max-w-md mx-auto select-none">
      <div className="min-h-screen pt-12 px-5 pb-20 flex flex-col justify-between">
        <div>
          {/* Top Bar: Circular Glass Back Button & Category Badge */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedTicket(null)}
              className="w-11 h-11 rounded-full bg-[#181A20] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-lg"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Category Badge */}
            <Badge text={categoryTag} variant="red" />
          </div>

          {/* Event Title & Date/Venue */}
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {selectedTicket.title}
            </h1>
            <p className="text-sm text-neutral-400 font-medium">
              {selectedTicket.date}
            </p>
          </div>

          {/* 2. White Rounded QR Code Card (100% Figma Parity) */}
          <div className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] bg-white rounded-[32px] p-6 shadow-2xl flex items-center justify-center relative mx-auto my-4 border border-white/20">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${ticketCode}`}
              alt="QR Code"
              className="w-56 h-56 block mx-auto object-contain"
            />
          </div>

          {/* QR Code Serial & Group Badge (Conditioned on ticketCount > 1) */}
          <div className="flex flex-col items-center justify-center gap-1.5 mb-6">
            <div className="flex items-center justify-center gap-2">
              <span 
                onClick={handleCopyCode}
                className="font-mono text-sm font-bold text-neutral-200 tracking-wider cursor-pointer hover:text-white transition-colors"
              >
                {ticketCode}
              </span>
              {copied && <Check className="w-4 h-4 text-emerald-400 inline shrink-0" />}

              {/* Group Pill Badge (shown only if ticket is for > 1 person) */}
              {isGroupMode && (
                <span className="bg-[#1E2028] text-white text-[10.5px] font-black px-2.5 py-0.5 rounded-full border border-white/15 uppercase tracking-wide">
                  {ticketCount} VSTUPENKY
                </span>
              )}
            </div>

            {/* Group Explanatory Subtitle */}
            {isGroupMode && (
              <p className="text-xs text-neutral-400 text-center max-w-xs leading-relaxed font-normal">
                Jeden kód pro celou skupinu — projděte turniketem společně
              </p>
            )}
          </div>

          {/* 3. Ticket Metadata List (Vstup, Sektor/Řada/Místo, Držitel) */}
          <div className="border-t border-white/10 pt-6 flex flex-col gap-5">
            {/* Vstup */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                <DoorClosed className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-neutral-400 font-medium">Vstup</span>
                <span className="text-sm font-bold text-white mt-0.5">{gateText}</span>
              </div>
            </div>

            {/* Sektor · řada · místo */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-neutral-400 font-medium">Sektor · řada · místo</span>
                <span className="text-sm font-bold text-white mt-0.5">{seatText}</span>
              </div>
            </div>

            {/* Držitel */}
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-neutral-400 font-medium">Držitel</span>
                <span className="text-sm font-bold text-white mt-0.5">{holderText}</span>
              </div>
            </div>
          </div>

          {/* 4. Add to Wallet & Split Buttons Section */}
          <div className="mt-8 flex flex-col gap-3">
            <h3 className="text-lg font-extrabold text-white tracking-tight">Přidat do peněženky</h3>

            {/* Official Apple Wallet Badge Button */}
            <button
              onClick={() => setWalletAdded(!walletAdded)}
              className="w-fit bg-black hover:bg-neutral-900 border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4H5C3.89 4 3 4.89 3 6V18C3 19.1 3.89 20 5 20H19C20.1 20 21 19.1 21 18V6C21 4.89 20.1 4 19 4ZM19 18H5V10H19V18ZM19 8H5V6H19V8Z" />
              </svg>
              <div className="flex flex-col items-start text-left leading-none">
                <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">Add to</span>
                <span className="text-sm font-bold text-white tracking-tight">Apple Wallet</span>
              </div>
            </button>

            {/* Split between friends (Shown only if ticket is for > 1 person) */}
            {isGroupMode && (
              <button
                onClick={() => useAppStore.getState().setActiveModal('ticket_transfer')}
                className="w-full bg-white hover:bg-neutral-100 text-black font-extrabold text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer mt-2"
              >
                <Maximize2 className="w-4 h-4 text-black" />
                <span>Rozdělit mezi přátele</span>
              </button>
            )}
          </div>

          {/* 5. Collapsible Accordions (Než vyrazíš, Jak se dostat na místo, Pořadatel a podmínky) */}
          <div className="border-t border-white/10 pt-4 mt-8 flex flex-col gap-3">
            {/* Než vyrazíš */}
            <div className="border-b border-white/10 pb-3">
              <button
                onClick={() => setOpenBeforeYouGo(!openBeforeYouGo)}
                className="w-full flex items-center justify-between text-sm font-bold text-white py-1 cursor-pointer"
              >
                <span>Než vyrazíš</span>
                {openBeforeYouGo ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openBeforeYouGo && (
                <div className="pt-2 text-xs text-neutral-400 leading-relaxed font-normal">
                  Doporučujeme dorazit alespoň 30 minut před začátkem akce. Na místě probíhá bezpečnostní kontrola tašek a batohů do velikosti A4.
                </div>
              )}
            </div>

            {/* Jak se dostat na místo */}
            <div className="border-b border-white/10 pb-3">
              <button
                onClick={() => setOpenHowToGetThere(!openHowToGetThere)}
                className="w-full flex items-center justify-between text-sm font-bold text-white py-1 cursor-pointer"
              >
                <span>Jak se dostat na místo</span>
                {openHowToGetThere ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openHowToGetThere && (
                <div className="pt-2 text-xs text-neutral-400 leading-relaxed font-normal">
                  Spojení MHD: Metro A (Jiřího z Poděbrad) nebo Tramvaj 11 (Italská). Parkování přímo v areálu je omezené.
                </div>
              )}
            </div>

            {/* Pořadatel a podmínky */}
            <div className="pb-3">
              <button
                onClick={() => setOpenOrganizerTerms(!openOrganizerTerms)}
                className="w-full flex items-center justify-between text-sm font-bold text-white py-1 cursor-pointer"
              >
                <span>Pořadatel a podmínky</span>
                {openOrganizerTerms ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              {openOrganizerTerms && (
                <div className="pt-2 flex flex-col gap-1.5 text-xs text-neutral-300 font-normal">
                  <a href="#" className="hover:underline text-neutral-300">Obchodní podmínky</a>
                  <a href="#" className="hover:underline text-neutral-300">Reklamace</a>
                  <span className="text-neutral-400 mt-1">ViVoo Events s.r.o.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Bottom Refund / Return Section */}
        <div className="mt-8 pt-4 flex flex-col items-center text-center">
          <button
            onClick={() => alert("Žádost o vrácení vstupenky k prodeji byla přijata.")}
            className="text-sm font-bold text-white hover:underline cursor-pointer tracking-tight"
          >
            Vrátit vstupenku k prodeji
          </button>
          <p className="text-xs text-neutral-400 text-center max-w-xs mt-1.5 leading-relaxed font-normal">
            Vrátíme ti 80 % ceny v kreditu, jakmile lístek koupí někdo další.
          </p>
        </div>
      </div>
    </div>
  );
};
