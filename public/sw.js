// public/sw.js
// Ramadan Daily Reminder Service Worker

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle push events from server (if you add web push later)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? '🌙 Ramadan Reminder', {
      body: data.body ?? 'Your daily Ramadan reminder is ready!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'ramadan-daily',
      requireInteraction: false,
    })
  );
});

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/ramadan') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/ramadan/daily-reminder');
      }
    })
  );
});

// ── Schedule daily 6 AM notification via periodic background sync fallback ──
// This fires when the browser wakes the SW (not guaranteed on all browsers,
// but Chrome on Android supports it with periodicSync permission).
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'ramadan-daily-reminder') {
    event.waitUntil(showDailyReminder());
  }
});

async function showDailyReminder() {
  const RAMADAN_START = new Date('2026-02-18T00:00:00').getTime();
  const diff = Math.floor((Date.now() - RAMADAN_START) / 86400000);
  const day = Math.min(Math.max(diff + 1, 1), 30);

  return self.registration.showNotification('🌙 Ramadan Daily Reminder', {
    body: `Day ${day} of Ramadan — Your reminder is ready. Open the app to read it.`,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'ramadan-daily',
    data: { url: '/ramadan/daily-reminder' },
  });
}
