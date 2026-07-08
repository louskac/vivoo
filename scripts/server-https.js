const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

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

const requestHandler = (req, res) => {
  console.log(`[HTTPS Server] ${req.method} ${req.url}`);
  
  // Resolve path
  let urlPath = req.url.split('?')[0];
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
