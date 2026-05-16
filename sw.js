const CACHE  = 'exm-v3';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (new URL(e.request.url).hostname.includes('script.google.com')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response('[]', { headers: {'Content-Type':'application/json'} })
    ));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
