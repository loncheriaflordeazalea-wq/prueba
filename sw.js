const CACHE   = 'examenes-v1';
const ASSETS  = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar: cachear assets estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first para el API, cache-first para assets
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // El API de Google siempre va directo a la red
  if (url.hostname.includes('script.google.com')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } })
    ));
    return;
  }

  // Assets: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
