'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronRight } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';

export const LiveAmbientBanner: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const setActiveLiveEventId = useAppStore((state) => state.setActiveLiveEventId);

  // Hide when another full-screen modal is active
  if (activeModal && activeModal !== 'live_mode') return null;

  const handleOpenLiveMode = () => {
    setActiveLiveEventId('hradec_pardubice');
    setActiveModal('live_mode');
  };

  return (
    <div className="sticky top-0 z-[800] w-full bg-gradient-to-r from-[#DE1D3E] via-[#B91C1C] to-[#0A0B0E] text-white px-4 py-2.5 shadow-2xl backdrop-blur-md flex items-center justify-between border-b border-white/15 select-none max-w-md mx-auto">
      <div 
        onClick={handleOpenLiveMode}
        className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
      >
        <span className="flex h-2.5 w-2.5 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-full border border-white/20 shrink-0">
            ŽIVĚ V ARÉNĚ
          </span>
          <div className="flex items-center gap-1 text-xs font-black text-white truncate">
            <TeamLogo teamName="FC Hradec Králové" className="w-3.5 h-3.5 shrink-0" />
            <span>FCHK</span>
            <span className="text-emerald-400 font-extrabold px-1">2:1</span>
            <span>PCE</span>
            <TeamLogo teamName="FK Pardubice" className="w-3.5 h-3.5 shrink-0" />
          </div>
        </div>
      </div>

      <button
        onClick={handleOpenLiveMode}
        className="px-3 py-1 rounded-full bg-white text-black text-xs font-black flex items-center gap-1 shadow-md hover:bg-neutral-200 active:scale-95 transition-all shrink-0 cursor-pointer ml-2"
      >
        <span>Aréna</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
