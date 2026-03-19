const CACHE_NAME = "store-cache-v1";

const urlsToCache = [
    "./",
    "index.html",
    "styles.css",
    "script.js",

    // Product Images
    "https://images.unsplash.com/photo-1589927986089-35812388d1f4",
    "https://images.unsplash.com/photo-1608198093002-ad4e005484a5",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    "https://images.unsplash.com/photo-1603048297172-c92544798e80"
];

// Install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response =>
            response || fetch(event.request)
        )
    );
});