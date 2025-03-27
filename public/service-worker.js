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