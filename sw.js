// Caches the app shell so the lounge opens instantly (and offline).
// Films and services always come from the network.
const CACHE = "lounge-v8";
const SHELL = ["./", "index.html", "css/style.css", "js/app.js", "js/data.js", "js/style-data.js", "js/style.js", "js/play-data.js", "js/play.js", "js/db.js", "js/vision.js", "js/closet.js", "js/scan.js", "js/stylist.js", "icons/icon.svg", "icons/nada-portrait.jpg", "manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Network first for the shell (so updates land), cache as fallback.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});
