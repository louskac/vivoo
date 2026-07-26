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

// Seed initial events or update dataset
function seedData() {
  db.exec('DELETE FROM sectors;');
  db.exec('DELETE FROM events;');

  console.log('[Database] Seeding Enigoo upcoming events and sectors...');

  const events = [
    {
      id: 'metronome_festival',
      title: 'Metronome Festival Prague 2026',
      tag: 'FESTIVAL',
      vibe: 'festivaly',
      location: 'Výstaviště Praha, Praha 7',
      date: 'Čt 18. – So 20. června 2026',
      lineup: 'Raye, Milky Chance, Michael Kiwanuka',
      weather_temp: '24°C',
      weather_text: 'Letní slunečno',
      weather_icon: 'clear',
      video_url: './videos/metronome_festival.mp4',
      bg_img: './images/metronome_festival.jpg',
      price_min: 1890,
      price_max: 3490,
      is_free: 0,
      sectors: [
        { name: '3-Day Pass General Admission', price: 1890, pov_type: 'dancefloor-back' },
        { name: 'VIP Platform Lounge', price: 3490, pov_type: 'dancefloor-front' }
      ]
    },
    {
      id: 'concert_hvezdy',
      title: 'Koncert pod živými hvězdami',
      tag: 'HUDBA',
      vibe: 'koncerty',
      location: 'Riegrovy sady, Praha 3',
      date: 'Ne 18. října 2026 · 15:00',
      lineup: 'Xindl X, Pokáč',
      weather_temp: '18°C',
      weather_text: 'Jasná obloha',
      weather_icon: 'clear',
      video_url: './videos/xindl_live.mp4',
      bg_img: './images/xindl_live.jpg',
      price_min: 400,
      price_max: 1200,
      is_free: 0,
      sectors: [
        { name: 'Sektor A (Stání u pódia)', price: 400, pov_type: 'dancefloor-front' },
        { name: 'VIP Sezení Terasa', price: 1200, pov_type: 'backstage' }
      ]
    },
    {
      id: 'derby',
      title: 'AC Sparta Praha vs SK Slavia Praha',
      tag: 'SPORT',
      vibe: 'sport',
      location: 'epet ARENA, Praha 7',
      date: 'So 12. října 2026 · 18:00',
      lineup: '312. Pražské Derby · Chance Liga',
      weather_temp: '16°C',
      weather_text: 'Jasno',
      weather_icon: 'clear',
      video_url: './videos/prague_derby.mp4',
      bg_img: './images/prague_derby.jpg',
      price_min: 390,
      price_max: 1100,
      is_free: 0,
      sectors: [
        { name: 'Sektor C (Galerie)', price: 390, pov_type: 'far-stadium' },
        { name: 'Sektor B (Střed)', price: 650, pov_type: 'mid-stadium' },
        { name: 'Sektor A (Hřiště)', price: 1100, pov_type: 'near-stadium' }
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
      weather_temp: '26°C',
      weather_text: 'Jasno',
      weather_icon: 'clear',
      video_url: './videos/beats_for_love.mp4',
      bg_img: './images/beats_for_love.jpg',
      price_min: 1490,
      price_max: 2990,
      is_free: 0,
      sectors: [
        { name: 'Celofestivalová vstupenka GA', price: 1490, pov_type: 'dancefloor-back' },
        { name: 'VIP Deck Pass', price: 2990, pov_type: 'dancefloor-front' }
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
      weather_temp: '14°C',
      weather_text: 'Chladno',
      weather_icon: 'indoor',
      video_url: './videos/labuti_jezero.mp4',
      bg_img: './images/labuti_jezero.jpg',
      price_min: 790,
      price_max: 1850,
      is_free: 0,
      sectors: [
        { name: 'Balkón 2. pořadí', price: 790, pov_type: 'fountain-far' },
        { name: 'Přízemí Lóže', price: 1850, pov_type: 'fountain-near' }
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
      weather_temp: '19°C',
      weather_text: 'Hala',
      weather_icon: 'indoor',
      video_url: './videos/allstar_game.mp4',
      bg_img: './images/allstar_game.jpg',
      price_min: 290,
      price_max: 690,
      is_free: 0,
      sectors: [
        { name: 'Stání Fanzóna', price: 290, pov_type: 'dancefloor-back' },
        { name: 'Sezení Palubovka', price: 690, pov_type: 'dancefloor-front' }
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
