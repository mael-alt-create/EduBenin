const V = "lumisciences-v1",
  F = [
    "./",
    "index.html",
    "css/style.css",
    "css/catalogue.css",
    "js/helpers.js",
    "js/catalogue.js",
    "js/app.js",
    "js/lessons/maths-parabole.js",
    "js/lessons/maths-pythagore.js",
    "js/lessons/maths-volumes.js",
    "js/lessons/pct-circuit.js",
    "js/lessons/pct-titrage.js",
    "js/lessons/svt-genetique.js",
    "js/lessons/svt-photosynthese.js",
  ];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(F)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((k) => Promise.all(k.filter((x) => x !== V).map((x) => caches.delete(x)))),
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
