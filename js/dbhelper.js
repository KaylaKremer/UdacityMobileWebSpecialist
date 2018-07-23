/**
 * Common database helper functions.
 */
class DBHelper {
	
	/**
   * Database URL.
   * Changed to retrieve data from the server on localhost:1337.
   */
	static get DATABASE_URL() {
		const port = 1337; // Change this to your server port
		return `http://localhost:${port}/restaurants`;
	}

	/**
   * Fetches all restaurant reviews data. Creates an IndexedDB database named 'restaurant-reviews-db' with an object store of 'restaurant-reviews'. If response from the server is ok, stores data received into the database and then returns the data. If response from the server fails, look in the database to see if there is data already stored there and return the data. Catches and handles errors appropriately when data cannot be retrieved.
   */
	static fetchRestaurants(callback, id) {
		const dbPromise = idb.open('restaurant-reviews-db', 1, upgradeDB => {
			switch (upgradeDB.oldVersion){
			case 0:
				upgradeDB.createObjectStore('restaurant-reviews', {keyPath: 'id'});
			}
		});
		let restaurantURL;
		id ? restaurantURL = `${DBHelper.DATABASE_URL}/${id}` : restaurantURL = `${DBHelper.DATABASE_URL}`;
		fetch(restaurantURL).then(response => {
			if(response.ok){
				return response.json().then(restaurantReviews => {
					dbPromise.then(db => {
						const tx = db.transaction('restaurant-reviews', 'readwrite');
						let restaurantReviewsStore = tx.objectStore('restaurant-reviews');
						restaurantReviews.forEach(restaurantReview => {
							restaurantReviewsStore.put(restaurantReview);
						});
						return tx.complete && restaurantReviewsStore.getAll();
					}).then(restaurantReviews => {
						console.log(`Sucessfully fetched data from server & stored in IndexedDB!`);
						callback(null, restaurantReviews);
					}).catch(error => {
						callback(`Failed to fetch data from server & store n IndexedDB: ${error}`, null);
					});
				});
			} else {
				dbPromise.then(db => {
					const tx = db.transaction('restaurant-reviews', 'readonly');
					let restaurantReviewsStore = tx.objectStore('restaurant-reviews');
					//if (restaurantReviewsStores.getAll())
					return tx.complete && restaurantReviewsStore.getAll();
				}).then(restaurantReviews => {
					console.log(`Sucessfully fetched data from IndexedDB!`);
					callback(null, restaurantReviews);
				}).catch(error => {
					callback(`Failed to fetch data from IndexedDB: ${error}`, null);
				});
			}
		}).catch(error => {
			callback(`Fetch request for data from server failed: ${error}`, null);
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
}