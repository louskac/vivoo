import { EventItem, ActivityItem } from './types';

export const MOCK_EVENTS: EventItem[] = [

  {
    id: 'hradec_pardubice',
    title: 'FC Hradec Králové vs FK Pardubice – Východočeské Derby',
    tag: 'FOTBAL',
    vibe: 'fotbal',
    location: 'Malšovická Aréna, Hradec Králové',
    date: 'Ne 26. července 2026 · 17:00',
    lineup: 'FC Hradec Králové vs FK Pardubice',
    promoter: 'FC Hradec Králové',
    weather: { temp: '22°C', text: 'Jasno', icon: 'clear' },
    videoUrl: '/videos/prague_derby.mp4',
    bgImg: '/images/prague_derby.jpg',
    priceMin: 250,
    priceMax: 750,
    isFree: false,
    badge: 'SOLD OUT',
    description: 'Východočeské derby 1. kola Chance Ligy! Souboj v vyprodané Malšovické Aréně.',
    sectors: [
      { name: 'Sektor G Fanklub', price: 250, povType: 'dancefloor-back' },
      { name: 'Sektor B Hlavní Tribuna', price: 450, povType: 'mid-stadium' },
      { name: 'VIP Malšovická Lounge', price: 750, povType: 'near-stadium' }
    ],
    liveConfig: {
      enabled: true,
      eventCategoryType: 'sports',
      activeModules: ['timeline', 'crowd_pulse', 'express_bar', 'venue_map'],
      statusHeader: 'Konec Utkání • (FCHK 2 : 1 PCE)',
      statusBadge: 'KONEČNÝ VÝSLEDEK',
      timeline: [
        { id: 'hp-1', time: '17:00', title: 'Zahájení Východočeského derby', status: 'past' },
        { id: 'hp-2', time: '17:44', title: 'GÓL! Mick van Buren (1:0)', subtitle: 'Vedení Hradce těsně před přestávkou', status: 'past', badge: 'GÓL' },
        { id: 'hp-3', time: '17:56', title: 'GÓL! František Čech (2:0)', subtitle: 'Asistence: D. Horák', status: 'past', badge: 'GÓL' },
        { id: 'hp-4', time: '18:00', title: 'GÓL! Tobias Boledovič (2:1)', subtitle: 'Pardubické snížení • Asistence: K. Trédl', status: 'past', badge: 'GÓL' },
        { id: 'hp-5', time: '18:50', title: 'Konec Zápasu • Vítězství Hradce Králové 2:1!', status: 'live', badge: 'KONEČNÝ VÝSLEDEK' }
      ],
      polls: [
        {
          id: 'poll-derby-mvp',
          question: 'Hlasování: Kdo byl Hráčem Utkání (MVP) Derby?',
          totalVotes: 2380,
          isActive: true,
          options: [
            { id: 'opt-buren', label: 'Mick van Buren (Hradec • Gól)', votes: 1420 },
            { id: 'opt-cech', label: 'František Čech (Hradec • Gól)', votes: 680 },
            { id: 'opt-boledovic', label: 'Tobias Boledovič (Pardubice • Gól)', votes: 280 }
          ]
        }
      ],
      pois: [
        { id: 'poi-hp1', name: 'NFC Malšovický Bar', category: 'bar', locationDetail: 'Tribuna B • Přízemí', queueLevel: 'low', waitTimeMinutes: 2 },
        { id: 'poi-hp2', name: 'WC Sektor Sever', category: 'wc', locationDetail: 'Chodba 2', queueLevel: 'med', waitTimeMinutes: 4 },
        { id: 'poi-hp3', name: 'FanShop Východní Čechy', category: 'merch', locationDetail: 'Hlavní Brána', queueLevel: 'high', waitTimeMinutes: 10 }
      ],
      expressMenu: [
        { id: 'hex-1', name: 'Radegast 12° 0.5L', category: 'pivo', price: 65, volumeOrSize: '0.5l', icon: 'beer' },
        { id: 'hex-2', name: 'Kofola Čepovaná 0.5L', category: 'nealko', price: 50, volumeOrSize: '0.5l', icon: 'cup' },
        { id: 'hex-3', name: 'Grilovaná Klobása Hradec', category: 'snack', price: 110, volumeOrSize: '200g', icon: 'food' },
        { id: 'hex-4', name: 'Šála Východočeské Derby', category: 'merch', price: 350, volumeOrSize: '1ks', icon: 'shirt' }
      ],
      lightshowPresets: [
        { id: 'ls-hradec', name: 'Černo-bílé Oslavy', colors: ['#FFFFFF', '#000000', '#DC2626'] }
      ],
      matchMomentum: {
        homeScore: 2,
        awayScore: 1,
        homeTeamName: 'FC Hradec Králové',
        awayTeamName: 'FK Pardubice',
        homeTeamLogo: 'https://images.fotmob.com/image_resources/logo/teamlogo/1712.png',
        awayTeamLogo: 'https://images.fotmob.com/image_resources/logo/teamlogo/2406.png',
        homePossessionPct: 54,
        awayPossessionPct: 46,
        homeShotsOnTarget: 7,
        awayShotsOnTarget: 4,
        homeDangerousAttacks: 42,
        awayDangerousAttacks: 31,
        momentumGraph: [35, 60, -25, 45, 80, -40, 85, -20, 30, 65, -55, 75, 40, -15, 60, 90, -30, 20]
      },
      homeLineup: [
        { id: 'hp-p1', name: 'Adam Zadražil', lastName: 'Zadražil', number: 12, position: 'GK', rating: 7.1, xPct: 50, yPct: 9, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1398355.png' },
        { id: 'hp-p2', name: 'Karel Uhrinčať', lastName: 'Uhrinčať', number: 7, position: 'DEF', rating: 7.3, xPct: 20, yPct: 20, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1382975.png' },
        { id: 'hp-p3', name: 'Filip Čihák', lastName: 'Čihák', number: 5, position: 'DEF', rating: 7.2, xPct: 50, yPct: 20, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/941552.png' },
        { id: 'hp-p4', name: 'František Čech', lastName: 'Čech', number: 25, position: 'DEF', rating: 7.9, goals: 1, xPct: 80, yPct: 20, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/846315.png' },
        { id: 'hp-p5', name: 'Tomáš Wiesner', lastName: 'Wiesner', number: 21, position: 'MID', rating: 5.9, yellowCards: 1, xPct: 14, yPct: 32, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/865046.png' },
        { id: 'hp-p6', name: 'Vladimír Darida', lastName: 'Darida', number: 16, position: 'MID', rating: 6.9, xPct: 38, yPct: 32, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/196311.png' },
        { id: 'hp-p7', name: 'Samuel Dancák', lastName: 'Dancák', number: 11, position: 'MID', rating: 6.6, yellowCards: 1, xPct: 62, yPct: 32, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/933789.png' },
        { id: 'hp-p8', name: 'Daniel Horák', lastName: 'Horák', number: 26, position: 'MID', rating: 7.5, assists: 1, xPct: 86, yPct: 32, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1132554.png' },
        { id: 'hp-p9', name: 'Mick van Buren', lastName: 'van Buren', number: 10, position: 'FWD', rating: 7.8, goals: 1, isCaptain: true, xPct: 28, yPct: 43, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/279110.png' },
        { id: 'hp-p10', name: 'Tom Slončík', lastName: 'Slončík', number: 19, position: 'FWD', rating: 6.7, xPct: 72, yPct: 43, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1435935.png' },
        { id: 'hp-p11', name: 'Ondřej Mihálik', lastName: 'Mihálik', number: 17, position: 'FWD', rating: 6.5, xPct: 50, yPct: 48, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/591775.png' }
      ],
      awayLineup: [
        { id: 'ap-p1', name: 'Vojtěch Patrák', lastName: 'Patrák', number: 10, position: 'MID', rating: 6.4, yellowCards: 1, xPct: 50, yPct: 56, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1163500.png' },
        { id: 'ap-p2', name: 'Václav Drchal', lastName: 'Drchal', number: 17, position: 'FWD', rating: 6.0, xPct: 28, yPct: 65, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/924667.png' },
        { id: 'ap-p3', name: 'Abdullahi Tanko', lastName: 'Tanko', number: 20, position: 'FWD', rating: 5.7, xPct: 72, yPct: 65, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1079839.png' },
        { id: 'ap-p4', name: 'Tobias Boledovič', lastName: 'Boledovič', number: 40, position: 'MID', rating: 7.1, goals: 1, xPct: 14, yPct: 75, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1791353.png' },
        { id: 'ap-p5', name: 'Samuel Šimek', lastName: 'Šimek', number: 8, position: 'MID', rating: 6.4, yellowCards: 1, xPct: 38, yPct: 75, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1180771.png' },
        { id: 'ap-p6', name: 'Michal Hlavatý', lastName: 'Hlavatý', number: 19, position: 'MID', rating: 6.5, isCaptain: true, xPct: 62, yPct: 75, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/740676.png' },
        { id: 'ap-p7', name: 'Nosa Godwin', lastName: 'Godwin', number: 15, position: 'MID', rating: 6.4, xPct: 86, yPct: 75, avatarUrl: '/api/player-avatar?name=Nosa+Godwin' },
        { id: 'ap-p8', name: 'Karel Trédl', lastName: 'Trédl', number: 2, position: 'DEF', rating: 6.8, assists: 1, xPct: 20, yPct: 85, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1354447.png' },
        { id: 'ap-p9', name: 'Jason Noslin', lastName: 'Noslin', number: 4, position: 'DEF', rating: 6.2, xPct: 40, yPct: 85, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1379398.png' },
        { id: 'ap-p10', name: 'Ondřej Kukučka', lastName: 'Kukučka', number: 5, position: 'DEF', rating: 6.1, xPct: 60, yPct: 85, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/1225873.png' },
        { id: 'ap-p11', name: 'Eldar Šehić', lastName: 'Šehić', number: 14, position: 'DEF', rating: 6.3, xPct: 80, yPct: 85, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/951807.png' },
        { id: 'ap-p12', name: 'Viktor Budinský', lastName: 'Budinský', number: 1, position: 'GK', rating: 6.2, xPct: 50, yPct: 93, avatarUrl: 'https://images.fotmob.com/image_resources/playerimages/319888.png' }
      ],





      jerseyRaffle: {
        title: 'Vyhraj originální podepsaný dres MVP Micka van Burena!',
        playerName: 'Mick van Buren',
        playerNumber: 9,
        totalEntries: 2190
      },
      nextGoalTeamPoll: {
        id: 'poll-next-goal-team',
        question: 'Kdo vstřelil rozhodující gól derby?',
        totalVotes: 2150,
        isActive: true,
        options: [
          { id: 'opt-hkr', label: 'FC Hradec Králové (František Čech)', votes: 1420 },
          { id: 'opt-pce', label: 'FK Pardubice (Tobias Boledovič)', votes: 730 }
        ]
      },
      nextGoalScorerPoll: {
        id: 'poll-next-goal-scorer',
        question: 'Kdo byl střelcem úvodního gólu zápasu?',
        totalVotes: 1980,
        isActive: true,
        options: [
          { id: 'opt-buren-first', label: 'Mick van Buren (44. min • Gól)', votes: 1540 },
          { id: 'opt-sloncik-first', label: 'Tom Slončík (Hradec)', votes: 310 },
          { id: 'opt-tanko-first', label: 'Abdullahi Tanko (Pardubice)', votes: 130 }
        ]
      }
    }
  },

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
    ],
    liveConfig: {
      enabled: true,
      eventCategoryType: 'sports',
      activeModules: ['timeline', 'crowd_pulse', 'express_bar', 'venue_map'],
      statusHeader: '2. Poločas • 68:12 (ACS 1 : 0 SVS)',
      statusBadge: 'ŽIVĚ',
      timeline: [
        { id: 't1', time: '18:00', title: 'Výkop 1. poločasu', status: 'past' },
        { id: 't2', time: '18:34', title: 'GÓL! Haraslín (1:0)', subtitle: 'Asistence: Birmančevič', status: 'past', badge: 'GÓL' },
        { id: 't3', time: '18:48', title: 'Poločasová přestávka', subtitle: 'NFC Bary Otevřeny', status: 'past' },
        { id: 't4', time: '19:04', title: '2. Poločas v plném proudu', status: 'live', badge: 'HRAJE SE' },
        { id: 't5', time: '19:55', title: 'Konec zápasu & Vyhlášení MVP', status: 'upcoming' }
      ],
      polls: [
        {
          id: 'poll-derby-mvp',
          question: 'Kdo je hráčem zápasu (MVP 312. Derby)?',
          totalVotes: 1420,
          isActive: true,
          options: [
            { id: 'opt-1', label: 'Lukáš Haraslín (ACS)', votes: 850 },
            { id: 'opt-2', label: 'Veljko Birmančevič (ACS)', votes: 340 },
            { id: 'opt-3', label: 'Mojmír Chytil (SVS)', votes: 230 }
          ]
        }
      ],
      pois: [
        { id: 'poi-1', name: 'NFC Bar Sektor B', category: 'bar', locationDetail: 'Vchod B2 • Přízemí', queueLevel: 'low', waitTimeMinutes: 2 },
        { id: 'poi-2', name: 'WC Muži / Ženy', category: 'wc', locationDetail: 'Sektor B • Chodba 3', queueLevel: 'med', waitTimeMinutes: 5 },
        { id: 'poi-3', name: 'Official FanShop', category: 'merch', locationDetail: 'Hlavní atrium', queueLevel: 'high', waitTimeMinutes: 14 },
        { id: 'poi-4', name: 'První Pomoc', category: 'first_aid', locationDetail: 'Sektor A1', queueLevel: 'low', waitTimeMinutes: 0 }
      ],
      expressMenu: [
        { id: 'ex-1', name: 'Pilsner Urquell 0.5L', category: 'pivo', price: 75, volumeOrSize: '0.5l', icon: 'beer' },
        { id: 'ex-2', name: 'Kofola Čepovaná', category: 'nealko', price: 55, volumeOrSize: '0.5l', icon: 'cup' },
        { id: 'ex-3', name: 'Klobása s Chlebem', category: 'snack', price: 125, volumeOrSize: '250g', icon: 'food' },
        { id: 'ex-4', name: 'Derby Šála Sparta vs Slavia', category: 'merch', price: 390, volumeOrSize: '1ks', icon: 'shirt' }
      ],
      lightshowPresets: [
        { id: 'ls-sparta', name: 'Sparta Rudé Světlo', colors: ['#DC2626', '#1E3A8A', '#F59E0B'] },
        { id: 'ls-strobe', name: 'Gólový Stroboskop', colors: ['#FFFFFF', '#DC2626', '#000000'] }
      ],
      matchMomentum: {
        homeScore: 1,
        awayScore: 0,
        homePossessionPct: 58,
        awayPossessionPct: 42,
        homeShotsOnTarget: 6,
        awayShotsOnTarget: 3,
        homeDangerousAttacks: 48,
        awayDangerousAttacks: 29,
        momentumGraph: [20, 35, 50, 65, -15, 10, 80, 85, 45]
      },
      homeLineup: [
        { id: 'p1', name: 'Peter Vindahl', number: 1, position: 'GK', rating: 7.2, xPct: 50, yPct: 9, avatarUrl: '/api/player-avatar?name=Peter+Vindahl' },
        { id: 'p2', name: 'Asger Sørensen', number: 3, position: 'DEF', rating: 7.4, xPct: 25, yPct: 20, avatarUrl: '/api/player-avatar?name=Asger+Sorensen' },
        { id: 'p3', name: 'Martin Vitík', number: 41, position: 'DEF', rating: 7.6, xPct: 50, yPct: 20, avatarUrl: '/api/player-avatar?name=Martin+Vitik' },
        { id: 'p4', name: 'Jaroslav Zelený', number: 30, position: 'DEF', rating: 7.1, xPct: 75, yPct: 20, avatarUrl: '/api/player-avatar?name=Jaroslav+Zeleny' },
        { id: 'p5', name: 'Angelo Preciado', number: 2, position: 'MID', rating: 7.8, xPct: 15, yPct: 32, avatarUrl: '/api/player-avatar?name=Angelo+Preciado' },
        { id: 'p6', name: 'Qazim Laci', number: 20, position: 'MID', rating: 7.3, xPct: 38, yPct: 32, avatarUrl: '/api/player-avatar?name=Qazim+Laci' },
        { id: 'p7', name: 'Kaan Kairinen', number: 6, position: 'MID', rating: 7.5, xPct: 62, yPct: 32, avatarUrl: '/api/player-avatar?name=Kaan+Kairinen' },
        { id: 'p8', name: 'Matej Ryneš', number: 32, position: 'MID', rating: 7.4, xPct: 85, yPct: 32, avatarUrl: '/api/player-avatar?name=Matej+Rynes' },
        { id: 'p9', name: 'Veljko Birmančevič', number: 14, position: 'FWD', rating: 8.1, assists: 1, xPct: 28, yPct: 43, avatarUrl: '/api/player-avatar?name=Veljko+Birmancevic' },
        { id: 'p10', name: 'Victor Olatunji', number: 7, position: 'FWD', rating: 7.0, xPct: 72, yPct: 43, avatarUrl: '/api/player-avatar?name=Victor+Olatunji' },
        { id: 'p11', name: 'Lukáš Haraslín', number: 22, position: 'FWD', rating: 8.5, goals: 1, isCaptain: true, xPct: 50, yPct: 48, avatarUrl: '/api/player-avatar?name=Lukas+Haraslin' }
      ],
      awayLineup: [
        { id: 'ap1', name: 'Aleš Mandous', number: 28, position: 'GK', rating: 6.8, xPct: 50, yPct: 93, avatarUrl: '/api/player-avatar?name=Ales+Mandous' },
        { id: 'ap2', name: 'Tomáš Holeš', number: 3, position: 'DEF', rating: 7.0, isCaptain: true, xPct: 20, yPct: 85, avatarUrl: '/api/player-avatar?name=Tomas+Holes' },
        { id: 'ap3', name: 'Igoh Ogbu', number: 5, position: 'DEF', rating: 7.2, xPct: 40, yPct: 85, avatarUrl: '/api/player-avatar?name=Igoh+Ogbu' },
        { id: 'ap4', name: 'David Zima', number: 4, position: 'DEF', rating: 6.9, xPct: 60, yPct: 85, avatarUrl: '/api/player-avatar?name=David+Zima' },
        { id: 'ap5', name: 'David Douděra', number: 21, position: 'MID', rating: 7.1, xPct: 80, yPct: 85, avatarUrl: '/api/player-avatar?name=David+Doudera' },
        { id: 'ap6', name: 'Christos Zafeiris', number: 10, position: 'MID', rating: 7.4, xPct: 25, yPct: 75, avatarUrl: '/api/player-avatar?name=Christos+Zafeiris' },
        { id: 'ap7', name: 'Oscar Dorley', number: 19, position: 'MID', rating: 7.3, yellowCards: 1, xPct: 50, yPct: 75, avatarUrl: '/api/player-avatar?name=Oscar+Dorley' },
        { id: 'ap8', name: 'Lukáš Provod', number: 17, position: 'MID', rating: 7.2, xPct: 75, yPct: 75, avatarUrl: '/api/player-avatar?name=Lukas+Provod' },
        { id: 'ap9', name: 'Conrad Wallem', number: 8, position: 'MID', rating: 6.8, xPct: 20, yPct: 65, avatarUrl: '/api/player-avatar?name=Conrad+Wallem' },
        { id: 'ap10', name: 'Mojmír Chytil', number: 13, position: 'FWD', rating: 7.0, xPct: 50, yPct: 56, avatarUrl: 'https://i.pravatar.cc/150?u=ap10_chytil' },
        { id: 'ap11', name: 'Tomáš Chorý', number: 11, position: 'FWD', rating: 7.1, xPct: 80, yPct: 65, avatarUrl: 'https://i.pravatar.cc/150?u=ap11_chory' }
      ],

      jerseyRaffle: {
        title: 'Vyhraj originální podepsaný dres MVP 312. Derby!',
        playerName: 'Lukáš Haraslín',
        playerNumber: 22,
        totalEntries: 1482
      },
      nextGoalTeamPoll: {
        id: 'poll-next-goal-team',
        question: 'Kdo vstřelí Další Gól v zápase?',
        totalVotes: 1940,
        isActive: true,
        options: [
          { id: 'opt-team-acs', label: 'AC Sparta Praha', votes: 1210 },
          { id: 'opt-team-svs', label: 'SK Slavia Praha', votes: 610 },
          { id: 'opt-team-none', label: 'Žádný další gól (1:0)', votes: 120 }
        ]
      },
      nextGoalScorerPoll: {
        id: 'poll-next-goal-scorer',
        question: 'Který konkrétní hráč dá příští gól?',
        totalVotes: 1620,
        isActive: true,
        options: [
          { id: 'opt-sc-haraslin', label: 'Lukáš Haraslín (ACS)', votes: 780 },
          { id: 'opt-sc-birmancevic', label: 'Veljko Birmančevič (ACS)', votes: 410 },
          { id: 'opt-sc-chytil', label: 'Mojmír Chytil (SVS)', votes: 290 },
          { id: 'opt-sc-chory', label: 'Tomáš Chorý (SVS)', votes: 140 }
        ]
      }
    }
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
    ],
    liveConfig: {
      enabled: true,
      eventCategoryType: 'festival',
      activeModules: ['timeline', 'crowd_pulse', 'express_bar', 'venue_map'],
      statusHeader: 'Main Stage • RAYE (Live 21:30 - 23:00)',
      statusBadge: 'ON STAGE',
      timeline: [
        { id: 'mf-1', time: '17:00', title: 'Gates Open & Dj Welcome Set', status: 'past' },
        { id: 'mf-2', time: '19:00', title: 'Milky Chance (Main Stage)', status: 'past' },
        { id: 'mf-3', time: '21:30', title: 'RAYE (Headliner Main Stage)', status: 'live', badge: 'PROBÍHÁ' },
        { id: 'mf-4', time: '23:15', title: 'Afterparty DJ Set (Moon Stage)', status: 'upcoming' }
      ],
      polls: [
        {
          id: 'poll-metronome-encore',
          question: 'Jaký přídavek si přejete na závěr koncertu RAYE?',
          totalVotes: 3290,
          isActive: true,
          options: [
            { id: 'mopt-1', label: 'Escapism (Acoustic)', votes: 2100 },
            { id: 'mopt-2', label: 'Prada (Live Remix)', votes: 890 },
            { id: 'mopt-3', label: 'Flip A Switch', votes: 300 }
          ]
        }
      ],
      pois: [
        { id: 'mpoi-1', name: 'Craft Beer Zone', category: 'bar', locationDetail: 'Fontána • Pravé Křídlo', queueLevel: 'med', waitTimeMinutes: 6 },
        { id: 'mpoi-2', name: 'VIP Toilet Oasis', category: 'wc', locationDetail: 'Za VIP Tribunou', queueLevel: 'low', waitTimeMinutes: 1 },
        { id: 'mpoi-3', name: 'Official Merch Shop', category: 'merch', locationDetail: 'Vstupní hala', queueLevel: 'high', waitTimeMinutes: 15 }
      ],
      expressMenu: [
        { id: 'mex-1', name: 'Craft IPA 0.4L', category: 'pivo', price: 95, volumeOrSize: '0.4l', icon: 'beer' },
        { id: 'mex-2', name: 'Fritz-Kola 0.33L', category: 'nealko', price: 65, volumeOrSize: '0.33l', icon: 'cup' },
        { id: 'mex-3', name: 'Pulled Pork Burger', category: 'snack', price: 185, volumeOrSize: '1ks', icon: 'food' }
      ],
      lightshowPresets: [
        { id: 'ls-festival', name: 'Neon Purple Wave', colors: ['#A855F7', '#EC4899', '#3B82F6'] }
      ]
    }
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
    ],
    liveConfig: {
      enabled: true,
      eventCategoryType: 'zoo',
      activeModules: ['timeline', 'crowd_pulse', 'venue_map'],
      statusHeader: 'Rezervace: Večerní okruh • 19:30 Krmení Lvic',
      statusBadge: 'PROHLÍDKA',
      timeline: [
        { id: 'z1', time: '18:30', title: 'Sraz u hlavního vchodu & Registrace', status: 'past' },
        { id: 'z2', time: '19:00', title: 'Pavilon Trikolóra & Gorily', status: 'past' },
        { id: 'z3', time: '19:30', title: 'Komentované krmení Lvic', status: 'live', badge: 'PRÁVĚ PROBÍHÁ' },
        { id: 'z4', time: '20:30', title: 'Noční expozice Sloní Džungle', status: 'upcoming' }
      ],
      polls: [
        {
          id: 'poll-zoo-quiz',
          question: 'Kvíz: Kolik váží nejstarší sloní samec v Zoo Praha?',
          totalVotes: 410,
          isActive: true,
          options: [
            { id: 'zopt-1', label: 'cca 3 500 kg', votes: 90 },
            { id: 'zopt-2', label: 'cca 5 200 kg (Správně!)', votes: 280 },
            { id: 'zopt-3', label: 'cca 7 000 kg', votes: 40 }
          ]
        }
      ],
      pois: [
        { id: 'zpoi-1', name: 'Restaurace Oceán', category: 'bar', locationDetail: 'Centrum Zoo', queueLevel: 'low', waitTimeMinutes: 3 },
        { id: 'zpoi-2', name: 'WC u Rezervace Bororo', category: 'wc', locationDetail: 'Dětský areál', queueLevel: 'low', waitTimeMinutes: 1 }
      ],
      expressMenu: [
        { id: 'zex-1', name: 'Ledová Káva / Latte', category: 'nealko', price: 70, volumeOrSize: '0.3l', icon: 'cup' },
        { id: 'zex-2', name: 'Domácí Malinovka', category: 'nealko', price: 50, volumeOrSize: '0.4l', icon: 'cup' }
      ]
    }
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
  },
  {
    id: 'symphonic_rock',
    title: 'Symphonic Rock Arena Night 2026',
    tag: 'KONCERTY',
    vibe: 'koncerty',
    location: 'O2 arena, Praha 9',
    date: 'So 14. listopadu 2026 · 20:00',
    lineup: 'Czech National Symphony Orchestra & Rock Legends',
    promoter: 'Live Nation Czech Republic',
    weather: { temp: '20°C', text: 'Hala', icon: 'indoor' },
    videoUrl: '/videos/symphonic_rock.mp4',
    bgImg: '/images/xindl_live.jpg',
    priceMin: 890,
    priceMax: 2490,
    isFree: false,
    badge: 'EXCLUSIVE',
    description: 'Největší rockové hymny v monumentálním aranžmá symfonického orchestru v O2 areně.',
    sectors: [
      { name: 'Stání u pódia', price: 890, povType: 'dancefloor-front' },
      { name: 'VIP Sezení Tribuna A', price: 2490, povType: 'mid-stadium' }
    ]
  },
  {
    id: 'summerbeats_openair',
    title: 'SummerBeats Festival 2026 – Sunset Edition',
    tag: 'FESTIVAL',
    vibe: 'festivaly',
    location: 'Naplavka Rašínovo nábřeží, Praha 2',
    date: 'Pá 7. srpna 2026 · 16:00',
    lineup: 'Deep House & Organic Electronic Collective',
    promoter: 'SummerBeats Prague',
    weather: { temp: '27°C', text: 'Slunečno', icon: 'clear' },
    videoUrl: '/videos/summerbeats.mp4',
    bgImg: '/images/metronome_festival.jpg',
    priceMin: 390,
    priceMax: 990,
    isFree: false,
    description: 'Západ slunce na Vltavě s nejlepší elektronickou hudbou a letním koktejlovým barem.',
    sectors: [
      { name: 'Standard Beach Ticket', price: 390, povType: 'dancefloor-back' },
      { name: 'VIP Boat Lounge', price: 990, povType: 'dancefloor-front' }
    ]
  },
  {
    id: 'techno_warehouse',
    title: 'Techno Warehouse Rave – Industrial Chapter IV',
    tag: 'PARTY',
    vibe: 'party',
    location: 'Hala 7, Pragovka Art District, Praha 9',
    date: 'So 28. listopadu 2026 · 22:00',
    lineup: 'Berlin Underground Residents & Local Techno Pioneer',
    promoter: 'Warehouse Events',
    weather: { temp: '18°C', text: 'Klub', icon: 'indoor' },
    videoUrl: '/videos/techno.mp4',
    bgImg: '/images/beats_for_love.jpg',
    priceMin: 450,
    priceMax: 890,
    isFree: false,
    description: 'Temný industriální rave v autentických prostorách staré fabrika Pragovka.',
    sectors: [
      { name: 'Warehouse Main Floor Pass', price: 450, povType: 'dancefloor-back' },
      { name: 'VIP Backstage Deck', price: 890, povType: 'backstage' }
    ]
  },
  {
    id: 'flora_praha',
    title: 'Květinová Výstava Botanica Praha',
    tag: 'VÝSTAVIŠTĚ',
    vibe: 'vystaviste',
    location: 'Botanická zahrada Praha, Troja',
    date: 'So 16. – Ne 24. května 2026',
    lineup: 'Exotické orchideje, Tropický skleník Fata Morgana',
    promoter: 'Botanická zahrada hl. m. Prahy',
    weather: { temp: '22°C', text: 'Polojasno', icon: 'clear' },
    videoUrl: '/videos/flora.mp4',
    bgImg: '/images/flora_olomouc.jpg',
    priceMin: 200,
    priceMax: 450,
    isFree: false,
    description: 'Jarní výstava tropických květin a motýlů v mezinárodně uznávaném skleníku.',
    sectors: [
      { name: 'Vstupenka Fata Morgana', price: 200, povType: 'fountain-far' },
      { name: 'Rodinné Vstupné', price: 450, povType: 'fountain-near' }
    ]
  },
  {
    id: 'prague_streetball',
    title: 'Prague 3x3 Streetball Masters 2026',
    tag: 'SPORT',
    vibe: 'sport',
    location: 'Václavské Náměstí, Praha 1',
    date: 'So 15. srpna 2026 · 12:00',
    lineup: 'FIBA 3x3 World Tour Qualifiers',
    promoter: 'Czech Streetball Association',
    weather: { temp: '25°C', text: 'Jasno', icon: 'clear' },
    videoUrl: '/videos/basketball.mp4',
    bgImg: '/images/allstar_game.jpg',
    priceMin: 0,
    priceMax: 350,
    isFree: true,
    badge: 'FREE ENTRY',
    description: 'Špičkový pouliční basketbal přímo v centru Prahy. Vstup pro veřejnost zdarma!',
    sectors: [
      { name: 'Volné Stání u Kurtu', price: 0, povType: 'dancefloor-back' },
      { name: 'VIP Tribunka', price: 350, povType: 'near-stadium' }
    ]
  },
  {
    id: 'louskacek_balet',
    title: 'Louskáček – Vánoční Balet Národního Divadla',
    tag: 'DIVADLO',
    vibe: 'divadlo',
    location: 'Státní opera Praha, Praha 1',
    date: 'Čt 17. prosince 2026 · 19:00',
    lineup: 'Balet Státní Opery & Dětský sbor',
    promoter: 'Národní divadlo',
    weather: { temp: '15°C', text: 'Divadlo', icon: 'indoor' },
    videoUrl: '/videos/ballet.mp4',
    bgImg: '/images/labuti_jezero.jpg',
    priceMin: 690,
    priceMax: 1990,
    isFree: false,
    description: 'Magické vánoční představení P. I. Čajkovského ve velkolepých kulisách Státní opery.',
    sectors: [
      { name: 'Balkón Sezení', price: 690, povType: 'far-stadium' },
      { name: 'Přízemí Lóže', price: 1990, povType: 'near-stadium' }
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
