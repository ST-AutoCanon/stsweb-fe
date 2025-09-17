
// service-worker.js

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Notification', body: event.data?.text() || '' };
  }

  const options = {
    body: data.body,
    icon: '/logo192.png', // your notification icon
    badge: '/favicon.ico',
    data: data.url || '/',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
