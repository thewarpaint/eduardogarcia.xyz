var CACHE_VERSION = 'cache-v463433e';

self.addEventListener('install', function (event) {
  addAssetsToCache(event);
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(removeOldCaches)
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        return response ||
          fetch(event.request)
            .catch(function (error) {
              console.error('Error fetching request ' + event.request + ': ' + error);
            });
      })
  );
});

function addAssetsToCache(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function (cache) {
        console.log('Cache ' + CACHE_VERSION + ' added');

        return cache.addAll([
          '/geometry-club',
          '/assets/js/main.js.6c8d34e4d9f32beef481d506919d9d7004096bcd.js',
          '/assets/js/geometry-club.js.7cc1ae06b4b2d2832cdb1e12440b16ec81951054.js',
          '/assets/css/main.css',
          '/assets/css/geometry-club.css.6a4a8c79db75873a0562020fc5d0999b175d87cb.css',
          '/assets/images/geometry-club-preview.jpg',
          '/assets/images/geometry-club-preview--128-128.jpg',
        ]);
      })
  );
}

function removeOldCaches(cacheKeys) {
  return Promise.all(
    cacheKeys
      .filter(function (cacheKey) {
        return cacheKey !== CACHE_VERSION;
      })
      .map(function (cacheKey) {
        console.log('Deleting cache ' + cacheKey);
        return caches.delete(cacheKey);
      })
  );
}
