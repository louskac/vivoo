import { EventItem, ActivityItem } from './types';

export const mockEvents: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Koncert pod živými hvězdami',
    location: 'Riegrovy sady, Praha 3',
    date: 'Ne 18. října · 15:00',
    priceMin: 400,
    bgImg: '/images/techno.jpg',
    videoUrl: '/videos/derby.mp4',
    tag: 'HUDBA',
    vibe: 'party',
    lineup: 'Xindl X, Pokáč',
    badge: 'HUDBA'
  },
  {
    id: 'ev-2',
    title: 'Coachella 2025',
    location: 'Indio, California',
    date: 'Pá 24. dubna · 18:00',
    priceMin: 499,
    bgImg: '/images/summerbeats.jpg',
    videoUrl: '/videos/derby.mp4',
    tag: 'FESTIVAL',
    vibe: 'party',
    lineup: 'Travis Scott, Lana Del Rey',
    badge: 'SOLD OUT'
  },
  {
    id: 'ev-3',
    title: 'Tomorrowland',
    location: 'Boom, Belgium',
    date: 'So 19. července · 16:00',
    priceMin: 299,
    bgImg: '/images/derby.jpg',
    videoUrl: '/videos/derby.mp4',
    tag: 'HUDBA',
    vibe: 'party',
    lineup: 'Martin Garrix, David Guetta',
    badge: 'VIP'
  },
  {
    id: 'ev-4',
    title: 'Lollapalooza',
    location: 'Grant Park, Chicago',
    date: 'Čt 1. srpna · 14:00',
    priceMin: 450,
    bgImg: '/images/ballet.jpg',
    videoUrl: '/videos/derby.mp4',
    tag: 'HUDBA',
    vibe: 'party',
    lineup: 'SZA, Blink-182',
    badge: 'EARLY BIRD'
  },
  {
    id: 'ev-5',
    title: 'Rolling Loud',
    location: 'Miami, Florida',
    date: 'Pá 13. prosince · 17:00',
    priceMin: 199,
    bgImg: '/images/flora.jpg',
    videoUrl: '/videos/derby.mp4',
    tag: 'FESTIVAL',
    vibe: 'adrenalin',
    lineup: 'Playboi Carti, Future',
    badge: 'LIMITED'
  },
  {
    id: 'ev-6',
    title: 'Glastonbury',
    location: 'Pilton, Somerset',
    date: 'St 25. června · 12:00',
    priceMin: 350,
    bgImg: '/images/fun.jpg',
    videoUrl: '/videos/derby.mp4',
    tag: 'FESTIVAL',
    vibe: 'klid',
    lineup: 'Coldplay, Dua Lipa',
    badge: 'FESTIVAL'
  }
];

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Vrácení vstupenky',
    dateStr: 'Dnes, 14:12',
    amount: 100,
    isPositive: true
  },
  {
    id: 'act-2',
    title: 'Video z akce',
    dateStr: 'Úterý 12.2.',
    amount: 300,
    isPositive: true
  }
];
