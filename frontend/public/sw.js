const CACHE_NAME = 'ortiz-auto-cache-v1';

// Evento de instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

// Evento de activación
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Evento de consumo de datos (fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});