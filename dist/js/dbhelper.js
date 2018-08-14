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
					console.log('Bad response received from server: ' + response.status);
					return;
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
    * Listens for network connection and if it occurs and local storage contains offline reviews, retrieve each review and add it to the server and IndexedDB via addReview. Then delete each stored offline review in local storage and remove offline labels from these reviews in UI to indicate to user they have been submitted.
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmV2aWV3c1N0b3JlIiwiY3JlYXRlSW5kZXgiLCJEQkhlbHBlciIsImNhbGxiYWNrIiwiaWQiLCJyZXN0YXVyYW50VVJMIiwiREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJyZXN0YXVyYW50c1N0b3JlIiwib2JqZWN0U3RvcmUiLCJpIiwicmVzdGF1cmFudHMiLCJsZW5ndGgiLCJwdXQiLCJjb21wbGV0ZSIsImdldEFsbCIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaGVkUmVzdGF1cmFudHMiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsInBhcnNlSW50IiwicmV2aWV3VVJMIiwiREFUQUJBU0VfUkVWSUVXU19VUkwiLCJtZXRob2QiLCJyZXZpZXdzIiwiaW5kZXhSZXN0YXVyYW50SWQiLCJpbmRleCIsImZldGNoZWRSZXZpZXdzIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJsb2MiLCJsYXQiLCJsbmciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibWFwV2lkdGgiLCJjbGllbnRXaWR0aCIsIm1hcEhlaWdodCIsImNsaWVudEhlaWdodCIsInN0YXRpY01hcCIsImZvckVhY2giLCJyZXN0YXVyYW50SWQiLCJpc0Zhdm9yaXRlIiwiZmV0Y2hVUkwiLCJnZXQiLCJpc19mYXZvcml0ZSIsInVwZGF0ZWRSZXN0YXVyYW50Iiwic3RhdHVzIiwicmV2aWV3IiwiZmlsbFJldmlld3NIVE1MIiwibmF2aWdhdG9yIiwib25MaW5lIiwib2ZmbGluZVJldmlldyIsIm9mZmxpbmVJZCIsIm9mZmxpbmVfaWQiLCJyZXN0YXVyYW50X2lkIiwiZGF0YSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiYWRkT2ZmbGluZVJldmlld3MiLCJmZXRjaE9wdGlvbnMiLCJib2R5IiwiaGVhZGVycyIsIkhlYWRlcnMiLCJmZXRjaFJldmlld3NCeUlkIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhcnNlIiwiZ2V0SXRlbSIsImtleSIsImFkZFJldmlldyIsInJlbW92ZUl0ZW0iLCJvZmZsaW5lTGFiZWxzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm9mZmxpbmVMYWJlbCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInJldmlld0lkIiwiZGVsZXRlIiwicG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsWUFBWUMsSUFBSUMsSUFBSixDQUFTLHVCQUFULEVBQWtDLENBQWxDLEVBQXFDLHFCQUFhO0FBQ25FLFNBQVFDLFVBQVVDLFVBQWxCO0FBQ0EsT0FBSyxDQUFMO0FBQ0NELGFBQVVFLGlCQUFWLENBQTRCLGFBQTVCLEVBQTJDLEVBQUNDLFNBQVMsSUFBVixFQUEzQztBQUNELE9BQUssQ0FBTDtBQUNDLE9BQU1DLGVBQWVKLFVBQVVFLGlCQUFWLENBQTRCLFNBQTVCLEVBQXVDLEVBQUNDLFNBQVMsSUFBVixFQUF2QyxDQUFyQjtB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ZSxjQUFNO0FBQ3BCLFdBQU1JLEtBQUtDLEdBQUdDLFdBQUgsQ0FBZSxTQUFmLEVBQTBCLFdBQTFCLENBQVg7QUFDQSxXQUFJZCxlQUFlWSxHQUFHSSxXQUFILENBQWUsU0FBZixDQUFuQjtBQUNBaEIsb0JBQWF1SCxNQUFiLENBQW9CRCxRQUFwQjtBQUNBL0YsZUFBUUMsR0FBUixDQUFZLHVEQUFaO0FBQ0EsY0FBT1osR0FBR1MsUUFBVjtBQUNBLE9BTkQ7QUFPQSxNQVJNLENBQVA7QUFTQSxLQVZELE1BVU87QUFDTkUsYUFBUUMsR0FBUix5Q0FBa0RmLFNBQVMyRSxNQUEzRDtBQUNBO0FBQ0E7QUFDRCxJQWZELEVBZUc1RSxJQWZILENBZVEsb0JBQVk7QUFDbkIsV0FBT04sU0FBU3FHLGdCQUFULENBQTBCekIsWUFBMUIsRUFBd0NRLGVBQXhDLENBQVA7QUFDQSxJQWpCRCxFQWlCRzVELEtBakJILENBaUJTLGlCQUFTO0FBQ2pCSCxZQUFRQyxHQUFSLDRCQUFxQ0csS0FBckM7QUFDQTtBQUNBLElBcEJEO0FBcUJBOzs7OztBQTVZRDs7OztzQkFJc0M7QUFDckMsT0FBTTZGLE9BQU8sSUFBYixDQURxQyxDQUNsQjtBQUNuQixnQ0FBMkJBLElBQTNCO0FBQ0E7OztzQkFFaUM7QUFDakMsT0FBTUEsT0FBTyxJQUFiLENBRGlDLENBQ2Q7QUFDbkIsZ0NBQTJCQSxJQUEzQjtBQUNBIiwiZmlsZSI6ImRiaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZGJQcm9taXNlID0gaWRiLm9wZW4oJ3Jlc3RhdXJhbnQtcmV2aWV3cy1kYicsIDIsIHVwZ3JhZGVEQiA9PiB7XG5cdHN3aXRjaCAodXBncmFkZURCLm9sZFZlcnNpb24pe1xuXHRjYXNlIDA6XG5cdFx0dXBncmFkZURCLmNyZWF0ZU9iamVjdFN0b3JlKCdyZXN0YXVyYW50cycsIHtrZXlQYXRoOiAnaWQnfSk7XG5cdGNhc2UgMTpcblx0XHRjb25zdCByZXZpZXdzU3RvcmUgPSB1cGdyYWRlREIuY3JlYXRlT2JqZWN0U3RvcmUoJ3Jldmlld3MnLCB7a2V5UGF0aDogJ2lkJ30pO1xuXHRcdHJldmlld3NTdG9yZS5jcmVhdGVJbmRleCgncmVzdGF1cmFudF9pZCcsICdyZXN0YXVyYW50X2lkJyk7XG5cdH1cbn0pO1xuXG4vKipcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxuICovXG5jbGFzcyBEQkhlbHBlciB7XG5cdFxuXHQvKipcbiAgICogRGF0YWJhc2UgVVJMLlxuICAgKiBDaGFuZ2VkIHRvIHJldHJpZXZlIHJlc3RhdXJhbnRzICYgcmV2aWV3cyBmcm9tIHNlcnZlciBvbiBsb2NhbGhvc3Q6MTMzNy5cbiAgICovXG5cdHN0YXRpYyBnZXQgREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmVzdGF1cmFudHNgO1xuXHR9XG5cblx0c3RhdGljIGdldCBEQVRBQkFTRV9SRVZJRVdTX1VSTCgpIHtcblx0XHRjb25zdCBwb3J0ID0gMTMzNzsgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxuXHRcdHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L3Jldmlld3NgO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoZXMgYWxsIHJlc3RhdXJhbnQgcmV2aWV3cyBkYXRhLiBDcmVhdGVzIGFuIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lZCAncmVzdGF1cmFudC1yZXZpZXdzLWRiJyB3aXRoIGFuIG9iamVjdCBzdG9yZSBvZiAncmVzdGF1cmFudC1yZXZpZXdzJy4gSWYgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGlzIG9rLCBzdG9yZXMgZGF0YSByZWNlaXZlZCBpbnRvIHRoZSBkYXRhYmFzZSBhbmQgdGhlbiByZXR1cm5zIHRoZSBkYXRhLiBJZiByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgZmFpbHMsIGxvb2sgaW4gdGhlIGRhdGFiYXNlIHRvIHNlZSBpZiB0aGVyZSBpcyBkYXRhIGFscmVhZHkgc3RvcmVkIHRoZXJlIGFuZCByZXR1cm4gdGhlIGRhdGEuIENhdGNoZXMgYW5kIGhhbmRsZXMgZXJyb3JzIGFwcHJvcHJpYXRlbHkgd2hlbiBkYXRhIGNhbm5vdCBiZSByZXRyaWV2ZWQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cyhjYWxsYmFjaywgaWQpIHtcblx0XHRsZXQgcmVzdGF1cmFudFVSTDtcblx0XHRpZCA/IHJlc3RhdXJhbnRVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVNUQVVSQU5UU19VUkx9LyR7aWR9YCA6IHJlc3RhdXJhbnRVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9SRVNUQVVSQU5UU19VUkx9YDtcblxuXHRcdGZldGNoKHJlc3RhdXJhbnRVUkwpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmVzdGF1cmFudHMgPT4ge1xuXHRcdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnRzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJlc3RhdXJhbnRzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudHMnKTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdGF1cmFudHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRyZXN0YXVyYW50c1N0b3JlLnB1dChyZXN0YXVyYW50c1tpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgcmVzdGF1cmFudHNTdG9yZS5nZXRBbGwoKTtcblx0XHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgJiBzdG9yZWQgaW4gSW5kZXhlZERCIWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXN0YXVyYW50cyk7XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmVzdGF1cmFudHMgZnJvbSBzZXJ2ZXIgJiBzdG9yZSBpbiBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50cycsICdyZWFkb25seScpO1xuXHRcdFx0XHRcdGxldCByZXN0YXVyYW50c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJyk7XG5cdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIHJlc3RhdXJhbnRzU3RvcmUuZ2V0QWxsKCk7XG5cdFx0XHRcdH0pLnRoZW4oZmV0Y2hlZFJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGZldGNoZWQgZGF0YSBmcm9tIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgZmV0Y2hlZFJlc3RhdXJhbnRzKTtcblx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJlc3RhdXJhbnRzIGZyb20gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soYEZldGNoIHJlcXVlc3QgZm9yIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gLCBudWxsKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50cy5maW5kKHIgPT4gci5pZCA9PT0gcGFyc2VJbnQoaWQpKTtcblx0XHRcdFx0aWYgKHJlc3RhdXJhbnQpIHsgLy8gR290IHRoZSByZXN0YXVyYW50XG5cdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XG5cdFx0XHRcdH0gZWxzZSB7IC8vIFJlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGRhdGFiYXNlXG5cdFx0XHRcdFx0Y2FsbGJhY2soJ1Jlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QnLCBudWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGEgcmV2aWV3IGJ5IGl0cyBJRC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJldmlld3NCeUlkKGlkLCBjYWxsYmFjayl7XG5cdFx0Y29uc3QgcmV2aWV3VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVWSUVXU19VUkx9Lz9yZXN0YXVyYW50X2lkPSR7aWR9YDtcblx0XHRmZXRjaChyZXZpZXdVUkwsIHttZXRob2Q6ICdHRVQnfSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXZpZXdzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXZpZXdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXZpZXdzJyk7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJldmlld3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdFx0XHRyZXZpZXdzU3RvcmUucHV0KHJldmlld3NbaV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc3QgaW5kZXhSZXN0YXVyYW50SWQgPSByZXZpZXdzU3RvcmUuaW5kZXgoJ3Jlc3RhdXJhbnRfaWQnKTtcblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiBpbmRleFJlc3RhdXJhbnRJZC5nZXRBbGwocGFyc2VJbnQoaWQpKTtcblx0XHRcdFx0XHR9KS50aGVuKGZldGNoZWRSZXZpZXdzID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZmV0Y2hlZCByZXZpZXdzIGZyb20gc2VydmVyICYgc3RvcmVkIGluIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCBmZXRjaGVkUmV2aWV3cyk7XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGBGYWlsZWQgdG8gZmV0Y2ggcmV2aWV3cyBmcm9tIHNlcnZlciAmIHN0b3JlIGluIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jldmlld3MnLCAncmVhZG9ubHknKTtcblx0XHRcdFx0XHRsZXQgcmV2aWV3c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jldmlld3MnKTtcblx0XHRcdFx0XHRjb25zdCBpbmRleFJlc3RhdXJhbnRJZCA9IHJldmlld3NTdG9yZS5pbmRleCgncmVzYXRhdXJhbnRfaWQnKTtcblx0XHRcdFx0XHRyZXR1cm4gdHguY29tcGxldGUgJiYgaW5kZXhSZXN0YXVyYW50SWQuZ2V0QWxsKGlkKTtcblx0XHRcdFx0fSkudGhlbihmZXRjaGVkUmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBmZXRjaGVkIHJldmlld3MgZnJvbSBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG51bGwsIGZldGNoZWRSZXZpZXdzKTtcblx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIHJldmlld3MgZnJvbSBJbmRleGVkREI6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdHJldHVybiBjYWxsYmFjayhgRmV0Y2ggcmVxdWVzdCBmb3IgcmV2aWV3cyBmcm9tIHNlcnZlciBmYWlsZWQ6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIHR5cGUgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lKGN1aXNpbmUsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzICB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZ1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gY3Vpc2luZSB0eXBlXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IHJlc3VsdHMgPSByZXN0YXVyYW50cztcblx0XHRcdFx0aWYgKGN1aXNpbmUgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IGN1aXNpbmVcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobmVpZ2hib3Job29kICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoTmVpZ2hib3Job29kcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIG5laWdoYm9yaG9vZHNcblx0XHRcdFx0Y29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZU5laWdoYm9yaG9vZHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBjdWlzaW5lcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlQ3Vpc2luZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgdXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgLi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgc21hbGwgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHNtYWxsSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX3NtYWxsfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgbGFyZ2UgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIGxhcmdlSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX2xhcmdlfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cbiAgICovXG5cdHN0YXRpYyBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCkge1xuXHRcdGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0cG9zaXRpb246IHJlc3RhdXJhbnQubGF0bG5nLFxuXHRcdFx0dGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcblx0XHRcdHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcblx0XHRcdG1hcDogbWFwLFxuXHRcdFx0YW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUH1cblx0XHQpO1xuXHRcdHJldHVybiBtYXJrZXI7XG5cdH1cblxuXHQvKipcbiAgICogU3RhdGljIG1hcCBpbWFnZSB0byBiZSBkaXNwbGF5ZWQgd2hlbiBpbmRleC5odG1sIGluaXRpYWxseSBsb2Fkcy5cbiAgICovXG5cdHN0YXRpYyBzdGF0aWNJbWFnZUZvck1hcEluZGV4KHJlc3RhdXJhbnRzKSB7XG5cdFx0bGV0IGxvYyA9IHtcblx0XHRcdGxhdDogNDAuNzIyMjE2LFxuXHRcdFx0bG5nOiAtNzMuOTg3NTAxXG5cdFx0fTtcblx0XHRjb25zdCBtYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5cdFx0Y29uc3QgbWFwV2lkdGggPSBtYXAuY2xpZW50V2lkdGg7XG5cdFx0Y29uc3QgbWFwSGVpZ2h0ID0gbWFwLmNsaWVudEhlaWdodDtcblx0XHRsZXQgc3RhdGljTWFwID0gYGh0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0YXRpY21hcD9jZW50ZXI9JHtcblx0XHRcdGxvYy5sYXR9LCR7bG9jLmxuZ30mem9vbT0xMiZzaXplPSR7bWFwV2lkdGh9eCR7bWFwSGVpZ2h0fSZtYXJrZXJzPWNvbG9yOnJlZGA7XG5cdFx0cmVzdGF1cmFudHMuZm9yRWFjaChyZXN0YXVyYW50ID0+IHtcblx0XHRcdHN0YXRpY01hcCArPSBgfCR7cmVzdGF1cmFudC5sYXRsbmcubGF0fSwke3Jlc3RhdXJhbnQubGF0bG5nLmxuZ31gO1xuXHRcdH0pO1xuXHRcdHN0YXRpY01hcCArPSBgJmtleT1BSXphU3lCeU9FbEc2RWFpMENFWjI3ZFlMNVZ3Nk56Sk90OUZaQWNgO1xuXHRcdHJldHVybiBzdGF0aWNNYXA7XG5cdH1cblxuXHQvKipcbiAgICogU3RhdGljIG1hcCBpbWFnZSB0byBiZSBkaXNwbGF5ZWQgd2hlbiByZXN0YXVyYW50Lmh0bWwgaW5pdGlhbGx5IGxvYWRzLlxuICAgKi9cblx0c3RhdGljIHN0YXRpY0ltYWdlRm9yTWFwUmVzdGF1cmFudEluZm8ocmVzdGF1cmFudCkge1xuXHRcdGNvbnN0IG1hcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcblx0XHRjb25zdCBtYXBXaWR0aCA9IG1hcC5jbGllbnRXaWR0aDtcblx0XHRjb25zdCBtYXBIZWlnaHQgPSBtYXAuY2xpZW50SGVpZ2h0O1xuXHRcdGxldCBzdGF0aWNNYXAgPSBgaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RhdGljbWFwP2NlbnRlcj0ke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9Jnpvb209MTYmc2l6ZT0ke21hcFdpZHRofXgke21hcEhlaWdodH0mbWFya2Vycz1jb2xvcjpyZWR8JHtyZXN0YXVyYW50LmxhdGxuZy5sYXR9LCR7cmVzdGF1cmFudC5sYXRsbmcubG5nfSZrZXk9QUl6YVN5QnlPRWxHNkVhaTBDRVoyN2RZTDVWdzZOekpPdDlGWkFjYDtcblx0XHRyZXR1cm4gc3RhdGljTWFwO1xuXHR9XG5cblx0LyoqXG4gICAqIFVwZGF0ZXMgZmF2b3JpdGUgc3RhdHVzIG9mIGEgcmVzdGF1cmFudCB3aGVuIGZhdm9yaXRlIGljb24gaXMgY2xpY2tlZC5cbiAgICovXG5cdHN0YXRpYyB1cGRhdGVGYXZvcml0ZShyZXN0YXVyYW50SWQsIGlzRmF2b3JpdGUpe1xuXHRcdGNvbnN0IGZldGNoVVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVTVEFVUkFOVFNfVVJMfS8ke3Jlc3RhdXJhbnRJZH0/aXNfZmF2b3JpdGU9JHtpc0Zhdm9yaXRlfWA7XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIHttZXRob2Q6ICdQVVQnfSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXN0YXVyYW50cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRjb25zdCByZXN0YXVyYW50c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnRzJyk7XG5cdFx0XHRcdFx0cmVzdGF1cmFudHNTdG9yZS5nZXQocmVzdGF1cmFudElkKS50aGVuKHJlc3RhdXJhbnQgPT4ge1xuXHRcdFx0XHRcdFx0cmVzdGF1cmFudC5pc19mYXZvcml0ZSA9IGlzRmF2b3JpdGU7XG5cdFx0XHRcdFx0XHRyZXN0YXVyYW50c1N0b3JlLnB1dChyZXN0YXVyYW50KTtcblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50c1N0b3JlLmdldChyZXN0YXVyYW50SWQpO1xuXHRcdFx0XHRcdH0pLnRoZW4odXBkYXRlZFJlc3RhdXJhbnQgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSB1cGRhdGVkIGZhdm9yaXRlIHN0YXR1cyBvZiAke3VwZGF0ZWRSZXN0YXVyYW50Lm5hbWV9YCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYEZhaWxlZCB0byB1cGRhdGUgZmF2b3JpdGUgc3RhdHVzOiAke2Vycm9yfWApO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBCYWQgcmVzcG9uc2UgcmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coYEZldGNoIHJlcXVlc3QgZm9yIHJlc3RhdXJhbnRzIGZyb20gc2VydmVyIGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBJZiBvbmxpbmUsIHBvc3RzIHJldmlldyB0byBzZXJ2ZXIgJiBJbmRleGVkREIuIElmIG9mZmxpbmUsIGNyZWF0ZXMgYW4gb2ZmbGluZSByZXZpZXcgb2JqZWN0IHRvIGJlIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlIGFuZCByZXRyaWV2ZWQgd2hlbiB0aGVyZSBpcyBhIG5ldHdvcmsgY29ubmVjdGlvbiB2aWEgYWRkT2ZmbGluZVJldmlld3MuXG4gICAqL1xuXHRzdGF0aWMgYWRkUmV2aWV3KHJldmlldywgcmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpe1xuXHRcdGlmICghbmF2aWdhdG9yLm9uTGluZSkge1xuXHRcdFx0Y29uc3Qgb2ZmbGluZVJldmlldyA9IHtcblx0XHRcdFx0b2ZmbGluZUlkOiByZXZpZXcub2ZmbGluZV9pZCxcblx0XHRcdFx0cmVzdGF1cmFudElkOiByZXZpZXcucmVzdGF1cmFudF9pZCxcblx0XHRcdFx0ZGF0YTogcmV2aWV3XG5cdFx0XHR9O1xuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0ob2ZmbGluZVJldmlldy5vZmZsaW5lSWQsIEpTT04uc3RyaW5naWZ5KG9mZmxpbmVSZXZpZXcpKTtcblx0XHRcdGNvbnN0IGNhbGxiYWNrID0gZmlsbFJldmlld3NIVE1MO1xuXHRcdFx0REJIZWxwZXIuYWRkT2ZmbGluZVJldmlld3MoY2FsbGJhY2spO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCBmZXRjaFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1JFVklFV1NfVVJMfWA7XG5cdFx0Y29uc3QgZmV0Y2hPcHRpb25zID0ge1xuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRib2R5OiBKU09OLnN0cmluZ2lmeShyZXZpZXcpLFxuXHRcdFx0aGVhZGVyczogbmV3IEhlYWRlcnMoe1xuXHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHR9KVxuXHRcdH07XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIGZldGNoT3B0aW9ucykudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTdWNjZXNzZnVsbHkgcG9zdGVkIHJldmlldyB0byBzZXJ2ZXInKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBCYWQgcmVzcG9uc2UgcmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRyZXR1cm4gREJIZWxwZXIuZmV0Y2hSZXZpZXdzQnlJZChyZXN0YXVyYW50SWQsIGZpbGxSZXZpZXdzSFRNTCk7XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coYEZldGNoIHJlcXVlc3QgZmFpbGVkOiAke2Vycm9yfWApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIExpc3RlbnMgZm9yIG5ldHdvcmsgY29ubmVjdGlvbiBhbmQgaWYgaXQgb2NjdXJzIGFuZCBsb2NhbCBzdG9yYWdlIGNvbnRhaW5zIG9mZmxpbmUgcmV2aWV3cywgcmV0cmlldmUgZWFjaCByZXZpZXcgYW5kIGFkZCBpdCB0byB0aGUgc2VydmVyIGFuZCBJbmRleGVkREIgdmlhIGFkZFJldmlldy4gVGhlbiBkZWxldGUgZWFjaCBzdG9yZWQgb2ZmbGluZSByZXZpZXcgaW4gbG9jYWwgc3RvcmFnZSBhbmQgcmVtb3ZlIG9mZmxpbmUgbGFiZWxzIGZyb20gdGhlc2UgcmV2aWV3cyBpbiBVSSB0byBpbmRpY2F0ZSB0byB1c2VyIHRoZXkgaGF2ZSBiZWVuIHN1Ym1pdHRlZC5cbiAgICovXG5cdHN0YXRpYyBhZGRPZmZsaW5lUmV2aWV3cyhjYWxsYmFjayl7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsICgpID0+IHtcblx0XHRcdGlmIChsb2NhbFN0b3JhZ2UubGVuZ3RoID4gMCl7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRjb25zdCBvZmZsaW5lUmV2aWV3ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSk7XG5cdFx0XHRcdFx0REJIZWxwZXIuYWRkUmV2aWV3KG9mZmxpbmVSZXZpZXcuZGF0YSwgb2ZmbGluZVJldmlldy5yZXN0YXVyYW50SWQsIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShvZmZsaW5lUmV2aWV3Lm9mZmxpbmVJZCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSByZXRyaWV2ZWQgb2ZmbGluZSByZXZpZXcgZGF0YSAmIHJlbW92ZWQgZnJvbSBsb2NhbCBzdG9yYWdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3Qgb2ZmbGluZUxhYmVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9mZmxpbmUtbGFiZWwnKSk7XG5cdFx0XHRcdG9mZmxpbmVMYWJlbHMuZm9yRWFjaChvZmZsaW5lTGFiZWwgPT4ge1xuXHRcdFx0XHRcdG9mZmxpbmVMYWJlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9mZmxpbmVMYWJlbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0ZhaWxlZCB0byBmaW5kIG9mZmxpbmUgcmV2aWV3IGRhdGEgaW4gbG9jYWwgc3RvcmFnZScpO1xuXHRcdFx0fVx0XG5cdFx0fSk7XG5cdH1cdFxuXG5cdC8qKlxuICAgKiBJZiBvbmxpbmUsIGRlbGV0ZXMgcmV2aWV3IGZyb20gc2VydmVyICYgSW5kZXhlZERCLiBJZiBvZmZsaW5lLCByZW1vdmVzIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICovXG5cdHN0YXRpYyByZW1vdmVSZXZpZXcocmV2aWV3SWQsIG9mZmxpbmVJZCwgcmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpe1xuXHRcdGlmKCFuYXZpZ2F0b3Iub25MaW5lKXtcblx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG9mZmxpbmVJZCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IGZldGNoVVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfUkVWSUVXU19VUkx9LyR7cmV2aWV3SWR9YDtcblx0XHRjb25zb2xlLmxvZygncmV2aWV3SWQnLCByZXZpZXdJZCk7XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIHttZXRob2Q6ICdERUxFVEUnfSkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXZpZXdzID0+IHtcblx0XHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKCdyZXZpZXdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJldmlld3NTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXZpZXdzJyk7XG5cdFx0XHRcdFx0XHRyZXZpZXdzU3RvcmUuZGVsZXRlKHJldmlld0lkKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdTdWNjZXNzZnVsbHkgZGVsZXRlZCByZXZpZXcgZnJvbSBzZXJ2ZXIgYW5kIEluZGV4ZWREQicpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTsgXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgQmFkIHJlc3BvbnNlIHJlY2VpdmVkIGZyb20gc2VydmVyOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0cmV0dXJuIERCSGVscGVyLmZldGNoUmV2aWV3c0J5SWQocmVzdGF1cmFudElkLCBmaWxsUmV2aWV3c0hUTUwpO1xuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGBGZXRjaCByZXF1ZXN0IGZhaWxlZDogJHtlcnJvcn1gKTtcblx0XHRcdHJldHVybjtcblx0XHR9KTtcblx0fVxufVxuIl19
