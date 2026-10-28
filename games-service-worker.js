var CACHE_PREFIX = 'games-v';
var CACHE_VERSION = CACHE_PREFIX + '%COMMIT_SHA%';

// How long a page navigation waits on the network before falling back to
// the cached version
var NAVIGATION_TIMEOUT_MS = 1500;

var PRECACHE_URLS = [
  '/games',
  '/games/memory',
  '/games/blocks',
];

function log() {
  console.log.apply(console, ['[SW]'].concat(Array.prototype.slice.call(arguments)));
}

function warn() {
  console.warn.apply(console, ['[SW]'].concat(Array.prototype.slice.call(arguments)));
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        log('Cache ' + CACHE_VERSION + ' added');
        return self.skipWaiting();
      })
      .catch(function (error) {
        // cache.addAll() is all-or-nothing, so this version never activates
        warn('Install failed, the previous service worker stays in control: ' + error);
        throw error;
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(removeOldCaches)
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin || !isGamesPath(url.pathname)) {
    return;
  }

  if (request.mode === 'navigate') {
    respondToNavigation(event);
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(function (response) {
        return response ||
          fetch(request)
            .then(function (networkResponse) {
              putInCache(request, networkResponse);
              return networkResponse;
            });
      })
  );
});

// Network first with a timeout, falling back to the cache. Pages are cached
// without their query string, since e.g. /games/memory?lang=es-MX&game=animals
// and /games/memory?lang=en-US&game=numbers are the same HTML document: the
// query string is only read client side.
function respondToNavigation(event) {
  var request = event.request;
  var key = cacheKey(request);

  var networkPromise = fetch(request)
    .then(function (response) {
      putInCache(key, response);
      return response;
    })
    .catch(function (error) {
      warn('Error fetching ' + request.url + ': ' + error);
      return null;
    });

  // Keeps the service worker alive until the cache update above lands, even
  // if the timeout wins the race
  event.waitUntil(networkPromise);

  var timeoutPromise = new Promise(function (resolve) {
    setTimeout(function () {
      resolve(null);
    }, NAVIGATION_TIMEOUT_MS);
  });

  event.respondWith(
    Promise.race([networkPromise, timeoutPromise])
      .then(function (response) {
        if (response) {
          return response;
        }

        return caches.match(key)
          .then(function (cachedResponse) {
            if (cachedResponse) {
              log('Serving cached ' + key + ' for ' + request.url);
              return cachedResponse;
            }

            // Nothing cached, wait on the in-flight fetch instead of starting
            // a second one
            return networkPromise
              .then(function (networkResponse) {
                return networkResponse || Response.error();
              });
          });
      })
  );
}

function isGamesPath(pathname) {
  return pathname === '/games' || pathname.indexOf('/games/') === 0;
}

// Drops the query string, hash and any trailing slash, so /games/ and /games
// share an entry
function cacheKey(request) {
  var url = new URL(request.url);

  url.search = '';
  url.hash = '';

  if (url.pathname.length > 1 && url.pathname.slice(-1) === '/') {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.href;
}

// Only successful responses are cached, so an error while online never
// replaces a good cached copy
function putInCache(key, response) {
  if (!response || !response.ok) {
    return;
  }

  var responseClone = response.clone();

  caches.open(CACHE_VERSION)
    .then(function (cache) {
      return cache.put(key, responseClone);
    });
}

// Only touches this service worker's own caches, other service workers on the
// site (e.g. Geometry Club's) keep theirs
function removeOldCaches(cacheKeys) {
  return Promise.all(
    cacheKeys
      .filter(function (key) {
        return key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_VERSION;
      })
      .map(function (key) {
        log('Deleting cache ' + key);
        return caches.delete(key);
      })
  );
}
