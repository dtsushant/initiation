importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js",
);

if (workbox) {
  console.log("Workbox is loaded");

  // Precache fallback
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Cache static assets
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "script" || request.destination === "style",
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-resources",
    }),
  );

  // Background sync example
  const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
    "postQueue",
    {
      maxRetentionTime: 24 * 60, // Retry for max of 24 hours
    },
  );

  workbox.routing.registerRoute(
    /\/api\/submit/, // POSTs to /api/submit
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin],
    }),
    "POST",
  );

  // Push handling
  self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    const title = data.title || "New Notification";
    const options = {
      body: data.body || "You have a new message.",
      icon: "icon-192.png",
      badge: "icon-192.png",
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });

  // Notification click
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
  });

  // Message handling (optional)
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
} else {
  console.log("Workbox failed to load");
}
const CACHE_NAME = "layout-app-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new message.",
    icon: "icon-192.png",
    badge: "icon-192.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
