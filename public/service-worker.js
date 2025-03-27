
// Cache name with version
const CACHE_NAME = 'pomodoro-app-v2';

// URLs to cache initially
const URLS_TO_CACHE = [
  '/',
  '/index.html',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  // Activate service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure service worker takes control immediately
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from cache
        if (response) {
          return response;
        }
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request
        return fetch(fetchRequest).then(
          (response) => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
      .catch(() => {
        // Fallback for offline page if needed
        if (event.request.url.indexOf('.html') > -1) {
          return caches.match('/');
        }
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    // Show notification with data from push event
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-192x192.png',
        tag: 'pomodoro-notification',
        vibrate: [200, 100, 200],
        data
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus or open window when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        if (clientList.length > 0) {
          // Focus existing window
          return clientList[0].focus();
        } else {
          // Open new window
          return clients.openWindow('/');
        }
      })
  );
});

// Custom event listener for timer notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TIMER_COMPLETED') {
    const { title, message } = event.data;
    
    // Show notification
    self.registration.showNotification(title, {
      body: message,
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      tag: 'pomodoro-notification',
      vibrate: [200, 100, 200],
      data: { url: '/' }
    });
  }
});
