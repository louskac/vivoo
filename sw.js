const CACHE_NAME = 'vivoo-cache-v18';
const ASSETS = [
  './',
  './index.html',
  './index.css?v=18',
  './app.js',
  './manifest.json',
  './icon.svg?v=18',
  './icon.png?v=18',
  './apple-touch-icon.png?v=18'
];



// Install Service Worker and cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event (clean up old caches)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network-first for static code files (PWA updates instantly), Cache-first for media assets
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith('http')) return;

  // Bypass service worker for all dynamic API calls
  if (e.request.url.includes('/api/')) {
    return;
  }

  // Bypass service worker completely for CDN video streams and MP4s (ensures iOS Safari range requests work)
  if (e.request.url.includes('commondatastorage.googleapis.com') || e.request.url.endsWith('.mp4')) {
    return;
  }

  // Network-First files (HTML, CSS, JS, manifest)
  const isCodeAsset = e.request.url.endsWith('/') || 
                      e.request.url.includes('index.html') || 
                      e.request.url.includes('index.css') || 
                      e.request.url.includes('app.js') || 
                      e.request.url.includes('manifest.json');

  if (isCodeAsset) {
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        // Update cache on successful network fetch
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cached version if offline
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // Fallback to cached index.html for navigation requests
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
  } else {
    // Cache-First strategy for static images and assets (logos, icons)
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
