// service-worker.js - Save this to your public folder
const CACHE_NAME = 'classroom-stream-v1';
const ASSETS = [
  '/',
  '/main.html',
  '/styles.css',
  '/app.js',
  '/offline.html', // Create a simple offline fallback page
  '/images/logo.png'
  // Add other essential assets
];

// During service worker installation, cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Network first, falling back to cache strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // For API requests, try network only
  if (event.request.url.includes('/api/')) {
    return fetch(event.request).catch(error => {
      return caches.match('/offline.html');
    });
  }
  
  // For socket.io requests, bypass service worker
  if (event.request.url.includes('/socket.io/')) {
    return;
  }
  
  // For everything else, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response for caching
        const responseToCache = response.clone();
        
        // Only cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      })
      .catch(error => {
        // If network fails, try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            // Return cached response or offline fallback
            return cachedResponse || caches.match('/offline.html');
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_ROOM_DATA') {
    const roomData = event.data.roomData;
    caches.open(CACHE_NAME + '-rooms')
      .then(cache => {
        // Store room data in a separate cache
        const response = new Response(JSON.stringify(roomData), {
          headers: { 'Content-Type': 'application/json' }
        });
        cache.put(`/rooms/${roomData.roomID}`, response);
      });
  }
});