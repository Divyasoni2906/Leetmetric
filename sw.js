// Cache name
const CACHE_NAME = "my-cache-v1";

// Files to cache
const ASSETS = ["/", "/index.html", "/styles.css", "/scripts/app.js", "/assets/icon-192x192.png"];

// Install event - Cache static files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch event - Serve cached files if available
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activate event - Cleanup old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Clearing old cache...");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
