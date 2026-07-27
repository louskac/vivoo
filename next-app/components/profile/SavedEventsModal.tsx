'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { mockEvents } from '@/lib/data';
import { X, Bookmark, Trash2, Calendar, MapPin, ChevronRight } from 'lucide-react';

export const SavedEventsModal: React.FC = () => {
  const { activeModal, setActiveModal, savedEventIds, toggleSaveEvent, setSelectedEvent } = useAppStore();

  if (activeModal !== 'saved_events') return null;

  const savedEvents = mockEvents.filter((ev) => savedEventIds.includes(ev.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F1117] border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-white shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#DE1D3E]/20 flex items-center justify-center text-[#DE1D3E]">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Uložené akce</h2>
            <p className="text-xs text-neutral-400">Vaše oblíbené akce a koncerty ({savedEvents.length})</p>
          </div>
        </div>

        {savedEvents.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-sm">
            Zatím nemáte uložené žádné akce. Nemáte vybrány žádné oblíbené akce.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {savedEvents.map((ev) => (
              <div
                key={ev.id}
                className="glass-panel p-3.5 rounded-2xl flex items-center justify-between gap-3 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                onClick={() => {
                  setSelectedEvent(ev);
                  setActiveModal(null);
                }}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                  <img src={ev.bgImg} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{ev.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveEvent(ev.id);
                  }}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-all shrink-0"
                  aria-label="Remove saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
