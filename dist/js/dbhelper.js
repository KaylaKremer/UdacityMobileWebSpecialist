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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmV2aWV3c1N0b3JlIiwiY3JlYXRlSW5kZXgiLCJEQkhlbHBlciIsImNhbGxiYWNrIiwiaWQiLCJyZXN0YXVyYW50VVJMIiwiREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJyZXN0YXVyYW50c1N0b3JlIiwib2JqZWN0U3RvcmUiLCJpIiwicmVzdGF1cmFudHMiLCJsZW5ndGgiLCJwdXQiLCJjb21wbGV0ZSIsImdldEFsbCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaGVkUmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsInBhcnNlSW50IiwicmV2aWV3VVJMIiwiREFUQUJBU0VfUkVWSUVXU19VUkwiLCJyZXZpZXdzIiwiaW5kZXhSZXN0YXVyYW50SWQiLCJpbmRleCIsImZldGNoZWRSZXZpZXdzIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJsb2MiLCJsYXQiLCJsbmciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFwV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1hcEhlaWdodCIsImNsaWVudEhlaWdodCIsInN0YXRpY01hcCIsImZvckVhY2giLCJwb3J0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFNQSxZQUFZQyxJQUFJQyxJQUFKLENBQVMsdUJBQVQsRUFBa0MsQ0FBbEMsRUFBcUMscUJBQWE7QUFDbkUsU0FBUUMsVUFBVUMsVUFBbEI7QUFDQSxPQUFLLENBQUw7QUFDQ0QsYUFBVUUsaUJBQVYsQ0FBNEIsYUFBNUIsRUFBMkMsRUFBQ0MsU0FBUyxJQUFWLEVBQTNDO0FBQ0QsT0FBSyxDQUFMO0FBQ0MsT0FBTUMsZUFBZUosVUFBVUUsaUJBQVYsQ0FBNEIsU0FBNUIsRUFBdUMsRUFBQ0MsU0FBUyxJQUFWLEVBQXZDLENBQXJCO0FBQ0FDLGdCQUFhQyxXQUFiLENBQXlCLGVBQXpCLEVBQTBDLGVBQTFDO0FBTEQ7QUFPQSxDQVJpQixDQUFsQjs7QUFVQTs7OztJQUdNQyxROzs7Ozs7Ozs7QUFnQkw7OzttQ0FHd0JDLFEsRUFBVUMsRSxFQUFJO0FBQ3JDLE9BQUlDLHNCQUFKO0FBQ0FELFFBQUtDLGdCQUFtQkgsU0FBU0ksd0JBQTVCLFNBQXdERixFQUE3RCxHQUFvRUMscUJBQW1CSCxTQUFTSSx3QkFBaEc7O0FBRUFDLFNBQU1GLGFBQU4sRUFBcUJHLElBQXJCLENBQTBCLG9CQUFZO0FBQ3JDLFFBQUdDLFNBQVNDLEVBQVosRUFBZTtBQUNkLFlBQU9ELFNBQVNFLElBQVQsR0FBZ0JILElBQWhCLENBQXFCLHVCQUFlO0FBQzFDZixnQkFBVWUsSUFBVixDQUFlLGNBQU07QUFDcEIsV0FBTUksS0FBS0MsR0FBR0MsV0FBSCxDQUFlLGFBQWYsRUFBOEIsV0FBOUIsQ0FBWDtBQUNBLFdBQUlDLG1CQUFtQkgsR0FBR0ksV0FBSCxDQUFlLGFBQWYsQ0FBdkI7QUFDQSxZQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUMsWUFBWUMsTUFBaEMsRUFBd0NGLEdBQXhD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VCxDQUF3QixLQUF4QixDQUFaO0FBQ0EsT0FBTUMsV0FBVzFCLElBQUkyQixXQUFyQjtBQUNBLE9BQU1DLFlBQVk1QixJQUFJNkIsWUFBdEI7QUFDQSxPQUFJQyxzRUFBb0U5QyxXQUFXNkIsTUFBWCxDQUFrQlMsR0FBdEYsU0FBNkZ0QyxXQUFXNkIsTUFBWCxDQUFrQlUsR0FBL0csc0JBQW1JRyxRQUFuSSxTQUErSUUsU0FBL0ksMkJBQThLNUMsV0FBVzZCLE1BQVgsQ0FBa0JTLEdBQWhNLFNBQXVNdEMsV0FBVzZCLE1BQVgsQ0FBa0JVLEdBQXpOLGlEQUFKO0FBQ0EsVUFBT08sU0FBUDtBQUNBOzs7OztBQTlRRDs7OztzQkFJc0M7QUFDckMsT0FBTUUsT0FBTyxJQUFiLENBRHFDLENBQ2xCO0FBQ25CLGdDQUEyQkEsSUFBM0I7QUFDQTs7O3NCQUVpQztBQUNqQyxPQUFNQSxPQUFPLElBQWIsQ0FEaUMsQ0FDZDtBQUNuQixnQ0FBMkJBLElBQTNCO0FBQ0EiLCJmaWxlIjoiZGJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkYlByb21pc2UgPSBpZGIub3BlbigncmVzdGF1cmFudC1yZXZpZXdzLWRiJywgMiwgdXBncmFkZURCID0+IHtcblx0c3dpdGNoICh1cGdyYWRlREIub2xkVmVyc2lvbil7XG5cdGNhc2UgMDpcblx0XHR1cGdyYWRlREIuY3JlYXRlT2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJywge2tleVBhdGg6ICdpZCd9KTtcblx0Y2FzZSAxOlxuXHRcdGNvbnN0IHJldmlld3NTdG9yZSA9IHVwZ3JhZGVEQi5jcmVhdGVPYmplY3RTdG9yZSgncmV2aWV3cycsIHtrZXlQYXRoOiAnaWQnfSk7XG5cdFx0cmV2aWV3c1N0b3JlLmNyZWF0ZUluZGV4KCdyZXN0YXVyYW50X2lkJywgJ3Jlc3RhdXJhbnRfaWQnKTtcblx0fVxufSk7XG5cbi8qKlxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXG4gKi9cbmNsYXNzIERCSGVscGVyIHtcblx0XG5cdC8qKlxuICAgKiBEYXRhYmFzZSBVUkwuXG4gICAqIENoYW5nZWQgdG8gcmV0cmlldmUgcmVzdGF1cmFudHMgJiByZXZpZXdzIGZyb20gc2VydmVyIG9uIGxvY2FsaG9zdDoxMzM3LlxuICAgKi9cblx0c3RhdGljIGdldCBEQVRBQkFTRV9SRVNUQVVSQU5UU19VUkwoKSB7XG5cdFx0Y29uc3QgcG9ydCA9IDEzMzc7IC8vIENoYW5nZSB0aGlzIHRvIHlvdXIgc2VydmVyIHBvcnRcblx0XHRyZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9yZXN0YXVyYW50c2A7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IERBVEFCQVNFX1JFVklFV1NfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmV2aWV3c2A7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2hlcyBhbGwgcmVzdGF1cmFudCByZXZpZXdzIGRhdGEuIENyZWF0ZXMgYW4gSW5kZXhlZERCIGRhdGFiYXNlIG5hbWVkICdyZXN0YXVyYW50LXJldmlld3MtZGInIHdpdGggYW4gb2JqZWN0IHN0b3JlIG9mICdyZXN0YXVyYW50LXJldmlld3MnLiBJZiByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgaXMgb2ssIHN0b3JlcyBkYXRhIHJlY2VpdmVkIGludG8gdGhlIGRhdGFiYXNlIGFuZCB0aGVuIHJldHVybnMgdGhlIGRhdGEuIElmIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBmYWlscywgbG9vayBpbiB0aGUgZGF0YWJhc2UgdG8gc2VlIGlmIHRoZXJlIGlzIGRhdGEgYWxyZWFkeSBzdG9yZWQgdGhlcmUgYW5kIHJldHVybiB0aGUgZGF0YS4gQ2F0Y2hlcyBhbmQgaGFuZGxlcyBlcnJvcnMgYXBwcm9wcmlhdGVseSB3aGVuIGRhdGEgY2Fubm90IGJlIHJldHJpZXZlZC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRzKGNhbGxiYWNrLCBpZCkge1xuXHRcdGxldCByZXN0YXVyYW50VVJMO1xuXHRcdGlkID8gcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH0vJHtpZH1gIDogcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH1gO1xuXG5cdFx0ZmV0Y2gocmVzdGF1cmFudFVSTCkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0XHRsZXQgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdHJlc3RhdXJhbnRzU3RvcmUucHV0KHJlc3RhdXJhbnRzW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50c1N0b3JlLmdldEFsbCgpO1xuXHRcdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZXN0YXVyYW50cyBmcm9tIHNlcnZlciAmIHN0b3JlZCBpbiBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJlc3RhdXJhbnRzKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXN0YXVyYW50cyBmcm9tIHNlcnZlciAmIHN0b3JlIGluIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnRzJywgJ3JlYWRvbmx5Jyk7XG5cdFx0XHRcdFx0bGV0IHJlc3RhdXJhbnRzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKTtcblx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXRBbGwoKTtcblx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmVzdGF1cmFudHMgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCBkYXRhIGZyb20gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmVzdGF1cmFudHMpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmVzdGF1cmFudHMgZnJvbSBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHJldHVybiBjYWxsYmFjayhgRmV0Y2ggcmVxdWVzdCBmb3IgcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgZmFpbGVkOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGEgcmVzdGF1cmFudCBieSBpdHMgSUQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgY2FsbGJhY2spIHtcblx0XHQvLyBmZXRjaCBhbGwgcmVzdGF1cmFudHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcmVzdGF1cmFudCA9IHJlc3RhdXJhbnRzLmZpbmQociA9PiByLmlkID09PSBwYXJzZUludChpZCkpO1xuXHRcdFx0XHRpZiAocmVzdGF1cmFudCkgeyAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcblx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcblx0XHRcdFx0fSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2Vcblx0XHRcdFx0XHRjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXZpZXcgYnkgaXRzIElELlxuICAgKi9cblx0c3RhdGljIGZldGNoUmV2aWV3c0J5SWQoaWQsIGNhbGxiYWNrKXtcblx0XHRjb25zdCByZXZpZXdVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVZJRVdTX1VSTH0vP3Jlc3RhdXJhbnRfaWQ9JHtpZH1gO1xuXHRcdGZldGNoKHJldmlld1VSTCkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXZpZXdzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXZpZXdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXZpZXdzJyk7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJldmlld3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRyZXZpZXdzU3RvcmUucHV0KHJldmlld3NbaV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc3QgaW5kZXhSZXN0YXVyYW50SWQgPSByZXZpZXdzU3RvcmUuaW5kZXgoJ3Jlc3RhdXJhbnRfaWQnKTtcblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiBpbmRleFJlc3RhdXJhbnRJZC5nZXRBbGwoaWQpO1xuXHRcdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIHJldmlld3MgZnJvbSBzZXJ2ZXIgJiBzdG9yZWQgaW4gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXZpZXdzKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXZpZXdzIGZyb20gc2VydmVyICYgc3RvcmUgaW4gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmV2aWV3cycsICdyZWFkb25seScpO1xuXHRcdFx0XHRcdGxldCByZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmV2aWV3cycpO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4UmVzdGF1cmFudElkID0gcmV2aWV3c1N0b3JlLmluZGV4KCdyZXNhdGF1cmFudF9pZCcpO1xuXHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiBpbmRleFJlc3RhdXJhbnRJZC5nZXRBbGwoaWQpO1xuXHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXZpZXdzID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcmV2aWV3cyBmcm9tIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJldmlld3MpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmV2aWV3cyBmcm9tIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGZXRjaCByZXF1ZXN0IGZvciByZXZpZXdzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gLCBudWxsKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSBhbmQgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzO1xuXHRcdFx0XHRpZiAoY3Vpc2luZSAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuZWlnaGJvcmhvb2QgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hOZWlnaGJvcmhvb2RzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gbmVpZ2hib3Job29kc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlTmVpZ2hib3Job29kcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoQ3Vpc2luZXMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIGN1aXNpbmVzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVDdWlzaW5lcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyB1cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAuL3Jlc3RhdXJhbnQuaHRtbD9pZD0ke3Jlc3RhdXJhbnQuaWR9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBzbWFsbCBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgc21hbGxJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfc21hbGx9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBsYXJnZSBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgbGFyZ2VJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfbGFyZ2V9YCk7XG5cdH1cblxuXHQvKipcbiAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxuICAgKi9cblx0c3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XG5cdFx0Y29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXG5cdFx0XHR0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuXHRcdFx0dXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxuXHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QfVxuXHRcdCk7XG5cdFx0cmV0dXJuIG1hcmtlcjtcblx0fVxuXG5cdC8qKlxuICAgKiBTdGF0aWMgbWFwIGltYWdlIHRvIGJlIGRpc3BsYXllZCB3aGVuIGluZGV4Lmh0bWwgaW5pdGlhbGx5IGxvYWRzLlxuICAgKi9cblx0c3RhdGljIHN0YXRpY0ltYWdlRm9yTWFwSW5kZXgocmVzdGF1cmFudHMpIHtcblx0XHRsZXQgbG9jID0ge1xuXHRcdFx0bGF0OiA0MC43MjIyMTYsXG5cdFx0XHRsbmc6IC03My45ODc1MDFcblx0XHR9O1xuXHRcdGNvbnN0IG1hcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcblx0XHRjb25zdCBtYXBXaWR0aCA9IG1hcC5jbGllbnRXaWR0aDtcblx0XHRjb25zdCBtYXBIZWlnaHQgPSBtYXAuY2xpZW50SGVpZ2h0O1xuXHRcdGxldCBzdGF0aWNNYXAgPSBgaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RhdGljbWFwP2NlbnRlcj0ke1xuXHRcdFx0bG9jLmxhdH0sJHtsb2MubG5nfSZ6b29tPTEyJnNpemU9JHttYXBXaWR0aH14JHttYXBIZWlnaHR9Jm1hcmtlcnM9Y29sb3I6cmVkYDtcblx0XHRyZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xuXHRcdFx0c3RhdGljTWFwICs9IGB8JHtyZXN0YXVyYW50LmxhdGxuZy5sYXR9LCR7cmVzdGF1cmFudC5sYXRsbmcubG5nfWA7XG5cdFx0fSk7XG5cdFx0c3RhdGljTWFwICs9IGAma2V5PUFJemFTeUJ5T0VsRzZFYWkwQ0VaMjdkWUw1Vnc2TnpKT3Q5RlpBY2A7XG5cdFx0cmV0dXJuIHN0YXRpY01hcDtcblx0fVxuXG5cdC8qKlxuICAgKiBTdGF0aWMgbWFwIGltYWdlIHRvIGJlIGRpc3BsYXllZCB3aGVuIHJlc3RhdXJhbnQuaHRtbCBpbml0aWFsbHkgbG9hZHMuXG4gICAqL1xuXHRzdGF0aWMgc3RhdGljSW1hZ2VGb3JNYXBSZXN0YXVyYW50SW5mbyhyZXN0YXVyYW50KSB7XG5cdFx0Y29uc3QgbWFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdGNvbnN0IG1hcFdpZHRoID0gbWFwLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IG1hcEhlaWdodCA9IG1hcC5jbGllbnRIZWlnaHQ7XG5cdFx0bGV0IHN0YXRpY01hcCA9IGBodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/Y2VudGVyPSR7cmVzdGF1cmFudC5sYXRsbmcubGF0fSwke3Jlc3RhdXJhbnQubGF0bG5nLmxuZ30mem9vbT0xNiZzaXplPSR7bWFwV2lkdGh9eCR7bWFwSGVpZ2h0fSZtYXJrZXJzPWNvbG9yOnJlZHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9JmtleT1BSXphU3lCeU9FbEc2RWFpMENFWjI3ZFlMNVZ3Nk56Sk90OUZaQWNgO1xuXHRcdHJldHVybiBzdGF0aWNNYXA7XG5cdH1cbn0iXX0=
