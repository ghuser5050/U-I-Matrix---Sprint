const CACHE_NAME = 'pwa-tasks-cache-v1';
const ASSETS = [
  './',
  'index.html',
  'manifest.json'
];

// התקנת ה-Service Worker ואיסוף הקבצים לזיכרון המטמון
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// ניהול בקשות הרשת וטעינת הקבצים מהזיכרון המקומי באופליין
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
