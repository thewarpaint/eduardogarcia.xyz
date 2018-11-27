var CACHE_VERSION = 'cache-v%COMMIT_SHA%';

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
          '/assets/js/main.js',
          '/assets/js/geometry-club.js',
          '/assets/css/main.css',
          '/assets/css/geometry-club.css',
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
