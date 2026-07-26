'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, Play } from 'lucide-react';

export const DiscoverGrid: React.FC = () => {
  const { setSelectedEvent } = useAppStore();

  const heroEvent = mockEvents[0];
  const gridEvents = mockEvents.slice(1);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pb-32 pt-10 px-4">
      {/* Top Search & City Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Hledej akce, interprety, n..."
            className="w-full bg-white/10 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/30"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          Praha
        </button>
      </div>

      {/* Featured Hero Card */}
      <div
        onClick={() => setSelectedEvent(heroEvent)}
        className="relative w-full h-[260px] rounded-3xl overflow-hidden mb-8 cursor-pointer group shadow-2xl"
      >
        <img
          src={heroEvent.bgImg}
          alt={heroEvent.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-black/20 to-transparent" />

        {/* Top Tag & Play button */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Badge text={heroEvent.tag} variant="red" />
          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
        </div>

        {/* Bottom Title & Price */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white leading-tight mb-1">{heroEvent.title}</h2>
            <p className="text-xs text-neutral-300 font-medium">{heroEvent.location} · {heroEvent.date}</p>
          </div>
          <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-extrabold text-white">
            od {heroEvent.priceMin} Kč
          </div>
        </div>
      </div>

      {/* Dnes v Praze Section */}
      <h3 className="text-xl font-black text-white mb-4">Dnes v Praze</h3>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        {gridEvents.map((ev) => (
          <div
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className="flex flex-col cursor-pointer group"
          >
            <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-2">
              <img
                src={ev.bgImg}
                alt={ev.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3">
                <Badge text={ev.badge || ev.tag} variant={ev.badge === 'VIP' ? 'gold' : ev.badge === 'SOLD OUT' ? 'red' : 'dark'} />
              </div>
            </div>

            {/* Title & Info */}
            <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1 mb-0.5">{ev.title}</h4>
            <p className="text-[0.72rem] text-neutral-400 font-medium line-clamp-1">{ev.location}</p>
            <p className="text-[0.75rem] font-bold text-white mt-1">${ev.priceMin}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
