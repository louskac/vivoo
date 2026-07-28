'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { VibeCategory } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, Play, Bookmark, Calendar } from 'lucide-react';
import { DateFilterType } from '@/lib/types';

export const DiscoverGrid: React.FC = () => {
  const setSelectedEvent = useAppStore((state) => state.setSelectedEvent);
  const gridVibeFilter = useAppStore((state) => state.gridVibeFilter);
  const setGridVibeFilter = useAppStore((state) => state.setGridVibeFilter);
  const gridSearchQuery = useAppStore((state) => state.gridSearchQuery);
  const setGridSearchQuery = useAppStore((state) => state.setGridSearchQuery);
  const savedEventIds = useAppStore((state) => state.savedEventIds);
  const toggleSaveEvent = useAppStore((state) => state.toggleSaveEvent);
  const gridDateFilter = useAppStore((state) => state.gridDateFilter);
  const gridCityFilter = useAppStore((state) => state.gridCityFilter);
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  const vibes: { id: VibeCategory; label: string }[] = [
    { id: 'vse', label: 'Vše' },
    { id: 'hokej', label: 'Hokej' },
    { id: 'fotbal', label: 'Fotbal' },
    { id: 'koncerty', label: 'Koncerty' },
    { id: 'festivaly', label: 'Festivaly' },
    { id: 'zoo', label: 'ZOO' },
    { id: 'vystaviste', label: 'Výstaviště' },
    { id: 'florbal', label: 'Florbal' },
    { id: 'sport', label: 'Sport' },
    { id: 'divadlo', label: 'Divadlo' },
    { id: 'standup', label: 'Stand-up' },
    { id: 'konference', label: 'Konference' },
  ];

  const matchesDateFilter = (evDate: string, filter: DateFilterType) => {
    if (filter === 'all') return true;
    const lower = evDate.toLowerCase();
    if (filter === 'today') return lower.includes('dnes') || lower.includes('23. říj') || lower.includes('pá 23');
    if (filter === 'tomorrow') return lower.includes('sobota') || lower.includes('so 12') || lower.includes('so 18');
    if (filter === 'weekend') return lower.includes('so') || lower.includes('ne') || lower.includes('soboty') || lower.includes('víkend');
    if (filter === 'this_month') return lower.includes('říj') || lower.includes('října') || lower.includes('lis') || lower.includes('listopadu');
    if (filter === 'next_month') return lower.includes('pro') || lower.includes('prosince') || lower.includes('dubna') || lower.includes('června') || lower.includes('července');
    return true;
  };

  const matchesCityFilter = (evLocation: string, cityFilter: string) => {
    if (cityFilter === 'all') return true;
    const lower = evLocation.toLowerCase();
    if (cityFilter === 'praha') return lower.includes('praha');
    if (cityFilter === 'pardubice') return lower.includes('pardubice');
    if (cityFilter === 'plzen') return lower.includes('plzeň') || lower.includes('plzen');
    if (cityFilter === 'ostrava') return lower.includes('ostrava');
    if (cityFilter === 'budejovice') return lower.includes('budějovice') || lower.includes('budejovice');
    if (cityFilter === 'olomouc') return lower.includes('olomouc');
    if (cityFilter === 'brno') return lower.includes('brno');
    return true;
  };

  // Filter events based on search query, category vibe, city, and date
  const filtered = mockEvents.filter((ev) => {
    const matchesVibe = gridVibeFilter === 'vse' || ev.vibe === gridVibeFilter;
    const matchesCity = matchesCityFilter(ev.location, gridCityFilter);
    const matchesDate = matchesDateFilter(ev.date, gridDateFilter);
    const matchesSearch =
      gridSearchQuery === '' ||
      ev.title.toLowerCase().includes(gridSearchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(gridSearchQuery.toLowerCase()) ||
      ev.tag.toLowerCase().includes(gridSearchQuery.toLowerCase());
    return matchesVibe && matchesCity && matchesDate && matchesSearch;
  });

  const heroEvent = filtered[0] || mockEvents[0];
  const gridEvents = filtered.slice(1);

  const cityName = gridCityFilter === 'all' ? 'Město' : gridCityFilter.toUpperCase();
  const dateFilterLabels: Record<string, string> = {
    all: 'Termín',
    today: 'Dnes',
    tomorrow: 'Zítra',
    weekend: 'Víkend',
    this_month: 'Tento měsíc',
    next_month: 'Příští měsíce',
  };
  const dateLabel = dateFilterLabels[gridDateFilter] || 'Termín';

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white pb-32 pt-10 px-4 animate-fade-in">
      {/* Top Search & Filter Controls Bar */}
      <div className="flex items-center gap-2 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={gridSearchQuery}
            onChange={(e) => setGridSearchQuery(e.target.value)}
            placeholder="Hledej akce..."
            className="w-full bg-white/10 border border-white/10 rounded-full py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/30 transition-all"
          />
        </div>

        {/* Date Filter Button */}
        <button
          onClick={() => setActiveModal('date_selector')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full border text-xs font-bold shrink-0 transition-all cursor-pointer ${
            gridDateFilter !== 'all'
              ? 'bg-red-500/20 border-red-500/60 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-red-500" />
          <span>{dateLabel}</span>
        </button>

        {/* City Filter Button */}
        <button
          onClick={() => setActiveModal('city_selector')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full border text-xs font-bold shrink-0 transition-all cursor-pointer ${
            gridCityFilter !== 'all'
              ? 'bg-red-500/20 border-red-500/60 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>{cityName}</span>
        </button>
      </div>

      {/* Category Pills Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-6">
        {vibes.map((vibe) => (
          <button
            key={vibe.id}
            onClick={() => setGridVibeFilter(vibe.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-300 ${
              gridVibeFilter === vibe.id
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
            }`}
          >
            {vibe.label}
          </button>
        ))}
      </div>

      {/* Featured Hero Card */}
      {heroEvent && (
        <div
          onClick={() => setSelectedEvent(heroEvent)}
          className="relative w-full h-[260px] rounded-3xl overflow-hidden mb-8 cursor-pointer group shadow-2xl border border-white/10"
        >
          <img
            src={heroEvent.bgImg}
            alt={heroEvent.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-black/30 to-transparent" />

          {/* Top Tag & Save button */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <Badge text={heroEvent.tag} variant="red" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveEvent(heroEvent.id);
              }}
              className="w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-black/80 active:scale-90 transition-all cursor-pointer"
              aria-label="Save"
            >
              <Bookmark className={`w-5 h-5 ${savedEventIds.includes(heroEvent.id) ? 'fill-white text-white' : 'text-white'}`} />
            </button>
          </div>

          {/* Bottom Title & Price */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white leading-tight mb-1">{heroEvent.title}</h2>
              <p className="text-xs text-neutral-300 font-medium">{heroEvent.location} · {heroEvent.date}</p>
            </div>
            <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-extrabold text-white">
              od {heroEvent.priceMin.toLocaleString()} Kč
            </div>
          </div>
        </div>
      )}

      {/* Dnes v Praze Section */}
      <h3 className="text-xl font-black text-white mb-4">Dnes v Praze</h3>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        {gridEvents.map((ev) => (
          <div
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className="flex flex-col cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-2 border border-white/10">
              <img
                src={ev.bgImg}
                alt={ev.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Badge & Save */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <Badge text={ev.badge || ev.tag} variant={ev.badge === 'VIP' ? 'gold' : ev.badge === 'SOLD OUT' ? 'red' : 'dark'} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveEvent(ev.id);
                  }}
                  className="w-8 h-8 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center pointer-events-auto hover:bg-black/80 active:scale-90 transition-all"
                  aria-label="Save"
                >
                  <Bookmark className={`w-4 h-4 ${savedEventIds.includes(ev.id) ? 'fill-white text-white' : 'text-white'}`} />
                </button>
              </div>
            </div>

            {/* Title & Info */}
            <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1 mb-0.5">{ev.title}</h4>
            <p className="text-[0.72rem] text-neutral-400 font-medium line-clamp-1">{ev.location}</p>
            <p className="text-[0.78rem] font-extrabold text-white mt-1">od {ev.priceMin.toLocaleString()} Kč</p>
          </div>
        ))}
      </div>
    </div>
  );
};
