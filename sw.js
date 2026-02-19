const CACHE_NAME = 'eq-test-v1';
const ASSETS = [
  '/eq-test/',
  '/eq-test/index.html',
  '/eq-test/js/i18n.js',
  '/eq-test/js/locales/ko.json',
  '/eq-test/js/locales/en.json',
  '/eq-test/js/locales/ja.json',
  '/eq-test/js/locales/zh.json',
  '/eq-test/js/locales/hi.json',
  '/eq-test/js/locales/ru.json',
  '/eq-test/js/locales/es.json',
  '/eq-test/js/locales/pt.json',
  '/eq-test/js/locales/id.json',
  '/eq-test/js/locales/tr.json',
  '/eq-test/js/locales/de.json',
  '/eq-test/js/locales/fr.json',
  '/eq-test/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => cached);
    })
  );
});
