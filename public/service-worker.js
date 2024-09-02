const CACHE_NAME = 'my-cache-v1';
const URLS_TO_CACHE = ['/settings/downloads'];

// Cache the page and its resources during the install phase
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE); // Cache the page URL
        })
    );
    self.skipWaiting(); // Activate the service worker immediately after installation
});

// Fetch event to cache CSS, images, and other resources
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                // Cache new resources
                return caches.open(CACHE_NAME).then((cache) => {
                    if (event.request.url.startsWith(self.location.origin)) {
                        // Cache only same-origin resources (CSS, images, etc.)
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
            });
        }).catch(() => {
            // Fallback to offline page if necessary
            if (event.request.mode === 'navigate') {
                return caches.match('/settings/downloads');
            }
        })
    );
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Ensure the service worker controls all pages
});