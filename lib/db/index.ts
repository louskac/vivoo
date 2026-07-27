import fs from 'fs';
import path from 'path';
import { ViVooDatabaseSchema, UserLikeDbModel, UserSavedDbModel, TicketDbModel, TransactionDbModel, UserVideoDbModel } from './schema';

const DB_FILE_PATH = path.join(process.cwd(), 'lib', 'db', 'vivoo_db.json');

const DEFAULT_DB: ViVooDatabaseSchema = {
  user: {
    id: 'usr-1',
    username: 'novakjan',
    handle: '@novakjan',
    fullName: 'Jan Novák',
    avatarUrl: '/images/avatar.jpg',
    bio: 'Festival enthusiast & music lover',
    memberTier: 'VIP Gold',
    cashlessCredit: 2360
  },
  likes: [
    { userId: 'usr-1', videoId: 'concert_hvezdy', createdAt: new Date().toISOString() }
  ],
  savedEvents: [
    { userId: 'usr-1', eventId: 'metronome_festival', createdAt: new Date().toISOString() },
    { userId: 'usr-1', eventId: 'concert_hvezdy', createdAt: new Date().toISOString() }
  ],
  tickets: [
    {
      id: 'tkt-hero-1',
      userId: 'usr-1',
      eventId: 'concert_hvezdy',
      eventTitle: 'Koncert pod živými hvězdami',
      location: 'Riegrovy sady, Praha 3',
      date: 'Ne 18. 10. · 20:00',
      bgImg: '/images/xindl_live.jpg',
      tier: 'standard',
      quantity: 1,
      totalPrice: 400,
      sectorName: 'Sektor A (Stání u pódia)',
      qrCode: 'VIVOO-HVEZDY-881920',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tkt-1',
      userId: 'usr-1',
      eventId: 'metronome_festival',
      eventTitle: 'Metronome Festival 2026',
      location: 'Výstaviště Praha, Praha 7',
      date: 'So 20. června · 16:00',
      bgImg: '/images/metronome_festival.jpg',
      tier: 'standard',
      quantity: 2,
      totalPrice: 1200,
      sectorName: '3-Day Pass General Admission',
      qrCode: 'VIVOO-METRONOME-89214',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: 'tx-101',
      userId: 'usr-1',
      title: 'Dobití NFC Kredit - Apple Pay',
      type: 'topup',
      dateStr: 'Dnes, 12:45',
      amount: 1000,
      isPositive: true,
      status: 'Dokončeno',
      timestamp: new Date().toISOString()
    },
    {
      id: 'tx-102',
      userId: 'usr-1',
      title: 'Nákup Vstupenky: Metronome Festival 2026',
      type: 'ticket',
      dateStr: '25. čvc 2026 · 18:20',
      amount: 1200,
      isPositive: false,
      status: 'Dokončeno',
      timestamp: new Date().toISOString()
    },
    {
      id: 'tx-103',
      userId: 'usr-1',
      title: 'NFC Nápojový Bar · Riegrovy Sady',
      type: 'nfc',
      dateStr: '20. čvc 2026 · 21:14',
      amount: 240,
      isPositive: false,
      status: 'Zúčtováno',
      timestamp: new Date().toISOString()
    }
  ],
  userVideos: [
    {
      id: 'v-1',
      userId: 'usr-1',
      title: 'Metronome Open Air Crowd',
      views: '2.4k',
      likes: 318,
      img: '/images/metronome_festival.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'v-2',
      userId: 'usr-1',
      title: 'Xindl X Live Front Row',
      views: '5.1k',
      likes: 890,
      img: '/images/xindl_live.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'v-3',
      userId: 'usr-1',
      title: 'Derby Atmosphere Smoke',
      views: '1.2k',
      likes: 142,
      img: '/images/prague_derby.jpg',
      createdAt: new Date().toISOString()
    },
    {
      id: 'v-4',
      userId: 'usr-1',
      title: 'Beats For Love Main Stage',
      views: '8.9k',
      likes: 1540,
      img: '/images/beats_for_love.jpg',
      createdAt: new Date().toISOString()
    }
  ],
  videoStats: {
    metronome_festival: { videoId: 'metronome_festival', likesCount: 1420, viewsCount: 5400 },
    concert_hvezdy: { videoId: 'concert_hvezdy', likesCount: 891, viewsCount: 3200 },
    derby: { videoId: 'derby', likesCount: 3120, viewsCount: 12800 },
    beats_for_love: { videoId: 'beats_for_love', likesCount: 4500, viewsCount: 18900 },
    ballet: { videoId: 'ballet', likesCount: 630, viewsCount: 2100 },
    basketball: { videoId: 'basketball', likesCount: 410, viewsCount: 1800 }
  }
};

let inMemoryDb: ViVooDatabaseSchema | null = null;

export function getDatabase(): ViVooDatabaseSchema {
  if (inMemoryDb) return inMemoryDb;
  
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      inMemoryDb = JSON.parse(data);
      return inMemoryDb!;
    }
  } catch (e) {
    console.error('[DB] Failed to read database file, using fallback default', e);
  }

  inMemoryDb = JSON.parse(JSON.stringify(DEFAULT_DB));
  saveDatabase(inMemoryDb!);
  return inMemoryDb!;
}

export function saveDatabase(db: ViVooDatabaseSchema): void {
  inMemoryDb = db;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DB] Failed to write database file', e);
  }
}
