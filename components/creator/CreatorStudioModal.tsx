'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronLeft, Video, TrendingUp, DollarSign, Ticket, Eye, CheckCircle2, Upload, Sparkles, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const CreatorStudioModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (activeModal !== 'creator_studio') return null;

  const mockMarketingVideos = [
    {
      id: 'vid-1',
      title: 'Východočeské Derby – Oslavy Gólu před Fanklubem',
      views: '48.2k',
      ticketsSold: 142,
      revenueGenerated: '85 200 Kč',
      conversionRate: '4.8%',
      thumbnail: '/images/prague_derby.jpg',
      date: 'Dnes, 17:45'
    },
    {
      id: 'vid-2',
      title: 'Zákulisí Hráčské Šatny před Zápasem',
      views: '32.1k',
      ticketsSold: 89,
      revenueGenerated: '53 400 Kč',
      conversionRate: '3.9%',
      thumbnail: '/images/derby.jpg',
      date: 'Včera'
    },
    {
      id: 'vid-3',
      title: 'Pozvánka na Letní Koncert pod hvězdami',
      views: '19.5k',
      ticketsSold: 64,
      revenueGenerated: '38 400 Kč',
      conversionRate: '5.1%',
      thumbnail: '/images/xindl_live.jpg',
      date: 'Před 3 dny'
    }
  ];

  const handleUploadNewVideo = () => {
    setToastMessage('Video bylo nahráno do B2C feedu. Konverze aktivní!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A0B0E] overflow-y-auto text-white animate-fade-in max-w-md mx-auto select-none custom-scrollbar">
      <div className="min-h-screen pt-12 px-5 pb-24 flex flex-col justify-between">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModal(null)}
              className="w-11 h-11 rounded-full bg-[#181A20] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer shadow-lg shrink-0"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
              <Sparkles className="w-4 h-4 text-[#DE1D3E]" />
              <span className="text-xs font-black text-[#DE1D3E] uppercase tracking-wider">MARKETING B2C STUDIO</span>
            </div>
          </div>

          {/* Title Banner */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-white tracking-tight">B2C Creator Studio</h1>
            <p className="text-xs text-neutral-400 font-medium">
              Analytika pro klubové markéťáky • Měření přímých prodejů lístků z vertikálních videí
            </p>
          </div>

          {/* Status Integration Cards */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-black border border-emerald-500/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">ENIGOO API & RELATOO CRM</span>
                <span className="text-xs font-extrabold text-white">100% Zrcadlení dat & Konverzí aktivní</span>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Aggregated Performance Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col gap-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Tržby z Videí</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xl font-black text-white font-mono mt-1">177 000 Kč</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +34% tento měsíc
              </span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col gap-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Vygenerováno Lístků</span>
                <Ticket className="w-4 h-4 text-[#DE1D3E]" />
              </div>
              <span className="text-xl font-black text-white font-mono mt-1">295 ks</span>
              <span className="text-[10px] text-neutral-400 font-bold mt-0.5">z 3 aktivních videí</span>
            </div>
          </div>

          {/* Upload New Promo Video Button */}
          <button
            onClick={handleUploadNewVideo}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#DE1D3E] via-red-600 to-[#B91C1C] hover:from-red-600 hover:to-red-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-white/20"
          >
            <Upload className="w-4 h-4" />
            <span>Nahrát Exkluzivní 9:16 Video</span>
          </button>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-xl animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {toastMessage}
            </div>
          )}

          {/* Marketing Videos Breakdown */}
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-xs font-black uppercase text-neutral-400 tracking-wider">Aktivní Videa a Výkonnost</h3>
            <div className="flex flex-col gap-3">
              {mockMarketingVideos.map((vid) => (
                <div key={vid.id} className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col gap-3 shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/15 relative">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Video className="w-5 h-5 text-white/90" />
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-white leading-tight truncate">{vid.title}</h4>
                      <span className="text-[10px] text-neutral-400 font-medium mt-1">{vid.date}</span>
                      <div className="flex items-center gap-3 text-xs font-mono font-extrabold text-white mt-1.5">
                        <span className="flex items-center gap-1 text-neutral-300">
                          <Eye className="w-3.5 h-3.5 text-neutral-400" /> {vid.views}
                        </span>
                        <span className="text-emerald-400 font-bold">{vid.revenueGenerated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-400 text-[11px]">Prodané vstupenky: <strong className="text-white">{vid.ticketsSold} ks</strong></span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-black">
                      CR: {vid.conversionRate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
