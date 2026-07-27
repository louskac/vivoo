'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Ticket as TicketIcon, Sparkles, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const TicketsView: React.FC = () => {
  const userBalance = useAppStore((state) => state.userBalance);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const purchasedTickets = useAppStore((state) => state.purchasedTickets);
  const [activeTicketTab, setActiveTicketTab] = useState<'active' | 'past'>('active');

  const allTickets = [
    ...purchasedTickets.map((t) => ({
      id: t.id,
      title: t.eventTitle,
      date: t.date,
      location: t.location,
      sector: `${t.tier.toUpperCase()} · ${t.quantity}x (${t.sectorName || 'Standard'})`,
      holder: 'Jan Novák',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${t.qrCode}`,
      badge: (t.tier === 'vip' ? 'VIP' : 'HUDBA') as any
    })),
    {
      id: 'TICK-312004',
      title: 'AC Sparta Praha vs SK Slavia Praha',
      date: 'So 12. října 2026 · 18:00',
      location: 'epet ARENA, Praha 7',
      sector: 'Sektor A (Dolní Hřiště)',
      holder: 'Jan Novák',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=DERBY-SPARTA-312004',
      badge: 'LIMITED' as const
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-32 pt-6 px-5 max-w-md mx-auto">
      {/* Top Wallet Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Moje Vstupenky</h1>
          <p className="text-xs text-neutral-400">Digitální lístky & NFC Cashless Peněženka</p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900/80 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-white">{userBalance} Kč</span>
        </div>
      </div>

      {/* Segmented Controller: Aktivní vs Historie */}
      <div className="flex bg-neutral-900/60 p-1 rounded-xl border border-white/10 mb-6">
        <button
          onClick={() => setActiveTicketTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTicketTab === 'active'
              ? 'bg-white/15 text-white shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Aktivní ({allTickets.length})
        </button>
        <button
          onClick={() => setActiveTicketTab('past')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTicketTab === 'past'
              ? 'bg-white/15 text-white shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Historie (0)
        </button>
      </div>

      {activeTicketTab === 'active' ? (
        <div className="flex flex-col gap-5">
          {allTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/90 to-neutral-950 flex flex-col gap-4 relative overflow-hidden group shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge text={ticket.badge} variant="red" />
                  <h2 className="text-lg font-bold text-white mt-1.5">{ticket.title}</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">{ticket.date}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 shrink-0">
                  <TicketIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="border-t border-dashed border-white/10 my-1" />

              {/* Dynamic QR Code & Gate Info */}
              <div className="flex items-center gap-4 bg-black/40 p-3.5 rounded-xl border border-white/5">
                <div className="bg-white p-2 rounded-lg shrink-0">
                  <img src={ticket.qrCode} alt="QR Ticket" className="w-16 h-16" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">{ticket.sector}</span>
                  <span className="text-xs text-neutral-300 font-medium">Držitel: {ticket.holder}</span>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Aktivní pro Gate Scan</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-neutral-500" />
          <p className="text-sm font-semibold text-neutral-300">Žádné absolvované akce</p>
          <p className="text-xs text-neutral-500">Vaše navštívené události a vzpomínkové fotky se zobrazí zde.</p>
        </div>
      )}


      {/* Discovery CTA Banner */}
      <div className="mt-8 glass-panel p-4 rounded-2xl border border-white/10 bg-gradient-to-r from-rose-900/30 via-neutral-900 to-neutral-900 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Chcete vyrazit na další akci?</h3>
          <p className="text-xs text-neutral-400">Objevit nadcházející festivaly a koncerty v Praze</p>
        </div>
        <button
          onClick={() => setActiveTab('discover')}
          className="w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
