const dbPromise = idb.open('restaurant-reviews-db', 2, upgradeDB => {
	switch (upgradeDB.oldVersion){
	case 0:
		upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});
	case 1:
		const reviewsStore = upgradeDB.createObjectStore('reviews', {keyPath: 'id'});
		reviewsStore.createIndex('restaurant_id', 'restaurant_id');
	}
});

/**
 * Common database helper functions.
 */
class DBHelper {
	
	/**
   * Database URL.
   * Changed to retrieve restaurants & reviews from server on localhost:1337.
   */
	static get DATABASE_RESTAURANTS_URL() {
		const port = 1337; // Change this to your server port
		return `http://localhost:${port}/restaurants`;
	}

	static get DATABASE_REVIEWS_URL() {
		const port = 1337; // Change this to your server port
		return `http://localhost:${port}/reviews`;
	}

	/**
   * Fetches all restaurant reviews data. Creates an IndexedDB database named 'restaurant-reviews-db' with an object store of 'restaurant-reviews'. If response from the server is ok, stores data received into the database and then returns the data. If response from the server fails, look in the database to see if there is data already stored there and return the data. Catches and handles errors appropriately when data cannot be retrieved.
   */
	static fetchRestaurants(callback, id) {
		let restaurantURL;
		id ? restaurantURL = `${DBHelper.DATABASE_RESTAURANTS_URL}/${id}` : restaurantURL = `${DBHelper.DATABASE_RESTAURANTS_URL}`;

		fetch(restaurantURL).then(response => {
			if(response.ok){
				return response.json().then(restaurants => {
					dbPromise.then(db => {
						const tx = db.transaction('restaurants', 'readwrite');
						let restaurantsStore = tx.objectStore('restaurants');
						for (let i = 0; i < restaurants.length; i++){
							restaurantsStore.put(restaurants[i]);
						}
						return tx.complete && restaurantsStore.getAll();
					}).then(fetchedRestaurants => {
						console.log(`Successfully fetched restaurants from server & stored in IndexedDB!`);
						return callback(null, fetchedRestaurants);
					}).catch(error => {
						return callback(`Failed to fetch restaurants from server & store in IndexedDB: ${error}`, null);
					});
				});
			}
			else {
				dbPromise.then(db => {
					const tx = db.transaction('restaurants', 'readonly');
					let restaurantsStore = tx.objectStore('restaurants');
					return tx.complete && restaurantsStore.getAll();
				}).then(fetchedRestaurants => {
					console.log(`Successfully fetched data from IndexedDB!`);
					return callback(null, fetchedRestaurants);
				}).catch(error => {
					return callback(`Failed to fetch restaurants from IndexedDB: ${error}`, null);
				});
			}
		}).catch(error => {
			return callback(`Fetch request for restaurants from server failed: ${error}`, null);
		});
	}

	/**
   * Fetch a restaurant by its ID.
   */
	static fetchRestaurantById(id, callback) {
		// fetch all restaurants with proper error handling.
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const restaurant = restaurants.find(r => r.id === parseInt(id));
				if (restaurant) { // Got the restaurant
					callback(null, restaurant);
				} else { // Restaurant does not exist in the database
					callback('Restaurant does not exist', null);
				}
			}
		});
	}

	/**
   * Fetch a review by its ID.
   */
	static fetchReviewsById(id, callback){
		const reviewURL = `${DBHelper.DATABASE_REVIEWS_URL}/?restaurant_id=${id}`;
		fetch(reviewURL, {method: 'GET'}).then(response => {
			if(response.ok){
				return response.json().then(reviews => {
					dbPromise.then(db => {
						const tx = db.transaction('reviews', 'readwrite');
						let reviewsStore = tx.objectStore('reviews');
						for (let i = 0; i < reviews.length; i++){
							reviewsStore.put(reviews[i]);
						}
						const indexRestaurantId = reviewsStore.index('restaurant_id');
						return tx.complete && indexRestaurantId.getAll(parseInt(id));
					}).then(fetchedReviews => {
						console.log(`Successfully fetched reviews from server & stored in IndexedDB!`);
						return callback(null, fetchedReviews);
					}).catch(error => {
						return callback(`Failed to fetch reviews from server & store in IndexedDB: ${error}`, null);
					});
				});
			}
			else {
				dbPromise.then(db => {
					const tx = db.transaction('reviews', 'readonly');
					let reviewsStore = tx.objectStore('reviews');
					const indexRestaurantId = reviewsStore.index('resataurant_id');
					return tx.complete && indexRestaurantId.getAll(id);
				}).then(fetchedReviews => {
					console.log(`Successfully fetched reviews from IndexedDB!`);
					return callback(null, fetchedReviews);
				}).catch(error => {
					return callback(`Failed to fetch reviews from IndexedDB: ${error}`, null);
				});
			}
		}).catch(error => {
			return callback(`Fetch request for reviews from server failed: ${error}`, null);
		});
	}

	/**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
	static fetchRestaurantByCuisine(cuisine, callback) {
		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given cuisine type
				const results = restaurants.filter(r => r.cuisine_type == cuisine);
				callback(null, results);
			}
		});
	}

	/**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
	static fetchRestaurantByNeighborhood(neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given neighborhood
				const results = restaurants.filter(r => r.neighborhood == neighborhood);
				callback(null, results);
			}
		});
	}

	/**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
	static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				let results = restaurants;
				if (cuisine != 'all') { // filter by cuisine
					results = results.filter(r => r.cuisine_type == cuisine);
				}
				if (neighborhood != 'all') { // filter by neighborhood
					results = results.filter(r => r.neighborhood == neighborhood);
				}
				callback(null, results);
			}
		});
	}

	/**
   * Fetch all neighborhoods with proper error handling.
   */
	static fetchNeighborhoods(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all neighborhoods from all restaurants
				const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
				// Remove duplicates from neighborhoods
				const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
				callback(null, uniqueNeighborhoods);
			}
		});
	}

	/**
   * Fetch all cuisines with proper error handling.
   */
	static fetchCuisines(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all cuisines from all restaurants
				const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
				// Remove duplicates from cuisines
				const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
				callback(null, uniqueCuisines);
			}
		});
	}

	/**
   * Restaurant page URL.
   */
	static urlForRestaurant(restaurant) {
		return (`./restaurant.html?id=${restaurant.id}`);
	}

	/**
   * Restaurant small image URL.
   */
	static smallImageUrlForRestaurant(restaurant) {
		return (`/img/${restaurant.photograph_small}`);
	}

	/**
   * Restaurant large image URL.
   */
	static largeImageUrlForRestaurant(restaurant) {
		return (`/img/${restaurant.photograph_large}`);
	}

	/**
   * Map marker for a restaurant.
   */
	static mapMarkerForRestaurant(restaurant, map) {
		const marker = new google.maps.Marker({
			position: restaurant.latlng,
			title: restaurant.name,
			url: DBHelper.urlForRestaurant(restaurant),
			map: map,
			animation: google.maps.Animation.DROP}
		);
		return marker;
	}

	/**
   * Static map image to be displayed when index.html initially loads.
   */
	static staticImageForMapIndex(restaurants) {
		let loc = {
			lat: 40.722216,
			lng: -73.987501
		};
		const map = document.getElementById('map');
		const mapWidth = map.clientWidth;
		const mapHeight = map.clientHeight;
		let staticMap = `http://maps.googleapis.com/maps/api/staticmap?center=${
			loc.lat},${loc.lng}&zoom=12&size=${mapWidth}x${mapHeight}&markers=color:red`;
		restaurants.forEach(restaurant => {
			staticMap += `|${restaurant.latlng.lat},${restaurant.latlng.lng}`;
		});
		staticMap += `&key=AIzaSyByOElG6Eai0CEZ27dYL5Vw6NzJOt9FZAc`;
		return staticMap;
	}

	/**
   * Static map image to be displayed when restaurant.html initially loads.
   */
	static staticImageForMapRestaurantInfo(restaurant) {
		const map = document.getElementById('map');
		const mapWidth = map.clientWidth;
		const mapHeight = map.clientHeight;
		let staticMap = `http://maps.googleapis.com/maps/api/staticmap?center=${restaurant.latlng.lat},${restaurant.latlng.lng}&zoom=16&size=${mapWidth}x${mapHeight}&markers=color:red|${restaurant.latlng.lat},${restaurant.latlng.lng}&key=AIzaSyByOElG6Eai0CEZ27dYL5Vw6NzJOt9FZAc`;
		return staticMap;
	}

	/**
   * Updates favorite status of a restaurant when favorite icon is clicked.
   */
	static updateFavorite(restaurantId, isFavorite){
		const fetchURL = `${DBHelper.DATABASE_RESTAURANTS_URL}/${restaurantId}?is_favorite=${isFavorite}`;
		fetch(fetchURL, {method: 'PUT'}).then(response => {
			if(response.ok){
				dbPromise.then(db => {
					const tx = db.transaction('restaurants', 'readwrite');
					const restaurantsStore = tx.objectStore('restaurants');
					restaurantsStore.get(restaurantId).then(restaurant => {
						restaurant.is_favorite = isFavorite;
						restaurantsStore.put(restaurant);
						return tx.complete && restaurantsStore.get(restaurantId);
					}).then(updatedRestaurant => {
						console.log(`Successfully updated favorite status of ${updatedRestaurant.name}`);
						return;
					}).catch(error => {
						console.log(`Failed to update favorite status: ${error}`);
						return;
					});
				});
			} else {
				console.log('Do offline stuff here');
			}
		}).catch(error => {
			console.log(`Fetch request for restaurants from server failed: ${error}`);
			return;
		});
	}

	/**
   * If online, posts review to server & IndexedDB. If offline, creates an offline review object to be stored in local storage via storeOfflineReview.
   */
	static addReview(review, restaurantId, fillReviewsHTML){
		if (!navigator.onLine) {
			const offlineReview = {
				data: review,
				id: restaurantId,
				callback: fillReviewsHTML
			};
			DBHelper.storeOfflineReview(offlineReview);
			return;
		}
		const fetchURL = `${DBHelper.DATABASE_REVIEWS_URL}`;
		const fetchOptions = {
			method: 'POST',
			body: JSON.stringify(review),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		};
		fetch(fetchURL, fetchOptions).then(response => {
			if(response.ok){
				console.log('Successfully posted review to server');
				return response.json();
			} else {
				console.log(`Bad response received from server: ${response.status}`);
				return;
			}
		}).then(response => {
			return DBHelper.fetchReviewsById(restaurantId, fillReviewsHTML);
		}).catch(error => {
			console.log(`Fetch request failed: ${error}`);
			return;
		});
	}

	/**
   * If online, deletes review from server & IndexedDB. If offline, removes from local storage.
   */
	static removeReview(reviewId, restaurantId, fillReviewsHTML){
		if(!navigator.onLine){
			localStorage.removeItem('reviewData');
			return;
		}
		const fetchURL = `${DBHelper.DATABASE_REVIEWS_URL}/${reviewId}`;
		console.log('reviewId', reviewId);
		fetch(fetchURL, {method: 'DELETE'}).then(response => {
			if(response.ok){
				return response.json().then(reviews => {
					dbPromise.then(db => {
						const tx = db.transaction('reviews', 'readwrite');
						let reviewsStore = tx.objectStore('reviews');
						reviewsStore.delete(reviewId);
						console.log('Successfully deleted review from server and IndexedDB');
						return tx.complete;
					});
				}); 
			} else {
				console.log(`Bad response received from server: ${response.status}`);
				return;
			}
		}).then(response => {
			return DBHelper.fetchReviewsById(restaurantId, fillReviewsHTML);
		}).catch(error => {
			console.log(`Fetch request failed: ${error}`);
			return;
		});
	}

	static storeOfflineReview(offlineReview){
		localStorage.setItem('reviewData', JSON.stringify(offlineReview.data));
		window.addEventListener('online', () => {
			let reviewData = JSON.parse(localStorage.getItem('reviewData'));
			if (reviewData !== null){
				const offlineLabels = Array.from(document.querySelectorAll('.offline-label'));
				offlineLabels.forEach(offlineLabel => {
					offlineLabel.parentNode.removeChild(offlineLabel);
				});
				DBHelper.addReview(offlineReview.data, offlineReview.id, offlineReview.callback);
				localStorage.removeItem('reviewData');
				console.log('Successfully retrieved offline review data & removed from local storage');
			} else {
				console.log('Failed to find offline review data in local storage');
			}
		});
	}

	
}
