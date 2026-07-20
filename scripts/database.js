const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'vivoo.db');
const db = new DatabaseSync(dbPath);

console.log(`[Database] Connected to SQLite database at: ${dbPath}`);

// Initialize schema
function initSchema() {
  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON;');

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      bio TEXT,
      cashless_credit INTEGER DEFAULT 400
    );
  `);

  // Events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tag TEXT NOT NULL,
      vibe TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      lineup TEXT,
      weather_temp TEXT,
      weather_text TEXT,
      weather_icon TEXT,
      video_url TEXT,
      bg_img TEXT,
      price_min INTEGER DEFAULT 0,
      price_max INTEGER DEFAULT 0,
      is_free INTEGER DEFAULT 0
    );
  `);

  // Sectors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sectors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      pov_type TEXT NOT NULL
    );
  `);

  // Tickets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
      sector_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      holder_name TEXT NOT NULL,
      is_group INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active'
    );
  `);

  // Split sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS split_sessions (
      id TEXT PRIMARY KEY,
      host_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
      sector_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      total_seats INTEGER NOT NULL,
      paid_seats INTEGER DEFAULT 1,
      created_at INTEGER,
      status TEXT DEFAULT 'active'
    );
  `);

  // Split members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS split_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT REFERENCES split_sessions(id) ON DELETE CASCADE,
      user_id INTEGER,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'pending'
    );
  `);

  // Activities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      time TEXT NOT NULL,
      amount INTEGER NOT NULL
    );
  `);
}

// Seed initial events if none exist
function seedData() {
  const eventCountStmt = db.prepare('SELECT COUNT(*) as count FROM events');
  const result = eventCountStmt.get();
  
  if (result.count > 0) {
    console.log('[Database] Database already has events seeded.');
    return;
  }

  console.log('[Database] Seeding initial events and sectors...');

  const events = [
    {
      id: 'derby',
      title: 'Prague Football Derby: Sparta vs Slavia',
      tag: 'Sport',
      vibe: 'sport',
      location: 'epet ARENA, Prague',
      date: 'Saturday, Oct 14 • 18:00',
      lineup: 'AC Sparta Praha vs SK Slavia Praha',
      weather_temp: '16°C',
      weather_text: 'Clear Sky',
      weather_icon: 'clear',
      video_url: './videos/derby.mp4',
      bg_img: './images/derby.jpg',
      price_min: 300,
      price_max: 1200,
      is_free: 0,
      sectors: [
        { name: 'Sektor C (Upper Gallery)', price: 350, pov_type: 'far-stadium' },
        { name: 'Sektor B (Mid Tier)', price: 650, pov_type: 'mid-stadium' },
        { name: 'Sektor A (Lower Pitchside)', price: 1100, pov_type: 'near-stadium' }
      ]
    },
    {
      id: 'techno',
      title: 'Basement Syndicate: Warehouse Techno Night',
      tag: 'Music',
      vibe: 'music',
      location: 'Hala 13, Holešovice',
      date: 'Friday, Oct 20 • 22:00',
      lineup: 'Boris Brejcha, Amelie Lens, DJ Shadow, Charlotte de Witte',
      weather_temp: '18°C',
      weather_text: 'Indoor Event',
      weather_icon: 'indoor',
      video_url: './videos/techno.mp4',
      bg_img: './images/techno.jpg',
      price_min: 400,
      price_max: 1600,
      is_free: 0,
      sectors: [
        { name: 'Warehouse General Admission', price: 450, pov_type: 'dancefloor-back' },
        { name: 'VIP Boiler Deck', price: 850, pov_type: 'dancefloor-front' },
        { name: 'Backstage Access Pass', price: 1500, pov_type: 'backstage' }
      ]
    },
    {
      id: 'basketball',
      title: 'Red Bull Half Court Basketball Finals',
      tag: 'Sport',
      vibe: 'sport',
      location: 'Riegrovy Sady, Prague',
      date: 'Sunday, Oct 15 • 15:00',
      lineup: 'Prague Streetball Elite & Guest Dunkers',
      weather_temp: '19°C',
      weather_text: 'Sunny Day',
      weather_icon: 'clear',
      video_url: './videos/basketball.mp4',
      bg_img: './images/basketball.jpg',
      price_min: 0,
      price_max: 0,
      is_free: 1,
      sectors: [
        { name: 'General Admission Standing', price: 0, pov_type: 'dancefloor-back' }
      ]
    },
    {
      id: 'summerbeats',
      title: 'Summer Beats Open Air Festival',
      tag: 'Music',
      vibe: 'music',
      location: 'Žluté lázně, Prague',
      date: 'Saturday, Aug 19 • 14:00',
      lineup: 'Solomun, Tale of Us, Adriatique, Keinemusik',
      weather_temp: '26°C',
      weather_text: 'Warm & Sunny',
      weather_icon: 'clear',
      video_url: './videos/summerbeats.mp4',
      bg_img: './images/summerbeats.jpg',
      price_min: 490,
      price_max: 1490,
      is_free: 0,
      sectors: [
        { name: 'General Admission Beach Area', price: 550, pov_type: 'dancefloor-back' },
        { name: 'VIP Main Deck VIP Seating', price: 1200, pov_type: 'dancefloor-front' }
      ]
    },
    {
      id: 'ballet',
      title: 'Magical Water Fountain Light Show',
      tag: 'Culture',
      vibe: 'culture',
      location: 'Křižík Fountain, Exhibition Grounds',
      date: 'Sunday, Oct 22 • 19:30',
      lineup: 'Laterna Magika Dance Ensemble & Prague Symphony Orchestra',
      weather_temp: '14°C',
      weather_text: 'Light Breeze',
      weather_icon: 'windy',
      video_url: './videos/ballet.mp4',
      bg_img: './images/ballet.jpg',
      price_min: 250,
      price_max: 900,
      is_free: 0,
      sectors: [
        { name: 'Grandstand Balcony C', price: 300, pov_type: 'fountain-far' },
        { name: 'Premium Terrace B', price: 550, pov_type: 'fountain-mid' },
        { name: 'Front VIP Row A', price: 850, pov_type: 'fountain-near' }
      ]
    },
    {
      id: 'flora',
      title: 'Flora Acoustic: Garden Symphony Concert',
      tag: 'Culture',
      vibe: 'culture',
      location: 'Flora Exhibition Grounds, Olomouc',
      date: 'Saturday, Oct 28 • 16:00',
      lineup: 'Olomouc Symphonic Soloists & Flora Acoustic Trio',
      weather_temp: '15°C',
      weather_text: 'Sunny Day',
      weather_icon: 'clear',
      video_url: './videos/flora.mp4',
      bg_img: './images/flora.jpg',
      price_min: 0,
      price_max: 0,
      is_free: 1,
      sectors: [
        { name: 'General Admission Gardens', price: 0, pov_type: 'fountain-mid' }
      ]
    },
    {
      id: 'networking_meetup',
      title: 'Prague Tech Founders Meetup',
      tag: 'Networking',
      vibe: 'networking',
      location: 'Start-up Loft, Holešovice',
      date: 'Thursday, Nov 9 • 19:00',
      lineup: 'Keynote Panel & Investor Pitch Arena',
      weather_temp: '17°C',
      weather_text: 'Indoor Loft',
      weather_icon: 'indoor',
      video_url: './videos/techno.mp4',
      bg_img: './images/networking.jpg',
      price_min: 0,
      price_max: 0,
      is_free: 1,
      sectors: [
        { name: 'Loft General Admission', price: 0, pov_type: 'dancefloor-back' }
      ]
    },
    {
      id: 'comedy_night',
      title: 'English Comedy Night: Stands-ups live',
      tag: 'Fun',
      vibe: 'fun',
      location: 'The Comedy Cellar, Prague',
      date: 'Wednesday, Nov 15 • 20:30',
      lineup: 'Toby Smith (UK) & Local Talent Showcase',
      weather_temp: '18°C',
      weather_text: 'Comedy Cellar',
      weather_icon: 'indoor',
      video_url: './videos/techno.mp4',
      bg_img: './images/fun.jpg',
      price_min: 220,
      price_max: 450,
      is_free: 0,
      sectors: [
        { name: 'General Admission seating', price: 250, pov_type: 'dancefloor-back' }
      ]
    }
  ];

  const insertEvent = db.prepare(`
    INSERT INTO events (
      id, title, tag, vibe, location, date, lineup, 
      weather_temp, weather_text, weather_icon, video_url, bg_img, 
      price_min, price_max, is_free
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, 
      ?, ?, ?
    )
  `);

  const insertSector = db.prepare(`
    INSERT INTO sectors (event_id, name, price, pov_type)
    VALUES (?, ?, ?, ?)
  `);

  for (const event of events) {
    insertEvent.run(
      event.id,
      event.title,
      event.tag,
      event.vibe,
      event.location,
      event.date,
      event.lineup,
      event.weather_temp,
      event.weather_text,
      event.weather_icon,
      event.video_url,
      event.bg_img,
      event.price_min,
      event.price_max,
      event.is_free
    );

    for (const sector of event.sectors) {
      insertSector.run(event.id, sector.name, sector.price, sector.pov_type);
    }
  }

  console.log('[Database] Seed completed successfully.');
}

initSchema();
seedData();

module.exports = db;
