// Push notifications scaffold only.
// Intentionally does NOT include any VAPID keys, FCM keys, or credentials.

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined') return 'default';
  if (!('Notification' in window)) return 'denied';

  return Notification.requestPermission();
}

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window;
}
