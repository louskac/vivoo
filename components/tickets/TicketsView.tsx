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

  const defaultUpcomingTickets: TicketDetailSpec[] = [
    {
      id: 'tkt-hero-1',
      title: 'Koncert pod živými hvězdami',
      date: 'Ne 15. 10. · 20:00 · Riegrovy sady',
      location: 'Riegrovy sady, Praha 3',
      seatDetail: 'Řada 12, Sedadlo 1',
      bgImg: '/images/xindl_live.jpg',
      badge: 'DNES',
      qrCode: 'VIVOO-HVEZDY-881920',
      eventId: 'concert_hvezdy',
      ticketCount: 1,
      categoryTag: 'HUDBA'
    },
    {
      id: 'tkt-sparta-1',
      title: 'Sparta x Slavia',
      date: 'Pá 20. 10. · 18:00 · Epet Aréna',
      location: 'epet ARENA, Praha 7',
      seatDetail: 'Severní tribuna A3 · Ř.9 · 11–14',
      bgImg: '/images/prague_derby.jpg',
      qrCode: 'VV0-2026-145344',
      eventId: 'derby',
      ticketCount: 4,
      groupSeats: 'Severní tribuna A3 · Ř.9 · 11–14',
      categoryTag: 'SPORT'
    },
    {
      id: 'tkt-hradec-pardubice',
      eventId: 'hradec_pardubice',
      title: 'FC Hradec Králové vs FK Pardubice',
      date: 'Pá 26. 7. · 18:00 · Malšovická Aréna',
      location: 'Malšovická Aréna, Hradec Králové',
      seatDetail: 'Sektor G · Řada 5 · Sedadlo 14',
      bgImg: '/images/derby.jpg',
      badge: 'ŽIVĚ V ARÉNĚ',
      qrCode: 'VIVOO-DERBY-FCHK-PCE',
      isTodayLive: true,
      ticketCount: 1,
      categoryTag: 'SPORT'
    }
  ];

  const upcomingTickets: TicketDetailSpec[] = [
    ...defaultUpcomingTickets,
    ...userTicketsFormatted
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
    <div className="flex flex-col min-h-screen pb-40 pt-8 px-5 max-w-md mx-auto animate-fade-in text-white select-none">
      {/* Figma Header Title */}
      <h1 className="text-4xl font-black tracking-tight text-white mb-6">Vstupenky</h1>

      {/* 1. Featured Hero Ticket Card (100% Figma Parity) */}
      {heroTicket && (
        <div
          onClick={() => setSelectedTicket(heroTicket)}
          className="relative w-full h-[250px] rounded-3xl overflow-hidden mb-8 cursor-pointer group shadow-2xl border border-white/10"
        >
          <img
            src={heroTicket.bgImg}
            alt={heroTicket.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/xindl_live.jpg';
            }}
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

          {/* Bottom Card Info - Clean Figma Typography */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-col items-start gap-1">
            <h2 className="text-2xl font-extrabold text-white leading-tight drop-shadow truncate w-full">
              {heroTicket.title}
            </h2>
            <p className="text-xs text-neutral-300 font-medium mt-0.5">
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
