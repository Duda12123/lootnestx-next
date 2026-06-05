const CACHE = "toolnest-v2"

self.addEventListener("install", (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/manifest.json"])))
})

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  )
})
