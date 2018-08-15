//Establish version number of cache to remove outdated caches during an update
const cacheVersion = 'v1';

//Assets to cache for offline use
const cacheAssets = [
	'/',
	'/index.html',
	'/restaurant.html',
	'/manifest.json',
	'/css/styles.css',
	'/js/idb.js',
	'/js/dbhelper.js',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/js/lazysizes.js',
	'/js/register.js',
	'/img/1_large.webp',
	'/img/2_large.webp',
	'/img/3_large.webp',
	'/img/4_large.webp',
	'/img/5_large.webp',
	'/img/6_large.webp',
	'/img/7_large.webp',
	'/img/8_large.webp',
	'/img/9_large.webp',
	'/img/10_large.webp',
	'/img/1_small.webp',
	'/img/2_small.webp',
	'/img/3_small.webp',
	'/img/4_small.webp',
	'/img/5_small.webp',
	'/img/6_small.webp',
	'/img/7_small.webp',
	'/img/8_small.webp',
	'/img/9_small.webp',
	'/img/10_small.webp',
	'/img/icon-192.png',
	'/img/icon-512.png',
	'/img/favicon.ico'
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
	event.respondWith(
		caches.match(event.request).then(response => {
			if(response) {
				return response;
			}
			else {
				const fetchRequest = event.request.clone();
				return fetch(fetchRequest).then(response => {
					if(!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}
					const responseToCache = response.clone();
					caches.open(`${cacheVersion}-restaurant`).then(cache => {
						cache.put(fetchRequest, responseToCache);
					});
					return response;
				});	
			}
		})
	);
});

