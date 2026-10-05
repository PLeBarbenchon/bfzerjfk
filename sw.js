// Garde le site en mémoire sur le téléphone pour qu'il marche hors-ligne.
// Si tu modifies le site, change "v2" en "v3" pour forcer la mise à jour.
const CACHE = "jeux-v2";
const FICHIERS = ["./", "index.html", "chronologie.html"];

self.addEventListener("install", e => {
  self.skipWaiting();
  // Chaque fichier est ajouté séparément : s'il en manque un, les autres sont quand même gardés
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FICHIERS.map(f => c.add(f).catch(() => {})))));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(rep => {
      const copie = rep.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie));
      return rep;
    }))
  );
});
