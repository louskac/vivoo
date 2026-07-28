'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { X, MapPin, Check } from 'lucide-react';

interface CityItem {
  id: string;
  name: string;
  count: number;
}

export const CitySelectorModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const gridCityFilter = useAppStore((state) => state.gridCityFilter);
  const setGridCityFilter = useAppStore((state) => state.setGridCityFilter);

  if (activeModal !== 'city_selector') return null;

  const countCity = (keyword: string) =>
    mockEvents.filter((e) => e.location.toLowerCase().includes(keyword.toLowerCase())).length;

  const cities: CityItem[] = [
    { id: 'all', name: 'Všechna města', count: mockEvents.length },
    { id: 'praha', name: 'Praha', count: countCity('praha') },
    { id: 'pardubice', name: 'Pardubice', count: countCity('pardubice') },
    { id: 'plzen', name: 'Plzeň', count: countCity('plzeň') || countCity('plzen') },
    { id: 'ostrava', name: 'Ostrava', count: countCity('ostrava') },
    { id: 'budejovice', name: 'České Budějovice', count: countCity('budějovice') || countCity('budejovice') },
    { id: 'olomouc', name: 'Olomouc', count: countCity('olomouc') },
    { id: 'brno', name: 'Brno', count: countCity('brno') },
  ];

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0B0E]/95 border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up backdrop-blur-2xl cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 active:scale-90 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-10">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Vybrat město</h2>
            <p className="text-xs text-neutral-400">Zobrazit akce v okolí</p>
          </div>
        </div>

        {/* City List */}
        <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 mb-6">
          {cities.map((city) => {
            const isSelected = gridCityFilter === city.id || (gridCityFilter === 'all' && city.id === 'all');
            return (
              <div
                key={city.id}
                onClick={() => {
                  setGridCityFilter(city.id);
                  setActiveModal(null);
                }}
                className="py-4 flex items-center justify-between cursor-pointer group hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-red-500' : 'text-neutral-500'}`} />
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                    {city.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-neutral-400">{city.count} akcí</span>
                  {isSelected && <Check className="w-4 h-4 text-red-500" />}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setActiveModal(null)}
          className="w-full py-3.5 rounded-full bg-white/10 text-white font-extrabold text-sm hover:bg-white/20 transition-all cursor-pointer"
        >
          Potvrdit výběr
        </button>
      </div>
    </div>
  );
};
