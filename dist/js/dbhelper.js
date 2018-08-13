'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbPromise = idb.open('restaurant-reviews-db', 2, function (upgradeDB) {
	switch (upgradeDB.oldVersion) {
		case 0:
			upgradeDB.createObjectStore('restaurants', { keyPath: 'id' });
		case 1:
			var reviewsStore = upgradeDB.createObjectStore('reviews', { keyPath: 'id' });
			reviewsStore.createIndex('restaurant_id', 'restaurant_id');
	}
});

/**
 * Common database helper functions.
 */

var DBHelper = function () {
	function DBHelper() {
		_classCallCheck(this, DBHelper);
	}

	_createClass(DBHelper, null, [{
		key: 'fetchRestaurants',


		/**
    * Fetches all restaurant reviews data. Creates an IndexedDB database named 'restaurant-reviews-db' with an object store of 'restaurant-reviews'. If response from the server is ok, stores data received into the database and then returns the data. If response from the server fails, look in the database to see if there is data already stored there and return the data. Catches and handles errors appropriately when data cannot be retrieved.
    */
		value: function fetchRestaurants(callback, id) {
			var restaurantURL = void 0;
			id ? restaurantURL = DBHelper.DATABASE_RESTAURANTS_URL + '/' + id : restaurantURL = '' + DBHelper.DATABASE_RESTAURANTS_URL;

			fetch(restaurantURL).then(function (response) {
				if (response.ok) {
					return response.json().then(function (restaurants) {
						dbPromise.then(function (db) {
							var tx = db.transaction('restaurants', 'readwrite');
							var restaurantsStore = tx.objectStore('restaurants');
							for (var i = 0; i < restaurants.length; i++) {
								restaurantsStore.put(restaurants[i]);
							}
							return tx.complete && restaurantsStore.getAll();
						}).then(function (fetchedRestaurants) {
							console.log('Successfully fetched restaurants from server & stored in IndexedDB!');
							return callback(null, fetchedRestaurants);
						}).catch(function (error) {
							return callback('Failed to fetch restaurants from server & store in IndexedDB: ' + error, null);
						});
					});
				} else {
					dbPromise.then(function (db) {
						var tx = db.transaction('restaurants', 'readonly');
						var restaurantsStore = tx.objectStore('restaurants');
						return tx.complete && restaurantsStore.getAll();
					}).then(function (fetchedRestaurants) {
						console.log('Successfully fetched data from IndexedDB!');
						return callback(null, fetchedRestaurants);
					}).catch(function (error) {
						return callback('Failed to fetch restaurants from IndexedDB: ' + error, null);
					});
				}
			}).catch(function (error) {
				return callback('Fetch request for restaurants from server failed: ' + error, null);
			});
		}

		/**
    * Fetch a restaurant by its ID.
    */

	}, {
		key: 'fetchRestaurantById',
		value: function fetchRestaurantById(id, callback) {
			// fetch all restaurants with proper error handling.
			DBHelper.fetchRestaurants(function (error, restaurants) {
				if (error) {
					callback(error, null);
				} else {
					var restaurant = restaurants.find(function (r) {
						return r.id === parseInt(id);
					});
					if (restaurant) {
						// Got the restaurant
						callback(null, restaurant);
					} else {
						// Restaurant does not exist in the database
						callback('Restaurant does not exist', null);
					}
				}
			});
		}

		/**
    * Fetch a review by its ID.
    */

	}, {
		key: 'fetchReviewsById',
		value: function fetchReviewsById(id, callback) {
			var reviewURL = DBHelper.DATABASE_REVIEWS_URL + '/?restaurant_id=' + id;
			fetch(reviewURL).then(function (response) {
				if (response.ok) {
					return response.json().then(function (reviews) {
						dbPromise.then(function (db) {
							var tx = db.transaction('reviews', 'readwrite');
							var reviewsStore = tx.objectStore('reviews');
							for (var i = 0; i < reviews.length; i++) {
								reviewsStore.put(reviews[i]);
							}
							var indexRestaurantId = reviewsStore.index('restaurant_id');
							return tx.complete && indexRestaurantId.getAll(id);
						}).then(function (fetchedReviews) {
							console.log('Successfully fetched reviews from server & stored in IndexedDB!');
							return callback(null, fetchedReviews);
						}).catch(function (error) {
							return callback('Failed to fetch reviews from server & store in IndexedDB: ' + error, null);
						});
					});
				} else {
					dbPromise.then(function (db) {
						var tx = db.transaction('reviews', 'readonly');
						var reviewsStore = tx.objectStore('reviews');
						var indexRestaurantId = reviewsStore.index('resataurant_id');
						return tx.complete && indexRestaurantId.getAll(id);
					}).then(function (fetchedReviews) {
						console.log('Successfully fetched reviews from IndexedDB!');
						return callback(null, fetchedReviews);
					}).catch(function (error) {
						return callback('Failed to fetch reviews from IndexedDB: ' + error, null);
					});
				}
			}).catch(function (error) {
				return callback('Fetch request for reviews from server failed: ' + error, null);
			});
		}

		/**
    * Fetch restaurants by a cuisine type with proper error handling.
    */

	}, {
		key: 'fetchRestaurantByCuisine',
		value: function fetchRestaurantByCuisine(cuisine, callback) {
			// Fetch all restaurants  with proper error handling
			DBHelper.fetchRestaurants(function (error, restaurants) {
				if (error) {
					callback(error, null);
				} else {
					// Filter restaurants to have only given cuisine type
					var results = restaurants.filter(function (r) {
						return r.cuisine_type == cuisine;
					});
					callback(null, results);
				}
			});
		}

		/**
    * Fetch restaurants by a neighborhood with proper error handling.
    */

	}, {
		key: 'fetchRestaurantByNeighborhood',
		value: function fetchRestaurantByNeighborhood(neighborhood, callback) {
			// Fetch all restaurants
			DBHelper.fetchRestaurants(function (error, restaurants) {
				if (error) {
					callback(error, null);
				} else {
					// Filter restaurants to have only given neighborhood
					var results = restaurants.filter(function (r) {
						return r.neighborhood == neighborhood;
					});
					callback(null, results);
				}
			});
		}

		/**
    * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
    */

	}, {
		key: 'fetchRestaurantByCuisineAndNeighborhood',
		value: function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
			// Fetch all restaurants
			DBHelper.fetchRestaurants(function (error, restaurants) {
				if (error) {
					callback(error, null);
				} else {
					var results = restaurants;
					if (cuisine != 'all') {
						// filter by cuisine
						results = results.filter(function (r) {
							return r.cuisine_type == cuisine;
						});
					}
					if (neighborhood != 'all') {
						// filter by neighborhood
						results = results.filter(function (r) {
							return r.neighborhood == neighborhood;
						});
					}
					callback(null, results);
				}
			});
		}

		/**
    * Fetch all neighborhoods with proper error handling.
    */

	}, {
		key: 'fetchNeighborhoods',
		value: function fetchNeighborhoods(callback) {
			// Fetch all restaurants
			DBHelper.fetchRestaurants(function (error, restaurants) {
				if (error) {
					callback(error, null);
				} else {
					// Get all neighborhoods from all restaurants
					var neighborhoods = restaurants.map(function (v, i) {
						return restaurants[i].neighborhood;
					});
					// Remove duplicates from neighborhoods
					var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {
						return neighborhoods.indexOf(v) == i;
					});
					callback(null, uniqueNeighborhoods);
				}
			});
		}

		/**
    * Fetch all cuisines with proper error handling.
    */

	}, {
		key: 'fetchCuisines',
		value: function fetchCuisines(callback) {
			// Fetch all restaurants
			DBHelper.fetchRestaurants(function (error, restaurants) {
				if (error) {
					callback(error, null);
				} else {
					// Get all cuisines from all restaurants
					var cuisines = restaurants.map(function (v, i) {
						return restaurants[i].cuisine_type;
					});
					// Remove duplicates from cuisines
					var uniqueCuisines = cuisines.filter(function (v, i) {
						return cuisines.indexOf(v) == i;
					});
					callback(null, uniqueCuisines);
				}
			});
		}

		/**
    * Restaurant page URL.
    */

	}, {
		key: 'urlForRestaurant',
		value: function urlForRestaurant(restaurant) {
			return './restaurant.html?id=' + restaurant.id;
		}

		/**
    * Restaurant small image URL.
    */

	}, {
		key: 'smallImageUrlForRestaurant',
		value: function smallImageUrlForRestaurant(restaurant) {
			return '/img/' + restaurant.photograph_small;
		}

		/**
    * Restaurant large image URL.
    */

	}, {
		key: 'largeImageUrlForRestaurant',
		value: function largeImageUrlForRestaurant(restaurant) {
			return '/img/' + restaurant.photograph_large;
		}

		/**
    * Map marker for a restaurant.
    */

	}, {
		key: 'mapMarkerForRestaurant',
		value: function mapMarkerForRestaurant(restaurant, map) {
			var marker = new google.maps.Marker({
				position: restaurant.latlng,
				title: restaurant.name,
				url: DBHelper.urlForRestaurant(restaurant),
				map: map,
				animation: google.maps.Animation.DROP });
			return marker;
		}

		/**
    * Static map image to be displayed when index.html initially loads.
    */

	}, {
		key: 'staticImageForMapIndex',
		value: function staticImageForMapIndex(restaurants) {
			var loc = {
				lat: 40.722216,
				lng: -73.987501
			};
			var map = document.getElementById('map');
			var mapWidth = map.clientWidth;
			var mapHeight = map.clientHeight;
			var staticMap = 'http://maps.googleapis.com/maps/api/staticmap?center=' + loc.lat + ',' + loc.lng + '&zoom=12&size=' + mapWidth + 'x' + mapHeight + '&markers=color:red';
			restaurants.forEach(function (restaurant) {
				staticMap += '|' + restaurant.latlng.lat + ',' + restaurant.latlng.lng;
			});
			staticMap += '&key=AIzaSyByOElG6Eai0CEZ27dYL5Vw6NzJOt9FZAc';
			return staticMap;
		}

		/**
    * Static map image to be displayed when restaurant.html initially loads.
    */

	}, {
		key: 'staticImageForMapRestaurantInfo',
		value: function staticImageForMapRestaurantInfo(restaurant) {
			var map = document.getElementById('map');
			var mapWidth = map.clientWidth;
			var mapHeight = map.clientHeight;
			var staticMap = 'http://maps.googleapis.com/maps/api/staticmap?center=' + restaurant.latlng.lat + ',' + restaurant.latlng.lng + '&zoom=16&size=' + mapWidth + 'x' + mapHeight + '&markers=color:red|' + restaurant.latlng.lat + ',' + restaurant.latlng.lng + '&key=AIzaSyByOElG6Eai0CEZ27dYL5Vw6NzJOt9FZAc';
			return staticMap;
		}

		/**
    * Updates favorite status of a restaurant when favorite icon is clicked.
    */

	}, {
		key: 'updateFavorite',
		value: function updateFavorite(restaurantId, isFavorite) {
			var fetchURL = DBHelper.DATABASE_RESTAURANTS_URL + '/' + restaurantId + '?is_favorite=' + isFavorite;
			fetch(fetchURL, { method: 'PUT' }).then(function (response) {
				if (response.ok) {
					dbPromise.then(function (db) {
						var tx = db.transaction('restaurants', 'readwrite');
						var restaurantsStore = tx.objectStore('restaurants');
						restaurantsStore.get(restaurantId).then(function (restaurant) {
							restaurant.is_favorite = isFavorite;
							restaurantsStore.put(restaurant);
							return tx.complete && restaurantsStore.get(restaurantId);
						}).then(function (updatedRestaurant) {
							console.log('Successfully updated favorite status of ' + updatedRestaurant.name);
							return;
						}).catch(function (error) {
							console.log('Failed to update favorite status: ' + error);
							return;
						});
					});
				} else {
					console.log('Do offline stuff here');
				}
			}).catch(function (error) {
				console.log('Fetch request for restaurants from server failed: ' + error);
				return;
			});
		}

		/**
    * If online, posts review to server & IndexedDB. If offline, creates an offline review object to be stored in local storage via storeReview.
    */

	}, {
		key: 'addReview',
		value: function addReview(review, restaurantId, fillReviewsHTML) {
			var offlineReview = {
				data: review
			};
			if (!navigator.onLine) {
				DBHelper.storeReview(offlineReview);
				return;
			}
			var fetchURL = '' + DBHelper.DATABASE_REVIEWS_URL;
			var fetchOptions = {
				method: 'POST',
				body: JSON.stringify(review),
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			};

			fetch(fetchURL, fetchOptions).then(function (response) {
				if (response.ok) {
					console.log('Successfully posted review to server');
					return response.json();
				} else {
					console.log('Bad response received from server: ' + response);
					return;
				}
			}).then(function (response) {
				return DBHelper.fetchReviewsById(restaurantId, fillReviewsHTML);
			}).catch(function (error) {
				console.log('Fetch request failed: ' + error);
				return;
			});
		}
	}, {
		key: 'storeReview',
		value: function storeReview(offlineReview) {
			localStorage.setItem('reviewData', JSON.stringify(offlineReview.data));
			window.addEventListener('online', function () {
				var reviewData = JSON.parse(localStorage.getItem(reviewData));
				if (reviewData !== null) {
					var offlineLabels = Array.from(document.querySelectorAll('.offline-label'));
					offlineLabels.forEach(function (offlineLabel) {
						offlineLabel.remove();
					});
					DBHelper.addReview(reviewData);
					localStorage.removeItem('reviewData');
					console.log('Successfully retrieved offline review data & removed from local storage');
				} else {
					console.log('Failed to find offline review data in local storage');
				}
			});
		}
	}, {
		key: 'DATABASE_RESTAURANTS_URL',


		/**
    * Database URL.
    * Changed to retrieve restaurants & reviews from server on localhost:1337.
    */
		get: function get() {
			var port = 1337; // Change this to your server port
			return 'http://localhost:' + port + '/restaurants';
		}
	}, {
		key: 'DATABASE_REVIEWS_URL',
		get: function get() {
			var port = 1337; // Change this to your server port
			return 'http://localhost:' + port + '/reviews';
		}
	}]);

	return DBHelper;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmV2aWV3c1N0b3JlIiwiY3JlYXRlSW5kZXgiLCJEQkhlbHBlciIsImNhbGxiYWNrIiwiaWQiLCJyZXN0YXVyYW50VVJMIiwiREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJyZXN0YXVyYW50c1N0b3JlIiwib2JqZWN0U3RvcmUiLCJpIiwicmVzdGF1cmFudHMiLCJsZW5ndGgiLCJwdXQiLCJjb21wbGV0ZSIsImdldEFsbCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaGVkUmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsInBhcnNlSW50IiwicmV2aWV3VVJMIiwiREFUQUJBU0VfUkVWSUVXU19VUkwiLCJyZXZpZXdzIiwiaW5kZXhSZXN0YXVyYW50SWQiLCJpbmRleCIsImZldGNoZWRSZXZpZXdzIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJsb2MiLCJsYXQiLCJsbmciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFwV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1hcEhlaWdodCIsImNsaWVudEhlaWdodCIsInN0YXRpY01hcCIsImZvckVhY2giLCJyZXN0YXVyYW50SWQiLCJpc0Zhdm9yaXRlIiwiZmV0Y2hVUkwiLCJtZXRob2QiLCJnZXQiLCJpc19mYXZvcml0ZSIsInVwZGF0ZWRSZXN0YXVyYW50IiwicmV2aWV3IiwiZmlsbFJldmlld3NIVE1MIiwib2ZmbGluZVJldmlldyIsImRhdGEiLCJuYXZpZ2F0b3IiLCJvbkxpbmUiLCJzdG9yZVJldmlldyIsImZldGNoT3B0aW9ucyIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiaGVhZGVycyIsIkhlYWRlcnMiLCJmZXRjaFJldmlld3NCeUlkIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXZpZXdEYXRhIiwicGFyc2UiLCJnZXRJdGVtIiwib2ZmbGluZUxhYmVscyIsIkFycmF5IiwiZnJvbSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvZmZsaW5lTGFiZWwiLCJyZW1vdmUiLCJhZGRSZXZpZXciLCJyZW1vdmVJdGVtIiwicG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsWUFBWUMsSUFBSUMsSUFBSixDQUFTLHVCQUFULEVBQWtDLENBQWxDLEVBQXFDLHFCQUFhO0FBQ25FLFNBQVFDLFVBQVVDLFVBQWxCO0FBQ0EsT0FBSyxDQUFMO0FBQ0NELGFBQVVFLGlCQUFWLENBQTRCLGFBQTVCLEVBQTJDLEVBQUNDLFNBQVMsSUFBVixFQUEzQztBQUNELE9BQUssQ0FBTDtBQUNDLE9BQU1DLGVBQWVKLFVBQVVFLGlCQUFWLENBQTRCLFNBQTVCLEVBQXVDLEVBQUNDLFNBQVMsSUFBVixFQUF2QyxDQUFyQjtBQUNBQyxnQkFBYUMsV0FBYixDQUF5QixlQUF6QixFQUEwQyxlQUExQztBQUxEO0FBT0EsQ0FSaUIsQ0FBbEI7O0FBVUE7Ozs7SUFHTUMsUTs7Ozs7Ozs7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RUFBWjtBQUNBLEtBUkQsTUFRTztBQUNORCxhQUFRQyxHQUFSLENBQVkscURBQVo7QUFDQTtBQUNELElBYkQ7QUFjQTs7Ozs7QUFuV0Q7Ozs7c0JBSXNDO0FBQ3JDLE9BQU15RixPQUFPLElBQWIsQ0FEcUMsQ0FDbEI7QUFDbkIsZ0NBQTJCQSxJQUEzQjtBQUNBOzs7c0JBRWlDO0FBQ2pDLE9BQU1BLE9BQU8sSUFBYixDQURpQyxDQUNkO0FBQ25CLGdDQUEyQkEsSUFBM0I7QUFDQSIsImZpbGUiOiJkYmhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRiUHJvbWlzZSA9IGlkYi5vcGVuKCdyZXN0YXVyYW50LXJldmlld3MtZGInLCAyLCB1cGdyYWRlREIgPT4ge1xuXHRzd2l0Y2ggKHVwZ3JhZGVEQi5vbGRWZXJzaW9uKXtcblx0Y2FzZSAwOlxuXHRcdHVwZ3JhZGVEQi5jcmVhdGVPYmplY3RTdG9yZSgncmVzdGF1cmFudHMnLCB7a2V5UGF0aDogJ2lkJ30pO1xuXHRjYXNlIDE6XG5cdFx0Y29uc3QgcmV2aWV3c1N0b3JlID0gdXBncmFkZURCLmNyZWF0ZU9iamVjdFN0b3JlKCdyZXZpZXdzJywge2tleVBhdGg6ICdpZCd9KTtcblx0XHRyZXZpZXdzU3RvcmUuY3JlYXRlSW5kZXgoJ3Jlc3RhdXJhbnRfaWQnLCAncmVzdGF1cmFudF9pZCcpO1xuXHR9XG59KTtcblxuLyoqXG4gKiBDb21tb24gZGF0YWJhc2UgaGVscGVyIGZ1bmN0aW9ucy5cbiAqL1xuY2xhc3MgREJIZWxwZXIge1xuXHRcblx0LyoqXG4gICAqIERhdGFiYXNlIFVSTC5cbiAgICogQ2hhbmdlZCB0byByZXRyaWV2ZSByZXN0YXVyYW50cyAmIHJldmlld3MgZnJvbSBzZXJ2ZXIgb24gbG9jYWxob3N0OjEzMzcuXG4gICAqL1xuXHRzdGF0aWMgZ2V0IERBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTCgpIHtcblx0XHRjb25zdCBwb3J0ID0gMTMzNzsgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxuXHRcdHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L3Jlc3RhdXJhbnRzYDtcblx0fVxuXG5cdHN0YXRpYyBnZXQgREFUQUJBU0VfUkVWSUVXU19VUkwoKSB7XG5cdFx0Y29uc3QgcG9ydCA9IDEzMzc7IC8vIENoYW5nZSB0aGlzIHRvIHlvdXIgc2VydmVyIHBvcnRcblx0XHRyZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9yZXZpZXdzYDtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaGVzIGFsbCByZXN0YXVyYW50IHJldmlld3MgZGF0YS4gQ3JlYXRlcyBhbiBJbmRleGVkREIgZGF0YWJhc2UgbmFtZWQgJ3Jlc3RhdXJhbnQtcmV2aWV3cy1kYicgd2l0aCBhbiBvYmplY3Qgc3RvcmUgb2YgJ3Jlc3RhdXJhbnQtcmV2aWV3cycuIElmIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBpcyBvaywgc3RvcmVzIGRhdGEgcmVjZWl2ZWQgaW50byB0aGUgZGF0YWJhc2UgYW5kIHRoZW4gcmV0dXJucyB0aGUgZGF0YS4gSWYgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGZhaWxzLCBsb29rIGluIHRoZSBkYXRhYmFzZSB0byBzZWUgaWYgdGhlcmUgaXMgZGF0YSBhbHJlYWR5IHN0b3JlZCB0aGVyZSBhbmQgcmV0dXJuIHRoZSBkYXRhLiBDYXRjaGVzIGFuZCBoYW5kbGVzIGVycm9ycyBhcHByb3ByaWF0ZWx5IHdoZW4gZGF0YSBjYW5ub3QgYmUgcmV0cmlldmVkLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2ssIGlkKSB7XG5cdFx0bGV0IHJlc3RhdXJhbnRVUkw7XG5cdFx0aWQgPyByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMfS8ke2lkfWAgOiByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMfWA7XG5cblx0XHRmZXRjaChyZXN0YXVyYW50VVJMKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRcdGxldCByZXN0YXVyYW50c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJyk7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0cmVzdGF1cmFudHNTdG9yZS5wdXQocmVzdGF1cmFudHNbaV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIHJlc3RhdXJhbnRzU3RvcmUuZ2V0QWxsKCk7XG5cdFx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmVzdGF1cmFudHMgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyICYgc3RvcmVkIGluIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmVzdGF1cmFudHMpO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyICYgc3RvcmUgaW4gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZG9ubHknKTtcblx0XHRcdFx0XHRsZXQgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50c1N0b3JlLmdldEFsbCgpO1xuXHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIGRhdGEgZnJvbSBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXN0YXVyYW50cyk7XG5cdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXN0YXVyYW50cyBmcm9tIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGZXRjaCByZXF1ZXN0IGZvciByZXN0YXVyYW50cyBmcm9tIHNlcnZlciBmYWlsZWQ6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xuXHRcdC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT09IHBhcnNlSW50KGlkKSk7XG5cdFx0XHRcdGlmIChyZXN0YXVyYW50KSB7IC8vIEdvdCB0aGUgcmVzdGF1cmFudFxuXHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xuXHRcdFx0XHR9IGVsc2UgeyAvLyBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBkYXRhYmFzZVxuXHRcdFx0XHRcdGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhIHJldmlldyBieSBpdHMgSUQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXZpZXdzQnlJZChpZCwgY2FsbGJhY2spe1xuXHRcdGNvbnN0IHJldmlld1VSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFVklFV1NfVVJMfS8/cmVzdGF1cmFudF9pZD0ke2lkfWA7XG5cdFx0ZmV0Y2gocmV2aWV3VVJMKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJldmlld3MgPT4ge1xuXHRcdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jldmlld3MnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0XHRsZXQgcmV2aWV3c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jldmlld3MnKTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmV2aWV3cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdHJldmlld3NTdG9yZS5wdXQocmV2aWV3c1tpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb25zdCBpbmRleFJlc3RhdXJhbnRJZCA9IHJldmlld3NTdG9yZS5pbmRleCgncmVzdGF1cmFudF9pZCcpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIGluZGV4UmVzdGF1cmFudElkLmdldEFsbChpZCk7XG5cdFx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcmV2aWV3cyBmcm9tIHNlcnZlciAmIHN0b3JlZCBpbiBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJldmlld3MpO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJldmlld3MgZnJvbSBzZXJ2ZXIgJiBzdG9yZSBpbiBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXZpZXdzJywgJ3JlYWRvbmx5Jyk7XG5cdFx0XHRcdFx0bGV0IHJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXZpZXdzJyk7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXhSZXN0YXVyYW50SWQgPSByZXZpZXdzU3RvcmUuaW5kZXgoJ3Jlc2F0YXVyYW50X2lkJyk7XG5cdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIGluZGV4UmVzdGF1cmFudElkLmdldEFsbChpZCk7XG5cdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZXZpZXdzIGZyb20gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmV2aWV3cyk7XG5cdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXZpZXdzIGZyb20gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZldGNoIHJlcXVlc3QgZm9yIHJldmlld3MgZnJvbSBzZXJ2ZXIgZmFpbGVkOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSB0eXBlIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZShjdWlzaW5lLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIGN1aXNpbmUgdHlwZVxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kKG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIG5laWdoYm9yaG9vZFxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCByZXN1bHRzID0gcmVzdGF1cmFudHM7XG5cdFx0XHRcdGlmIChjdWlzaW5lICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5laWdoYm9yaG9vZCAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaE5laWdoYm9yaG9vZHMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIG5laWdoYm9yaG9vZHMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgbmVpZ2hib3Job29kcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0ubmVpZ2hib3Job29kKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZU5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzLmZpbHRlcigodiwgaSkgPT4gbmVpZ2hib3Job29kcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVOZWlnaGJvcmhvb2RzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hDdWlzaW5lcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgY3Vpc2luZXMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgY3Vpc2luZXMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLmN1aXNpbmVfdHlwZSk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcblx0XHRcdFx0Y29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZUN1aXNpbmVzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHNtYWxsIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBzbWFsbEltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9zbWFsbH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IGxhcmdlIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBsYXJnZUltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9sYXJnZX1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBNYXAgbWFya2VyIGZvciBhIHJlc3RhdXJhbnQuXG4gICAqL1xuXHRzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcblx0XHRjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdHBvc2l0aW9uOiByZXN0YXVyYW50LmxhdGxuZyxcblx0XHRcdHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXG5cdFx0XHR1cmw6IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksXG5cdFx0XHRtYXA6IG1hcCxcblx0XHRcdGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1B9XG5cdFx0KTtcblx0XHRyZXR1cm4gbWFya2VyO1xuXHR9XG5cblx0LyoqXG4gICAqIFN0YXRpYyBtYXAgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIHdoZW4gaW5kZXguaHRtbCBpbml0aWFsbHkgbG9hZHMuXG4gICAqL1xuXHRzdGF0aWMgc3RhdGljSW1hZ2VGb3JNYXBJbmRleChyZXN0YXVyYW50cykge1xuXHRcdGxldCBsb2MgPSB7XG5cdFx0XHRsYXQ6IDQwLjcyMjIxNixcblx0XHRcdGxuZzogLTczLjk4NzUwMVxuXHRcdH07XG5cdFx0Y29uc3QgbWFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdGNvbnN0IG1hcFdpZHRoID0gbWFwLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IG1hcEhlaWdodCA9IG1hcC5jbGllbnRIZWlnaHQ7XG5cdFx0bGV0IHN0YXRpY01hcCA9IGBodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/Y2VudGVyPSR7XG5cdFx0XHRsb2MubGF0fSwke2xvYy5sbmd9Jnpvb209MTImc2l6ZT0ke21hcFdpZHRofXgke21hcEhlaWdodH0mbWFya2Vycz1jb2xvcjpyZWRgO1xuXHRcdHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XG5cdFx0XHRzdGF0aWNNYXAgKz0gYHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9YDtcblx0XHR9KTtcblx0XHRzdGF0aWNNYXAgKz0gYCZrZXk9QUl6YVN5QnlPRWxHNkVhaTBDRVoyN2RZTDVWdzZOekpPdDlGWkFjYDtcblx0XHRyZXR1cm4gc3RhdGljTWFwO1xuXHR9XG5cblx0LyoqXG4gICAqIFN0YXRpYyBtYXAgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIHdoZW4gcmVzdGF1cmFudC5odG1sIGluaXRpYWxseSBsb2Fkcy5cbiAgICovXG5cdHN0YXRpYyBzdGF0aWNJbWFnZUZvck1hcFJlc3RhdXJhbnRJbmZvKHJlc3RhdXJhbnQpIHtcblx0XHRjb25zdCBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5cdFx0Y29uc3QgbWFwV2lkdGggPSBtYXAuY2xpZW50V2lkdGg7XG5cdFx0Y29uc3QgbWFwSGVpZ2h0ID0gbWFwLmNsaWVudEhlaWdodDtcblx0XHRsZXQgc3RhdGljTWFwID0gYGh0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0YXRpY21hcD9jZW50ZXI9JHtyZXN0YXVyYW50LmxhdGxuZy5sYXR9LCR7cmVzdGF1cmFudC5sYXRsbmcubG5nfSZ6b29tPTE2JnNpemU9JHttYXBXaWR0aH14JHttYXBIZWlnaHR9Jm1hcmtlcnM9Y29sb3I6cmVkfCR7cmVzdGF1cmFudC5sYXRsbmcubGF0fSwke3Jlc3RhdXJhbnQubGF0bG5nLmxuZ30ma2V5PUFJemFTeUJ5T0VsRzZFYWkwQ0VaMjdkWUw1Vnc2TnpKT3Q5RlpBY2A7XG5cdFx0cmV0dXJuIHN0YXRpY01hcDtcblx0fVxuXG5cdC8qKlxuICAgKiBVcGRhdGVzIGZhdm9yaXRlIHN0YXR1cyBvZiBhIHJlc3RhdXJhbnQgd2hlbiBmYXZvcml0ZSBpY29uIGlzIGNsaWNrZWQuXG4gICAqL1xuXHRzdGF0aWMgdXBkYXRlRmF2b3JpdGUocmVzdGF1cmFudElkLCBpc0Zhdm9yaXRlKXtcblx0XHRjb25zdCBmZXRjaFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH0vJHtyZXN0YXVyYW50SWR9P2lzX2Zhdm9yaXRlPSR7aXNGYXZvcml0ZX1gO1xuXHRcdGZldGNoKGZldGNoVVJMLCB7bWV0aG9kOiAnUFVUJ30pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdHJlc3RhdXJhbnRzU3RvcmUuZ2V0KHJlc3RhdXJhbnRJZCkudGhlbihyZXN0YXVyYW50ID0+IHtcblx0XHRcdFx0XHRcdHJlc3RhdXJhbnQuaXNfZmF2b3JpdGUgPSBpc0Zhdm9yaXRlO1xuXHRcdFx0XHRcdFx0cmVzdGF1cmFudHNTdG9yZS5wdXQocmVzdGF1cmFudCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXQocmVzdGF1cmFudElkKTtcblx0XHRcdFx0XHR9KS50aGVuKHVwZGF0ZWRSZXN0YXVyYW50ID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgdXBkYXRlZCBmYXZvcml0ZSBzdGF0dXMgb2YgJHt1cGRhdGVkUmVzdGF1cmFudC5uYW1lfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gdXBkYXRlIGZhdm9yaXRlIHN0YXR1czogJHtlcnJvcn1gKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRG8gb2ZmbGluZSBzdHVmZiBoZXJlJyk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coYEZldGNoIHJlcXVlc3QgZm9yIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBJZiBvbmxpbmUsIHBvc3RzIHJldmlldyB0byBzZXJ2ZXIgJiBJbmRleGVkREIuIElmIG9mZmxpbmUsIGNyZWF0ZXMgYW4gb2ZmbGluZSByZXZpZXcgb2JqZWN0IHRvIGJlIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlIHZpYSBzdG9yZVJldmlldy5cbiAgICovXG5cdHN0YXRpYyBhZGRSZXZpZXcocmV2aWV3LCByZXN0YXVyYW50SWQsIGZpbGxSZXZpZXdzSFRNTCl7XG5cdFx0Y29uc3Qgb2ZmbGluZVJldmlldyA9IHtcblx0XHRcdGRhdGE6IHJldmlld1xuXHRcdH07XG5cdFx0aWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XG5cdFx0XHREQkhlbHBlci5zdG9yZVJldmlldyhvZmZsaW5lUmV2aWV3KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZmV0Y2hVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVZJRVdTX1VSTH1gO1xuXHRcdGNvbnN0IGZldGNoT3B0aW9ucyA9IHtcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkocmV2aWV3KSxcblx0XHRcdGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0fSlcblx0XHR9O1xuXG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIGZldGNoT3B0aW9ucykudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTdWNjZXNzZnVsbHkgcG9zdGVkIHJldmlldyB0byBzZXJ2ZXInKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBCYWQgcmVzcG9uc2UgcmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6ICR7cmVzcG9uc2V9YCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdHJldHVybiBEQkhlbHBlci5mZXRjaFJldmlld3NCeUlkKHJlc3RhdXJhbnRJZCwgZmlsbFJldmlld3NIVE1MKTtcblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhgRmV0Y2ggcmVxdWVzdCBmYWlsZWQ6ICR7ZXJyb3J9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSk7XG5cdH1cblxuXHRzdGF0aWMgc3RvcmVSZXZpZXcob2ZmbGluZVJldmlldyl7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Jldmlld0RhdGEnLCBKU09OLnN0cmluZ2lmeShvZmZsaW5lUmV2aWV3LmRhdGEpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKCkgPT4ge1xuXHRcdFx0bGV0IHJldmlld0RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHJldmlld0RhdGEpKTtcblx0XHRcdGlmIChyZXZpZXdEYXRhICE9PSBudWxsKXtcblx0XHRcdFx0Y29uc3Qgb2ZmbGluZUxhYmVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9mZmxpbmUtbGFiZWwnKSk7XG5cdFx0XHRcdG9mZmxpbmVMYWJlbHMuZm9yRWFjaChvZmZsaW5lTGFiZWwgPT4ge1xuXHRcdFx0XHRcdG9mZmxpbmVMYWJlbC5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdERCSGVscGVyLmFkZFJldmlldyhyZXZpZXdEYXRhKTtcblx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Jldmlld0RhdGEnKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSByZXRyaWV2ZWQgb2ZmbGluZSByZXZpZXcgZGF0YSAmIHJlbW92ZWQgZnJvbSBsb2NhbCBzdG9yYWdlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRmFpbGVkIHRvIGZpbmQgb2ZmbGluZSByZXZpZXcgZGF0YSBpbiBsb2NhbCBzdG9yYWdlJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==
