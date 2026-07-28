'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Sparkles, Volume2 } from 'lucide-react';

export const LightshowOverlay: React.FC = () => {
  const isLightshowActive = useAppStore((state) => state.isLightshowActive);
  const setLightshowActive = useAppStore((state) => state.setLightshowActive);

  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['bg-red-600', 'bg-blue-600', 'bg-purple-600', 'bg-amber-500', 'bg-white', 'bg-emerald-500'];

  useEffect(() => {
    if (!isLightshowActive) return;
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 250); // Flash every 250ms

    return () => clearInterval(interval);
  }, [isLightshowActive, colors.length]);

  if (!isLightshowActive) return null;

  return (
    <div
      onClick={() => setLightshowActive(false)}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 transition-colors duration-150 ${colors[colorIndex]} text-black select-none cursor-pointer`}
    >
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
          <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
          <span className="text-xs font-black uppercase tracking-wider">Synchronizovaný Světelný Stroboskop</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightshowActive(false);
          }}
          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Animated Pulsing Visual */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-24 h-24 rounded-full bg-black/30 border-4 border-white/80 flex items-center justify-center animate-ping">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black text-black drop-shadow-md uppercase tracking-tight">
          Namiřte obrazovku k pódiu / hřišti!
        </h2>
        <p className="text-sm font-bold bg-black/50 text-white px-4 py-1.5 rounded-full border border-white/20">
          Obrazovka se synchronizuje s atmosférou arény
        </p>
      </div>

      {/* Bottom Hint */}
      <p className="text-xs font-semibold bg-black/70 text-white/80 px-4 py-2 rounded-xl">
        Klepnutím kamkoliv světelnou show ukončíte
      </p>
    </div>
  );
};
