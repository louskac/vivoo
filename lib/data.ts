import { EventItem, ActivityItem } from './types';

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'metronome_festival',
    title: 'Metronome Festival Prague 2026',
    tag: 'FESTIVAL',
    vibe: 'festivaly',
    location: 'Výstaviště Praha, Praha 7',
    date: 'Čt 18. – So 20. června 2026',
    lineup: 'Raye, Milky Chance, Michael Kiwanuka',
    promoter: 'Metronome Production',
    weather: { temp: '24°C', text: 'Letní slunečno', icon: 'clear' },
    videoUrl: '/videos/metronome_festival.mp4',
    bgImg: '/images/metronome_festival.jpg',
    priceMin: 1890,
    priceMax: 3490,
    isFree: false,
    sectors: [
      { name: '3-Day Pass General Admission', price: 1890, povType: 'dancefloor-back' },
      { name: 'VIP Platform Lounge', price: 3490, povType: 'dancefloor-front' }
    ]
  },
  {
    id: 'concert_hvezdy',
    title: 'Xindl X – Koncert pod živými hvězdami',
    tag: 'HUDBA',
    vibe: 'koncerty',
    location: 'Riegrovy sady, Praha 3',
    date: 'Ne 18. října 2026 · 15:00',
    lineup: 'Xindl X, Pokáč',
    promoter: 'BrainZone Live',
    weather: { temp: '18°C', text: 'Jasná obloha', icon: 'clear' },
    videoUrl: '/videos/xindl_live.mp4',
    bgImg: '/images/xindl_live.jpg',
    priceMin: 400,
    priceMax: 1200,
    isFree: false,
    sectors: [
      { name: 'Sektor A (Stání u pódia)', price: 400, povType: 'dancefloor-front' },
      { name: 'VIP Sezení Terasa', price: 1200, povType: 'backstage' }
    ]
  },
  {
    id: 'derby',
    title: 'AC Sparta Praha vs SK Slavia Praha – 312. Derby',
    tag: 'SPORT',
    vibe: 'sport',
    location: 'epet ARENA, Praha 7',
    date: 'So 12. října 2026 · 18:00',
    lineup: 'AC Sparta Praha vs SK Slavia Praha',
    promoter: 'AC Sparta Praha',
    weather: { temp: '16°C', text: 'Jasno', icon: 'clear' },
    videoUrl: '/videos/prague_derby.mp4',
    bgImg: '/images/prague_derby.jpg',
    priceMin: 390,
    priceMax: 1100,
    isFree: false,
    sectors: [
      { name: 'Sektor C (Galerie)', price: 390, povType: 'far-stadium' },
      { name: 'Sektor B (Střed)', price: 650, povType: 'mid-stadium' },
      { name: 'Sektor A (Hřiště)', price: 1100, povType: 'near-stadium' }
    ]
  },
  {
    id: 'beats_for_love',
    title: 'Beats for Love 2026',
    tag: 'FESTIVAL',
    vibe: 'party',
    location: 'Dolní Vítkovice, Ostrava',
    date: 'St 1. – So 4. července 2026',
    lineup: 'Armin van Buuren, Lost Frequencies, Sub Focus',
    promoter: 'Beats for Love s.r.o.',
    weather: { temp: '26°C', text: 'Jasno', icon: 'clear' },
    videoUrl: '/videos/beats_for_love.mp4',
    bgImg: '/images/beats_for_love.jpg',
    priceMin: 1490,
    priceMax: 2990,
    isFree: false,
    sectors: [
      { name: 'Celofestivalová vstupenka GA', price: 1490, povType: 'dancefloor-back' },
      { name: 'VIP Deck Pass', price: 2990, povType: 'dancefloor-front' }
    ]
  },
  {
    id: 'ballet',
    title: 'Labutí jezero – Balet ND',
    tag: 'DIVADLO',
    vibe: 'divadlo',
    location: 'Národní divadlo, Praha 1',
    date: 'Pá 27. listopadu 2026 · 19:00',
    lineup: 'Orchestr & Balet Národního divadla',
    promoter: 'Národní divadlo Praha',
    weather: { temp: '14°C', text: 'Chladno', icon: 'indoor' },
    videoUrl: '/videos/labuti_jezero.mp4',
    bgImg: '/images/labuti_jezero.jpg',
    priceMin: 790,
    priceMax: 1850,
    isFree: false,
    sectors: [
      { name: 'Balkón 2. pořadí', price: 790, povType: 'fountain-far' },
      { name: 'Přízemí Lóže', price: 1850, povType: 'fountain-near' }
    ]
  },
  {
    id: 'basketball',
    title: 'NBL All-Star Game 2026',
    tag: 'SPORT',
    vibe: 'sport',
    location: 'UNYP Arena, Praha 9',
    date: 'Ne 14. února 2027 · 17:00',
    lineup: 'Slam Dunk Contest & 3pt Shooting Show',
    promoter: 'Česká basketbalová federace',
    weather: { temp: '19°C', text: 'Hala', icon: 'indoor' },
    videoUrl: '/videos/allstar_game.mp4',
    bgImg: '/images/allstar_game.jpg',
    priceMin: 290,
    priceMax: 690,
    isFree: false,
    sectors: [
      { name: 'Stání Fanzóna', price: 290, povType: 'dancefloor-back' },
      { name: 'Sezení Palubovka', price: 690, povType: 'dancefloor-front' }
    ]
  }
];

export const mockEvents = MOCK_EVENTS;

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Nákup vstupenky – Metronome Festival',
    dateStr: 'Dnes, 14:12',
    amount: 1890,
    isPositive: false
  },
  {
    id: 'act-2',
    title: 'Odvyplácení bonusu od pořadatele BrainZone',
    dateStr: 'Úterý 12.2.',
    amount: 300,
    isPositive: true
  }
];
