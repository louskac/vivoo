import { EventItem, ActivityItem } from './types';

export const mockEvents: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Metronome Festival Prague 2026',
    location: 'Výstaviště Praha, Praha 7',
    date: 'Čt 18. – So 20. června 2026',
    priceMin: 1890,
    bgImg: '/images/summerbeats.jpg',
    videoUrl: '/videos/metronome_festival.mp4',
    tag: 'FESTIVAL',
    vibe: 'festivaly',
    lineup: 'Raye, Milky Chance, Michael Kiwanuka',
    promoter: 'Metronome Production',
    description: 'Největší pražský hudební festival přímo v srdci parkového areálu Výstaviště Holešovice. Tři dny plné mezinárodních hvězd, špičkového zvuku a letní atmosféry s jídlem z nejlepších bistra.',
    badge: 'FESTIVAL'
  },
  {
    id: 'ev-2',
    title: 'Koncert pod živými hvězdami',
    location: 'Riegrovy sady, Praha 3',
    date: 'Ne 18. října 2026 · 15:00',
    priceMin: 400,
    bgImg: '/images/techno.jpg',
    videoUrl: '/videos/xindl_live.mp4',
    tag: 'HUDBA',
    vibe: 'koncerty',
    lineup: 'Xindl X, Pokáč',
    promoter: 'BrainZone Live',
    description: 'Zažijte jedinečnou atmosféru letního večera na open-air Koncertu pod živými hvězdami, kde pod širým nebem vystoupí oblíbený písničkář Xindl X a speciální host Pokáč.',
    badge: 'HUDBA'
  },
  {
    id: 'ev-3',
    title: 'AC Sparta Praha vs SK Slavia Praha',
    location: 'epet ARENA, Praha 7',
    date: 'So 12. října 2026 · 18:00',
    priceMin: 390,
    bgImg: '/images/derby.jpg',
    videoUrl: '/videos/prague_derby.mp4',
    tag: 'SPORT',
    vibe: 'sport',
    lineup: '312. Pražské Derby · Chance Liga',
    promoter: 'AC Sparta Praha',
    description: 'Tradiční a nejemotivnější fotbalové střetnutí v České republice. 312. vydání pražského derby mezi AC Sparta Praha a SK Slavia Praha v bojích o čelo tabulky.',
    badge: 'LIMITED'
  },
  {
    id: 'ev-4',
    title: 'Beats for Love 2026',
    location: 'Dolní Vítkovice, Ostrava',
    date: 'St 1. – So 4. července 2026',
    priceMin: 1490,
    bgImg: '/images/flora.jpg',
    videoUrl: '/videos/beats_for_love.mp4',
    tag: 'FESTIVAL',
    vibe: 'party',
    lineup: 'Armin van Buuren, Lost Frequencies, Sub Focus',
    promoter: 'Beats for Love s.r.o.',
    description: 'Největší taneční festival v srdci Evropy v unikátním industriálním prostředí Dolních Vítkovic. Více než 400 DJů na 15 žánrových pódiích.',
    badge: 'EARLY BIRD'
  },
  {
    id: 'ev-5',
    title: 'Labutí jezero – Balet ND',
    location: 'Národní divadlo, Praha 1',
    date: 'Pá 27. listopadu 2026 · 19:00',
    priceMin: 790,
    bgImg: '/images/ballet.jpg',
    videoUrl: '/videos/labuti_jezero.mp4',
    tag: 'DIVADLO',
    vibe: 'divadlo',
    lineup: 'Orchestr & Balet Národního divadla',
    promoter: 'Národní divadlo Praha',
    description: 'Kanonické dílo světového baletního repertoáru na scéně historické budovy Národního divadla. Slavná hudba P. I. Čajkovského v podání orchestru ND.',
    badge: 'VIP'
  },
  {
    id: 'ev-6',
    title: 'NBL All-Star Game 2026',
    location: 'UNYP Arena, Praha 9',
    date: 'Ne 14. února 2027 · 17:00',
    priceMin: 290,
    bgImg: '/images/basketball.jpg',
    videoUrl: '/videos/allstar_game.mp4',
    tag: 'SPORT',
    vibe: 'sport',
    lineup: 'Slam Dunk Contest & 3pt Shooting Show',
    promoter: 'Česká basketbalová federace',
    description: 'Basketbalová show roku! Nejlepší hráči Kooperativa NBL v nekompromisním souboji Východ vs. Západ, doprovázeni soutěží ve smečování a střelbě trojek.',
    badge: 'HUDBA'
  }
];

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
