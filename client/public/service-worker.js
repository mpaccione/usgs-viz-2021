// Set this to true for production
const doCache = true;

// Cache
const CACHE_NAME = "quake-viz-cache-1.0";
const ASSETS_URL = "/assets/";
const CSS_URL = "/static/css/";
const JS_URL = "/static/js/";
const urlsToCache = [
  // DESKTOP
  `/`,
  // CSS Chunks
  `${CSS_URL}main.29521d99.chunk.css`,
  `${CSS_URL}2.85f7760d.chunk.css`,
  `${CSS_URL}4.6ecebf6e.chunk.css`,
  // JS Chunks
  `${JS_URL}runtime~main.77309457.js`,
  `${JS_URL}main.498f36cc.chunk.js`,
  `${JS_URL}2.08a31337.chunk.js`,
  `${JS_URL}3.bb60ac8e.chunk.js`,
  `${JS_URL}4.e6a30b6f.chunk.js`,
  // Globe Texture
  `${ASSETS_URL}moltenCore1k_optimized.jpg`,
  `${ASSETS_URL}earthmap4k_optimized.jpg`,
  `${ASSETS_URL}earthClouds4k_optimized.jpg`,
  `${ASSETS_URL}politicalmap4k_optimized.jpg`,
  `${ASSETS_URL}tectonic4k_optimized.jpg`,
  // Globe Bumpmap
  `${ASSETS_URL}earthbump4k_optimized.jpg`,
  // Globe Sepcular
  `${ASSETS_URL}earthspec4k_optimized.jpg`,
  // Skybox Texture
  `${ASSETS_URL}skybox_posx.png`,
  `${ASSETS_URL}skybox_posy.png`,
  `${ASSETS_URL}skybox_posz.png`,
  `${ASSETS_URL}skybox_negx.png`,
  `${ASSETS_URL}skybox_negy.png`,
  `${ASSETS_URL}skybox_negz.png`,
];

// Delete old caches that are not our current one!
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            console.log("Deleting cache: " + key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// The first time the user starts up the PWA, 'install' is triggered.
self.addEventListener("install", function (event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        cache.addAll(urlsToCache);
      })
    );
  }
});

// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
self.addEventListener("fetch", function (event) {
  if (doCache) {
    console.log({event})
    console.log({caches})
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request)
            .then(function (fetchRes) {
              return fetchRes;
            })
            .catch((err) => {
              console.log("Service Worker Error");
              console.log(err);
            })
        );
      })
    );
  }
});
