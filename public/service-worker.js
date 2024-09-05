// const CACHE_NAME = 'audio-component-cache-v1';
// const AUDIO_CACHE_URLS = [
//   '/src/app/settings/downloads', // The component's page URL
//   '/assets', // CSS file for the component

// ];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(AUDIO_CACHE_URLS);
//     })
//   );
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }
//       return fetch(event.request).then((response) => {
//         return caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, response.clone());
//           return response;
//         });
//       });
//     })
//   );
// });

// self.addEventListener('activate', (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

const CACHE_NAME = 'my-cache-v1';
const URLS_TO_CACHE = [
    '/settings/downloads',
    "favicon.ico",
    "/_next/static/chunks/reactPlayerFilePlayer.js",
    "/_next/image?url=%2Floader-animated-gif.gif&w=48&q=75",
    "/assets/images/download-explanation.jpg",
    "/wifi.svg"
];


const cacheDynamicImages = (request) => {
    if (request.url.includes('/_next/image')) {
        return fetch(request)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${request.url}: ${response.statusText}`);
                }
                const responseClone = response.clone();
                return caches.open(CACHE_NAME).then((cache) => {
                    return cache.put(request, responseClone);
                });
            })
            .catch((error) => {
                console.error(`Failed to cache ${request.url}:`, error);
            });
    }
    return fetch(request); // For non-image requests, just fetch normally
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache:', cache);
            return Promise.all(
                URLS_TO_CACHE.map((url) => {
                    return fetch(url)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                            }
                            // Clone the response before caching it
                            const responseClone = response.clone();
                            return cache.put(url, responseClone);
                        })
                        .catch((error) => {
                            console.error(`Failed to cache ${url}:`, error);
                        });
                })
            );
        })
    );
    self.skipWaiting(); // Activate the service worker immediately after installation
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('Serving from cache:', event.request.url);
                return response; // Serve from cache
            }
            return cacheDynamicImages(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).catch(() => {
                    console.error('Fetching failed, no cache available.');
                    return caches.match('/settings/downloads'); // Return fallback page if available
                });
            })
        })
    );
});

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
