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
    * If online, posts review to server & IndexedDB. If offline, creates an offline review object to be stored in local storage and retrieved when there is a network connection via addOfflineReviews.
    */

	}, {
		key: 'addReview',
		value: function addReview(review, restaurantId, fillReviewsHTML) {
			if (!navigator.onLine) {
				var offlineReview = {
					offlineId: review.offline_id,
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
    * If online, deletes review from server & IndexedDB. If offline, removes from local storage.
    */

	}, {
		key: 'removeReview',
		value: function removeReview(reviewId, offlineId, restaurantId, fillReviewsHTML) {
			if (!navigator.onLine) {
				localStorage.removeItem(offlineId);
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

		/**
    * Listens for network connection and if it occurs and local storage contains offline reviews, retrieve each review and add it to the server and IndexedDB via addReview. Then delete each stored offline review in local storage and remove offline labels from these reviews in front end to indicate to user they have been submitted.
    */

	}, {
		key: 'addOfflineReviews',
		value: function addOfflineReviews(callback) {
			window.addEventListener('online', function () {
				if (localStorage.length > 0) {
					for (var i = 0; i < localStorage.length; i++) {
						var offlineReview = JSON.parse(localStorage.getItem(localStorage.key(i)));
						DBHelper.addReview(offlineReview.data, offlineReview.restaurantId, callback);
						localStorage.removeItem(offlineReview.offlineId);
						console.log('Successfully retrieved offline review data & removed from local storage');
					}
					var offlineLabels = Array.from(document.querySelectorAll('.offline-label'));
					offlineLabels.forEach(function (offlineLabel) {
						offlineLabel.parentNode.removeChild(offlineLabel);
					});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmV2aWV3c1N0b3JlIiwiY3JlYXRlSW5kZXgiLCJEQkhlbHBlciIsImNhbGxiYWNrIiwiaWQiLCJyZXN0YXVyYW50VVJMIiwiREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJyZXN0YXVyYW50c1N0b3JlIiwib2JqZWN0U3RvcmUiLCJpIiwicmVzdGF1cmFudHMiLCJsZW5ndGgiLCJwdXQiLCJjb21wbGV0ZSIsImdldEFsbCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaGVkUmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsInBhcnNlSW50IiwicmV2aWV3VVJMIiwiREFUQUJBU0VfUkVWSUVXU19VUkwiLCJtZXRob2QiLCJyZXZpZXdzIiwiaW5kZXhSZXN0YXVyYW50SWQiLCJpbmRleCIsImZldGNoZWRSZXZpZXdzIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJsb2MiLCJsYXQiLCJsbmciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFwV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1hcEhlaWdodCIsImNsaWVudEhlaWdodCIsInN0YXRpY01hcCIsImZvckVhY2giLCJyZXN0YXVyYW50SWQiLCJpc0Zhdm9yaXRlIiwiZmV0Y2hVUkwiLCJnZXQiLCJpc19mYXZvcml0ZSIsInVwZGF0ZWRSZXN0YXVyYW50IiwicmV2aWV3IiwiZmlsbFJldmlld3NIVE1MIiwibmF2aWdhdG9yIiwib25MaW5lIiwib2ZmbGluZVJldmlldyIsIm9mZmxpbmVJZCIsIm9mZmxpbmVfaWQiLCJyZXN0YXVyYW50X2lkIiwiZGF0YSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiYWRkT2ZmbGluZVJldmlld3MiLCJmZXRjaE9wdGlvbnMiLCJib2R5IiwiaGVhZGVycyIsIkhlYWRlcnMiLCJzdGF0dXMiLCJmZXRjaFJldmlld3NCeUlkIiwicmV2aWV3SWQiLCJyZW1vdmVJdGVtIiwiZGVsZXRlIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhcnNlIiwiZ2V0SXRlbSIsImtleSIsImFkZFJldmlldyIsIm9mZmxpbmVMYWJlbHMiLCJBcnJheSIsImZyb20iLCJxdWVyeVNlbGVjdG9yQWxsIiwib2ZmbGluZUxhYmVsIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwicG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsWUFBWUMsSUFBSUMsSUFBSixDQUFTLHVCQUFULEVBQWtDLENBQWxDLEVBQXFDLHFCQUFhO0FBQ25FLFNBQVFDLFVBQVVDLFVBQWxCO0FBQ0EsT0FBSyxDQUFMO0FBQ0NELGFBQVVFLGlCQUFWLENBQTRCLGFBQTVCLEVBQTJDLEVBQUNDLFNBQVMsSUFBVixFQUEzQztBQUNELE9BQUssQ0FBTDtBQUNDLE9BQU1DLGVBQWVKLFVBQVVFLGlCQUFWLENBQTRCLFNBQTVCLEVBQXVDLEVBQUNDLFNBQVMsSUFBVixFQUF2QyxDQUFyQjtB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S2MsS0FBTCxDQUFXaEIsYUFBYWlCLE9BQWIsQ0FBcUJqQixhQUFha0IsR0FBYixDQUFpQjlGLENBQWpCLENBQXJCLENBQVgsQ0FBdEI7QUFDQWYsZUFBUzhHLFNBQVQsQ0FBbUJ4QixjQUFjSSxJQUFqQyxFQUF1Q0osY0FBY1YsWUFBckQsRUFBbUUzRSxRQUFuRTtBQUNBMEYsbUJBQWFZLFVBQWIsQ0FBd0JqQixjQUFjQyxTQUF0QztBQUNBbEUsY0FBUUMsR0FBUixDQUFZLHlFQUFaO0FBQ0E7QUFDRCxTQUFNeUYsZ0JBQWdCQyxNQUFNQyxJQUFOLENBQVc3QyxTQUFTOEMsZ0JBQVQsQ0FBMEIsZ0JBQTFCLENBQVgsQ0FBdEI7QUFDQUgsbUJBQWNwQyxPQUFkLENBQXNCLHdCQUFnQjtBQUNyQ3dDLG1CQUFhQyxVQUFiLENBQXdCQyxXQUF4QixDQUFvQ0YsWUFBcEM7QUFDQSxNQUZEO0FBR0EsS0FYRCxNQVdPO0FBQ045RixhQUFRQyxHQUFSLENBQVkscURBQVo7QUFDQTtBQUNELElBZkQ7QUFnQkE7Ozs7O0FBNVlEOzs7O3NCQUlzQztBQUNyQyxPQUFNZ0csT0FBTyxJQUFiLENBRHFDLENBQ2xCO0FBQ25CLGdDQUEyQkEsSUFBM0I7QUFDQTs7O3NCQUVpQztBQUNqQyxPQUFNQSxPQUFPLElBQWIsQ0FEaUMsQ0FDZDtBQUNuQixnQ0FBMkJBLElBQTNCO0FBQ0EiLCJmaWxlIjoiZGJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkYlByb21pc2UgPSBpZGIub3BlbigncmVzdGF1cmFudC1yZXZpZXdzLWRiJywgMiwgdXBncmFkZURCID0+IHtcblx0c3dpdGNoICh1cGdyYWRlREIub2xkVmVyc2lvbil7XG5cdGNhc2UgMDpcblx0XHR1cGdyYWRlREIuY3JlYXRlT2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJywge2tleVBhdGg6ICdpZCd9KTtcblx0Y2FzZSAxOlxuXHRcdGNvbnN0IHJldmlld3NTdG9yZSA9IHVwZ3JhZGVEQi5jcmVhdGVPYmplY3RTdG9yZSgncmV2aWV3cycsIHtrZXlQYXRoOiAnaWQnfSk7XG5cdFx0cmV2aWV3c1N0b3JlLmNyZWF0ZUluZGV4KCdyZXN0YXVyYW50X2lkJywgJ3Jlc3RhdXJhbnRfaWQnKTtcblx0fVxufSk7XG5cbi8qKlxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXG4gKi9cbmNsYXNzIERCSGVscGVyIHtcblx0XG5cdC8qKlxuICAgKiBEYXRhYmFzZSBVUkwuXG4gICAqIENoYW5nZWQgdG8gcmV0cmlldmUgcmVzdGF1cmFudHMgJiByZXZpZXdzIGZyb20gc2VydmVyIG9uIGxvY2FsaG9zdDoxMzM3LlxuICAgKi9cblx0c3RhdGljIGdldCBEQVRBQkFTRV9SRVNUQVVSQU5UU19VUkwoKSB7XG5cdFx0Y29uc3QgcG9ydCA9IDEzMzc7IC8vIENoYW5nZSB0aGlzIHRvIHlvdXIgc2VydmVyIHBvcnRcblx0XHRyZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9yZXN0YXVyYW50c2A7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IERBVEFCQVNFX1JFVklFV1NfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmV2aWV3c2A7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2hlcyBhbGwgcmVzdGF1cmFudCByZXZpZXdzIGRhdGEuIENyZWF0ZXMgYW4gSW5kZXhlZERCIGRhdGFiYXNlIG5hbWVkICdyZXN0YXVyYW50LXJldmlld3MtZGInIHdpdGggYW4gb2JqZWN0IHN0b3JlIG9mICdyZXN0YXVyYW50LXJldmlld3MnLiBJZiByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgaXMgb2ssIHN0b3JlcyBkYXRhIHJlY2VpdmVkIGludG8gdGhlIGRhdGFiYXNlIGFuZCB0aGVuIHJldHVybnMgdGhlIGRhdGEuIElmIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBmYWlscywgbG9vayBpbiB0aGUgZGF0YWJhc2UgdG8gc2VlIGlmIHRoZXJlIGlzIGRhdGEgYWxyZWFkeSBzdG9yZWQgdGhlcmUgYW5kIHJldHVybiB0aGUgZGF0YS4gQ2F0Y2hlcyBhbmQgaGFuZGxlcyBlcnJvcnMgYXBwcm9wcmlhdGVseSB3aGVuIGRhdGEgY2Fubm90IGJlIHJldHJpZXZlZC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRzKGNhbGxiYWNrLCBpZCkge1xuXHRcdGxldCByZXN0YXVyYW50VVJMO1xuXHRcdGlkID8gcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH0vJHtpZH1gIDogcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFU1RBVVJBTlRTX1VSTH1gO1xuXG5cdFx0ZmV0Y2gocmVzdGF1cmFudFVSTCkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudHMnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0XHRsZXQgcmVzdGF1cmFudHNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycpO1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdHJlc3RhdXJhbnRzU3RvcmUucHV0KHJlc3RhdXJhbnRzW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50c1N0b3JlLmdldEFsbCgpO1xuXHRcdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZXN0YXVyYW50cyBmcm9tIHNlcnZlciAmIHN0b3JlZCBpbiBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJlc3RhdXJhbnRzKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXN0YXVyYW50cyBmcm9tIHNlcnZlciAmIHN0b3JlIGluIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnRzJywgJ3JlYWRvbmx5Jyk7XG5cdFx0XHRcdFx0bGV0IHJlc3RhdXJhbnRzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKTtcblx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXRBbGwoKTtcblx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmVzdGF1cmFudHMgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCBkYXRhIGZyb20gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmVzdGF1cmFudHMpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmVzdGF1cmFudHMgZnJvbSBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHJldHVybiBjYWxsYmFjayhgRmV0Y2ggcmVxdWVzdCBmb3IgcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgZmFpbGVkOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGEgcmVzdGF1cmFudCBieSBpdHMgSUQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgY2FsbGJhY2spIHtcblx0XHQvLyBmZXRjaCBhbGwgcmVzdGF1cmFudHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcmVzdGF1cmFudCA9IHJlc3RhdXJhbnRzLmZpbmQociA9PiByLmlkID09PSBwYXJzZUludChpZCkpO1xuXHRcdFx0XHRpZiAocmVzdGF1cmFudCkgeyAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcblx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcblx0XHRcdFx0fSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2Vcblx0XHRcdFx0XHRjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXZpZXcgYnkgaXRzIElELlxuICAgKi9cblx0c3RhdGljIGZldGNoUmV2aWV3c0J5SWQoaWQsIGNhbGxiYWNrKXtcblx0XHRjb25zdCByZXZpZXdVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVZJRVdTX1VSTH0vP3Jlc3RhdXJhbnRfaWQ9JHtpZH1gO1xuXHRcdGZldGNoKHJldmlld1VSTCwge21ldGhvZDogJ0dFVCd9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJldmlld3MgPT4ge1xuXHRcdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jldmlld3MnLCAncmVhZHdyaXRlJyk7XG5cdFx0XHRcdFx0XHRsZXQgcmV2aWV3c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jldmlld3MnKTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmV2aWV3cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0XHRcdHJldmlld3NTdG9yZS5wdXQocmV2aWV3c1tpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjb25zdCBpbmRleFJlc3RhdXJhbnRJZCA9IHJldmlld3NTdG9yZS5pbmRleCgncmVzdGF1cmFudF9pZCcpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIGluZGV4UmVzdGF1cmFudElkLmdldEFsbChwYXJzZUludChpZCkpO1xuXHRcdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIHJldmlld3MgZnJvbSBzZXJ2ZXIgJiBzdG9yZWQgaW4gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXZpZXdzKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCByZXZpZXdzIGZyb20gc2VydmVyICYgc3RvcmUgaW4gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmV2aWV3cycsICdyZWFkb25seScpO1xuXHRcdFx0XHRcdGxldCByZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmV2aWV3cycpO1xuXHRcdFx0XHRcdGNvbnN0IGluZGV4UmVzdGF1cmFudElkID0gcmV2aWV3c1N0b3JlLmluZGV4KCdyZXNhdGF1cmFudF9pZCcpO1xuXHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiBpbmRleFJlc3RhdXJhbnRJZC5nZXRBbGwoaWQpO1xuXHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXZpZXdzID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcmV2aWV3cyBmcm9tIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJldmlld3MpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmV2aWV3cyBmcm9tIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGZXRjaCByZXF1ZXN0IGZvciByZXZpZXdzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gLCBudWxsKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSBhbmQgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzO1xuXHRcdFx0XHRpZiAoY3Vpc2luZSAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuZWlnaGJvcmhvb2QgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hOZWlnaGJvcmhvb2RzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gbmVpZ2hib3Job29kc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlTmVpZ2hib3Job29kcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoQ3Vpc2luZXMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIGN1aXNpbmVzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVDdWlzaW5lcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyB1cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAuL3Jlc3RhdXJhbnQuaHRtbD9pZD0ke3Jlc3RhdXJhbnQuaWR9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBzbWFsbCBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgc21hbGxJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfc21hbGx9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBsYXJnZSBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgbGFyZ2VJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfbGFyZ2V9YCk7XG5cdH1cblxuXHQvKipcbiAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxuICAgKi9cblx0c3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XG5cdFx0Y29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXG5cdFx0XHR0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuXHRcdFx0dXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxuXHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QfVxuXHRcdCk7XG5cdFx0cmV0dXJuIG1hcmtlcjtcblx0fVxuXG5cdC8qKlxuICAgKiBTdGF0aWMgbWFwIGltYWdlIHRvIGJlIGRpc3BsYXllZCB3aGVuIGluZGV4Lmh0bWwgaW5pdGlhbGx5IGxvYWRzLlxuICAgKi9cblx0c3RhdGljIHN0YXRpY0ltYWdlRm9yTWFwSW5kZXgocmVzdGF1cmFudHMpIHtcblx0XHRsZXQgbG9jID0ge1xuXHRcdFx0bGF0OiA0MC43MjIyMTYsXG5cdFx0XHRsbmc6IC03My45ODc1MDFcblx0XHR9O1xuXHRcdGNvbnN0IG1hcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcblx0XHRjb25zdCBtYXBXaWR0aCA9IG1hcC5jbGllbnRXaWR0aDtcblx0XHRjb25zdCBtYXBIZWlnaHQgPSBtYXAuY2xpZW50SGVpZ2h0O1xuXHRcdGxldCBzdGF0aWNNYXAgPSBgaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RhdGljbWFwP2NlbnRlcj0ke1xuXHRcdFx0bG9jLmxhdH0sJHtsb2MubG5nfSZ6b29tPTEyJnNpemU9JHttYXBXaWR0aH14JHttYXBIZWlnaHR9Jm1hcmtlcnM9Y29sb3I6cmVkYDtcblx0XHRyZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xuXHRcdFx0c3RhdGljTWFwICs9IGB8JHtyZXN0YXVyYW50LmxhdGxuZy5sYXR9LCR7cmVzdGF1cmFudC5sYXRsbmcubG5nfWA7XG5cdFx0fSk7XG5cdFx0c3RhdGljTWFwICs9IGAma2V5PUFJemFTeUJ5T0VsRzZFYWkwQ0VaMjdkWUw1Vnc2TnpKT3Q5RlpBY2A7XG5cdFx0cmV0dXJuIHN0YXRpY01hcDtcblx0fVxuXG5cdC8qKlxuICAgKiBTdGF0aWMgbWFwIGltYWdlIHRvIGJlIGRpc3BsYXllZCB3aGVuIHJlc3RhdXJhbnQuaHRtbCBpbml0aWFsbHkgbG9hZHMuXG4gICAqL1xuXHRzdGF0aWMgc3RhdGljSW1hZ2VGb3JNYXBSZXN0YXVyYW50SW5mbyhyZXN0YXVyYW50KSB7XG5cdFx0Y29uc3QgbWFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdGNvbnN0IG1hcFdpZHRoID0gbWFwLmNsaWVudFdpZHRoO1xuXHRcdGNvbnN0IG1hcEhlaWdodCA9IG1hcC5jbGllbnRIZWlnaHQ7XG5cdFx0bGV0IHN0YXRpY01hcCA9IGBodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdGF0aWNtYXA/Y2VudGVyPSR7cmVzdGF1cmFudC5sYXRsbmcubGF0fSwke3Jlc3RhdXJhbnQubGF0bG5nLmxuZ30mem9vbT0xNiZzaXplPSR7bWFwV2lkdGh9eCR7bWFwSGVpZ2h0fSZtYXJrZXJzPWNvbG9yOnJlZHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9JmtleT1BSXphU3lCeU9FbEc2RWFpMENFWjI3ZFlMNVZ3Nk56Sk90OUZaQWNgO1xuXHRcdHJldHVybiBzdGF0aWNNYXA7XG5cdH1cblxuXHQvKipcbiAgICogVXBkYXRlcyBmYXZvcml0ZSBzdGF0dXMgb2YgYSByZXN0YXVyYW50IHdoZW4gZmF2b3JpdGUgaWNvbiBpcyBjbGlja2VkLlxuICAgKi9cblx0c3RhdGljIHVwZGF0ZUZhdm9yaXRlKHJlc3RhdXJhbnRJZCwgaXNGYXZvcml0ZSl7XG5cdFx0Y29uc3QgZmV0Y2hVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVNUQVVSQU5UU19VUkx9LyR7cmVzdGF1cmFudElkfT9pc19mYXZvcml0ZT0ke2lzRmF2b3JpdGV9YDtcblx0XHRmZXRjaChmZXRjaFVSTCwge21ldGhvZDogJ1BVVCd9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnRzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdGNvbnN0IHJlc3RhdXJhbnRzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKTtcblx0XHRcdFx0XHRyZXN0YXVyYW50c1N0b3JlLmdldChyZXN0YXVyYW50SWQpLnRoZW4ocmVzdGF1cmFudCA9PiB7XG5cdFx0XHRcdFx0XHRyZXN0YXVyYW50LmlzX2Zhdm9yaXRlID0gaXNGYXZvcml0ZTtcblx0XHRcdFx0XHRcdHJlc3RhdXJhbnRzU3RvcmUucHV0KHJlc3RhdXJhbnQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIHJlc3RhdXJhbnRzU3RvcmUuZ2V0KHJlc3RhdXJhbnRJZCk7XG5cdFx0XHRcdFx0fSkudGhlbih1cGRhdGVkUmVzdGF1cmFudCA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IHVwZGF0ZWQgZmF2b3JpdGUgc3RhdHVzIG9mICR7dXBkYXRlZFJlc3RhdXJhbnQubmFtZX1gKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgRmFpbGVkIHRvIHVwZGF0ZSBmYXZvcml0ZSBzdGF0dXM6ICR7ZXJyb3J9YCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9XSVBcblx0XHRcdFx0Y29uc29sZS5sb2coJ0RvIG9mZmxpbmUgc3R1ZmYgaGVyZScpO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaCByZXF1ZXN0IGZvciByZXN0YXVyYW50cyBmcm9tIHNlcnZlciBmYWlsZWQ6ICR7ZXJyb3J9YCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogSWYgb25saW5lLCBwb3N0cyByZXZpZXcgdG8gc2VydmVyICYgSW5kZXhlZERCLiBJZiBvZmZsaW5lLCBjcmVhdGVzIGFuIG9mZmxpbmUgcmV2aWV3IG9iamVjdCB0byBiZSBzdG9yZWQgaW4gbG9jYWwgc3RvcmFnZSBhbmQgcmV0cmlldmVkIHdoZW4gdGhlcmUgaXMgYSBuZXR3b3JrIGNvbm5lY3Rpb24gdmlhIGFkZE9mZmxpbmVSZXZpZXdzLlxuICAgKi9cblx0c3RhdGljIGFkZFJldmlldyhyZXZpZXcsIHJlc3RhdXJhbnRJZCwgZmlsbFJldmlld3NIVE1MKXtcblx0XHRpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcblx0XHRcdGNvbnN0IG9mZmxpbmVSZXZpZXcgPSB7XG5cdFx0XHRcdG9mZmxpbmVJZDogcmV2aWV3Lm9mZmxpbmVfaWQsXG5cdFx0XHRcdHJlc3RhdXJhbnRJZDogcmV2aWV3LnJlc3RhdXJhbnRfaWQsXG5cdFx0XHRcdGRhdGE6IHJldmlld1xuXHRcdFx0fTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKG9mZmxpbmVSZXZpZXcub2ZmbGluZUlkLCBKU09OLnN0cmluZ2lmeShvZmZsaW5lUmV2aWV3KSk7XG5cdFx0XHRjb25zdCBjYWxsYmFjayA9IGZpbGxSZXZpZXdzSFRNTDtcblx0XHRcdERCSGVscGVyLmFkZE9mZmxpbmVSZXZpZXdzKGNhbGxiYWNrKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgZmV0Y2hVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVZJRVdTX1VSTH1gO1xuXHRcdGNvbnN0IGZldGNoT3B0aW9ucyA9IHtcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkocmV2aWV3KSxcblx0XHRcdGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0fSlcblx0XHR9O1xuXHRcdGZldGNoKGZldGNoVVJMLCBmZXRjaE9wdGlvbnMpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IHBvc3RlZCByZXZpZXcgdG8gc2VydmVyJyk7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQmFkIHJlc3BvbnNlIHJlY2VpdmVkIGZyb20gc2VydmVyOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0cmV0dXJuIERCSGVscGVyLmZldGNoUmV2aWV3c0J5SWQocmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpO1xuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaCByZXF1ZXN0IGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBJZiBvbmxpbmUsIGRlbGV0ZXMgcmV2aWV3IGZyb20gc2VydmVyICYgSW5kZXhlZERCLiBJZiBvZmZsaW5lLCByZW1vdmVzIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICovXG5cdHN0YXRpYyByZW1vdmVSZXZpZXcocmV2aWV3SWQsIG9mZmxpbmVJZCwgcmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpe1xuXHRcdGlmKCFuYXZpZ2F0b3Iub25MaW5lKXtcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG9mZmxpbmVJZCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGZldGNoVVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVWSUVXU19VUkx9LyR7cmV2aWV3SWR9YDtcblx0XHRjb25zb2xlLmxvZygncmV2aWV3SWQnLCByZXZpZXdJZCk7XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIHttZXRob2Q6ICdERUxFVEUnfSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXZpZXdzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXZpZXdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXZpZXdzJyk7XG5cdFx0XHRcdFx0XHRyZXZpZXdzU3RvcmUuZGVsZXRlKHJldmlld0lkKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdTdWNjZXNzZnVsbHkgZGVsZXRlZCByZXZpZXcgZnJvbSBzZXJ2ZXIgYW5kIEluZGV4ZWREQicpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsgXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQmFkIHJlc3BvbnNlIHJlY2VpdmVkIGZyb20gc2VydmVyOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0cmV0dXJuIERCSGVscGVyLmZldGNoUmV2aWV3c0J5SWQocmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpO1xuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaCByZXF1ZXN0IGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBMaXN0ZW5zIGZvciBuZXR3b3JrIGNvbm5lY3Rpb24gYW5kIGlmIGl0IG9jY3VycyBhbmQgbG9jYWwgc3RvcmFnZSBjb250YWlucyBvZmZsaW5lIHJldmlld3MsIHJldHJpZXZlIGVhY2ggcmV2aWV3IGFuZCBhZGQgaXQgdG8gdGhlIHNlcnZlciBhbmQgSW5kZXhlZERCIHZpYSBhZGRSZXZpZXcuIFRoZW4gZGVsZXRlIGVhY2ggc3RvcmVkIG9mZmxpbmUgcmV2aWV3IGluIGxvY2FsIHN0b3JhZ2UgYW5kIHJlbW92ZSBvZmZsaW5lIGxhYmVscyBmcm9tIHRoZXNlIHJldmlld3MgaW4gZnJvbnQgZW5kIHRvIGluZGljYXRlIHRvIHVzZXIgdGhleSBoYXZlIGJlZW4gc3VibWl0dGVkLlxuICAgKi9cblx0c3RhdGljIGFkZE9mZmxpbmVSZXZpZXdzKGNhbGxiYWNrKXtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKCkgPT4ge1xuXHRcdFx0aWYgKGxvY2FsU3RvcmFnZS5sZW5ndGggPiAwKXtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGNvbnN0IG9mZmxpbmVSZXZpZXcgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZS5rZXkoaSkpKTtcblx0XHRcdFx0XHREQkhlbHBlci5hZGRSZXZpZXcob2ZmbGluZVJldmlldy5kYXRhLCBvZmZsaW5lUmV2aWV3LnJlc3RhdXJhbnRJZCwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG9mZmxpbmVSZXZpZXcub2ZmbGluZUlkKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IHJldHJpZXZlZCBvZmZsaW5lIHJldmlldyBkYXRhICYgcmVtb3ZlZCBmcm9tIGxvY2FsIHN0b3JhZ2UnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBvZmZsaW5lTGFiZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcub2ZmbGluZS1sYWJlbCcpKTtcblx0XHRcdFx0b2ZmbGluZUxhYmVscy5mb3JFYWNoKG9mZmxpbmVMYWJlbCA9PiB7XG5cdFx0XHRcdFx0b2ZmbGluZUxhYmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2ZmbGluZUxhYmVsKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRmFpbGVkIHRvIGZpbmQgb2ZmbGluZSByZXZpZXcgZGF0YSBpbiBsb2NhbCBzdG9yYWdlJyk7XG5cdFx0XHR9XHRcblx0XHR9KTtcblx0fVx0XG59XG4iXX0=
