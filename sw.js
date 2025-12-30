
const CACHE_NAME = 'civic-connect-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache external assets like fonts and icons as they are requested
        if (event.request.url.includes('google') || event.request.url.includes('gstatic') || event.request.url.includes('picsum') || event.request.url.includes('ui-avatars')) {
          const cacheCopy = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // If both fail (network and cache), we are truly offline
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
