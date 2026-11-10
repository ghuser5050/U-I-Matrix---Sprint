// שם המטמון של האפליקציה שלך
const CACHE_NAME = 'smart-matrix-pwa-v1';

// רשימת המשאבים הבסיסיים שחובה לשמור במטמון לעבודה אופליין מלאה
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap'
];

// שלב ההתקנה: יצירת המטמון ושמירת הקבצים החיוניים
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA Cache פתוח ומוכן');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// שלב האקטיבציה: ניקוי מטמונים ישנים במידה והקוד עודכן
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('מנקה מטמון ישן:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// אסטרטגיית Fetch: ניסיון טעינה מהרשת, ואם אין קליטה (אופליין) – שליפת המידע מהמטמון
self.addEventListener('fetch', (event) => {
  // מאפשר רק בקשות מסוג GET כדי לא להכשיל פעולות פנימיות
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // אם התקבלה תשובה תקינה מהרשת, נשמור עותק מעודכן במטמון
        if (response && response.status === 200 && event.request.url.startsWith('http')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // במידה ואין רשת (Offline), נשלוף את המידע ששמרנו מראש במטמון
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // פולבק בסיסי במידה והמשאב לא במטמון
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
