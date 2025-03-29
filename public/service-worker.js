// Install event - Ensures SW is installed correctly
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

// Activate event - Ensures clients are claimed properly
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated');
});

// Push notification event
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      event.waitUntil(
        self.registration.showNotification(data.title || 'Pomodoro Alert', {
          body: data.message || 'Time is up!',
          icon: '/android-chrome-192x192.png',
          badge: '/android-chrome-192x192.png',
          tag: 'pomodoro-notification',
          vibrate: [200, 100, 200],
          data: { url: '/' } // Ensure URL data exists
        })
      );
    } catch (error) {
      console.error('Error parsing push event data:', error);
    }
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (event.notification.data?.url) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

// Message event listener for custom timer notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TIMER_COMPLETED') {
    const { title, message } = event.data;

    if (title && message) {
      self.registration.showNotification(title, {
        body: message,
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-192x192.png',
        tag: 'pomodoro-notification',
        vibrate: [200, 100, 200],
        data: { url: '/' }
      });
    } else {
      console.error('Invalid TIMER_COMPLETED message data:', event.data);
    }
  }
});
