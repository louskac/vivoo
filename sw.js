const CACHE_NAME = 'vivoo-cache-v30';
const ASSETS = [
  './',
  './manifest.json',
  './icon.svg',
  './icon.png',
  './apple-touch-icon.png'
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

  // Network-First files (manifest, HTML pages)
  const isCodeAsset = e.request.url.endsWith('/') || 
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
