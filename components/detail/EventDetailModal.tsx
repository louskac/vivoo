'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, MapPin, Calendar } from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const selectedEvent = useAppStore((state) => state.selectedEvent);
  const setSelectedEvent = useAppStore((state) => state.setSelectedEvent);
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  if (!selectedEvent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0B0E] overflow-y-auto pb-28 text-white animate-fade-in max-w-md mx-auto">
      {/* 380px Full Bleed Hero Section matching Figma point 4 */}
      <div className="relative w-full h-[380px]">
        <img
          src={selectedEvent.bgImg}
          alt={selectedEvent.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A0B0E]" />

        {/* Back Glass Circle Button */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-12 left-5 w-11 h-11 rounded-full bg-black/50 border border-white/15 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all z-20 cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Hero Content Positioned Bottom Left */}
        <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col items-start gap-2">
          <Badge text={selectedEvent.tag} variant="red" />
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
            {selectedEvent.title}
          </h1>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="p-5 flex flex-col gap-6 bg-[#0A0B0E]">
        {/* Metadata Rows */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
            <MapPin className="w-5 h-5 text-red-500 shrink-0" />
            <span>{selectedEvent.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
            <Calendar className="w-5 h-5 text-neutral-400 shrink-0" />
            <span>{selectedEvent.date}</span>
          </div>
        </div>

        {/* Headliner Card matching Figma */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-white/10">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/15">
            <img src={selectedEvent.bgImg} alt="Headliner" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">{selectedEvent.lineup.split(',')[0]}</h3>
            <p className="text-xs text-neutral-400 font-medium">Headliner · 20:00</p>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-extrabold text-white">O akci</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Zažijte jedinečnou atmosféru letního večera na akcích pod širým nebem v Praze. Připravte se na největší hity v neopakovatelné komorní i festivalové atmosféře s výhledem na celé město.{' '}
            <span className="text-white font-bold cursor-pointer hover:underline">...více</span>
          </p>
        </div>
      </div>

      {/* Sticky Fixed Bottom Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-[#0A0B0E]/95 backdrop-blur-xl border-t border-white/10 px-5 flex items-center justify-between z-50 max-w-md mx-auto">
        <div>
          <span className="text-[0.68rem] text-neutral-400 block uppercase tracking-wider font-bold">Cena od</span>
          <span className="text-xl font-black text-white">od {selectedEvent.priceMin.toLocaleString()} Kč</span>
        </div>
        <button
          onClick={() => setActiveModal('checkout')}
          className="bg-[#DE1D3E] text-white px-8 py-3 rounded-full text-base font-bold shadow-lg shadow-red-600/30 hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
        >
          Koupit
        </button>
      </div>
    </div>
  );
};

