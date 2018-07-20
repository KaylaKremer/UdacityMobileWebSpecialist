// Import IndexedDB
import idb from 'idb';

// Establish version number of cache to remove outdated caches during an update
const cacheVersion = 'v3';

// Created IndexedDB database
const dbPromise = idb.open('restaurant-reviews-db', 1, upgradeDB => {
	switch (upgradeDB.oldVersion) {
	case 0:
		upgradeDB.createObjectStore('restaurants-reviews', {keyPath: 'id'});
	}
});

// Assets to cache for offline use
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
	'/css/styles.css',
	'/js/dbhelper.js',
	'/js/index.js',
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

// Installs a service worker and caches assets with current cache version as its name.
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(`${cacheVersion}-restaurant-reviews`).then(cache => {
			return cache.addAll(cacheAssets);
		}).catch(error => {
			console.log(`Cache install failed: ${error}`);
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

/* Code below is WIP */
self.addEventListener('fetch', event => {
	const requestURL = new URL(event.request.url);
	if (requestURL.port === '1337'){
		console.log(requestURL.searchParams);
		if(requestURL.searchParams.get('id')){
			const id = requestURL.searchParams.get('id');
			console.log('id', id);
			handleIndexedDBRequest(event, id);
		} else {
			const id = '0';
			console.log('id', id);
			handleIndexedDBRequest(event, id);
		}
	} else {
		handleCacheRequest(event);
	}
});

function handleIndexedDBRequest(event, id){
	event.respondWith(
		dbPromise.then(db => {
			const tx = db.transaction('restaurant-reviews');
			const restaurantReviewsStore = tx.objectStore('restaurant-reviews');
			return restaurantReviewsStore.get(id);
		}).then(restaurantReview => {
			if (restaurantReview.data) {
				return restaurantReview.data;
			} else {
				fetch(event.request).then(fetchedRestaurantReview => {
					fetchedRestaurantReview.json();
				}).then(restaurantReview => {
					return dbPromise.then(db => {
						const tx = db.transaction('restaurant-reviews', 'readwrite');
						const restaurantReviewsStore = tx.objectStore('restaurant-reviews');
						restaurantReviewsStore.put({
							id: id,
							data: restaurantReview
						});
						return restaurantReview;
					});
				}).then(response => {
					console.log(response);
				}).catch(error => {
					console.log(`Failed to retrieve data from server: ${error}`);
				});
			}
		}).catch(error => {
			console.log(`Failed to retrieve data from IndexedDB: ${error}`);
		})
	);
}

function handleCacheRequest(event){
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
				caches.open(`${cacheVersion}-restaurant-reviews`).then(cache => {
					cache.put(event.request, responseToCache);
				});
				return response;
			});
		})
	);
}