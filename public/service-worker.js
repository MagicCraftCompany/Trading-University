// Trading University Service Worker
const CACHE_NAME = 'trading-university-cache-v1';

// Skip waiting to activate the service worker immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Simple network-first strategy with fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before using it
        const responseToCache = response.clone();
        
        // Cache the successful response
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // If network request fails, try to return from cache
        return caches.match(event.request);
      })
  );
});

// Handle service worker messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 