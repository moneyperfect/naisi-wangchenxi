const CACHE_NAME = "couples-v6";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Only cache GET requests, skip navigation and API calls
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") return;
  if (e.request.url.includes("/api/")) return;
});
