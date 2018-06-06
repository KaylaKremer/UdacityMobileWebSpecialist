//Establish version number of cache to remove outdated caches during an update.
const cacheVersion = 'v29';

const cacheFiles = [
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(`${cacheVersion}-restaurant`).then(cache => {
            return cache.addAll(cacheFiles);
        })
    ).then( () => {
        console.log('Install completed');
    }).catch( () => {
        console.log('Install failed');
    });
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.filter(cacheName => {
            return !cacheName.startsWith(cacheVersion);
        }).map(cacheName => {
            return caches.delete(cacheName);
        }));
    }).then( () => {
        console.log('Activate completed');
        }).catch( () => {
            console.log('Activate failed');
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
                return;
            }
            if(response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

