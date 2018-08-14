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
		value: function updateFavorite(favoriteId, restaurantId, isFavorite) {
			if (!navigator.onLine) {
				var offlineFavorite = {
					offlineId: 'offlineFavorite-' + favoriteId,
					restaurantId: restaurantId,
					status: isFavorite
				};
				localStorage.setItem(offlineFavorite.offlineId, JSON.stringify(offlineFavorite));
				DBHelper.updateOfflineFavorites();
				return;
			}
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
					console.log('Bad response received from server: ' + response.status);
					return;
				}
			}).catch(function (error) {
				console.log('Fetch request for restaurants from server failed: ' + error);
				return;
			});
		}
	}, {
		key: 'updateOfflineFavorites',
		value: function updateOfflineFavorites() {
			window.addEventListener('online', function () {
				if (localStorage.length > 0) {
					for (var i = 0; i < localStorage.length; i++) {
						if (localStorage.key(i).includes('offlineFavorite')) {
							var offlineFavorite = JSON.parse(localStorage.getItem(localStorage.key(i)));
							DBHelper.updateFavorite(null, offlineFavorite.restaurantId, offlineFavorite.status);
							localStorage.removeItem(offlineFavorite.offlineId);
							console.log('Successfully updated restaurant favorite satus from local storage');
						} else {
							return;
						}
					}
					var offlineFavoriteLabel = document.querySelector('.offline-favorite-label');
					offlineFavoriteLabel.parentNode.removeChild(offlineFavoriteLabel);
				} else {
					console.log('Failed to find offline favorite status data in local storage');
				}
			});
		}

		/**
    * If online, posts review to server & IndexedDB. If offline, creates an offline review object to be stored in local storage and retrieved when there is a network connection via addOfflineReviews.
    */

	}, {
		key: 'addReview',
		value: function addReview(review, restaurantId, fillReviewsHTML) {
			if (!navigator.onLine) {
				var offlineReview = {
					offlineId: 'offlineReview-' + review.offline_id,
					restaurantId: review.restaurant_id,
					data: review
				};
				localStorage.setItem(offlineReview.offlineId, JSON.stringify(offlineReview));
				var callback = fillReviewsHTML;
				DBHelper.addOfflineReviews(callback);
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
    * Listens for network connection and if it occurs and local storage contains offline reviews, retrieve each review and add it to the server and IndexedDB via addReview. Then delete each stored offline review in local storage and remove offline labels from these reviews in UI to indicate to user they have been submitted.
    */

	}, {
		key: 'addOfflineReviews',
		value: function addOfflineReviews(callback) {
			window.addEventListener('online', function () {
				if (localStorage.length > 0) {
					for (var i = 0; i < localStorage.length; i++) {
						if (localStorage.key(i).includes('offlineReview')) {
							var offlineReview = JSON.parse(localStorage.getItem(localStorage.key(i)));
							DBHelper.addReview(offlineReview.data, offlineReview.restaurantId, callback);
							localStorage.removeItem(offlineReview.offlineId);
							console.log('Successfully retrieved offline review data & removed from local storage');
						} else {
							return;
						}
					}
					var offlineReviewLabels = Array.from(document.querySelectorAll('.offline-review-label'));
					offlineReviewLabels.forEach(function (offlineReviewLabel) {
						offlineReviewLabel.parentNode.removeChild(offlineReviewLabel);
					});
				} else {
					console.log('Failed to find offline review data in local storage');
				}
			});
		}

		/**
    * If online, deletes review from server & IndexedDB. If offline, removes from local storage.
    */

	}, {
		key: 'removeReview',
		value: function removeReview(reviewId, offlineId, restaurantId, fillReviewsHTML) {
			if (!navigator.onLine) {
				localStorage.removeItem('offlineReview-' + offlineId);
				return;
			}
			var fetchURL = DBHelper.DATABASE_REVIEWS_URL + '/' + reviewId;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmV2aWV3c1N0b3JlIiwiY3JlYXRlSW5kZXgiLCJEQkhlbHBlciIsImNhbGxiYWNrIiwiaWQiLCJyZXN0YXVyYW50VVJMIiwiREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJyZXN0YXVyYW50c1N0b3JlIiwib2JqZWN0U3RvcmUiLCJpIiwicmVzdGF1cmFudHMiLCJsZW5ndGgiLCJwdXQiLCJjb21wbGV0ZSIsImdldEFsbCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaGVkUmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsInBhcnNlSW50IiwicmV2aWV3VVJMIiwiREFUQUJBU0VfUkVWSUVXU19VUkwiLCJtZXRob2QiLCJyZXZpZXdzIiwiaW5kZXhSZXN0YXVyYW50SWQiLCJpbmRleCIsImZldGNoZWRSZXZpZXdzIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJsb2MiLCJsYXQiLCJsbmciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFwV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1hcEhlaWdodCIsImNsaWVudEhlaWdodCIsInN0YXRpY01hcCIsImZvckVhY2giLCJmYXZvcml0ZUlkIiwicmVzdGF1cmFudElkIiwiaXNGYXZvcml0ZSIsIm5hdmlnYXRvciIsIm9uTGluZSIsIm9mZmxpbmVGYXZvcml0ZSIsIm9mZmxpbmVJZCIsInN0YXR1cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwidXBkYXRlT2ZmbGluZUZhdm9yaXRlcyIsImZldGNoVVJMIiwiZ2V0IiwiaXNfZmF2b3JpdGUiLCJ1cGRhdGVkUmVzdGF1cmFudCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJrZXkiLCJpbmNsdWRlcyIsInBhcnNlIiwiZ2V0SXRlbSIsInVwZGF0ZUZhdm9yaXRlIiwicmVtb3ZlSXRlbSIsIm9mZmxpbmVGYXZvcml0ZUxhYmVsIiwicXVlcnlTZWxlY3RvciIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInJldmlldyIsImZpbGxSZXZpZXdzSFRNTCIsIm9mZmxpbmVSZXZpZXciLCJvZmZsaW5lX2lkIiwicmVzdGF1cmFudF9pZCIsImRhdGEiLCJhZGRPZmZsaW5lUmV2aWV3cyIsImZldGNoT3B0aW9ucyIsImJvZHkiLCJoZWFkZXJzIiwiSGVhZGVycyIsImZldGNoUmV2aWV3c0J5SWQiLCJhZGRSZXZpZXciLCJvZmZsaW5lUmV2aWV3TGFiZWxzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm9mZmxpbmVSZXZpZXdMYWJlbCIsInJldmlld0lkIiwiZGVsZXRlIiwicG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsWUFBWUMsSUFBSUMsSUFBSixDQUFTLHVCQUFULEVBQWtDLENBQWxDLEVBQXFDLHFCQUFhO0FBQ25FLFNBQVFDLFVBQVVDLFVBQWxCO0FBQ0EsT0FBSyxDQUFMO0FBQ0NELGFBQVVFLGlC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bigncmVzdGF1cmFudC1yZXZpZXdzLWRiJywgMiwgdXBncmFkZURCID0+IHtcblx0c3dpdGNoICh1cGdyYWRlREIub2xkVmVyc2lvbil7XG5cdGNhc2UgMDpcblx0XHR1cGdyYWRlREIuY3JlYXRlT2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJywge2tleVBhdGg6ICdpZCd9KTtcblx0Y2FzZSAxOlxuXHRcdGNvbnN0IHJldmlld3NTdG9yZSA9IHVwZ3JhZGVEQi5jcmVhdGVPYmplY3RTdG9yZSgncmV2aWV3cycsIHtrZXlQYXRoOiAnaWQnfSk7XG5cdFx0cmV2aWV3c1N0b3JlLmNyZWF0ZUluZGV4KCdyZXN0YXVyYW50X2lkJywgJ3Jlc3RhdXJhbnRfaWQnKTtcblx0fVxufSk7XG5cbi8qKlxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXG4gKi9cbmNsYXNzIERCSGVscGVyIHtcblx0XG5cdC8qKlxuICAgKiBEYXRhYmFzZSBVUkwuXG4gICAqIENoYW5nZWQgdG8gcmV0cmlldmUgcmVzdGF1cmFudHMgJiByZXZpZXdzIGZyb20gc2VydmVyIG9uIGxvY2FsaG9zdDoxMzM3LlxuICAgKi9cblx0c3RhdGljIGdldCBEQVRBQkFTRV9SRVNUQVVSQU5UU19VUkwoKSB7XG5cdFx0Y29uc3QgcG9ydCA9IDEzMzc7IC8vIENoYW5nZSB0aGlzIHRvIHlvdXIgc2VydmVyIHBvcnRcblx0XHRyZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9yZXN0YXVyYW50c2A7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IERBVEFCQVNFX1JFVklFV1NfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmV2aWV3c2A7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2hlcyBhbGwgcmVzdGF1cmFudCByZXZpZXdzIGRhdGEuIENyZWF0ZXMgYW4gSW5kZXhlZERCIGRhdGFiYXNlIG5hbWVkICdyZXN0YXVyYW50LXJldmlld3MtZGInIHdpdGggYW4gb2JqZWN0IHN0b3JlIG9mICdyZXN0YXVyYW50LXJldmlld3MnLiBJZiByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgaXMgb2ssIHN0b3JlcyBkYXRhIHJlY2VpdmVkIGludG8gdGhlIGRhdGFiYXNlIGFuZCB0aGVuIHJldHVybnMgdGhlIGRhdGEuIElmIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBmYWlscywgbG9vayBpbiB0aGUgZGF0YWJhc2UgdG8gc2VlIGlmIHRoZXJlIGlzIGRhdGEgYWxyZWFkeSBzdG9yZWQgdGhlcmUgYW5kIHJldHVybiB0aGUgZGF0YS4gQ2F0Y2hlcyBhbmQgaGFuZGxlcyBlcnJvcnMgYXBwcm9wcmlhdGVseSB3aGVuIGRhdGEgY2Fubm90IGJlIHJldHJpZXZlZC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRzKGNhbGxiYWNrLCBpZCkge1xuXHRcdGxldCByZXN0YXVyYW50VVJMO1xuXHRcdGlkID8gcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH0vJHtpZH1gIDogcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH1gO1xuXG5cdFx0ZmV0Y2gocmVzdGF1cmFudFVSTCkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0XHRsZXQgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdHJlc3RhdXJhbnRzU3RvcmUucHV0KHJlc3RhdXJhbnRzW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50c1N0b3JlLmdldEFsbCgpO1xuXHRcdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZXN0YXVyYW50cyBmcm9tIHNlcnZlciAmIHN0b3JlZCBpbiBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJlc3RhdXJhbnRzKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXN0YXVyYW50cyBmcm9tIHNlcnZlciAmIHN0b3JlIGluIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnRzJywgJ3JlYWRvbmx5Jyk7XG5cdFx0XHRcdFx0bGV0IHJlc3RhdXJhbnRzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKTtcblx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXRBbGwoKTtcblx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmVzdGF1cmFudHMgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCBkYXRhIGZyb20gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmVzdGF1cmFudHMpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmVzdGF1cmFudHMgZnJvbSBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHJldHVybiBjYWxsYmFjayhgRmV0Y2ggcmVxdWVzdCBmb3IgcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgZmFpbGVkOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGEgcmVzdGF1cmFudCBieSBpdHMgSUQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgY2FsbGJhY2spIHtcblx0XHQvLyBmZXRjaCBhbGwgcmVzdGF1cmFudHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcmVzdGF1cmFudCA9IHJlc3RhdXJhbnRzLmZpbmQociA9PiByLmlkID09PSBwYXJzZUludChpZCkpO1xuXHRcdFx0XHRpZiAocmVzdGF1cmFudCkgeyAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcblx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcblx0XHRcdFx0fSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2Vcblx0XHRcdFx0XHRjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXZpZXcgYnkgaXRzIElELlxuICAgKi9cblx0c3RhdGljIGZldGNoUmV2aWV3c0J5SWQoaWQsIGNhbGxiYWNrKXtcblx0XHRjb25zdCByZXZpZXdVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVZJRVdTX1VSTH0vP3Jlc3RhdXJhbnRfaWQ9JHtpZH1gO1xuXHRcdGZldGNoKHJldmlld1VSTCwge21ldGhvZDogJ0dFVCd9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJldmlld3MgPT4ge1xuXHRcdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jldmlld3MnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0XHRsZXQgcmV2aWV3c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jldmlld3MnKTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmV2aWV3cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdHJldmlld3NTdG9yZS5wdXQocmV2aWV3c1tpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb25zdCBpbmRleFJlc3RhdXJhbnRJZCA9IHJldmlld3NTdG9yZS5pbmRleCgncmVzdGF1cmFudF9pZCcpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIGluZGV4UmVzdGF1cmFudElkLmdldEFsbChwYXJzZUludChpZCkpO1xuXHRcdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIHJldmlld3MgZnJvbSBzZXJ2ZXIgJiBzdG9yZWQgaW4gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXZpZXdzKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXZpZXdzIGZyb20gc2VydmVyICYgc3RvcmUgaW4gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmV2aWV3cycsICdyZWFkb25seScpO1xuXHRcdFx0XHRcdGxldCByZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmV2aWV3cycpO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4UmVzdGF1cmFudElkID0gcmV2aWV3c1N0b3JlLmluZGV4KCdyZXNhdGF1cmFudF9pZCcpO1xuXHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiBpbmRleFJlc3RhdXJhbnRJZC5nZXRBbGwoaWQpO1xuXHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXZpZXdzID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcmV2aWV3cyBmcm9tIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJldmlld3MpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmV2aWV3cyBmcm9tIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGZXRjaCByZXF1ZXN0IGZvciByZXZpZXdzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gLCBudWxsKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSBhbmQgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzO1xuXHRcdFx0XHRpZiAoY3Vpc2luZSAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuZWlnaGJvcmhvb2QgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hOZWlnaGJvcmhvb2RzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gbmVpZ2hib3Job29kc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlTmVpZ2hib3Job29kcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoQ3Vpc2luZXMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIGN1aXNpbmVzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVDdWlzaW5lcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyB1cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAuL3Jlc3RhdXJhbnQuaHRtbD9pZD0ke3Jlc3RhdXJhbnQuaWR9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBzbWFsbCBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgc21hbGxJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfc21hbGx9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBsYXJnZSBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgbGFyZ2VJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfbGFyZ2V9YCk7XG5cdH1cblxuXHQvKipcbiAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxuICAgKi9cblx0c3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XG5cdFx0Y29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXG5cdFx0XHR0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuXHRcdFx0dXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxuXHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QfVxuXHRcdCk7XG5cdFx0cmV0dXJuIG1hcmtlcjtcblx0fVxuXG5cdC8qKlxuICAgKiBTdGF0aWMgbWFwIGltYWdlIHRvIGJlIGRpc3BsYXllZCB3aGVuIGluZGV4Lmh0bWwgaW5pdGlhbGx5IGxvYWRzLlxuICAgKi9cblx0c3RhdGljIHN0YXRpY0ltYWdlRm9yTWFwSW5kZXgocmVzdGF1cmFudHMpIHtcblx0XHRsZXQgbG9jID0ge1xuXHRcdFx0bGF0OiA0MC43MjIyMTYsXG5cdFx0XHRsbmc6IC03My45ODc1MDFcblx0XHR9O1xuXHRcdGNvbnN0IG1hcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcblx0XHRjb25zdCBtYXBXaWR0aCA9IG1hcC5jbGllbnRXaWR0aDtcblx0XHRjb25zdCBtYXBIZWlnaHQgPSBtYXAuY2xpZW50SGVpZ2h0O1xuXHRcdGxldCBzdGF0aWNNYXAgPSBgaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RhdGljbWFwP2NlbnRlcj0ke1xuXHRcdFx0bG9jLmxhdH0sJHtsb2MubG5nfSZ6b29tPTEyJnNpemU9JHttYXBXaWR0aH14JHttYXBIZWlnaHR9Jm1hcmtlcnM9Y29sb3I6cmVkYDtcblx0XHRyZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xuXHRcdFx0c3RhdGljTWFwICs9IGB8JHtyZXN0YXVyYW50LmxhdGxuZy5sYXR9LCR7cmVzdGF1cmFudC5sYXRsbmcubG5nfWA7XG5cdFx0fSk7XG5cdFx0c3RhdGljTWFwICs9IGAma2V5PUFJemFTeUJ5T0VsRzZFYWkwQ0VaMjdkWUw1Vnc2TnpKT3Q5RlpBY2A7XG5cdFx0cmV0dXJuIHN0YXRpY01hcDtcblx0fVxuXG5cdC8qKlxuICAgKiBTdGF0aWMgbWFwIGltYWdlIHRvIGJlIGRpc3BsYXllZCB3aGVuIHJlc3RhdXJhbnQuaHRtbCBpbml0aWFsbHkgbG9hZHMuXG4gICAqL1xuXHRzdGF0aWMgc3RhdGljSW1hZ2VGb3JNYXBSZXN0YXVyYW50SW5mbyhyZXN0YXVyYW50KSB7XG5cdFx0Y29uc3QgbWFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdGNvbnN0IG1hcFdpZHRoID0gbWFwLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IG1hcEhlaWdodCA9IG1hcC5jbGllbnRIZWlnaHQ7XG5cdFx0bGV0IHN0YXRpY01hcCA9IGBodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/Y2VudGVyPSR7cmVzdGF1cmFudC5sYXRsbmcubGF0fSwke3Jlc3RhdXJhbnQubGF0bG5nLmxuZ30mem9vbT0xNiZzaXplPSR7bWFwV2lkdGh9eCR7bWFwSGVpZ2h0fSZtYXJrZXJzPWNvbG9yOnJlZHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9JmtleT1BSXphU3lCeU9FbEc2RWFpMENFWjI3ZFlMNVZ3Nk56Sk90OUZaQWNgO1xuXHRcdHJldHVybiBzdGF0aWNNYXA7XG5cdH1cblxuXHQvKipcbiAgICogVXBkYXRlcyBmYXZvcml0ZSBzdGF0dXMgb2YgYSByZXN0YXVyYW50IHdoZW4gZmF2b3JpdGUgaWNvbiBpcyBjbGlja2VkLlxuICAgKi9cblx0c3RhdGljIHVwZGF0ZUZhdm9yaXRlKGZhdm9yaXRlSWQsIHJlc3RhdXJhbnRJZCwgaXNGYXZvcml0ZSl7XG5cdFx0aWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XG5cdFx0XHRjb25zdCBvZmZsaW5lRmF2b3JpdGUgPSB7XG5cdFx0XHRcdG9mZmxpbmVJZDogYG9mZmxpbmVGYXZvcml0ZS0ke2Zhdm9yaXRlSWR9YCxcblx0XHRcdFx0cmVzdGF1cmFudElkOiByZXN0YXVyYW50SWQsXG5cdFx0XHRcdHN0YXR1czogaXNGYXZvcml0ZVxuXHRcdFx0fTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKG9mZmxpbmVGYXZvcml0ZS5vZmZsaW5lSWQsIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVGYXZvcml0ZSkpO1xuXHRcdFx0REJIZWxwZXIudXBkYXRlT2ZmbGluZUZhdm9yaXRlcygpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBmZXRjaFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH0vJHtyZXN0YXVyYW50SWR9P2lzX2Zhdm9yaXRlPSR7aXNGYXZvcml0ZX1gO1xuXHRcdGZldGNoKGZldGNoVVJMLCB7bWV0aG9kOiAnUFVUJ30pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdHJlc3RhdXJhbnRzU3RvcmUuZ2V0KHJlc3RhdXJhbnRJZCkudGhlbihyZXN0YXVyYW50ID0+IHtcblx0XHRcdFx0XHRcdHJlc3RhdXJhbnQuaXNfZmF2b3JpdGUgPSBpc0Zhdm9yaXRlO1xuXHRcdFx0XHRcdFx0cmVzdGF1cmFudHNTdG9yZS5wdXQocmVzdGF1cmFudCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXQocmVzdGF1cmFudElkKTtcblx0XHRcdFx0XHR9KS50aGVuKHVwZGF0ZWRSZXN0YXVyYW50ID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgdXBkYXRlZCBmYXZvcml0ZSBzdGF0dXMgb2YgJHt1cGRhdGVkUmVzdGF1cmFudC5uYW1lfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gdXBkYXRlIGZhdm9yaXRlIHN0YXR1czogJHtlcnJvcn1gKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQmFkIHJlc3BvbnNlIHJlY2VpdmVkIGZyb20gc2VydmVyOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaCByZXF1ZXN0IGZvciByZXN0YXVyYW50cyBmcm9tIHNlcnZlciBmYWlsZWQ6ICR7ZXJyb3J9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSk7XG5cdH1cblxuXHRzdGF0aWMgdXBkYXRlT2ZmbGluZUZhdm9yaXRlcygpe1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCAoKSA9PiB7XG5cdFx0XHRpZiAobG9jYWxTdG9yYWdlLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0aWYobG9jYWxTdG9yYWdlLmtleShpKS5pbmNsdWRlcygnb2ZmbGluZUZhdm9yaXRlJykpe1xuXHRcdFx0XHRcdFx0Y29uc3Qgb2ZmbGluZUZhdm9yaXRlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSk7XG5cdFx0XHRcdFx0XHREQkhlbHBlci51cGRhdGVGYXZvcml0ZShudWxsLCBvZmZsaW5lRmF2b3JpdGUucmVzdGF1cmFudElkLCBvZmZsaW5lRmF2b3JpdGUuc3RhdHVzKTtcblx0XHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG9mZmxpbmVGYXZvcml0ZS5vZmZsaW5lSWQpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSB1cGRhdGVkIHJlc3RhdXJhbnQgZmF2b3JpdGUgc2F0dXMgZnJvbSBsb2NhbCBzdG9yYWdlJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgb2ZmbGluZUZhdm9yaXRlTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub2ZmbGluZS1mYXZvcml0ZS1sYWJlbCcpO1xuXHRcdFx0XHRvZmZsaW5lRmF2b3JpdGVMYWJlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9mZmxpbmVGYXZvcml0ZUxhYmVsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZmluZCBvZmZsaW5lIGZhdm9yaXRlIHN0YXR1cyBkYXRhIGluIGxvY2FsIHN0b3JhZ2UnKTtcblx0XHRcdH1cdFxuXHRcdH0pO1xuXHR9XHRcblxuXHQvKipcbiAgICogSWYgb25saW5lLCBwb3N0cyByZXZpZXcgdG8gc2VydmVyICYgSW5kZXhlZERCLiBJZiBvZmZsaW5lLCBjcmVhdGVzIGFuIG9mZmxpbmUgcmV2aWV3IG9iamVjdCB0byBiZSBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZSBhbmQgcmV0cmlldmVkIHdoZW4gdGhlcmUgaXMgYSBuZXR3b3JrIGNvbm5lY3Rpb24gdmlhIGFkZE9mZmxpbmVSZXZpZXdzLlxuICAgKi9cblx0c3RhdGljIGFkZFJldmlldyhyZXZpZXcsIHJlc3RhdXJhbnRJZCwgZmlsbFJldmlld3NIVE1MKXtcblx0XHRpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcblx0XHRcdGNvbnN0IG9mZmxpbmVSZXZpZXcgPSB7XG5cdFx0XHRcdG9mZmxpbmVJZDogYG9mZmxpbmVSZXZpZXctJHtyZXZpZXcub2ZmbGluZV9pZH1gLFxuXHRcdFx0XHRyZXN0YXVyYW50SWQ6IHJldmlldy5yZXN0YXVyYW50X2lkLFxuXHRcdFx0XHRkYXRhOiByZXZpZXdcblx0XHRcdH07XG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShvZmZsaW5lUmV2aWV3Lm9mZmxpbmVJZCwgSlNPTi5zdHJpbmdpZnkob2ZmbGluZVJldmlldykpO1xuXHRcdFx0Y29uc3QgY2FsbGJhY2sgPSBmaWxsUmV2aWV3c0hUTUw7XG5cdFx0XHREQkhlbHBlci5hZGRPZmZsaW5lUmV2aWV3cyhjYWxsYmFjayk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGZldGNoVVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVWSUVXU19VUkx9YDtcblx0XHRjb25zdCBmZXRjaE9wdGlvbnMgPSB7XG5cdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHJldmlldyksXG5cdFx0XHRoZWFkZXJzOiBuZXcgSGVhZGVycyh7XG5cdFx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdH0pXG5cdFx0fTtcblx0XHRmZXRjaChmZXRjaFVSTCwgZmV0Y2hPcHRpb25zKS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSBwb3N0ZWQgcmV2aWV3IHRvIHNlcnZlcicpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coYEJhZCByZXNwb25zZSByZWNlaXZlZCBmcm9tIHNlcnZlcjogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdHJldHVybiBEQkhlbHBlci5mZXRjaFJldmlld3NCeUlkKHJlc3RhdXJhbnRJZCwgZmlsbFJldmlld3NIVE1MKTtcblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhgRmV0Y2ggcmVxdWVzdCBmYWlsZWQ6ICR7ZXJyb3J9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogTGlzdGVucyBmb3IgbmV0d29yayBjb25uZWN0aW9uIGFuZCBpZiBpdCBvY2N1cnMgYW5kIGxvY2FsIHN0b3JhZ2UgY29udGFpbnMgb2ZmbGluZSByZXZpZXdzLCByZXRyaWV2ZSBlYWNoIHJldmlldyBhbmQgYWRkIGl0IHRvIHRoZSBzZXJ2ZXIgYW5kIEluZGV4ZWREQiB2aWEgYWRkUmV2aWV3LiBUaGVuIGRlbGV0ZSBlYWNoIHN0b3JlZCBvZmZsaW5lIHJldmlldyBpbiBsb2NhbCBzdG9yYWdlIGFuZCByZW1vdmUgb2ZmbGluZSBsYWJlbHMgZnJvbSB0aGVzZSByZXZpZXdzIGluIFVJIHRvIGluZGljYXRlIHRvIHVzZXIgdGhleSBoYXZlIGJlZW4gc3VibWl0dGVkLlxuICAgKi9cblx0c3RhdGljIGFkZE9mZmxpbmVSZXZpZXdzKGNhbGxiYWNrKXtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKCkgPT4ge1xuXHRcdFx0aWYgKGxvY2FsU3RvcmFnZS5sZW5ndGggPiAwKXtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGlmKGxvY2FsU3RvcmFnZS5rZXkoaSkuaW5jbHVkZXMoJ29mZmxpbmVSZXZpZXcnKSl7XG5cdFx0XHRcdFx0XHRjb25zdCBvZmZsaW5lUmV2aWV3ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSk7XG5cdFx0XHRcdFx0XHREQkhlbHBlci5hZGRSZXZpZXcob2ZmbGluZVJldmlldy5kYXRhLCBvZmZsaW5lUmV2aWV3LnJlc3RhdXJhbnRJZCwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0ob2ZmbGluZVJldmlldy5vZmZsaW5lSWQpO1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSByZXRyaWV2ZWQgb2ZmbGluZSByZXZpZXcgZGF0YSAmIHJlbW92ZWQgZnJvbSBsb2NhbCBzdG9yYWdlJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgb2ZmbGluZVJldmlld0xhYmVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9mZmxpbmUtcmV2aWV3LWxhYmVsJykpO1xuXHRcdFx0XHRvZmZsaW5lUmV2aWV3TGFiZWxzLmZvckVhY2gob2ZmbGluZVJldmlld0xhYmVsID0+IHtcblx0XHRcdFx0XHRvZmZsaW5lUmV2aWV3TGFiZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvZmZsaW5lUmV2aWV3TGFiZWwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gZmluZCBvZmZsaW5lIHJldmlldyBkYXRhIGluIGxvY2FsIHN0b3JhZ2UnKTtcblx0XHRcdH1cdFxuXHRcdH0pO1xuXHR9XHRcblxuXHQvKipcbiAgICogSWYgb25saW5lLCBkZWxldGVzIHJldmlldyBmcm9tIHNlcnZlciAmIEluZGV4ZWREQi4gSWYgb2ZmbGluZSwgcmVtb3ZlcyBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gICAqL1xuXHRzdGF0aWMgcmVtb3ZlUmV2aWV3KHJldmlld0lkLCBvZmZsaW5lSWQsIHJlc3RhdXJhbnRJZCwgZmlsbFJldmlld3NIVE1MKXtcblx0XHRpZighbmF2aWdhdG9yLm9uTGluZSl7XG5cdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgb2ZmbGluZVJldmlldy0ke29mZmxpbmVJZH1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZmV0Y2hVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVZJRVdTX1VSTH0vJHtyZXZpZXdJZH1gO1xuXHRcdGZldGNoKGZldGNoVVJMLCB7bWV0aG9kOiAnREVMRVRFJ30pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmV2aWV3cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRcdGxldCByZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmV2aWV3cycpO1xuXHRcdFx0XHRcdFx0cmV2aWV3c1N0b3JlLmRlbGV0ZShyZXZpZXdJZCk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQgcmV2aWV3IGZyb20gc2VydmVyIGFuZCBJbmRleGVkREInKTtcblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7IFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coYEJhZCByZXNwb25zZSByZWNlaXZlZCBmcm9tIHNlcnZlcjogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdHJldHVybiBEQkhlbHBlci5mZXRjaFJldmlld3NCeUlkKHJlc3RhdXJhbnRJZCwgZmlsbFJldmlld3NIVE1MKTtcblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhgRmV0Y2ggcmVxdWVzdCBmYWlsZWQ6ICR7ZXJyb3J9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==
