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
    * If online, posts review to server & IndexedDB. If offline, creates an offline review object to be stored in local storage via storeOfflineReview.
    */

	}, {
		key: 'addReview',
		value: function addReview(review, restaurantId, fillReviewsHTML) {
			if (!navigator.onLine) {
				var offlineReview = {
					data: review,
					id: restaurantId,
					callback: fillReviewsHTML
				};
				DBHelper.storeOfflineReview(offlineReview);
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
		key: 'storeOfflineReview',
		value: function storeOfflineReview(offlineReview) {
			localStorage.setItem('reviewData', JSON.stringify(offlineReview.data));
			window.addEventListener('online', function () {
				var reviewData = JSON.parse(localStorage.getItem('reviewData'));
				if (reviewData !== null) {
					var offlineLabels = Array.from(document.querySelectorAll('.offline-label'));
					offlineLabels.forEach(function (offlineLabel) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmV2aWV3c1N0b3JlIiwiY3JlYXRlSW5kZXgiLCJEQkhlbHBlciIsImNhbGxiYWNrIiwiaWQiLCJyZXN0YXVyYW50VVJMIiwiREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJyZXN0YXVyYW50c1N0b3JlIiwib2JqZWN0U3RvcmUiLCJpIiwicmVzdGF1cmFudHMiLCJsZW5ndGgiLCJwdXQiLCJjb21wbGV0ZSIsImdldEFsbCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaGVkUmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsInBhcnNlSW50IiwicmV2aWV3VVJMIiwiREFUQUJBU0VfUkVWSUVXU19VUkwiLCJyZXZpZXdzIiwiaW5kZXhSZXN0YXVyYW50SWQiLCJpbmRleCIsImZldGNoZWRSZXZpZXdzIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJsb2MiLCJsYXQiLCJsbmciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFwV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1hcEhlaWdodCIsImNsaWVudEhlaWdodCIsInN0YXRpY01hcCIsImZvckVhY2giLCJyZXN0YXVyYW50SWQiLCJpc0Zhdm9yaXRlIiwiZmV0Y2hVUkwiLCJtZXRob2QiLCJnZXQiLCJpc19mYXZvcml0ZSIsInVwZGF0ZWRSZXN0YXVyYW50IiwicmV2aWV3IiwiZmlsbFJldmlld3NIVE1MIiwibmF2aWdhdG9yIiwib25MaW5lIiwib2ZmbGluZVJldmlldyIsImRhdGEiLCJzdG9yZU9mZmxpbmVSZXZpZXciLCJmZXRjaE9wdGlvbnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImhlYWRlcnMiLCJIZWFkZXJzIiwiZmV0Y2hSZXZpZXdzQnlJZCIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmV2aWV3RGF0YSIsInBhcnNlIiwiZ2V0SXRlbSIsIm9mZmxpbmVMYWJlbHMiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwib2ZmbGluZUxhYmVsIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwiYWRkUmV2aWV3IiwicmVtb3ZlSXRlbSIsInBvcnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU1BLFlBQVlDLElBQUlDLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxDQUFsQyxFQUFxQyxxQkFBYTtBQUNuRSxTQUFRQyxVQUFVQyxVQUFsQjtBQUNBLE9BQUssQ0FBTDtBQUNDRCxhQUFVRSxpQkFBVixDQUE0QixhQUE1QixFQUEyQyxFQUFDQyxTQUFTLElBQVYsRUFBM0M7QUFDRCxPQUFLLENBQUw7QUFDQyxPQUFNQyxlQUFlSixVQUFVRSxpQkFBVixDQUE0QixTQUE1QixFQUF1QyxFQUFDQyxTQUFTLElBQVYsRUFBdkMsQ0FBckI7QUFDQUMsZ0JBQWFDLFdBQWIsQ0FBeUIsZUFBekIsRUFBMEMsZUFBMUM7QUFMRDtBQU9BLENBUmlCLENBQWxC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TUFGRDtBQUdBM0csY0FBUzhHLFNBQVQsQ0FBbUJ4QixjQUFjQyxJQUFqQyxFQUF1Q0QsY0FBY3BGLEVBQXJELEVBQXlEb0YsY0FBY3JGLFFBQXZFO0FBQ0ErRixrQkFBYWUsVUFBYixDQUF3QixZQUF4QjtBQUNBMUYsYUFBUUMsR0FBUixDQUFZLHlFQUFaO0FBQ0EsS0FSRCxNQVFPO0FBQ05ELGFBQVFDLEdBQVIsQ0FBWSxxREFBWjtBQUNBO0FBQ0QsSUFiRDtBQWNBOzs7OztBQXBXRDs7OztzQkFJc0M7QUFDckMsT0FBTTBGLE9BQU8sSUFBYixDQURxQyxDQUNsQjtBQUNuQixnQ0FBMkJBLElBQTNCO0FBQ0E7OztzQkFFaUM7QUFDakMsT0FBTUEsT0FBTyxJQUFiLENBRGlDLENBQ2Q7QUFDbkIsZ0NBQTJCQSxJQUEzQjtBQUNBIiwiZmlsZSI6ImRiaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZGJQcm9taXNlID0gaWRiLm9wZW4oJ3Jlc3RhdXJhbnQtcmV2aWV3cy1kYicsIDIsIHVwZ3JhZGVEQiA9PiB7XG5cdHN3aXRjaCAodXBncmFkZURCLm9sZFZlcnNpb24pe1xuXHRjYXNlIDA6XG5cdFx0dXBncmFkZURCLmNyZWF0ZU9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycsIHtrZXlQYXRoOiAnaWQnfSk7XG5cdGNhc2UgMTpcblx0XHRjb25zdCByZXZpZXdzU3RvcmUgPSB1cGdyYWRlREIuY3JlYXRlT2JqZWN0U3RvcmUoJ3Jldmlld3MnLCB7a2V5UGF0aDogJ2lkJ30pO1xuXHRcdHJldmlld3NTdG9yZS5jcmVhdGVJbmRleCgncmVzdGF1cmFudF9pZCcsICdyZXN0YXVyYW50X2lkJyk7XG5cdH1cbn0pO1xuXG4vKipcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxuICovXG5jbGFzcyBEQkhlbHBlciB7XG5cdFxuXHQvKipcbiAgICogRGF0YWJhc2UgVVJMLlxuICAgKiBDaGFuZ2VkIHRvIHJldHJpZXZlIHJlc3RhdXJhbnRzICYgcmV2aWV3cyBmcm9tIHNlcnZlciBvbiBsb2NhbGhvc3Q6MTMzNy5cbiAgICovXG5cdHN0YXRpYyBnZXQgREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmVzdGF1cmFudHNgO1xuXHR9XG5cblx0c3RhdGljIGdldCBEQVRBQkFTRV9SRVZJRVdTX1VSTCgpIHtcblx0XHRjb25zdCBwb3J0ID0gMTMzNzsgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxuXHRcdHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L3Jldmlld3NgO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoZXMgYWxsIHJlc3RhdXJhbnQgcmV2aWV3cyBkYXRhLiBDcmVhdGVzIGFuIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lZCAncmVzdGF1cmFudC1yZXZpZXdzLWRiJyB3aXRoIGFuIG9iamVjdCBzdG9yZSBvZiAncmVzdGF1cmFudC1yZXZpZXdzJy4gSWYgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGlzIG9rLCBzdG9yZXMgZGF0YSByZWNlaXZlZCBpbnRvIHRoZSBkYXRhYmFzZSBhbmQgdGhlbiByZXR1cm5zIHRoZSBkYXRhLiBJZiByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgZmFpbHMsIGxvb2sgaW4gdGhlIGRhdGFiYXNlIHRvIHNlZSBpZiB0aGVyZSBpcyBkYXRhIGFscmVhZHkgc3RvcmVkIHRoZXJlIGFuZCByZXR1cm4gdGhlIGRhdGEuIENhdGNoZXMgYW5kIGhhbmRsZXMgZXJyb3JzIGFwcHJvcHJpYXRlbHkgd2hlbiBkYXRhIGNhbm5vdCBiZSByZXRyaWV2ZWQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cyhjYWxsYmFjaywgaWQpIHtcblx0XHRsZXQgcmVzdGF1cmFudFVSTDtcblx0XHRpZCA/IHJlc3RhdXJhbnRVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVNUQVVSQU5UU19VUkx9LyR7aWR9YCA6IHJlc3RhdXJhbnRVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVNUQVVSQU5UU19VUkx9YDtcblxuXHRcdGZldGNoKHJlc3RhdXJhbnRVUkwpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmVzdGF1cmFudHMgPT4ge1xuXHRcdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnRzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJlc3RhdXJhbnRzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdGF1cmFudHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRyZXN0YXVyYW50c1N0b3JlLnB1dChyZXN0YXVyYW50c1tpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXRBbGwoKTtcblx0XHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgJiBzdG9yZWQgaW4gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXN0YXVyYW50cyk7XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgJiBzdG9yZSBpbiBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50cycsICdyZWFkb25seScpO1xuXHRcdFx0XHRcdGxldCByZXN0YXVyYW50c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJyk7XG5cdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIHJlc3RhdXJhbnRzU3RvcmUuZ2V0QWxsKCk7XG5cdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgZGF0YSBmcm9tIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJlc3RhdXJhbnRzKTtcblx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJlc3RhdXJhbnRzIGZyb20gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZldGNoIHJlcXVlc3QgZm9yIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gLCBudWxsKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50cy5maW5kKHIgPT4gci5pZCA9PT0gcGFyc2VJbnQoaWQpKTtcblx0XHRcdFx0aWYgKHJlc3RhdXJhbnQpIHsgLy8gR290IHRoZSByZXN0YXVyYW50XG5cdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XG5cdFx0XHRcdH0gZWxzZSB7IC8vIFJlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGRhdGFiYXNlXG5cdFx0XHRcdFx0Y2FsbGJhY2soJ1Jlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QnLCBudWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGEgcmV2aWV3IGJ5IGl0cyBJRC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJldmlld3NCeUlkKGlkLCBjYWxsYmFjayl7XG5cdFx0Y29uc3QgcmV2aWV3VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVWSUVXU19VUkx9Lz9yZXN0YXVyYW50X2lkPSR7aWR9YDtcblx0XHRmZXRjaChyZXZpZXdVUkwpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmV2aWV3cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRcdGxldCByZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmV2aWV3cycpO1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXZpZXdzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0cmV2aWV3c1N0b3JlLnB1dChyZXZpZXdzW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNvbnN0IGluZGV4UmVzdGF1cmFudElkID0gcmV2aWV3c1N0b3JlLmluZGV4KCdyZXN0YXVyYW50X2lkJyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgaW5kZXhSZXN0YXVyYW50SWQuZ2V0QWxsKGlkKTtcblx0XHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXZpZXdzID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZXZpZXdzIGZyb20gc2VydmVyICYgc3RvcmVkIGluIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmV2aWV3cyk7XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmV2aWV3cyBmcm9tIHNlcnZlciAmIHN0b3JlIGluIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jldmlld3MnLCAncmVhZG9ubHknKTtcblx0XHRcdFx0XHRsZXQgcmV2aWV3c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jldmlld3MnKTtcblx0XHRcdFx0XHRjb25zdCBpbmRleFJlc3RhdXJhbnRJZCA9IHJldmlld3NTdG9yZS5pbmRleCgncmVzYXRhdXJhbnRfaWQnKTtcblx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgaW5kZXhSZXN0YXVyYW50SWQuZ2V0QWxsKGlkKTtcblx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIHJldmlld3MgZnJvbSBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXZpZXdzKTtcblx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJldmlld3MgZnJvbSBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHJldHVybiBjYWxsYmFjayhgRmV0Y2ggcmVxdWVzdCBmb3IgcmV2aWV3cyBmcm9tIHNlcnZlciBmYWlsZWQ6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIHR5cGUgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lKGN1aXNpbmUsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzICB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZ1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gY3Vpc2luZSB0eXBlXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IHJlc3VsdHMgPSByZXN0YXVyYW50cztcblx0XHRcdFx0aWYgKGN1aXNpbmUgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IGN1aXNpbmVcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobmVpZ2hib3Job29kICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoTmVpZ2hib3Job29kcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIG5laWdoYm9yaG9vZHNcblx0XHRcdFx0Y29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZU5laWdoYm9yaG9vZHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBjdWlzaW5lcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlQ3Vpc2luZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgdXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgLi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgc21hbGwgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHNtYWxsSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX3NtYWxsfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgbGFyZ2UgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIGxhcmdlSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX2xhcmdlfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cbiAgICovXG5cdHN0YXRpYyBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCkge1xuXHRcdGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0cG9zaXRpb246IHJlc3RhdXJhbnQubGF0bG5nLFxuXHRcdFx0dGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcblx0XHRcdHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcblx0XHRcdG1hcDogbWFwLFxuXHRcdFx0YW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUH1cblx0XHQpO1xuXHRcdHJldHVybiBtYXJrZXI7XG5cdH1cblxuXHQvKipcbiAgICogU3RhdGljIG1hcCBpbWFnZSB0byBiZSBkaXNwbGF5ZWQgd2hlbiBpbmRleC5odG1sIGluaXRpYWxseSBsb2Fkcy5cbiAgICovXG5cdHN0YXRpYyBzdGF0aWNJbWFnZUZvck1hcEluZGV4KHJlc3RhdXJhbnRzKSB7XG5cdFx0bGV0IGxvYyA9IHtcblx0XHRcdGxhdDogNDAuNzIyMjE2LFxuXHRcdFx0bG5nOiAtNzMuOTg3NTAxXG5cdFx0fTtcblx0XHRjb25zdCBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5cdFx0Y29uc3QgbWFwV2lkdGggPSBtYXAuY2xpZW50V2lkdGg7XG5cdFx0Y29uc3QgbWFwSGVpZ2h0ID0gbWFwLmNsaWVudEhlaWdodDtcblx0XHRsZXQgc3RhdGljTWFwID0gYGh0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0YXRpY21hcD9jZW50ZXI9JHtcblx0XHRcdGxvYy5sYXR9LCR7bG9jLmxuZ30mem9vbT0xMiZzaXplPSR7bWFwV2lkdGh9eCR7bWFwSGVpZ2h0fSZtYXJrZXJzPWNvbG9yOnJlZGA7XG5cdFx0cmVzdGF1cmFudHMuZm9yRWFjaChyZXN0YXVyYW50ID0+IHtcblx0XHRcdHN0YXRpY01hcCArPSBgfCR7cmVzdGF1cmFudC5sYXRsbmcubGF0fSwke3Jlc3RhdXJhbnQubGF0bG5nLmxuZ31gO1xuXHRcdH0pO1xuXHRcdHN0YXRpY01hcCArPSBgJmtleT1BSXphU3lCeU9FbEc2RWFpMENFWjI3ZFlMNVZ3Nk56Sk90OUZaQWNgO1xuXHRcdHJldHVybiBzdGF0aWNNYXA7XG5cdH1cblxuXHQvKipcbiAgICogU3RhdGljIG1hcCBpbWFnZSB0byBiZSBkaXNwbGF5ZWQgd2hlbiByZXN0YXVyYW50Lmh0bWwgaW5pdGlhbGx5IGxvYWRzLlxuICAgKi9cblx0c3RhdGljIHN0YXRpY0ltYWdlRm9yTWFwUmVzdGF1cmFudEluZm8ocmVzdGF1cmFudCkge1xuXHRcdGNvbnN0IG1hcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcblx0XHRjb25zdCBtYXBXaWR0aCA9IG1hcC5jbGllbnRXaWR0aDtcblx0XHRjb25zdCBtYXBIZWlnaHQgPSBtYXAuY2xpZW50SGVpZ2h0O1xuXHRcdGxldCBzdGF0aWNNYXAgPSBgaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RhdGljbWFwP2NlbnRlcj0ke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9Jnpvb209MTYmc2l6ZT0ke21hcFdpZHRofXgke21hcEhlaWdodH0mbWFya2Vycz1jb2xvcjpyZWR8JHtyZXN0YXVyYW50LmxhdGxuZy5sYXR9LCR7cmVzdGF1cmFudC5sYXRsbmcubG5nfSZrZXk9QUl6YVN5QnlPRWxHNkVhaTBDRVoyN2RZTDVWdzZOekpPdDlGWkFjYDtcblx0XHRyZXR1cm4gc3RhdGljTWFwO1xuXHR9XG5cblx0LyoqXG4gICAqIFVwZGF0ZXMgZmF2b3JpdGUgc3RhdHVzIG9mIGEgcmVzdGF1cmFudCB3aGVuIGZhdm9yaXRlIGljb24gaXMgY2xpY2tlZC5cbiAgICovXG5cdHN0YXRpYyB1cGRhdGVGYXZvcml0ZShyZXN0YXVyYW50SWQsIGlzRmF2b3JpdGUpe1xuXHRcdGNvbnN0IGZldGNoVVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMfS8ke3Jlc3RhdXJhbnRJZH0/aXNfZmF2b3JpdGU9JHtpc0Zhdm9yaXRlfWA7XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIHttZXRob2Q6ICdQVVQnfSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRjb25zdCByZXN0YXVyYW50c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJyk7XG5cdFx0XHRcdFx0cmVzdGF1cmFudHNTdG9yZS5nZXQocmVzdGF1cmFudElkKS50aGVuKHJlc3RhdXJhbnQgPT4ge1xuXHRcdFx0XHRcdFx0cmVzdGF1cmFudC5pc19mYXZvcml0ZSA9IGlzRmF2b3JpdGU7XG5cdFx0XHRcdFx0XHRyZXN0YXVyYW50c1N0b3JlLnB1dChyZXN0YXVyYW50KTtcblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50c1N0b3JlLmdldChyZXN0YXVyYW50SWQpO1xuXHRcdFx0XHRcdH0pLnRoZW4odXBkYXRlZFJlc3RhdXJhbnQgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSB1cGRhdGVkIGZhdm9yaXRlIHN0YXR1cyBvZiAke3VwZGF0ZWRSZXN0YXVyYW50Lm5hbWV9YCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYEZhaWxlZCB0byB1cGRhdGUgZmF2b3JpdGUgc3RhdHVzOiAke2Vycm9yfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdEbyBvZmZsaW5lIHN0dWZmIGhlcmUnKTtcblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhgRmV0Y2ggcmVxdWVzdCBmb3IgcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgZmFpbGVkOiAke2Vycm9yfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIElmIG9ubGluZSwgcG9zdHMgcmV2aWV3IHRvIHNlcnZlciAmIEluZGV4ZWREQi4gSWYgb2ZmbGluZSwgY3JlYXRlcyBhbiBvZmZsaW5lIHJldmlldyBvYmplY3QgdG8gYmUgc3RvcmVkIGluIGxvY2FsIHN0b3JhZ2UgdmlhIHN0b3JlT2ZmbGluZVJldmlldy5cbiAgICovXG5cdHN0YXRpYyBhZGRSZXZpZXcocmV2aWV3LCByZXN0YXVyYW50SWQsIGZpbGxSZXZpZXdzSFRNTCl7XG5cdFx0aWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XG5cdFx0XHRjb25zdCBvZmZsaW5lUmV2aWV3ID0ge1xuXHRcdFx0XHRkYXRhOiByZXZpZXcsXG5cdFx0XHRcdGlkOiByZXN0YXVyYW50SWQsXG5cdFx0XHRcdGNhbGxiYWNrOiBmaWxsUmV2aWV3c0hUTUxcblx0XHRcdH07XG5cdFx0XHREQkhlbHBlci5zdG9yZU9mZmxpbmVSZXZpZXcob2ZmbGluZVJldmlldyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGZldGNoVVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVWSUVXU19VUkx9YDtcblx0XHRjb25zdCBmZXRjaE9wdGlvbnMgPSB7XG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHJldmlldyksXG5cdFx0XHRoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdH0pXG5cdFx0fTtcblx0XHRmZXRjaChmZXRjaFVSTCwgZmV0Y2hPcHRpb25zKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSBwb3N0ZWQgcmV2aWV3IHRvIHNlcnZlcicpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coYEJhZCByZXNwb25zZSByZWNlaXZlZCBmcm9tIHNlcnZlcjogJHtyZXNwb25zZX1gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0cmV0dXJuIERCSGVscGVyLmZldGNoUmV2aWV3c0J5SWQocmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpO1xuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaCByZXF1ZXN0IGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxuXG5cdHN0YXRpYyBzdG9yZU9mZmxpbmVSZXZpZXcob2ZmbGluZVJldmlldyl7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Jldmlld0RhdGEnLCBKU09OLnN0cmluZ2lmeShvZmZsaW5lUmV2aWV3LmRhdGEpKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKCkgPT4ge1xuXHRcdFx0bGV0IHJldmlld0RhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZXZpZXdEYXRhJykpO1xuXHRcdFx0aWYgKHJldmlld0RhdGEgIT09IG51bGwpe1xuXHRcdFx0XHRjb25zdCBvZmZsaW5lTGFiZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub2ZmbGluZS1sYWJlbCcpKTtcblx0XHRcdFx0b2ZmbGluZUxhYmVscy5mb3JFYWNoKG9mZmxpbmVMYWJlbCA9PiB7XG5cdFx0XHRcdFx0b2ZmbGluZUxhYmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2ZmbGluZUxhYmVsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdERCSGVscGVyLmFkZFJldmlldyhvZmZsaW5lUmV2aWV3LmRhdGEsIG9mZmxpbmVSZXZpZXcuaWQsIG9mZmxpbmVSZXZpZXcuY2FsbGJhY2spO1xuXHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncmV2aWV3RGF0YScpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IHJldHJpZXZlZCBvZmZsaW5lIHJldmlldyBkYXRhICYgcmVtb3ZlZCBmcm9tIGxvY2FsIHN0b3JhZ2UnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZmluZCBvZmZsaW5lIHJldmlldyBkYXRhIGluIGxvY2FsIHN0b3JhZ2UnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuIl19
