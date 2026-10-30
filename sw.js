// קוד סרביס וורקר חסין שגיאות - מותאם לדרישות WebAPK של גוגל כרום באנדרואיד
const CACHE_NAME = 'pwa-secure-tasks-v2';

self.addEventListener('install', event => {
  self.skipWaiting(); // כפיית הפעלה מיידית של הגרסה החדשה
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // השגת שליטה על הדף באופן מיידי
});

self.addEventListener('fetch', event => {
  // פונקציונליות חובה למעבר מבדק ה-PWA בכרום
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
