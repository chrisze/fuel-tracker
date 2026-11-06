// SR22T Tank Tracker - offline cache. Bump VERSION to force an update.
const VERSION = "sr22t-v18";
// The "?v=18" suffixes matter: GitHub Pages serves every file with
// Cache-Control max-age=600, so a plain addAll() during install can be
// satisfied by the browser's HTTP cache and store the PREVIOUS page
// under the NEW version's cache name — after which the cache-first
// fetch handler serves that stale page forever. These URLs have never
// been requested before, so install always fetches fresh from the
// network. Serving still matches, because the fetch handler looks up
// with ignoreSearch:true.
const FILES = ["./?v=18", "./index.html?v=18", "./manifest.webmanifest?v=18", "./icon-192.png?v=18", "./icon-512.png?v=18", "./apple-touch-icon.png?v=18"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request)));
});
