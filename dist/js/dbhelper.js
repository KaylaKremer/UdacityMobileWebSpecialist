'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
			var dbPromise = idb.open('restaurant-reviews-db', 1, function (upgradeDB) {
				switch (upgradeDB.oldVersion) {
					case 0:
						upgradeDB.createObjectStore('restaurant-reviews', { keyPath: 'id' });
				}
			});
			var restaurantURL = void 0;
			id ? restaurantURL = DBHelper.DATABASE_URL + '/' + id : restaurantURL = '' + DBHelper.DATABASE_URL;
			fetch(restaurantURL).then(function (response) {
				if (response.ok) {
					return response.json().then(function (restaurantReviews) {
						dbPromise.then(function (db) {
							var tx = db.transaction('restaurant-reviews', 'readwrite');
							var restaurantReviewsStore = tx.objectStore('restaurant-reviews');
							restaurantReviews.forEach(function (restaurantReview) {
								restaurantReviewsStore.put(restaurantReview);
							});
							return tx.complete && restaurantReviewsStore.getAll();
						}).then(function (restaurantReviews) {
							console.log('Sucessfully fetched data from server & stored in IndexedDB!');
							callback(null, restaurantReviews);
						}).catch(function (error) {
							callback('Failed to fetch data from server & store n IndexedDB: ' + error, null);
						});
					});
				} else {
					dbPromise.then(function (db) {
						var tx = db.transaction('restaurant-reviews', 'readonly');
						var restaurantReviewsStore = tx.objectStore('restaurant-reviews');
						//if (restaurantReviewsStores.getAll())
						return tx.complete && restaurantReviewsStore.getAll();
					}).then(function (restaurantReviews) {
						console.log('Sucessfully fetched data from IndexedDB!');
						callback(null, restaurantReviews);
					}).catch(function (error) {
						callback('Failed to fetch data from IndexedDB: ' + error, null);
					});
				}
			}).catch(function (error) {
				callback('Fetch request for data from server failed: ' + error, null);
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
			var staticMap = 'http://maps.googleapis.com/maps/api/staticmap?center=' + restaurant.latlng + '&zoom=16&size=' + mapWidth + 'x' + mapHeight + '&markers=color:red|' + restaurant.latlng.lat + ',' + restaurant.latlng.lng + '&key=AIzaSyByOElG6Eai0CEZ27dYL5Vw6NzJOt9FZAc';
			return staticMap;
		}
	}, {
		key: 'DATABASE_URL',


		/**
    * Database URL.
    * Changed to retrieve data from the server on localhost:1337.
    */
		get: function get() {
			var port = 1337; // Change this to your server port
			return 'http://localhost:' + port + '/restaurants';
		}
	}]);

	return DBHelper;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJpZCIsImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmVzdGF1cmFudFVSTCIsIkRBVEFCQVNFX1VSTCIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwib2siLCJqc29uIiwidHgiLCJkYiIsInRyYW5zYWN0aW9uIiwicmVzdGF1cmFudFJldmlld3NTdG9yZSIsIm9iamVjdFN0b3JlIiwicmVzdGF1cmFudFJldmlld3MiLCJmb3JFYWNoIiwicHV0IiwicmVzdGF1cmFudFJldmlldyIsImNvbXBsZXRlIiwiZ2V0QWxsIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZXJyb3IiLCJmZXRjaFJlc3RhdXJhbnRzIiwicmVzdGF1cmFudHMiLCJyZXN0YXVyYW50IiwiZmluZCIsInIiLCJwYXJzZUludCIsImN1aXNpbmUiLCJyZXN1bHRzIiwiZmlsdGVyIiwiY3Vpc2luZV90eXBlIiwibmVpZ2hib3Job29kIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImluZGV4T2YiLCJjdWlzaW5lcyIsInVuaXF1ZUN1aXNpbmVzIiwicGhvdG9ncmFwaF9zbWFsbCIsInBob3RvZ3JhcGhfbGFyZ2UiLCJtYXJrZXIiLCJnb29nbGUiLCJtYXBzIiwiTWFya2VyIiwicG9zaXRpb24iLCJsYXRsbmciLCJ0aXRsZSIsIm5hbWUiLCJ1cmwiLCJ1cmxGb3JSZXN0YXVyYW50IiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsImxvYyIsImxhdCIsImxuZyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJtYXBXaWR0aCIsImNsaWVudFdpZHRoIiwibWFwSGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwic3RhdGljTWFwIiwicG9ydCJdLCJtYXBwaW5n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d0IsTUFBWCxDQUFrQlMsR0FBbkMsU0FBMENqQyxXQUFXd0IsTUFBWCxDQUFrQlUsR0FBNUQ7QUFDQSxJQUZEO0FBR0FPO0FBQ0EsVUFBT0EsU0FBUDtBQUNBOztBQUVEOzs7Ozs7a0RBR3VDekMsVSxFQUFZO0FBQ2xELE9BQU1VLE1BQU15QixTQUFTQyxjQUFULENBQXdCLEtBQXhCLENBQVo7QUFDQSxPQUFNQyxXQUFXM0IsSUFBSTRCLFdBQXJCO0FBQ0EsT0FBTUMsWUFBWTdCLElBQUk4QixZQUF0QjtBQUNBLE9BQUlDLHNFQUFvRXpDLFdBQVd3QixNQUEvRSxzQkFBc0dhLFFBQXRHLFNBQWtIRSxTQUFsSCwyQkFBaUp2QyxXQUFXd0IsTUFBWCxDQUFrQlMsR0FBbkssU0FBMEtqQyxXQUFXd0IsTUFBWCxDQUFrQlUsR0FBNUwsaURBQUo7QUFDQSxVQUFPTyxTQUFQO0FBQ0E7Ozs7O0FBcE9EOzs7O3NCQUkwQjtBQUN6QixPQUFNQyxPQUFPLElBQWIsQ0FEeUIsQ0FDTjtBQUNuQixnQ0FBMkJBLElBQTNCO0FBQ0EiLCJmaWxlIjoiZGJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxuICovXG5jbGFzcyBEQkhlbHBlciB7XG5cdFxuXHQvKipcbiAgICogRGF0YWJhc2UgVVJMLlxuICAgKiBDaGFuZ2VkIHRvIHJldHJpZXZlIGRhdGEgZnJvbSB0aGUgc2VydmVyIG9uIGxvY2FsaG9zdDoxMzM3LlxuICAgKi9cblx0c3RhdGljIGdldCBEQVRBQkFTRV9VUkwoKSB7XG5cdFx0Y29uc3QgcG9ydCA9IDEzMzc7IC8vIENoYW5nZSB0aGlzIHRvIHlvdXIgc2VydmVyIHBvcnRcblx0XHRyZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9yZXN0YXVyYW50c2A7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2hlcyBhbGwgcmVzdGF1cmFudCByZXZpZXdzIGRhdGEuIENyZWF0ZXMgYW4gSW5kZXhlZERCIGRhdGFiYXNlIG5hbWVkICdyZXN0YXVyYW50LXJldmlld3MtZGInIHdpdGggYW4gb2JqZWN0IHN0b3JlIG9mICdyZXN0YXVyYW50LXJldmlld3MnLiBJZiByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgaXMgb2ssIHN0b3JlcyBkYXRhIHJlY2VpdmVkIGludG8gdGhlIGRhdGFiYXNlIGFuZCB0aGVuIHJldHVybnMgdGhlIGRhdGEuIElmIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBmYWlscywgbG9vayBpbiB0aGUgZGF0YWJhc2UgdG8gc2VlIGlmIHRoZXJlIGlzIGRhdGEgYWxyZWFkeSBzdG9yZWQgdGhlcmUgYW5kIHJldHVybiB0aGUgZGF0YS4gQ2F0Y2hlcyBhbmQgaGFuZGxlcyBlcnJvcnMgYXBwcm9wcmlhdGVseSB3aGVuIGRhdGEgY2Fubm90IGJlIHJldHJpZXZlZC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRzKGNhbGxiYWNrLCBpZCkge1xuXHRcdGNvbnN0IGRiUHJvbWlzZSA9IGlkYi5vcGVuKCdyZXN0YXVyYW50LXJldmlld3MtZGInLCAxLCB1cGdyYWRlREIgPT4ge1xuXHRcdFx0c3dpdGNoICh1cGdyYWRlREIub2xkVmVyc2lvbil7XG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRcdHVwZ3JhZGVEQi5jcmVhdGVPYmplY3RTdG9yZSgncmVzdGF1cmFudC1yZXZpZXdzJywge2tleVBhdGg6ICdpZCd9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRsZXQgcmVzdGF1cmFudFVSTDtcblx0XHRpZCA/IHJlc3RhdXJhbnRVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9VUkx9LyR7aWR9YCA6IHJlc3RhdXJhbnRVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9VUkx9YDtcblx0XHRmZXRjaChyZXN0YXVyYW50VVJMKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3RhdXJhbnRSZXZpZXdzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50LXJldmlld3MnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0XHRsZXQgcmVzdGF1cmFudFJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50LXJldmlld3MnKTtcblx0XHRcdFx0XHRcdHJlc3RhdXJhbnRSZXZpZXdzLmZvckVhY2gocmVzdGF1cmFudFJldmlldyA9PiB7XG5cdFx0XHRcdFx0XHRcdHJlc3RhdXJhbnRSZXZpZXdzU3RvcmUucHV0KHJlc3RhdXJhbnRSZXZpZXcpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudFJldmlld3NTdG9yZS5nZXRBbGwoKTtcblx0XHRcdFx0XHR9KS50aGVuKHJlc3RhdXJhbnRSZXZpZXdzID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNlc3NmdWxseSBmZXRjaGVkIGRhdGEgZnJvbSBzZXJ2ZXIgJiBzdG9yZWQgaW4gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudFJldmlld3MpO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggZGF0YSBmcm9tIHNlcnZlciAmIHN0b3JlIG4gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50LXJldmlld3MnLCAncmVhZG9ubHknKTtcblx0XHRcdFx0XHRsZXQgcmVzdGF1cmFudFJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50LXJldmlld3MnKTtcblx0XHRcdFx0XHQvL2lmIChyZXN0YXVyYW50UmV2aWV3c1N0b3Jlcy5nZXRBbGwoKSlcblx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudFJldmlld3NTdG9yZS5nZXRBbGwoKTtcblx0XHRcdFx0fSkudGhlbihyZXN0YXVyYW50UmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Vzc2Z1bGx5IGZldGNoZWQgZGF0YSBmcm9tIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50UmV2aWV3cyk7XG5cdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIGRhdGEgZnJvbSBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNhbGxiYWNrKGBGZXRjaCByZXF1ZXN0IGZvciBkYXRhIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gLCBudWxsKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50cy5maW5kKHIgPT4gci5pZCA9PT0gcGFyc2VJbnQoaWQpKTtcblx0XHRcdFx0aWYgKHJlc3RhdXJhbnQpIHsgLy8gR290IHRoZSByZXN0YXVyYW50XG5cdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XG5cdFx0XHRcdH0gZWxzZSB7IC8vIFJlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGRhdGFiYXNlXG5cdFx0XHRcdFx0Y2FsbGJhY2soJ1Jlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QnLCBudWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSB0eXBlIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZShjdWlzaW5lLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIGN1aXNpbmUgdHlwZVxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kKG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIG5laWdoYm9yaG9vZFxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCByZXN1bHRzID0gcmVzdGF1cmFudHM7XG5cdFx0XHRcdGlmIChjdWlzaW5lICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5laWdoYm9yaG9vZCAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaE5laWdoYm9yaG9vZHMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIG5laWdoYm9yaG9vZHMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgbmVpZ2hib3Job29kcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0ubmVpZ2hib3Job29kKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZU5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzLmZpbHRlcigodiwgaSkgPT4gbmVpZ2hib3Job29kcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVOZWlnaGJvcmhvb2RzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hDdWlzaW5lcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgY3Vpc2luZXMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgY3Vpc2luZXMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLmN1aXNpbmVfdHlwZSk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcblx0XHRcdFx0Y29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZUN1aXNpbmVzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHNtYWxsIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBzbWFsbEltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9zbWFsbH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IGxhcmdlIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBsYXJnZUltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9sYXJnZX1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBNYXAgbWFya2VyIGZvciBhIHJlc3RhdXJhbnQuXG4gICAqL1xuXHRzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcblx0XHRjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdHBvc2l0aW9uOiByZXN0YXVyYW50LmxhdGxuZyxcblx0XHRcdHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXG5cdFx0XHR1cmw6IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksXG5cdFx0XHRtYXA6IG1hcCxcblx0XHRcdGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1B9XG5cdFx0KTtcblx0XHRyZXR1cm4gbWFya2VyO1xuXHR9XG5cblx0LyoqXG4gICAqIFN0YXRpYyBtYXAgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIHdoZW4gaW5kZXguaHRtbCBpbml0aWFsbHkgbG9hZHMuXG4gICAqL1xuXHRzdGF0aWMgc3RhdGljSW1hZ2VGb3JNYXBJbmRleChyZXN0YXVyYW50cykge1xuXHRcdGxldCBsb2MgPSB7XG5cdFx0XHRsYXQ6IDQwLjcyMjIxNixcblx0XHRcdGxuZzogLTczLjk4NzUwMVxuXHRcdH07XG5cdFx0Y29uc3QgbWFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdGNvbnN0IG1hcFdpZHRoID0gbWFwLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IG1hcEhlaWdodCA9IG1hcC5jbGllbnRIZWlnaHQ7XG5cdFx0bGV0IHN0YXRpY01hcCA9IGBodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/Y2VudGVyPSR7XG5cdFx0XHRsb2MubGF0fSwke2xvYy5sbmd9Jnpvb209MTImc2l6ZT0ke21hcFdpZHRofXgke21hcEhlaWdodH0mbWFya2Vycz1jb2xvcjpyZWRgO1xuXHRcdHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XG5cdFx0XHRzdGF0aWNNYXAgKz0gYHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9YDtcblx0XHR9KTtcblx0XHRzdGF0aWNNYXAgKz0gYCZrZXk9QUl6YVN5QnlPRWxHNkVhaTBDRVoyN2RZTDVWdzZOekpPdDlGWkFjYDtcblx0XHRyZXR1cm4gc3RhdGljTWFwO1xuXHR9XG5cblx0LyoqXG4gICAqIFN0YXRpYyBtYXAgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIHdoZW4gcmVzdGF1cmFudC5odG1sIGluaXRpYWxseSBsb2Fkcy5cbiAgICovXG5cdHN0YXRpYyBzdGF0aWNJbWFnZUZvck1hcFJlc3RhdXJhbnRJbmZvKHJlc3RhdXJhbnQpIHtcblx0XHRjb25zdCBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5cdFx0Y29uc3QgbWFwV2lkdGggPSBtYXAuY2xpZW50V2lkdGg7XG5cdFx0Y29uc3QgbWFwSGVpZ2h0ID0gbWFwLmNsaWVudEhlaWdodDtcblx0XHRsZXQgc3RhdGljTWFwID0gYGh0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0YXRpY21hcD9jZW50ZXI9JHtyZXN0YXVyYW50LmxhdGxuZ30mem9vbT0xNiZzaXplPSR7bWFwV2lkdGh9eCR7bWFwSGVpZ2h0fSZtYXJrZXJzPWNvbG9yOnJlZHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9JmtleT1BSXphU3lCeU9FbEc2RWFpMENFWjI3ZFlMNVZ3Nk56Sk90OUZaQWNgO1xuXHRcdHJldHVybiBzdGF0aWNNYXA7XG5cdH1cbn0iXX0=
