import { EventItem, ActivityItem } from './types';

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'pardubice_hokej',
    title: 'HC Dynamo Pardubice vs HC Sparta Praha',
    tag: 'HOKEJ',
    vibe: 'hokej',
    location: 'Enteria Arena, Pardubice',
    date: 'Pá 23. října 2026 · 18:00',
    lineup: 'HC Dynamo Pardubice vs HC Sparta Praha',
    promoter: 'HC Dynamo Pardubice',
    weather: { temp: '19°C', text: 'Hala', icon: 'indoor' },
    videoUrl: '/videos/pardubice_hokej.mp4',
    bgImg: '/images/pardubice_hokej.jpg',
    priceMin: 290,
    priceMax: 990,
    isFree: false,
    badge: 'LIMITED',
    description: 'Šlágr Tipsport Extraligy! Souboj o čelo tabulky v našlapané Enteria Areně.',
    sectors: [
      { name: 'Sektor Stání Fanklub', price: 290, povType: 'dancefloor-back' },
      { name: 'Sektor B Sezení Střed', price: 590, povType: 'mid-stadium' },
      { name: 'VIP Club Lounge Pass', price: 990, povType: 'near-stadium' }
    ]
  },
  {
    id: 'derby',
    title: 'AC Sparta Praha vs SK Slavia Praha – 312. Derby',
    tag: 'FOTBAL',
    vibe: 'fotbal',
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
    badge: 'SOLD OUT',
    description: 'Největší fotbalový svátek v České republice. Tradiční pražské derby v epet ARENĚ na Letné.',
    sectors: [
      { name: 'Sektor C (Galerie)', price: 390, povType: 'far-stadium' },
      { name: 'Sektor B (Střed)', price: 650, povType: 'mid-stadium' },
      { name: 'Sektor A (Hřiště)', price: 1100, povType: 'near-stadium' }
    ]
  },
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
    badge: 'FESTIVAL',
    description: 'Metropolitní hudební festival v srdci Prahy s mezinárodními hvězdami na Výstavišti.',
    sectors: [
      { name: '3-Day Pass General Admission', price: 1890, povType: 'dancefloor-back' },
      { name: 'VIP Platform Lounge', price: 3490, povType: 'dancefloor-front' }
    ]
  },
  {
    id: 'zoo_praha',
    title: 'Zoo Praha – Večerní zážitková prohlídka',
    tag: 'ZOO',
    vibe: 'zoo',
    location: 'Zoo Praha, Troja',
    date: 'Soboty a Neděle · 18:30 – 21:30',
    lineup: 'Průvodce Zoo Praha, Krmení goril a lvic',
    promoter: 'Zoologická zahrada hl. m. Prahy',
    weather: { temp: '21°C', text: 'Příjemný večer', icon: 'clear' },
    videoUrl: '/videos/zoo_praha.mp4',
    bgImg: '/images/zoo_praha.jpg',
    priceMin: 350,
    priceMax: 650,
    isFree: false,
    description: 'Unikátní večerní atmosféra v jedné z nejlepších zoologických zahrad světa s odborným průvodcem.',
    sectors: [
      { name: 'Dospělý večerní okruh', price: 350, povType: 'fountain-far' },
      { name: 'Rodinný zážitkový pas (2+2)', price: 650, povType: 'fountain-near' }
    ]
  },
  {
    id: 'plzen_hokej',
    title: 'HC Škoda Plzeň vs HC Olomouc',
    tag: 'HOKEJ',
    vibe: 'hokej',
    location: 'LOGSPEED CZ Aréna, Plzeň',
    date: 'Ne 1. listopadu 2026 · 16:30',
    lineup: 'HC Škoda Plzeň vs HC Olomouc',
    promoter: 'HC Škoda Plzeň',
    weather: { temp: '18°C', text: 'Hala', icon: 'indoor' },
    videoUrl: '/videos/plzen_hokej.mp4',
    bgImg: '/images/plzen_hokej.jpg',
    priceMin: 250,
    priceMax: 750,
    isFree: false,
    description: 'Plzeňská hokejová vřava! Přijďte zažít nepopsatelnou atmosféru v LOGSPEED CZ Aréně.',
    sectors: [
      { name: 'Sektor Kotevní Stání', price: 250, povType: 'dancefloor-back' },
      { name: 'Sektor C Sezení', price: 490, povType: 'mid-stadium' },
      { name: 'Skybox Guest Pass', price: 750, povType: 'near-stadium' }
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
    badge: 'EARLY BIRD',
    description: 'Největší taneční festival v srdci Evropy v industriálním areálu Dolních Vítkovic.',
    sectors: [
      { name: 'Celofestivalová vstupenka GA', price: 1490, povType: 'dancefloor-back' },
      { name: 'VIP Deck Pass', price: 2990, povType: 'dancefloor-front' }
    ]
  },
  {
    id: 'viktoria_plzen',
    title: 'FC Viktoria Plzeň vs FK Jablonec',
    tag: 'FOTBAL',
    vibe: 'fotbal',
    location: 'Doosan Arena, Plzeň',
    date: 'So 7. listopadu 2026 · 15:00',
    lineup: 'FC Viktoria Plzeň vs FK Jablonec',
    promoter: 'FC Viktoria Plzeň',
    weather: { temp: '15°C', text: 'Polojasno', icon: 'cloudy' },
    videoUrl: '/videos/viktoria_plzen.mp4',
    bgImg: '/images/viktoria_plzen.jpg',
    priceMin: 290,
    priceMax: 850,
    isFree: false,
    description: 'Souboj Chance Ligy v Doosan Areně ve Štruncových sadech.',
    sectors: [
      { name: 'Sektor P Kotel', price: 290, povType: 'dancefloor-back' },
      { name: 'Hlavní Tribuna B', price: 550, povType: 'mid-stadium' },
      { name: 'VIP Gold Club', price: 850, povType: 'near-stadium' }
    ]
  },
  {
    id: 'zeme_zivitelka',
    title: 'Země živitelka 2026 – 52. Ročník',
    tag: 'VÝSTAVIŠTĚ',
    vibe: 'vystaviste',
    location: 'Výstaviště České Budějovice',
    date: 'Čt 27. srpna – Út 1. září 2026',
    lineup: 'Největší agrosalon v ČR, Gastrofesty & Technika',
    promoter: 'Výstaviště České Budějovice a.s.',
    weather: { temp: '25°C', text: 'Slunečno', icon: 'clear' },
    videoUrl: '/videos/zeme_zivitelka.mp4',
    bgImg: '/images/zeme_zivitelka.jpg',
    priceMin: 180,
    priceMax: 450,
    isFree: false,
    description: 'Jediný agrosalon v ČR s tradicí přes půl století na výstavišti v Českých Budějovicích.',
    sectors: [
      { name: 'Jednodenní Vstupenka Standard', price: 180, povType: 'fountain-far' },
      { name: 'Rodinné Vstupné (2+2)', price: 450, povType: 'fountain-near' }
    ]
  },
  {
    id: 'safari_park',
    title: 'Safari Park Dvůr Králové – Večerní Africké Safari',
    tag: 'ZOO',
    vibe: 'zoo',
    location: 'Safari Park Dvůr Králové nad Labem',
    date: 'Každý den v sezóně · 20:00',
    lineup: 'Jízda Safaribusem mezi divokými zvířaty',
    promoter: 'Safari Park Dvůr Králové',
    weather: { temp: '22°C', text: 'Jasno', icon: 'clear' },
    videoUrl: '/videos/safari_park.mp4',
    bgImg: '/images/safari_park.jpg',
    priceMin: 280,
    priceMax: 580,
    isFree: false,
    description: 'Zažijte atmosféru afrického soumraku a pozorujte nosorožce, lvy a žirafy z bezprostřední blízkosti.',
    sectors: [
      { name: 'Večerní Safaribus Vstup', price: 280, povType: 'fountain-far' },
      { name: 'VIP Terasa Afrika', price: 580, povType: 'fountain-near' }
    ]
  },
  {
    id: 'tatran_florbal',
    title: 'Superfinále Florbalu 2026 – Tatran Střešovice',
    tag: 'FLORBAL',
    vibe: 'florbal',
    location: 'UNYP Arena, Praha 9',
    date: 'So 18. dubna 2026 · 17:00',
    lineup: 'Tatran Střešovice vs Předvýběr.CZ Florbal MB',
    promoter: 'Český Florbal',
    weather: { temp: '19°C', text: 'Hala', icon: 'indoor' },
    videoUrl: '/videos/tatran_florbal.mp4',
    bgImg: '/images/tatran_florbal.jpg',
    priceMin: 220,
    priceMax: 550,
    isFree: false,
    description: 'Florbalový zápas roku! Zápas o titul mistra České republiky v UNYP Areně.',
    sectors: [
      { name: 'Sektor Stání Fanzóna', price: 220, povType: 'dancefloor-back' },
      { name: 'Sezení Palubovka VIP', price: 550, povType: 'dancefloor-front' }
    ]
  },
  {
    id: 'flora_olomouc',
    title: 'Flora Olomouc 2026 – Jarní etapová výstava',
    tag: 'VÝSTAVIŠTĚ',
    vibe: 'vystaviste',
    location: 'Výstaviště Flora Olomouc, Smetanovy sady',
    date: 'Čt 23. – Ne 26. dubna 2026',
    lineup: 'Květinové expozice, Zahradnické trhy & Show',
    promoter: 'Výstaviště Flora Olomouc a.s.',
    weather: { temp: '18°C', text: 'Slunečno', icon: 'clear' },
    videoUrl: '/videos/flora_olomouc.mp4',
    bgImg: '/images/flora_olomouc.jpg',
    priceMin: 160,
    priceMax: 380,
    isFree: false,
    description: 'Nejkrásnější svátek květin v Smetanových sadech s desítkami tisíc návštěvníků.',
    sectors: [
      { name: 'Standardní Vstupenka', price: 160, povType: 'fountain-far' },
      { name: 'Rodinná Vstupenka', price: 380, povType: 'fountain-near' }
    ]
  },
  {
    id: 'oktagon_mma',
    title: 'OKTAGON MMA – Fight Night Prague',
    tag: 'MMA',
    vibe: 'sport',
    location: 'O2 arena, Praha 9',
    date: 'So 19. prosince 2026 · 18:00',
    lineup: 'Titulový zápas & 10 elitních duelů',
    promoter: 'OKTAGON MMA',
    weather: { temp: '20°C', text: 'Hala', icon: 'indoor' },
    videoUrl: '/videos/oktagon_mma.mp4',
    bgImg: '/images/oktagon_mma.jpg',
    priceMin: 690,
    priceMax: 4990,
    isFree: false,
    badge: 'VIP',
    description: 'Špičkový turnaj MMA v pražské O2 areně. Světové hvězdy, nekompromisní duely a neopakovatelná show.',
    sectors: [
      { name: 'Horní Patro Sezení', price: 690, povType: 'far-stadium' },
      { name: 'Dolní Patro Octagon Side', price: 1990, povType: 'mid-stadium' },
      { name: 'VIP Octagon Floor Table', price: 4990, povType: 'near-stadium' }
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
  },
  {
    id: 'standup_comedy',
    title: 'Underground Comedy Night Prague',
    tag: 'STAND-UP',
    vibe: 'standup',
    location: 'Rock Café, Praha 1',
    date: 'Pá 20. listopadu 2026 · 20:00',
    lineup: 'Tigran Hovakimyan, Jan Geryk & Hosté',
    promoter: 'Underground Comedy CZ',
    weather: { temp: '20°C', text: 'Klub', icon: 'indoor' },
    videoUrl: '/videos/standup_comedy.mp4',
    bgImg: '/images/standup_comedy.jpg',
    priceMin: 320,
    priceMax: 490,
    isFree: false,
    sectors: [
      { name: 'Stání v sále', price: 320, povType: 'dancefloor-back' },
      { name: 'VIP Sezení u stolu', price: 490, povType: 'dancefloor-front' }
    ]
  },
  {
    id: 'ecommerce_summit',
    title: 'Czech E-Commerce & Retail Summit 2026',
    tag: 'KONFERENCE',
    vibe: 'konference',
    location: 'Cubex Centrum Praha, Praha 4',
    date: 'Út 10. listopadu 2026 · 09:00',
    lineup: 'Keynotes, Networking & Enigoo Tech Showcase',
    promoter: 'Czech Event Masters',
    weather: { temp: '21°C', text: 'Sál', icon: 'indoor' },
    videoUrl: '/videos/ecommerce_summit.mp4',
    bgImg: '/images/ecommerce_summit.jpg',
    priceMin: 1990,
    priceMax: 4990,
    isFree: false,
    description: 'Prestižní konference o budoucnosti e-commerce, ticketingu a věrnostních programů v Česku.',
    sectors: [
      { name: 'Standard Conference Pass', price: 1990, povType: 'mid-stadium' },
      { name: 'VIP Executive Lounge & Dinner', price: 4990, povType: 'near-stadium' }
    ]
  },
  {
    id: 'barum_rally',
    title: 'Barum Czech Rally Zlín 2026',
    tag: 'MOTORSPORT',
    vibe: 'sport',
    location: 'Městská RZ Zlín & Vysočina',
    date: 'Pá 21. – Ne 23. srpna 2026',
    lineup: 'FIA European Rally Championship (ERC)',
    promoter: 'Auto Klub Barum Zlín',
    weather: { temp: '23°C', text: 'Slunečno', icon: 'clear' },
    videoUrl: '/videos/barum_rally.mp4',
    bgImg: '/images/barum_rally.jpg',
    priceMin: 350,
    priceMax: 1200,
    isFree: false,
    description: 'Legenda automobilových soutěží! Městská rychlostní zkouška v ulicích nočního Zlína.',
    sectors: [
      { name: 'Celostátní Divácká Vstupenka', price: 350, povType: 'far-stadium' },
      { name: 'VIP RZ Zlín Servisní Zóna', price: 1200, povType: 'near-stadium' }
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
    title: 'HC Dynamo Pardubice – Permanentkářský bonus',
    dateStr: 'Úterý 12.2.',
    amount: 300,
    isPositive: true
  },
  {
    id: 'act-3',
    title: 'Nákup lístku – HC Dynamo Pardubice vs Sparta',
    dateStr: 'Včera, 18:45',
    amount: 590,
    isPositive: false
  }
];
