export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const isPushNotificationSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const requestPushNotificationPermission = async (): Promise<boolean> => {
  if (!isPushNotificationSupported()) {
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const sendTimerNotification = async (
  title: string,
  message: string
): Promise<void> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'TIMER_COMPLETED',
      title,
      message
    });
    return;
  }
  
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: message,
        icon: '/icons/icon-192x192.png'
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};

export const playNotificationSound = (soundUrl = '/notification.mp3'): void => {
  try {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.log('Audio playback error (likely due to browser autoplay restrictions):', error);
    });
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};