// self.addEventListener('push', (event) => {
//   let data = {};
//   try { data = event.data.json(); }
//   catch { data = { title: 'Notification', body: event.data?.text() }; }

//   const options = {
//     body: data.body,
//     icon: '/favicon.ico',
//     badge: '/favicon.ico',
//     data: data.url || '/'
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.title, options)
//   );
// });

// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   event.waitUntil(clients.openWindow(event.notification.data));
// });

// self.addEventListener("push", function (event) {
//   const data = event.data ? event.data.json() : {};
//   event.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.body,
//       icon: "/logo192.png",
//       data: { url: data.url || "/" }
//     })
//   );
// });

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
