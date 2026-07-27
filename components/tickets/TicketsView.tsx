'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/Badge';
import { TicketDetailSpec } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

export const TicketsView: React.FC = () => {
  const setSelectedTicket = useAppStore((state) => state.setSelectedTicket);
  const { tickets: dbTickets } = useUser();

  const userTicketsFormatted: TicketDetailSpec[] = dbTickets.map((t) => ({
    id: t.id,
    title: t.eventTitle,
    date: t.date,
    location: t.location,
    seatDetail: `${t.sectorName || 'Standard'} · ${t.quantity}x (Sedadlo 24)`,
    bgImg: t.bgImg,
    qrCode: t.qrCode
  }));

  // Map dynamic purchased tickets + default tickets
  const upcomingTickets: TicketDetailSpec[] = [
    {
      id: 'tkt-hero-1',
      title: 'Koncert pod živými hvězdami',
      date: 'Ne 18. 10. · 20:00 · Riegrovy sady',
      location: 'Riegrovy sady, Praha 3',
      seatDetail: 'Řada 12, Sedadlo 1',
      bgImg: '/images/xindl_live.jpg',
      badge: 'DNES',
      qrCode: 'VIVOO-HVEZDY-881920'
    },
    ...userTicketsFormatted,
    {
      id: 'tkt-sparta-1',
      title: 'Sparta x Slavia',
      date: 'Pá 20. 10. · 18:00 · Epet Aréna',
      location: 'epet ARENA, Praha 7',
      seatDetail: 'Sektor B · Řada 11 · Sedadlo 122',
      bgImg: '/images/prague_derby.jpg',
      qrCode: 'VIVOO-DERBY-312004'
    },
    {
      id: 'tkt-sparta-2',
      title: 'Sparta x Slavia',
      date: 'Pá 20. 10. · 18:00 · Epet Aréna',
      location: 'epet ARENA, Praha 7',
      seatDetail: 'Sektor B · Řada 11 · Sedadlo 123',
      bgImg: '/images/prague_derby.jpg',
      qrCode: 'VIVOO-DERBY-312005'
    }
  ];

  const pastTickets: TicketDetailSpec[] = [
    {
      id: 'tkt-past-1',
      title: 'Sparta x Slavia',
      date: 'Pá 20. 10. · 18:00 · Epet Aréna',
      location: 'epet ARENA, Praha 7',
      seatDetail: 'Sektor B · Řada 10 · Sedadlo 98',
      bgImg: '/images/prague_derby.jpg',
      qrCode: 'VIVOO-PAST-1092',
      isPast: true
    }
  ];

  const heroTicket = upcomingTickets[0];
  const listUpcoming = upcomingTickets.slice(1);

  return (
    <div className="flex flex-col min-h-screen pb-32 pt-8 px-5 max-w-md mx-auto animate-fade-in text-white">
      {/* Figma Header Title */}
      <h1 className="text-4xl font-black tracking-tight text-white mb-6">Vstupenky</h1>

      {/* 1. Featured Hero Ticket Card (matching Figma spec point 1) */}
      {heroTicket && (
        <div
          onClick={() => setSelectedTicket(heroTicket)}
          className="relative w-full h-[240px] rounded-3xl overflow-hidden mb-8 cursor-pointer group shadow-2xl border border-white/10"
        >
          <img
            src={heroTicket.bgImg}
            alt={heroTicket.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Dark scrim gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          {/* Badge DNES */}
          {heroTicket.badge && (
            <div className="absolute top-4 left-4">
              <Badge text={heroTicket.badge} variant="red" />
            </div>
          )}

          {/* Bottom Card Info */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col items-start gap-1">
            <h2 className="text-xl font-extrabold text-white leading-tight drop-shadow">
              {heroTicket.title}
            </h2>
            <p className="text-xs text-neutral-300 font-medium">
              {heroTicket.date}
            </p>
            <p className="text-xs text-neutral-400 font-medium">
              {heroTicket.seatDetail}
            </p>
          </div>
        </div>
      )}

      {/* 2. Nadcházející Section */}
      <div className="flex flex-col gap-3 mb-8">
        <h3 className="text-xl font-bold text-white mb-1">Nadcházející</h3>

        <div className="flex flex-col divide-y divide-white/10">
          {listUpcoming.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="py-3.5 flex items-center justify-between gap-4 cursor-pointer group hover:opacity-80 transition-opacity"
            >
              {/* Square Thumbnail */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 shrink-0 border border-white/10">
                <img
                  src={ticket.bgImg}
                  alt={ticket.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Middle Ticket Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-extrabold text-white truncate">{ticket.title}</h4>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{ticket.date}</p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{ticket.seatDetail}</p>
              </div>

              {/* Right Chevron Arrow */}
              <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Proběhlé Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-white mb-1">Proběhlé</h3>

        <div className="flex flex-col divide-y divide-white/10">
          {pastTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="py-3.5 flex items-center justify-between gap-4 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 shrink-0 border border-white/10">
                <img
                  src={ticket.bgImg}
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-extrabold text-white truncate">{ticket.title}</h4>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{ticket.date}</p>
              </div>

              <ChevronRight className="w-5 h-5 text-neutral-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
