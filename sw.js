//Establish version number of cache to remove outdated caches during an update
const cacheVersion = 'v1';

//Assets to cache for offline use
const cacheAssets = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/restaurant.html?id=1',
    '/restaurant.html?id=2',
    '/restaurant.html?id=3',
    '/restaurant.html?id=4',
    '/restaurant.html?id=5',
    '/restaurant.html?id=6',
    '/restaurant.html?id=7',
    '/restaurant.html?id=8',
    '/restaurant.html?id=9',
    '/restaurant.html?id=10',
    '/data/restaurants.json',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/img/1_large.jpg',
    '/img/2_large.jpg',
    '/img/3_large.jpg',
    '/img/4_large.jpg',
    '/img/5_large.jpg',
    '/img/6_large.jpg',
    '/img/7_large.jpg',
    '/img/8_large.jpg',
    '/img/9_large.jpg',
    '/img/10_large.jpg',
    '/img/1_small.jpg',
    '/img/2_small.jpg',
    '/img/3_small.jpg',
    '/img/4_small.jpg',
    '/img/5_small.jpg',
    '/img/6_small.jpg',
    '/img/7_small.jpg',
    '/img/8_small.jpg',
    '/img/9_small.jpg',
    '/img/10_small.jpg'
];

//Installs a service worker and caches assets with current cache version as its name.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(`${cacheVersion}-restaurant`).then(cache => {
            return cache.addAll(cacheAssets);
        })
    );
    console.log('Installed service worker and cached assets');
});

/* Updates the service worker with a newer version (if available in a waiting state). Activate fires once older service worker no longer controls current pages. Older cache(s) is also deleted. */
self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.filter(cacheName => {
            return !cacheName.startsWith(cacheVersion);
        }).map(cacheName => {
            return caches.delete(cacheName);
        }));
    }));
    console.log('Deleted old cache and activated new service worker');
});

/* Fetches assets from the cache the service worker created if a matching response is found. If not, fetches assets from the network and adds these new asset requests to the cache. */
self.addEventListener('fetch', event => {
    /* Fix found from Stack Overflow for this error message sometimes received in Chrome Browser - TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-orgin' mode. */
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(
        caches.match(event.request).then(response => {
            if(response) {
                console.log(`Found ${event.request.url} in cache`);
                return response;
            }

            const fetchRequest = event.request.clone();
            console.log(`Network request for ${event.request.url}`);
            return fetch(fetchRequest).then(response => {
                if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(`${cacheVersion}-restaurant`).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});

