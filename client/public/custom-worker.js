self.addEventListener('install', function(event) {
  const ASSETS_URL  = '/assets/',
        CSS_URL     = '/static/css/',
        JS_URL      = '/static/js/',
        CACHE_NAME  = 'assetCache',
        urlsToCache = [
          // DESKTOP
          `/`,
          // CSS Chunks
          `${CSS_URL}main.b98c4016.chunk.css`,
          `${CSS_URL}2.bbc39d94.chunk.css`,
          `${CSS_URL}3.641a7774.chunk.css`,
          // JS Chunks
          `${JS_URL}runtime~main.abbfb56c5.js`,
          `${JS_URL}main.ed129144.chunk.js`,
          `${JS_URL}2.074c83c1.chunk.js`,
          `${JS_URL}3.6e021e0d.chunk.js`,
          `${JS_URL}4.42ddf1c4.chunk.js`,
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

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Open a cache and cache our files
        // console.log('urlsToCache');
        // console.log(urlsToCache);
        return cache.addAll(urlsToCache).then(function(){
          console.log('Assets added to cache');
        }).catch(function(err){
          console.log(`Service Worker Error Fetching Assets`, err);
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('activate')
})

self.addEventListener('fetch', function(event) {
    console.log(event);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request).then(function(fetchRes){
              return fetchRes
            }).catch((err) => {
              console.log("Service Worker Error");
              console.log(err);
            });
        })
    );
});