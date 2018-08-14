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
			fetch(reviewURL, { method: 'GET' }).then(function (response) {
				if (response.ok) {
					return response.json().then(function (reviews) {
						dbPromise.then(function (db) {
							var tx = db.transaction('reviews', 'readwrite');
							var reviewsStore = tx.objectStore('reviews');
							for (var i = 0; i < reviews.length; i++) {
								reviewsStore.put(reviews[i]);
							}
							var indexRestaurantId = reviewsStore.index('restaurant_id');
							return tx.complete && indexRestaurantId.getAll(parseInt(id));
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
					//WIP
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
					id: review.id,
					restaurantId: restaurantId,
					data: review,
					callback: fillReviewsHTML
				};
				localStorage.setItem('' + offlineReview.id, JSON.stringify(offlineReview.data));
				DBHelper.storedOfflineReviews();
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
					console.log('Bad response received from server: ' + response.status);
					return;
				}
			}).then(function (response) {
				return DBHelper.fetchReviewsById(restaurantId, fillReviewsHTML);
			}).catch(function (error) {
				console.log('Fetch request failed: ' + error);
				return;
			});
		}

		/**
    * If online, deletes review from server & IndexedDB. If offline, removes from local storage.
    */

	}, {
		key: 'removeReview',
		value: function removeReview(reviewId, restaurantId, fillReviewsHTML) {
			if (!navigator.onLine) {
				localStorage.removeItem('reviewData');
				return;
			}
			var fetchURL = DBHelper.DATABASE_REVIEWS_URL + '/' + reviewId;
			console.log('reviewId', reviewId);
			fetch(fetchURL, { method: 'DELETE' }).then(function (response) {
				if (response.ok) {
					return response.json().then(function (reviews) {
						dbPromise.then(function (db) {
							var tx = db.transaction('reviews', 'readwrite');
							var reviewsStore = tx.objectStore('reviews');
							reviewsStore.delete(reviewId);
							console.log('Successfully deleted review from server and IndexedDB');
							return tx.complete;
						});
					});
				} else {
					console.log('Bad response received from server: ' + response.status);
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
		key: 'storedOfflineReviews',
		value: function storedOfflineReviews() {
			//WIP
			window.addEventListener('online', function () {
				if (localStorage.length > 0) {
					var offlineLabels = Array.from(document.querySelectorAll('.offline-label'));
					offlineLabels.forEach(function (offlineLabel) {
						offlineLabel.parentNode.removeChild(offlineLabel);
					});
					for (var i = 0; i < localStorage.length; i++) {
						var offlineReview = JSON.parse(localStorage.getItem('id')[i]);
						DBHelper.addReview(offlineReview.data, offlineReview.restaurantId, offlineReview.callback);
						localStorage.removeItem('' + offlineReview.id);
						console.log('Successfully retrieved offline review data & removed from local storage');
					}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmV2aWV3c1N0b3JlIiwiY3JlYXRlSW5kZXgiLCJEQkhlbHBlciIsImNhbGxiYWNrIiwiaWQiLCJyZXN0YXVyYW50VVJMIiwiREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJyZXN0YXVyYW50c1N0b3JlIiwib2JqZWN0U3RvcmUiLCJpIiwicmVzdGF1cmFudHMiLCJsZW5ndGgiLCJwdXQiLCJjb21wbGV0ZSIsImdldEFsbCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaGVkUmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsInBhcnNlSW50IiwicmV2aWV3VVJMIiwiREFUQUJBU0VfUkVWSUVXU19VUkwiLCJtZXRob2QiLCJyZXZpZXdzIiwiaW5kZXhSZXN0YXVyYW50SWQiLCJpbmRleCIsImZldGNoZWRSZXZpZXdzIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJsb2MiLCJsYXQiLCJsbmciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFwV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1hcEhlaWdodCIsImNsaWVudEhlaWdodCIsInN0YXRpY01hcCIsImZvckVhY2giLCJyZXN0YXVyYW50SWQiLCJpc0Zhdm9yaXRlIiwiZmV0Y2hVUkwiLCJnZXQiLCJpc19mYXZvcml0ZSIsInVwZGF0ZWRSZXN0YXVyYW50IiwicmV2aWV3IiwiZmlsbFJldmlld3NIVE1MIiwibmF2aWdhdG9yIiwib25MaW5lIiwib2ZmbGluZVJldmlldyIsImRhdGEiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0b3JlZE9mZmxpbmVSZXZpZXdzIiwiZmV0Y2hPcHRpb25zIiwiYm9keSIsImhlYWRlcnMiLCJIZWFkZXJzIiwic3RhdHVzIiwiZmV0Y2hSZXZpZXdzQnlJZCIsInJldmlld0lkIiwicmVtb3ZlSXRlbSIsImRlbGV0ZSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmZsaW5lTGFiZWxzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm9mZmxpbmVMYWJlbCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInBhcnNlIiwiZ2V0SXRlbSIsImFkZFJldmlldyIsInBvcnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU1BLFlBQVlDLElBQUlDLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxDQUFsQyxFQUFxQyxxQkFBYTtBQUNuRSxTQUFRQyxVQUFVQyxVQUFsQjtBQUNBLE9BQUssQ0FBTDtBQUNDRCxhQUFVRSxpQkFBVixDQUE0QixhQUE1QixFQUEyQyxFQUFDQyxTQUFTLElBQVYsRUFBM0M7QUFDRCxPQUFLLENBQUw7QUFDQyxPQUFNQyxlQUFlSixVQUFVRSxpQkFBVixDQUE0QixTQUE1QixFQUF1QyxFQUFDQyxTQUFTLElBQVYsRUFBdkMsQ0FBckI7QUFDQUMsZ0JBQWFDLFdBQWIsQ0FBeUIsZUFBekIsRUFBMEMsZUFBMUM7QUFM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N0YsSUFBSSxDQUFiLEVBQWdCQSxJQUFJeUUsYUFBYXZFLE1BQWpDLEVBQXlDRixHQUF6QyxFQUE2QztBQUM1QyxVQUFNdUUsZ0JBQWdCSSxLQUFLcUIsS0FBTCxDQUFXdkIsYUFBYXdCLE9BQWIsQ0FBcUIsSUFBckIsRUFBMkJqRyxDQUEzQixDQUFYLENBQXRCO0FBQ0FmLGVBQVNpSCxTQUFULENBQW1CM0IsY0FBY0MsSUFBakMsRUFBdUNELGNBQWNWLFlBQXJELEVBQW1FVSxjQUFjckYsUUFBakY7QUFDQXVGLG1CQUFhWSxVQUFiLE1BQTJCZCxjQUFjcEYsRUFBekM7QUFDQW1CLGNBQVFDLEdBQVIsQ0FBWSx5RUFBWjtBQUNBO0FBQ0QsS0FYRCxNQVdPO0FBQ05ELGFBQVFDLEdBQVIsQ0FBWSxxREFBWjtBQUNBO0FBQ0QsSUFmRDtBQWdCQTs7Ozs7QUExWUQ7Ozs7c0JBSXNDO0FBQ3JDLE9BQU00RixPQUFPLElBQWIsQ0FEcUMsQ0FDbEI7QUFDbkIsZ0NBQTJCQSxJQUEzQjtBQUNBOzs7c0JBRWlDO0FBQ2pDLE9BQU1BLE9BQU8sSUFBYixDQURpQyxDQUNkO0FBQ25CLGdDQUEyQkEsSUFBM0I7QUFDQSIsImZpbGUiOiJkYmhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRiUHJvbWlzZSA9IGlkYi5vcGVuKCdyZXN0YXVyYW50LXJldmlld3MtZGInLCAyLCB1cGdyYWRlREIgPT4ge1xuXHRzd2l0Y2ggKHVwZ3JhZGVEQi5vbGRWZXJzaW9uKXtcblx0Y2FzZSAwOlxuXHRcdHVwZ3JhZGVEQi5jcmVhdGVPYmplY3RTdG9yZSgncmVzdGF1cmFudHMnLCB7a2V5UGF0aDogJ2lkJ30pO1xuXHRjYXNlIDE6XG5cdFx0Y29uc3QgcmV2aWV3c1N0b3JlID0gdXBncmFkZURCLmNyZWF0ZU9iamVjdFN0b3JlKCdyZXZpZXdzJywge2tleVBhdGg6ICdpZCd9KTtcblx0XHRyZXZpZXdzU3RvcmUuY3JlYXRlSW5kZXgoJ3Jlc3RhdXJhbnRfaWQnLCAncmVzdGF1cmFudF9pZCcpO1xuXHR9XG59KTtcblxuLyoqXG4gKiBDb21tb24gZGF0YWJhc2UgaGVscGVyIGZ1bmN0aW9ucy5cbiAqL1xuY2xhc3MgREJIZWxwZXIge1xuXHRcblx0LyoqXG4gICAqIERhdGFiYXNlIFVSTC5cbiAgICogQ2hhbmdlZCB0byByZXRyaWV2ZSByZXN0YXVyYW50cyAmIHJldmlld3MgZnJvbSBzZXJ2ZXIgb24gbG9jYWxob3N0OjEzMzcuXG4gICAqL1xuXHRzdGF0aWMgZ2V0IERBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTCgpIHtcblx0XHRjb25zdCBwb3J0ID0gMTMzNzsgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxuXHRcdHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L3Jlc3RhdXJhbnRzYDtcblx0fVxuXG5cdHN0YXRpYyBnZXQgREFUQUJBU0VfUkVWSUVXU19VUkwoKSB7XG5cdFx0Y29uc3QgcG9ydCA9IDEzMzc7IC8vIENoYW5nZSB0aGlzIHRvIHlvdXIgc2VydmVyIHBvcnRcblx0XHRyZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9yZXZpZXdzYDtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaGVzIGFsbCByZXN0YXVyYW50IHJldmlld3MgZGF0YS4gQ3JlYXRlcyBhbiBJbmRleGVkREIgZGF0YWJhc2UgbmFtZWQgJ3Jlc3RhdXJhbnQtcmV2aWV3cy1kYicgd2l0aCBhbiBvYmplY3Qgc3RvcmUgb2YgJ3Jlc3RhdXJhbnQtcmV2aWV3cycuIElmIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBpcyBvaywgc3RvcmVzIGRhdGEgcmVjZWl2ZWQgaW50byB0aGUgZGF0YWJhc2UgYW5kIHRoZW4gcmV0dXJucyB0aGUgZGF0YS4gSWYgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGZhaWxzLCBsb29rIGluIHRoZSBkYXRhYmFzZSB0byBzZWUgaWYgdGhlcmUgaXMgZGF0YSBhbHJlYWR5IHN0b3JlZCB0aGVyZSBhbmQgcmV0dXJuIHRoZSBkYXRhLiBDYXRjaGVzIGFuZCBoYW5kbGVzIGVycm9ycyBhcHByb3ByaWF0ZWx5IHdoZW4gZGF0YSBjYW5ub3QgYmUgcmV0cmlldmVkLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2ssIGlkKSB7XG5cdFx0bGV0IHJlc3RhdXJhbnRVUkw7XG5cdFx0aWQgPyByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMfS8ke2lkfWAgOiByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMfWA7XG5cblx0XHRmZXRjaChyZXN0YXVyYW50VVJMKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRcdGxldCByZXN0YXVyYW50c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJyk7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0cmVzdGF1cmFudHNTdG9yZS5wdXQocmVzdGF1cmFudHNbaV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIHJlc3RhdXJhbnRzU3RvcmUuZ2V0QWxsKCk7XG5cdFx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmVzdGF1cmFudHMgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyICYgc3RvcmVkIGluIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmVzdGF1cmFudHMpO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyICYgc3RvcmUgaW4gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZG9ubHknKTtcblx0XHRcdFx0XHRsZXQgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50c1N0b3JlLmdldEFsbCgpO1xuXHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIGRhdGEgZnJvbSBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXN0YXVyYW50cyk7XG5cdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXN0YXVyYW50cyBmcm9tIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGZXRjaCByZXF1ZXN0IGZvciByZXN0YXVyYW50cyBmcm9tIHNlcnZlciBmYWlsZWQ6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xuXHRcdC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT09IHBhcnNlSW50KGlkKSk7XG5cdFx0XHRcdGlmIChyZXN0YXVyYW50KSB7IC8vIEdvdCB0aGUgcmVzdGF1cmFudFxuXHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xuXHRcdFx0XHR9IGVsc2UgeyAvLyBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBkYXRhYmFzZVxuXHRcdFx0XHRcdGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhIHJldmlldyBieSBpdHMgSUQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXZpZXdzQnlJZChpZCwgY2FsbGJhY2spe1xuXHRcdGNvbnN0IHJldmlld1VSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFVklFV1NfVVJMfS8/cmVzdGF1cmFudF9pZD0ke2lkfWA7XG5cdFx0ZmV0Y2gocmV2aWV3VVJMLCB7bWV0aG9kOiAnR0VUJ30pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmV2aWV3cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRcdGxldCByZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmV2aWV3cycpO1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXZpZXdzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRcdFx0cmV2aWV3c1N0b3JlLnB1dChyZXZpZXdzW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNvbnN0IGluZGV4UmVzdGF1cmFudElkID0gcmV2aWV3c1N0b3JlLmluZGV4KCdyZXN0YXVyYW50X2lkJyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgaW5kZXhSZXN0YXVyYW50SWQuZ2V0QWxsKHBhcnNlSW50KGlkKSk7XG5cdFx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcmV2aWV3cyBmcm9tIHNlcnZlciAmIHN0b3JlZCBpbiBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJldmlld3MpO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJldmlld3MgZnJvbSBzZXJ2ZXIgJiBzdG9yZSBpbiBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXZpZXdzJywgJ3JlYWRvbmx5Jyk7XG5cdFx0XHRcdFx0bGV0IHJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXZpZXdzJyk7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXhSZXN0YXVyYW50SWQgPSByZXZpZXdzU3RvcmUuaW5kZXgoJ3Jlc2F0YXVyYW50X2lkJyk7XG5cdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIGluZGV4UmVzdGF1cmFudElkLmdldEFsbChpZCk7XG5cdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZXZpZXdzIGZyb20gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmV2aWV3cyk7XG5cdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXZpZXdzIGZyb20gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZldGNoIHJlcXVlc3QgZm9yIHJldmlld3MgZnJvbSBzZXJ2ZXIgZmFpbGVkOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSB0eXBlIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZShjdWlzaW5lLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIGN1aXNpbmUgdHlwZVxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kKG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIG5laWdoYm9yaG9vZFxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCByZXN1bHRzID0gcmVzdGF1cmFudHM7XG5cdFx0XHRcdGlmIChjdWlzaW5lICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5laWdoYm9yaG9vZCAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaE5laWdoYm9yaG9vZHMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIG5laWdoYm9yaG9vZHMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgbmVpZ2hib3Job29kcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0ubmVpZ2hib3Job29kKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZU5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzLmZpbHRlcigodiwgaSkgPT4gbmVpZ2hib3Job29kcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVOZWlnaGJvcmhvb2RzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hDdWlzaW5lcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgY3Vpc2luZXMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgY3Vpc2luZXMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLmN1aXNpbmVfdHlwZSk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcblx0XHRcdFx0Y29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZUN1aXNpbmVzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHNtYWxsIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBzbWFsbEltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9zbWFsbH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IGxhcmdlIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBsYXJnZUltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9sYXJnZX1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBNYXAgbWFya2VyIGZvciBhIHJlc3RhdXJhbnQuXG4gICAqL1xuXHRzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcblx0XHRjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdHBvc2l0aW9uOiByZXN0YXVyYW50LmxhdGxuZyxcblx0XHRcdHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXG5cdFx0XHR1cmw6IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksXG5cdFx0XHRtYXA6IG1hcCxcblx0XHRcdGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1B9XG5cdFx0KTtcblx0XHRyZXR1cm4gbWFya2VyO1xuXHR9XG5cblx0LyoqXG4gICAqIFN0YXRpYyBtYXAgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIHdoZW4gaW5kZXguaHRtbCBpbml0aWFsbHkgbG9hZHMuXG4gICAqL1xuXHRzdGF0aWMgc3RhdGljSW1hZ2VGb3JNYXBJbmRleChyZXN0YXVyYW50cykge1xuXHRcdGxldCBsb2MgPSB7XG5cdFx0XHRsYXQ6IDQwLjcyMjIxNixcblx0XHRcdGxuZzogLTczLjk4NzUwMVxuXHRcdH07XG5cdFx0Y29uc3QgbWFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdGNvbnN0IG1hcFdpZHRoID0gbWFwLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IG1hcEhlaWdodCA9IG1hcC5jbGllbnRIZWlnaHQ7XG5cdFx0bGV0IHN0YXRpY01hcCA9IGBodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/Y2VudGVyPSR7XG5cdFx0XHRsb2MubGF0fSwke2xvYy5sbmd9Jnpvb209MTImc2l6ZT0ke21hcFdpZHRofXgke21hcEhlaWdodH0mbWFya2Vycz1jb2xvcjpyZWRgO1xuXHRcdHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XG5cdFx0XHRzdGF0aWNNYXAgKz0gYHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9YDtcblx0XHR9KTtcblx0XHRzdGF0aWNNYXAgKz0gYCZrZXk9QUl6YVN5QnlPRWxHNkVhaTBDRVoyN2RZTDVWdzZOekpPdDlGWkFjYDtcblx0XHRyZXR1cm4gc3RhdGljTWFwO1xuXHR9XG5cblx0LyoqXG4gICAqIFN0YXRpYyBtYXAgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIHdoZW4gcmVzdGF1cmFudC5odG1sIGluaXRpYWxseSBsb2Fkcy5cbiAgICovXG5cdHN0YXRpYyBzdGF0aWNJbWFnZUZvck1hcFJlc3RhdXJhbnRJbmZvKHJlc3RhdXJhbnQpIHtcblx0XHRjb25zdCBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5cdFx0Y29uc3QgbWFwV2lkdGggPSBtYXAuY2xpZW50V2lkdGg7XG5cdFx0Y29uc3QgbWFwSGVpZ2h0ID0gbWFwLmNsaWVudEhlaWdodDtcblx0XHRsZXQgc3RhdGljTWFwID0gYGh0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0YXRpY21hcD9jZW50ZXI9JHtyZXN0YXVyYW50LmxhdGxuZy5sYXR9LCR7cmVzdGF1cmFudC5sYXRsbmcubG5nfSZ6b29tPTE2JnNpemU9JHttYXBXaWR0aH14JHttYXBIZWlnaHR9Jm1hcmtlcnM9Y29sb3I6cmVkfCR7cmVzdGF1cmFudC5sYXRsbmcubGF0fSwke3Jlc3RhdXJhbnQubGF0bG5nLmxuZ30ma2V5PUFJemFTeUJ5T0VsRzZFYWkwQ0VaMjdkWUw1Vnc2TnpKT3Q5RlpBY2A7XG5cdFx0cmV0dXJuIHN0YXRpY01hcDtcblx0fVxuXG5cdC8qKlxuICAgKiBVcGRhdGVzIGZhdm9yaXRlIHN0YXR1cyBvZiBhIHJlc3RhdXJhbnQgd2hlbiBmYXZvcml0ZSBpY29uIGlzIGNsaWNrZWQuXG4gICAqL1xuXHRzdGF0aWMgdXBkYXRlRmF2b3JpdGUocmVzdGF1cmFudElkLCBpc0Zhdm9yaXRlKXtcblx0XHRjb25zdCBmZXRjaFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH0vJHtyZXN0YXVyYW50SWR9P2lzX2Zhdm9yaXRlPSR7aXNGYXZvcml0ZX1gO1xuXHRcdGZldGNoKGZldGNoVVJMLCB7bWV0aG9kOiAnUFVUJ30pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdHJlc3RhdXJhbnRzU3RvcmUuZ2V0KHJlc3RhdXJhbnRJZCkudGhlbihyZXN0YXVyYW50ID0+IHtcblx0XHRcdFx0XHRcdHJlc3RhdXJhbnQuaXNfZmF2b3JpdGUgPSBpc0Zhdm9yaXRlO1xuXHRcdFx0XHRcdFx0cmVzdGF1cmFudHNTdG9yZS5wdXQocmVzdGF1cmFudCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXQocmVzdGF1cmFudElkKTtcblx0XHRcdFx0XHR9KS50aGVuKHVwZGF0ZWRSZXN0YXVyYW50ID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgdXBkYXRlZCBmYXZvcml0ZSBzdGF0dXMgb2YgJHt1cGRhdGVkUmVzdGF1cmFudC5uYW1lfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gdXBkYXRlIGZhdm9yaXRlIHN0YXR1czogJHtlcnJvcn1gKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL1dJUFxuXHRcdFx0XHRjb25zb2xlLmxvZygnRG8gb2ZmbGluZSBzdHVmZiBoZXJlJyk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coYEZldGNoIHJlcXVlc3QgZm9yIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBJZiBvbmxpbmUsIHBvc3RzIHJldmlldyB0byBzZXJ2ZXIgJiBJbmRleGVkREIuIElmIG9mZmxpbmUsIGNyZWF0ZXMgYW4gb2ZmbGluZSByZXZpZXcgb2JqZWN0IHRvIGJlIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlIHZpYSBzdG9yZU9mZmxpbmVSZXZpZXcuXG4gICAqL1xuXHRzdGF0aWMgYWRkUmV2aWV3KHJldmlldywgcmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpe1xuXHRcdGlmICghbmF2aWdhdG9yLm9uTGluZSkge1xuXHRcdFx0Y29uc3Qgb2ZmbGluZVJldmlldyA9IHtcblx0XHRcdFx0aWQ6IHJldmlldy5pZCxcblx0XHRcdFx0cmVzdGF1cmFudElkOiByZXN0YXVyYW50SWQsXG5cdFx0XHRcdGRhdGE6IHJldmlldyxcblx0XHRcdFx0Y2FsbGJhY2s6IGZpbGxSZXZpZXdzSFRNTFxuXHRcdFx0fTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke29mZmxpbmVSZXZpZXcuaWR9YCwgSlNPTi5zdHJpbmdpZnkob2ZmbGluZVJldmlldy5kYXRhKSk7XG5cdFx0XHREQkhlbHBlci5zdG9yZWRPZmZsaW5lUmV2aWV3cygpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBmZXRjaFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFVklFV1NfVVJMfWA7XG5cdFx0Y29uc3QgZmV0Y2hPcHRpb25zID0ge1xuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShyZXZpZXcpLFxuXHRcdFx0aGVhZGVyczogbmV3IEhlYWRlcnMoe1xuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHR9KVxuXHRcdH07XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIGZldGNoT3B0aW9ucykudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTdWNjZXNzZnVsbHkgcG9zdGVkIHJldmlldyB0byBzZXJ2ZXInKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBCYWQgcmVzcG9uc2UgcmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRyZXR1cm4gREJIZWxwZXIuZmV0Y2hSZXZpZXdzQnlJZChyZXN0YXVyYW50SWQsIGZpbGxSZXZpZXdzSFRNTCk7XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coYEZldGNoIHJlcXVlc3QgZmFpbGVkOiAke2Vycm9yfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIElmIG9ubGluZSwgZGVsZXRlcyByZXZpZXcgZnJvbSBzZXJ2ZXIgJiBJbmRleGVkREIuIElmIG9mZmxpbmUsIHJlbW92ZXMgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgKi9cblx0c3RhdGljIHJlbW92ZVJldmlldyhyZXZpZXdJZCwgcmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpe1xuXHRcdGlmKCFuYXZpZ2F0b3Iub25MaW5lKXtcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdyZXZpZXdEYXRhJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGZldGNoVVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVWSUVXU19VUkx9LyR7cmV2aWV3SWR9YDtcblx0XHRjb25zb2xlLmxvZygncmV2aWV3SWQnLCByZXZpZXdJZCk7XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIHttZXRob2Q6ICdERUxFVEUnfSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXZpZXdzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXZpZXdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXZpZXdzJyk7XG5cdFx0XHRcdFx0XHRyZXZpZXdzU3RvcmUuZGVsZXRlKHJldmlld0lkKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdTdWNjZXNzZnVsbHkgZGVsZXRlZCByZXZpZXcgZnJvbSBzZXJ2ZXIgYW5kIEluZGV4ZWREQicpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsgXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQmFkIHJlc3BvbnNlIHJlY2VpdmVkIGZyb20gc2VydmVyOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0cmV0dXJuIERCSGVscGVyLmZldGNoUmV2aWV3c0J5SWQocmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpO1xuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaCByZXF1ZXN0IGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxuXG5cdHN0YXRpYyBzdG9yZWRPZmZsaW5lUmV2aWV3cygpe1xuXHRcdC8vV0lQXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsICgpID0+IHtcblx0XHRcdGlmIChsb2NhbFN0b3JhZ2UubGVuZ3RoID4gMCl7XG5cdFx0XHRcdGNvbnN0IG9mZmxpbmVMYWJlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vZmZsaW5lLWxhYmVsJykpO1xuXHRcdFx0XHRvZmZsaW5lTGFiZWxzLmZvckVhY2gob2ZmbGluZUxhYmVsID0+IHtcblx0XHRcdFx0XHRvZmZsaW5lTGFiZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvZmZsaW5lTGFiZWwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGNvbnN0IG9mZmxpbmVSZXZpZXcgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpZCcpW2ldKTtcblx0XHRcdFx0XHREQkhlbHBlci5hZGRSZXZpZXcob2ZmbGluZVJldmlldy5kYXRhLCBvZmZsaW5lUmV2aWV3LnJlc3RhdXJhbnRJZCwgb2ZmbGluZVJldmlldy5jYWxsYmFjayk7XG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYCR7b2ZmbGluZVJldmlldy5pZH1gKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IHJldHJpZXZlZCBvZmZsaW5lIHJldmlldyBkYXRhICYgcmVtb3ZlZCBmcm9tIGxvY2FsIHN0b3JhZ2UnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0ZhaWxlZCB0byBmaW5kIG9mZmxpbmUgcmV2aWV3IGRhdGEgaW4gbG9jYWwgc3RvcmFnZScpO1xuXHRcdFx0fVx0XG5cdFx0fSk7XG5cdH1cdFxufVxuIl19
