// const CACHE_NAME = 'my-cache-v1';
// const URLs_TO_CACHE = [
//     '/settings/downloads',
// ];

// // Cache the necessary assets during the install phase
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(URLs_TO_CACHE);
//         })
//     );
// });

// // Serve cached assets and fetch new assets when online
// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request).then((networkResponse) => {
//                 // Optionally, cache the newly fetched assets
//                 return caches.open(CACHE_NAME).then((cache) => {
//                     cache.put(event.request, networkResponse.clone());
//                     return networkResponse;
//                 });
//             });
//         }).catch(() => {
//             // Optional: fallback to an offline page if available
//             return caches.match('/offline.html');
//         })
//     );
// });

// // Optionally, add a fetch event to handle all requests
// self.addEventListener('fetch', (event) => {
//     if (event.request.mode === 'navigate') {
//         event.respondWith(
//             fetch(event.request).catch(() => {
//                 return caches.match('/offline.html');
//             })
//         );
//     } else {
//         event.respondWith(
//             caches.match(event.request).then((response) => {
//                 return response || fetch(event.request).then((networkResponse) => {
//                     return caches.open(CACHE_NAME).then((cache) => {
//                         cache.put(event.request, networkResponse.clone());
//                         return networkResponse;
//                     });
//                 });
//             })
//         );
//     }
// });
