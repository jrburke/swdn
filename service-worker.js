var cacheName = 'swdn-v3';

var urlsToCache = [
  '/swdn/libs/test.js',
  '/swdn/test.html'
];

self.addEventListener('install', function(event) {

  console.log(cacheName + '-install');
  console.log('has foreign fetch? ' + event.registerForeignFetch);

  // Perform install steps
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  console.log(cacheName + '-fetch: ' + url);

  if (url.indexOf('test.js') !== -1) {
    event.respondWith(new Response(
      "document.getElementById('output').textContent = " +
      "'swdn/libs/test.js from service worker cache. GOOD';",
      {
        headers: { 'Content-Type': 'application/javascript' }
      }
    ));
  } else {
    console.log('Trying cache');
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          return fetch(event.request);
        }
      )
    );
  }
});
