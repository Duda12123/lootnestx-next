const CACHE = "toolnest-v1"
const ASSETS = ["/", "/manifest.json"]

self.addEventListener("install", (e: any) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
})

self.addEventListener("fetch", (e: any) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  )
})
