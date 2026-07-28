'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { mockEvents } from '@/lib/data';
import { X, Bookmark, Trash2, Calendar, MapPin, Ticket } from 'lucide-react';

export const SavedEventsModal: React.FC = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const setSelectedEvent = useAppStore((state) => state.setSelectedEvent);
  const { savedEventIds, toggleSave } = useUser();

  if (activeModal !== 'saved_events') return null;

  const savedEvents = mockEvents.filter((ev) => savedEventIds.includes(ev.id));

  return (
    <div
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0B0E]/95 border border-white/15 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 pb-8 text-white shadow-2xl relative animate-slide-up backdrop-blur-2xl cursor-default"
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
          <div className="w-10 h-10 rounded-xl bg-[#DE1D3E]/20 flex items-center justify-center text-[#DE1D3E] shrink-0">
            <Bookmark className="w-5 h-5 fill-[#DE1D3E]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Uložené akce</h2>
            <p className="text-xs text-neutral-400">Vaše uložené akce a koncerty ({savedEvents.length})</p>
          </div>
        </div>

        {savedEvents.length === 0 ? (
          <div className="py-14 text-center text-neutral-400 text-sm flex flex-col items-center gap-3">
            <Bookmark className="w-10 h-10 text-neutral-600" />
            <p className="font-semibold text-neutral-300">Nemáte vybrány žádné uložené akce</p>
            <p className="text-xs text-neutral-500 max-w-xs">
              Při prozerání videa nebo vyhledávání klikněte na „Uložit“ pro přidání do tohoto seznamu.
            </p>
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
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/10">
                  <img src={ev.bgImg} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{ev.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(ev);
                      setActiveModal('checkout');
                    }}
                    className="bg-[#DE1D3E] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow hover:bg-red-600 active:scale-95 transition-all"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    Koupit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(ev.id);
                    }}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-all"
                    aria-label="Remove saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
