const CACHE_NAME = "x-clone-cache-v2";
const OFFLINE_URL = "/offline.html";

// Files to cache (add more if needed)
const STATIC_ASSETS = [
  "/",
  "/index.html",
  OFFLINE_URL,
  "/assets/x-logo.png",
  "/manifest.json",
];

// On install - cache offline page and static files
self.addEventListener("install", (event) => {
  console.log("🛠️ Installing service worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching static assets");
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.error("❌ Failed to cache some assets:", error);
        // Still proceed even if some assets fail to cache
      });
    })
  );
  self.skipWaiting();
});

// On activate - cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("✅ Service worker activated");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (!url.origin === location.origin) {
    return;
  }

  // API GET request caching
  if (url.pathname.startsWith("/api/") && request.method === "GET") {
    event.respondWith(
      caches.open("api-cache").then((cache) =>
        fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(request) || caches.match(OFFLINE_URL))
      )
    );
    return;
  }

  // Handle navigation requests (page loads)
  if (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept").includes("text/html"))
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful, return the response
          if (response.ok) {
            return response;
          }
          // If not successful, serve offline page
          return caches.match(OFFLINE_URL);
        })
        .catch(() => {
          // Network failed, serve offline page
          console.log("🔄 Serving offline page");
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Static asset caching with offline fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).catch(() => {
        // If it's an image or other asset, you might want to return a fallback
        if (request.destination === "image") {
          return caches.match("/assets/x-logo.png");
        }
        return new Response("Offline", { status: 503 });
      });
    })
  );
});
