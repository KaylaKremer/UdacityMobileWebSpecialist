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
    * Fetch all restaurants. (Code is refactored here to use fetch API instead of XHR with proper error handling.)
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
							console.log('Sucessfully fetched & stored data in IndexedDB: ' + restaurantReviews);
							callback(null, restaurantReviews);
						}).catch(function (error) {
							callback('Failed to fetch & store data in IndexedDB: ' + error, null);
						});
					});
				} else {
					throw response;
				}
			}).catch(function (error) {
				callback('Fetch request for data failed: ' + error, null);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJpZCIsImRiUHJvbWlzZSIsImlkYiIsIm9wZW4iLCJ1cGdyYWRlREIiLCJvbGRWZXJzaW9uIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJrZXlQYXRoIiwicmVzdGF1cmFudFVSTCIsIkRBVEFCQVNFX1VSTCIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwib2siLCJqc29uIiwidHgiLCJkYiIsInRyYW5zYWN0aW9uIiwicmVzdGF1cmFudFJldmlld3NTdG9yZSIsIm9iamVjdFN0b3JlIiwicmVzdGF1cmFudFJldmlld3MiLCJmb3JFYWNoIiwicHV0IiwicmVzdGF1cmFudFJldmlldyIsImNvbXBsZXRlIiwiZ2V0QWxsIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZXJyb3IiLCJmZXRjaFJlc3RhdXJhbnRzIiwicmVzdGF1cmFudHMiLCJyZXN0YXVyYW50IiwiZmluZCIsInIiLCJwYXJzZUludCIsImN1aXNpbmUiLCJyZXN1bHRzIiwiZmlsdGVyIiwiY3Vpc2luZV90eXBlIiwibmVpZ2hib3Job29kIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImluZGV4T2YiLCJjdWlzaW5lcyIsInVuaXF1ZUN1aXNpbmVzIiwicGhvdG9ncmFwaF9zbWFsbCIsInBob3RvZ3JhcGhfbGFyZ2UiLCJtYXJrZXIiLCJnb29nbGUiLCJtYXBzIiwiTWFya2VyIiwicG9zaXRpb24iLCJsYXRsbmciLCJ0aXRsZSIsIm5hbWUiLCJ1cmwiLCJ1cmxGb3JSZXN0YXVyYW50IiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsInBvcnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7SUFHTUEsUTs7Ozs7Ozs7O0FBV0w7OzttQ0FHd0JDLFEsRUFBVUMsRSxFQUFJO0FBQ3JDLE9BQU1DLFlBQVlDLElBQUlDLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxD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QixJQUZtQjtBQUdyQ0MsU0FBSzdELFNBQVM4RCxnQkFBVCxDQUEwQjVCLFVBQTFCLENBSGdDO0FBSXJDVSxTQUFLQSxHQUpnQztBQUtyQ21CLGVBQVdULE9BQU9DLElBQVAsQ0FBWVMsU0FBWixDQUFzQkMsSUFMSSxFQUF2QixDQUFmO0FBT0EsVUFBT1osTUFBUDtBQUNBOzs7OztBQTNMRDs7OztzQkFJMEI7QUFDekIsT0FBTWEsT0FBTyxJQUFiLENBRHlCLENBQ047QUFDbkIsZ0NBQTJCQSxJQUEzQjtBQUNBIiwiZmlsZSI6ImRiaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb21tb24gZGF0YWJhc2UgaGVscGVyIGZ1bmN0aW9ucy5cbiAqL1xuY2xhc3MgREJIZWxwZXIge1xuXHRcblx0LyoqXG4gICAqIERhdGFiYXNlIFVSTC5cbiAgICogQ2hhbmdlZCB0byByZXRyaWV2ZSBkYXRhIGZyb20gdGhlIHNlcnZlciBvbiBsb2NhbGhvc3Q6MTMzNy5cbiAgICovXG5cdHN0YXRpYyBnZXQgREFUQUJBU0VfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmVzdGF1cmFudHNgO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCByZXN0YXVyYW50cy4gKENvZGUgaXMgcmVmYWN0b3JlZCBoZXJlIHRvIHVzZSBmZXRjaCBBUEkgaW5zdGVhZCBvZiBYSFIgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuKVxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2ssIGlkKSB7XG5cdFx0Y29uc3QgZGJQcm9taXNlID0gaWRiLm9wZW4oJ3Jlc3RhdXJhbnQtcmV2aWV3cy1kYicsIDEsIHVwZ3JhZGVEQiA9PiB7XG5cdFx0XHRzd2l0Y2ggKHVwZ3JhZGVEQi5vbGRWZXJzaW9uKXtcblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0dXBncmFkZURCLmNyZWF0ZU9iamVjdFN0b3JlKCdyZXN0YXVyYW50LXJldmlld3MnLCB7a2V5UGF0aDogJ2lkJ30pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGxldCByZXN0YXVyYW50VVJMO1xuXHRcdGlkID8gcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1VSTH0vJHtpZH1gIDogcmVzdGF1cmFudFVSTCA9IGAke0RCSGVscGVyLkRBVEFCQVNFX1VSTH1gO1xuXHRcdGZldGNoKHJlc3RhdXJhbnRVUkwpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYocmVzcG9uc2Uub2spe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpLnRoZW4ocmVzdGF1cmFudFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdGRiUHJvbWlzZS50aGVuKGRiID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc3RhdXJhbnQtcmV2aWV3cycsICdyZWFkd3JpdGUnKTtcblx0XHRcdFx0XHRcdGxldCByZXN0YXVyYW50UmV2aWV3c1N0b3JlID0gdHgub2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnQtcmV2aWV3cycpO1xuXHRcdFx0XHRcdFx0cmVzdGF1cmFudFJldmlld3MuZm9yRWFjaChyZXN0YXVyYW50UmV2aWV3ID0+IHtcblx0XHRcdFx0XHRcdFx0cmVzdGF1cmFudFJldmlld3NTdG9yZS5wdXQocmVzdGF1cmFudFJldmlldyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHJldHVybiB0eC5jb21wbGV0ZSAmJiByZXN0YXVyYW50UmV2aWV3c1N0b3JlLmdldEFsbCgpO1xuXHRcdFx0XHRcdH0pLnRoZW4ocmVzdGF1cmFudFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYFN1Y2Vzc2Z1bGx5IGZldGNoZWQgJiBzdG9yZWQgZGF0YSBpbiBJbmRleGVkREI6ICR7cmVzdGF1cmFudFJldmlld3N9YCk7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50UmV2aWV3cyk7XG5cdFx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCAmIHN0b3JlIGRhdGEgaW4gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IHJlc3BvbnNlO1xuXHRcdFx0fVxuXHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdGNhbGxiYWNrKGBGZXRjaCByZXF1ZXN0IGZvciBkYXRhIGZhaWxlZDogJHtlcnJvcn1gLCBudWxsKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50cy5maW5kKHIgPT4gci5pZCA9PT0gcGFyc2VJbnQoaWQpKTtcblx0XHRcdFx0aWYgKHJlc3RhdXJhbnQpIHsgLy8gR290IHRoZSByZXN0YXVyYW50XG5cdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XG5cdFx0XHRcdH0gZWxzZSB7IC8vIFJlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGRhdGFiYXNlXG5cdFx0XHRcdFx0Y2FsbGJhY2soJ1Jlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QnLCBudWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSB0eXBlIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZShjdWlzaW5lLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIGN1aXNpbmUgdHlwZVxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kKG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIG5laWdoYm9yaG9vZFxuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCByZXN1bHRzID0gcmVzdGF1cmFudHM7XG5cdFx0XHRcdGlmIChjdWlzaW5lICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5laWdoYm9yaG9vZCAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXG5cdFx0XHRcdFx0cmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaE5laWdoYm9yaG9vZHMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIG5laWdoYm9yaG9vZHMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgbmVpZ2hib3Job29kcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0ubmVpZ2hib3Job29kKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZU5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzLmZpbHRlcigodiwgaSkgPT4gbmVpZ2hib3Job29kcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVOZWlnaGJvcmhvb2RzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hDdWlzaW5lcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgY3Vpc2luZXMgZnJvbSBhbGwgcmVzdGF1cmFudHNcblx0XHRcdFx0Y29uc3QgY3Vpc2luZXMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLmN1aXNpbmVfdHlwZSk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcblx0XHRcdFx0Y29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZUN1aXNpbmVzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IHNtYWxsIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBzbWFsbEltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9zbWFsbH1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBSZXN0YXVyYW50IGxhcmdlIGltYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyBsYXJnZUltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaF9sYXJnZX1gKTtcblx0fVxuXG5cdC8qKlxuICAgKiBNYXAgbWFya2VyIGZvciBhIHJlc3RhdXJhbnQuXG4gICAqL1xuXHRzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcblx0XHRjb25zdCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdHBvc2l0aW9uOiByZXN0YXVyYW50LmxhdGxuZyxcblx0XHRcdHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXG5cdFx0XHR1cmw6IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCksXG5cdFx0XHRtYXA6IG1hcCxcblx0XHRcdGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1B9XG5cdFx0KTtcblx0XHRyZXR1cm4gbWFya2VyO1xuXHR9XG59Il19
