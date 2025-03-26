
import { sendTimerNotification, playNotificationSound, requestPushNotificationPermission } from './pwaUtils';

// Request notification permission on page load
export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return await requestPushNotificationPermission();
      }
    }
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions): void => {
  sendTimerNotification(title, options?.body || '');
  playNotificationSound();
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateEstimatedFinishTime = (
  remainingPomodoros: number,
  pomodoroLength: number = 25
): string | null => {
  if (remainingPomodoros <= 0) return null;
  
  const now = new Date();
  const minutesToAdd = remainingPomodoros * pomodoroLength;
  const finishTime = new Date(now.getTime() + minutesToAdd * 60000);
  
  return finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
