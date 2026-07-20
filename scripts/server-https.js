const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const crypto = require('crypto');
const db = require('./database');

const certDir = path.join(__dirname, '..', 'certificates');
const keyPath = path.join(certDir, 'dev.key');
const certPath = path.join(certDir, 'dev.cert');

const HTTPS_PORT = 8443;
const HTTP_REDIRECT_PORT = 8080;

// 1. DYNAMICALLY DETECT LOCAL NETWORK IP ADDRESSES
function getLocalIps() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

// 2. SSL CERTIFICATE GENERATION
function ensureCertificates() {
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log('[HTTPS Server] Using existing SSL certificates.');
    return;
  }

  console.log('[HTTPS Server] SSL certificates not found. Generating...');
  
  const localIps = getLocalIps();
  const domains = ['localhost', '*.localhost', '127.0.0.1', ...localIps];
  console.log('[HTTPS Server] Generating certificates for:', domains.join(', '));

  let generated = false;
  
  // Try mkcert
  try {
    execSync('which mkcert', { stdio: 'ignore' });
    console.log('[HTTPS Server] mkcert found! Generating trusted local certificates...');
    
    const domainArgs = domains.map(d => `"${d}"`).join(' ');
    execSync(`mkcert -key-file "${keyPath}" -cert-file "${certPath}" ${domainArgs}`, { stdio: 'inherit' });
    
    console.log('[HTTPS Server] Trusted certificates generated successfully with mkcert.');
    generated = true;
  } catch (e) {
    console.log('[HTTPS Server] mkcert is not available. Falling back to OpenSSL...');
  }

  // Fallback to OpenSSL
  if (!generated) {
    try {
      const dnsEntries = domains.map((d, i) => {
        if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) {
          return `IP:${d}`;
        }
        return `DNS:${d}`;
      }).join(',');

      execSync(
        `openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -sha256 -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=${dnsEntries}"`,
        { stdio: 'inherit' }
      );
      console.log('[HTTPS Server] Self-signed certificates generated successfully with OpenSSL.');
    } catch (err) {
      console.error('[HTTPS Server] Failed to generate SSL certificates with OpenSSL:', err.message);
      console.error('Please install openssl or mkcert to host local HTTPS.');
      process.exit(1);
    }
  }
}

ensureCertificates();

// 3. STATIC FILE SERVER LOGIC
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

function serveFile(filePath, req, res) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Support HTTP Range Requests (required for video playback on iOS Safari)
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const totalSize = stats.size;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
      
      if (start >= totalSize || end >= totalSize || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
        res.end();
        return;
      }
      
      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      };
      
      res.writeHead(206, headers);
      fileStream.pipe(res);
    } else {
      // Standard static file response
      const noCacheExtensions = ['.html', '.css', '.js', '.json'];
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': noCacheExtensions.includes(ext)
          ? 'no-cache, no-store, must-revalidate'
          : 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      };

      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

// JSON API HELPERS
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const userId = parseInt(authHeader.split(' ')[1], 10);
  if (isNaN(userId)) return null;

  try {
    const user = db.prepare('SELECT id, username, full_name, bio, cashless_credit FROM users WHERE id = ?').get(userId);
    return user || null;
  } catch (e) {
    return null;
  }
}

// JSON API ROUTING HANDLER
async function handleApiRequest(req, res) {
  const urlPath = req.url.split('?')[0];
  const method = req.method;

  // Handle CORS Preflight Options
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  try {
    // 1. APPLE BIOMETRIC SIGN-IN (Frictionless OAuth simulation)
    if (urlPath === '/api/auth/apple' && method === 'POST') {
      const body = await getRequestBody(req);
      
      const randId = Math.floor(1000 + Math.random() * 9000);
      const username = `apple_user_${randId}`;
      const fullName = `Apple User ${randId}`;
      const bio = 'Immersive events fan, authenticated via Apple ID.';
      
      const registerStmt = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, bio, cashless_credit)
        VALUES (?, 'apple_oauth_token', ?, ?, 400)
      `);
      const result = registerStmt.run(username, fullName, bio);
      const newUserId = result.lastInsertRowid;

      // Seed registration bonus activity
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const fullTime = `Today, ${timeStr}`;
      db.prepare(`
        INSERT INTO activities (user_id, type, title, time, amount)
        VALUES (?, 'bonus', 'Account Registration Bonus', ?, 50)
      `).run(newUserId, fullTime);

      const user = db.prepare('SELECT id, username, full_name, bio, cashless_credit FROM users WHERE id = ?').get(newUserId);
      return sendJSON(res, { success: true, user });
    }

    // 2. SEND OTP (Email or Phone Number)
    if (urlPath === '/api/auth/otp/send' && method === 'POST') {
      const body = await getRequestBody(req);
      const { identity } = body;
      
      if (!identity) {
        return sendJSON(res, { success: false, error: 'Email or Phone Number is required.' }, 400);
      }
      
      return sendJSON(res, { success: true, message: 'Verification code sent. Use test code: 1234' });
    }

    // 2.5 VERIFY OTP & SIGN IN/UP
    if (urlPath === '/api/auth/otp/verify' && method === 'POST') {
      const body = await getRequestBody(req);
      const { identity, code } = body;

      if (!identity || !code) {
        return sendJSON(res, { success: false, error: 'Identity and verification code are required.' }, 400);
      }

      if (code !== '1234') {
        return sendJSON(res, { success: false, error: 'Invalid verification code. Enter 1234 to verify.' }, 400);
      }

      const cleanIdentity = identity.trim().toLowerCase();
      let user = db.prepare('SELECT * FROM users WHERE username = ?').get(cleanIdentity);

      if (!user) {
        let fullName = 'Viver User';
        if (cleanIdentity.includes('@')) {
          const part = cleanIdentity.split('@')[0];
          fullName = part.charAt(0).toUpperCase() + part.slice(1);
        } else {
          fullName = 'Member ' + cleanIdentity.slice(-4);
        }

        const bio = 'Verified event goer.';
        const result = db.prepare(`
          INSERT INTO users (username, password_hash, full_name, bio, cashless_credit)
          VALUES (?, 'passwordless_otp', ?, ?, 400)
        `).run(cleanIdentity, fullName, bio);
        const newUserId = result.lastInsertRowid;

        // Seed registration bonus
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const fullTime = `Today, ${timeStr}`;
        db.prepare(`
          INSERT INTO activities (user_id, type, title, time, amount)
          VALUES (?, 'bonus', 'Account Registration Bonus', ?, 50)
        `).run(newUserId, fullTime);

        user = db.prepare('SELECT * FROM users WHERE id = ?').get(newUserId);
      }

      const safeUser = {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        bio: user.bio,
        cashless_credit: user.cashless_credit
      };
      
      return sendJSON(res, { success: true, user: safeUser });
    }

    // 3. ME (Get user details)
    if (urlPath === '/api/auth/me' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, { success: false, error: 'Unauthorized' }, 401);
      }
      return sendJSON(res, { success: true, user });
    }

    // 4. EVENTS
    if (urlPath === '/api/events' && method === 'GET') {
      const events = db.prepare('SELECT * FROM events').all();
      const result = [];
      for (const ev of events) {
        const sectors = db.prepare('SELECT name, price, pov_type FROM sectors WHERE event_id = ?').all(ev.id);
        result.push({
          id: ev.id,
          title: ev.title,
          tag: ev.tag,
          vibe: ev.vibe,
          location: ev.location,
          date: ev.date,
          lineup: ev.lineup,
          weather: { temp: ev.weather_temp, text: ev.weather_text, icon: ev.weather_icon },
          videoUrl: ev.video_url,
          bgImg: ev.bg_img,
          priceMin: ev.price_min,
          priceMax: ev.price_max,
          isFree: !!ev.is_free,
          sectors: sectors.map(s => ({
            name: s.name,
            price: s.price,
            povType: s.pov_type
          }))
        });
      }
      return sendJSON(res, { success: true, events: result });
    }

    // 5. TICKETS (GET)
    if (urlPath === '/api/tickets' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, { success: false, error: 'Unauthorized' }, 401);
      }

      const tickets = db.prepare(`
        SELECT t.*, e.title as event_title, e.location as event_location, e.bg_img as event_bg_img, e.tag as event_tag
        FROM tickets t
        JOIN events e ON t.event_id = e.id
        WHERE t.user_id = ?
      `).all(user.id);

      const formattedTickets = tickets.map(t => ({
        id: t.id,
        event: {
          id: t.event_id,
          title: t.event_title,
          location: t.event_location,
          bgImg: t.event_bg_img,
          tag: t.event_tag
        },
        seat: {
          name: t.sector_name,
          price: t.price
        },
        holderName: t.holder_name,
        isGroup: !!t.is_group,
        isScanned: t.status === 'used'
      }));

      return sendJSON(res, { success: true, tickets: formattedTickets });
    }

    // 6. TICKETS PURCHASE (POST)
    if (urlPath === '/api/tickets/purchase' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, { success: false, error: 'Unauthorized' }, 401);
      }

      const body = await getRequestBody(req);
      console.log('[DEBUG PURCHASE] Request body:', body);
      const { eventId, sectorName, price, holderName, isGroup } = body;
      console.log('[DEBUG PURCHASE] User credit:', user.cashless_credit, 'price:', price);

      if (user.cashless_credit < price) {
        return sendJSON(res, { success: false, error: 'Insufficient cashless credit. Please top up your wallet in the profile tab.' }, 400);
      }

      // Deduct credit
      const newCredit = user.cashless_credit - price;
      db.prepare('UPDATE users SET cashless_credit = ? WHERE id = ?').run(newCredit, user.id);

      // Create ticket
      const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
      db.prepare(`
        INSERT INTO tickets (id, user_id, event_id, sector_name, price, holder_name, is_group, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
      `).run(ticketId, user.id, eventId, sectorName, price, holderName || user.full_name, isGroup ? 1 : 0);

      // Create activity
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const fullTimeStr = `Today, ${timeStr}`;
      
      db.prepare(`
        INSERT INTO activities (user_id, type, title, time, amount)
        VALUES (?, 'purchase', ?, ?, ?)
      `).run(user.id, `Ticket Purchase - ${sectorName}`, fullTimeStr, -price);

      // Get event detail
      const ev = db.prepare('SELECT title, location, bg_img FROM events WHERE id = ?').get(eventId);

      return sendJSON(res, {
        success: true,
        newCredit,
        ticket: {
          id: ticketId,
          event: {
            id: eventId,
            title: ev.title,
            location: ev.location,
            bgImg: ev.bg_img
          },
          seat: {
            name: sectorName,
            price: price
          },
          holderName: holderName || user.full_name,
          isGroup: !!isGroup,
          isScanned: false
        }
      });
    }

    // 7. TICKETS SCAN (POST)
    if (urlPath === '/api/tickets/scan' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, { success: false, error: 'Unauthorized' }, 401);
      }

      db.prepare('UPDATE tickets SET status = \'used\' WHERE user_id = ?').run(user.id);
      return sendJSON(res, { success: true });
    }

    // 8. WALLET UPDATE (POST)
    if (urlPath === '/api/wallet/update' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, { success: false, error: 'Unauthorized' }, 401);
      }

      const body = await getRequestBody(req);
      const { amount, title, type } = body;

      const newCredit = user.cashless_credit + amount;
      db.prepare('UPDATE users SET cashless_credit = ? WHERE id = ?').run(newCredit, user.id);

      // Create activity
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const fullTimeStr = `Today, ${timeStr}`;
      
      db.prepare(`
        INSERT INTO activities (user_id, type, title, time, amount)
        VALUES (?, ?, ?, ?, ?)
      `).run(user.id, type || 'reward', title || 'Credits Adjustment', fullTimeStr, amount);

      return sendJSON(res, { success: true, newCredit });
    }

    // 9. WALLET ACTIVITIES (GET)
    if (urlPath === '/api/wallet/activities' && method === 'GET') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, { success: false, error: 'Unauthorized' }, 401);
      }

      const activities = db.prepare('SELECT type, title, time, amount FROM activities WHERE user_id = ? ORDER BY id DESC').all(user.id);
      return sendJSON(res, { success: true, activities });
    }

    // 10. SPLIT CREATE (POST)
    if (urlPath === '/api/split/create' && method === 'POST') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, { success: false, error: 'Unauthorized' }, 401);
      }

      const body = await getRequestBody(req);
      const { eventId, sectorName, price, totalSeats } = body;

      if (user.cashless_credit < price) {
        return sendJSON(res, { success: false, error: 'Insufficient cashless credit. Please top up your wallet in the profile tab.' }, 400);
      }

      // Deduct credit
      const newCredit = user.cashless_credit - price;
      db.prepare('UPDATE users SET cashless_credit = ? WHERE id = ?').run(newCredit, user.id);

      // Random 4-letter session ID
      const sessionId = Math.random().toString(36).substring(2, 6).toLowerCase();

      // Create session
      db.prepare(`
        INSERT INTO split_sessions (id, host_user_id, event_id, sector_name, price, total_seats, paid_seats, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'active')
      `).run(sessionId, user.id, eventId, sectorName, price, totalSeats, Date.now());

      // Insert host member
      db.prepare(`
        INSERT INTO split_members (session_id, user_id, name, status)
        VALUES (?, ?, ?, 'paid')
      `).run(sessionId, user.id, user.full_name);

      // Insert guest members
      const insertMember = db.prepare(`
        INSERT INTO split_members (session_id, name, status)
        VALUES (?, ?, 'pending')
      `);

      for (let i = 1; i < totalSeats; i++) {
        const guestName = i === 1 ? 'Honza' : i === 2 ? 'Karel' : `Friend Guest ${i}`;
        insertMember.run(sessionId, guestName);
      }

      // Create ticket for host
      const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
      db.prepare(`
        INSERT INTO tickets (id, user_id, event_id, sector_name, price, holder_name, is_group, status)
        VALUES (?, ?, ?, ?, ?, ?, 1, 'active')
      `).run(ticketId, user.id, eventId, sectorName, price, `${user.full_name} (Host)`);

      // Create activity
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const fullTimeStr = `Today, ${timeStr}`;
      db.prepare(`
        INSERT INTO activities (user_id, type, title, time, amount)
        VALUES (?, 'purchase', ?, ?, ?)
      `).run(user.id, `Group Booking Host - ${sectorName}`, fullTimeStr, -price);

      return sendJSON(res, {
        success: true,
        sessionId,
        newCredit,
        ticketId
      });
    }

    // 11. SPLIT STATUS (GET)
    if (urlPath === '/api/split/status' && method === 'GET') {
      const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
      const sessionId = url.searchParams.get('sessionId');
      if (!sessionId) {
        return sendJSON(res, { success: false, error: 'Session ID required' }, 400);
      }

      const session = db.prepare(`
        SELECT s.*, e.title as event_title, e.location as event_location, e.bg_img as event_bg_img
        FROM split_sessions s
        JOIN events e ON s.event_id = e.id
        WHERE s.id = ?
      `).get(sessionId);

      if (!session) {
        return sendJSON(res, { success: false, error: 'Session not found' }, 404);
      }

      const members = db.prepare('SELECT id, name, status FROM split_members WHERE session_id = ?').all(sessionId);

      return sendJSON(res, {
        success: true,
        session: {
          id: session.id,
          eventId: session.event_id,
          eventTitle: session.event_title,
          eventLocation: session.event_location,
          eventBgImg: session.event_bg_img,
          sectorName: session.sector_name,
          price: session.price,
          totalSeats: session.total_seats,
          paidSeats: session.paid_seats,
          createdAt: session.created_at,
          status: session.status
        },
        members
      });
    }

    // 12. SPLIT PAY (POST)
    if (urlPath === '/api/split/pay' && method === 'POST') {
      const body = await getRequestBody(req);
      const { sessionId, memberId } = body;

      const session = db.prepare('SELECT * FROM split_sessions WHERE id = ?').get(sessionId);
      if (!session) {
        return sendJSON(res, { success: false, error: 'Session not found' }, 404);
      }

      const member = db.prepare('SELECT * FROM split_members WHERE id = ? AND session_id = ?').get(memberId, sessionId);
      if (!member) {
        return sendJSON(res, { success: false, error: 'Member not found' }, 404);
      }

      if (member.status === 'paid') {
        return sendJSON(res, { success: true, message: 'Already paid' });
      }

      db.prepare('UPDATE split_members SET status = \'paid\' WHERE id = ?').run(memberId);

      const newPaidCount = session.paid_seats + 1;
      db.prepare('UPDATE split_sessions SET paid_seats = ? WHERE id = ?').run(newPaidCount, sessionId);

      if (newPaidCount >= session.total_seats) {
        db.prepare('UPDATE split_sessions SET status = \'completed\' WHERE id = ?').run(sessionId);
      }

      return sendJSON(res, { success: true, newPaidCount });
    }

    // Default 404 for unmatched API requests
    return sendJSON(res, { success: false, error: 'API endpoint not found.' }, 404);
  } catch (e) {
    console.error('[API Error]', e);
    return sendJSON(res, { success: false, error: e.message }, 500);
  }
}

const requestHandler = (req, res) => {
  console.log(`[HTTPS Server] ${req.method} ${req.url}`);
  
  // Resolve path
  let urlPath = req.url.split('?')[0];
  if (urlPath.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }

  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  const filePath = path.join(__dirname, '..', urlPath);
  serveFile(filePath, req, res);
};

// 4. START HTTPS SERVER
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

const secureServer = https.createServer(options, requestHandler);

secureServer.listen(HTTPS_PORT, () => {
  const localIps = getLocalIps();
  
  console.log(`\n==================================================`);
  console.log(`🔒 ViVoo HTTPS Server started successfully!`);
  console.log(`--------------------------------------------------`);
  console.log(`- Local Address:  https://localhost:${HTTPS_PORT}`);
  
  localIps.forEach(ip => {
    console.log(`- LAN Address:    https://${ip}:${HTTPS_PORT}`);
  });
  console.log(`==================================================\n`);
  console.log(`💡 Tip: To test on a physical mobile device, make sure`);
  console.log(`your phone is on the same Wi-Fi and open the LAN link.`);
  console.log(`==================================================\n`);
});

// 5. START HTTP REDIRECT SERVER (PORT 8080 redirects to HTTPS 8443)
const redirectServer = http.createServer((req, res) => {
  const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
  const redirectUrl = `https://${host}:${HTTPS_PORT}${req.url}`;
  
  res.writeHead(301, { 'Location': redirectUrl });
  res.end();
});

redirectServer.listen(HTTP_REDIRECT_PORT, () => {
  console.log(`🔄 HTTP Redirect Server running on port ${HTTP_REDIRECT_PORT} (redirects to HTTPS ${HTTPS_PORT})`);
});
