self.addEventListener('push', (event) => {
  // サーバ側から送る payload(JSON) をそのまま通知に映す想定
  let data = {};
  try { data = event.data?.json() || {}; } catch { }
  const title = data.title ?? '通知';
  const options = {
    body: data.body ?? '',
    icon: data.icon ?? './gallery/icon-192.png',
    badge: data.badge ?? './gallery/icon-192.png',
    data: { url: data.url ?? '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.openWindow(url));
});

self.addEventListener("install", (e) => {
  console.log("ServiceWorker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("ServiceWorker activated");
  clients.claim();
});

// SPA用：常に index.html を返す
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch("./index.html"));
    return;
  }
});

