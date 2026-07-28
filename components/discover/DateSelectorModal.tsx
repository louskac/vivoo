'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { DateFilterType } from '@/lib/types';
import { X, Calendar, Check, Clock, Sparkles } from 'lucide-react';

interface DateOption {
  id: DateFilterType;
  label: string;
  sublabel: string;
  count: number;
}

export const DateSelectorModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const gridDateFilter = useAppStore((state) => state.gridDateFilter);
  const setGridDateFilter = useAppStore((state) => state.setGridDateFilter);

  if (activeModal !== 'date_selector') return null;

  const countDate = (type: DateFilterType): number => {
    if (type === 'all') return mockEvents.length;
    return mockEvents.filter((ev) => {
      const lower = ev.date.toLowerCase();
      if (type === 'today') return lower.includes('dnes') || lower.includes('23. říj') || lower.includes('pá 23');
      if (type === 'tomorrow') return lower.includes('sobota') || lower.includes('so 12') || lower.includes('so 18');
      if (type === 'weekend') return lower.includes('so') || lower.includes('ne') || lower.includes('soboty') || lower.includes('víkend');
      if (type === 'this_month') return lower.includes('říj') || lower.includes('října') || lower.includes('lis') || lower.includes('listopadu');
      if (type === 'next_month') return lower.includes('pro') || lower.includes('prosince') || lower.includes('dubna') || lower.includes('června') || lower.includes('července');
      return true;
    }).length;
  };

  const dateOptions: DateOption[] = [
    { id: 'all', label: 'Kdykoliv', sublabel: 'Všechny nadcházející akce', count: countDate('all') },
    { id: 'today', label: 'Dnes', sublabel: 'Akce probíhající dnes', count: countDate('today') },
    { id: 'tomorrow', label: 'Zítra', sublabel: 'Akce plánované na zítřek', count: countDate('tomorrow') },
    { id: 'weekend', label: 'Tento víkend', sublabel: 'Víkendový program (So + Ne)', count: countDate('weekend') },
    { id: 'this_month', label: 'Tento měsíc', sublabel: 'Akce v tomto měsíci', count: countDate('this_month') },
    { id: 'next_month', label: 'Příští měsíce', sublabel: 'Velké nadcházející akce', count: countDate('next_month') },
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-10">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Vybrat termín</h2>
            <p className="text-xs text-neutral-400">Filtrovat akce podle data konání</p>
          </div>
        </div>

        {/* Date Preset List */}
        <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10 mb-6">
          {dateOptions.map((opt) => {
            const isSelected = gridDateFilter === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  setGridDateFilter(opt.id);
                  setActiveModal(null);
                }}
                className="py-4 flex items-center justify-between cursor-pointer group hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${isSelected ? 'text-red-500' : 'text-neutral-500'}`} />
                  <div>
                    <span className={`text-sm font-bold block ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[0.72rem] text-neutral-400 font-medium">
                      {opt.sublabel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {opt.count} akcí
                  </span>
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
          Zobrazit výsledky
        </button>
      </div>
    </div>
  );
};
