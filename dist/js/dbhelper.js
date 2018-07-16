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
    * Fetch all restaurants.
    */
		value: function fetchRestaurants(callback, id) {
			var fetchURL = void 0;
			if (!id) {
				fetchURL = '' + DBHelper.DATABASE_URL;
			} else {
				fetchURL = DBHelper.DATABASE_URL + '/' + id;
			}
			fetch(fetchURL, { method: "GET" }).then(function (response) {
				if (response.ok) {
					return response.json().then(function (restaurants) {
						callback(null, restaurants);
					}).catch(function (error) {
						callback(error.status + ': ' + error.statusText, null);
					});
				} else {
					return callback(response.status + ': ' + response.statusText, null);
				}
			}).catch(function (error) {
				callback(error.status + ': ' + error.statusText, null);
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
						return r.id == id;
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
    * Change this to restaurants.json file location on your server.
    */
		get: function get() {
			var port = 1337; // Change this to your server port
			return 'http://localhost:' + port + '/restaurants';
		}
	}]);

	return DBHelper;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJpZCIsImZldGNoVVJMIiwiREFUQUJBU0VfVVJMIiwiZmV0Y2giLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJyZXN0YXVyYW50cyIsImNhdGNoIiwiZXJyb3IiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsImN1aXNpbmUiLCJyZXN1bHRzIiwiZmlsdGVyIiwiY3Vpc2luZV90eXBlIiwibmVpZ2hib3Job29kIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImluZGV4T2YiLCJjdWlzaW5lcyIsInVuaXF1ZUN1aXNpbmVzIiwicGhvdG9ncmFwaF9zbWFsbCIsInBob3RvZ3JhcGhfbGFyZ2UiLCJtYXJrZXIiLCJnb29nbGUiLCJtYXBzIiwiTWFya2VyIiwicG9zaXRpb24iLCJsYXRsbmciLCJ0aXRsZSIsIm5hbWUiLCJ1cmwiLCJ1cmxGb3JSZXN0YXVyYW50IiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsInBvcnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7SUFHTUEsUTs7Ozs7Ozs7O0FBV0w7OzttQ0FHd0JDLFEsRUFBVUMsRSxFQUFJO0FBQ3JDLE9BQUlDLGlCQUFKO0FBQ0EsT0FBSSxDQUFDRCxFQUFMLEVBQVM7QUFDUkMsb0JBQWNILFNBQVNJLFlBQXZCO0FBQ0EsSUFGRCxNQUVPO0FBQ05ELGVBQWNILFNBQVNJLFlBQXZCLFNBQXVDRixFQUF2QztBQUNBO0FBQ0RHLFNBQU1GLFFBQU4sRUFBZ0IsRUFBQ0csUUFBUSxLQUFULEVBQWhCLEVBQWlDQyxJQUFqQyxDQUFzQyxvQkFBWTtBQUNqRCxRQUFHQyxTQUFTQyxFQUFaLEVBQWU7QUFDZCxZQUFPRCxTQUFTRSxJQUFULEdBQWdCSCxJQUFoQixDQUFxQix1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b0NBQWdDQSxXQUFXZixFQUEzQztBQUNBOztBQUVEOzs7Ozs7NkNBR2tDZSxVLEVBQVk7QUFDN0Msb0JBQWdCQSxXQUFXZ0IsZ0JBQTNCO0FBQ0E7O0FBRUQ7Ozs7Ozs2Q0FHa0NoQixVLEVBQVk7QUFDN0Msb0JBQWdCQSxXQUFXaUIsZ0JBQTNCO0FBQ0E7O0FBRUQ7Ozs7Ozt5Q0FHOEJqQixVLEVBQVlTLEcsRUFBSztBQUM5QyxPQUFNUyxTQUFTLElBQUlDLE9BQU9DLElBQVAsQ0FBWUMsTUFBaEIsQ0FBdUI7QUFDckNDLGNBQVV0QixXQUFXdUIsTUFEZ0I7QUFFckNDLFdBQU94QixXQUFXeUIsSUFGbUI7QUFHckNDLFNBQUszQyxTQUFTNEMsZ0JBQVQsQ0FBMEIzQixVQUExQixDQUhnQztBQUlyQ1MsU0FBS0EsR0FKZ0M7QUFLckNtQixlQUFXVCxPQUFPQyxJQUFQLENBQVlTLFNBQVosQ0FBc0JDLElBTEksRUFBdkIsQ0FBZjtBQU9BLFVBQU9aLE1BQVA7QUFDQTs7Ozs7QUEvS0Q7Ozs7c0JBSTBCO0FBQ3pCLE9BQU1hLE9BQU8sSUFBYixDQUR5QixDQUNOO0FBQ25CLGdDQUEyQkEsSUFBM0I7QUFDQSIsImZpbGUiOiJkYmhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXG4gKi9cbmNsYXNzIERCSGVscGVyIHtcblxuXHQvKipcbiAgICogRGF0YWJhc2UgVVJMLlxuICAgKiBDaGFuZ2UgdGhpcyB0byByZXN0YXVyYW50cy5qc29uIGZpbGUgbG9jYXRpb24gb24geW91ciBzZXJ2ZXIuXG4gICAqL1xuXHRzdGF0aWMgZ2V0IERBVEFCQVNFX1VSTCgpIHtcblx0XHRjb25zdCBwb3J0ID0gMTMzNzsgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxuXHRcdHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L3Jlc3RhdXJhbnRzYDtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCBhbGwgcmVzdGF1cmFudHMuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cyhjYWxsYmFjaywgaWQpIHtcblx0XHRsZXQgZmV0Y2hVUkw7XG5cdFx0aWYgKCFpZCkge1xuXHRcdFx0ZmV0Y2hVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9VUkx9YDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZmV0Y2hVUkwgPSBgJHtEQkhlbHBlci5EQVRBQkFTRV9VUkx9LyR7aWR9YDtcblx0XHR9XG5cdFx0ZmV0Y2goZmV0Y2hVUkwsIHttZXRob2Q6IFwiR0VUXCJ9KS50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmKHJlc3BvbnNlLm9rKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKS50aGVuKHJlc3RhdXJhbnRzID0+IHtcblx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50cyk7XG5cdFx0XHRcdH0pLmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRjYWxsYmFjayhgJHtlcnJvci5zdGF0dXN9OiAke2Vycm9yLnN0YXR1c1RleHR9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKGAke3Jlc3BvbnNlLnN0YXR1c306ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjYWxsYmFjayhgJHtlcnJvci5zdGF0dXN9OiAke2Vycm9yLnN0YXR1c1RleHR9YCwgbnVsbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xuXHRcdC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT0gaWQpO1xuXHRcdFx0XHRpZiAocmVzdGF1cmFudCkgeyAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcblx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcblx0XHRcdFx0fSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2Vcblx0XHRcdFx0XHRjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIHR5cGUgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lKGN1aXNpbmUsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzICB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZ1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gY3Vpc2luZSB0eXBlXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IHJlc3VsdHMgPSByZXN0YXVyYW50cztcblx0XHRcdFx0aWYgKGN1aXNpbmUgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IGN1aXNpbmVcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobmVpZ2hib3Job29kICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoTmVpZ2hib3Job29kcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIG5laWdoYm9yaG9vZHNcblx0XHRcdFx0Y29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZU5laWdoYm9yaG9vZHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBjdWlzaW5lcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlQ3Vpc2luZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgdXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgLi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgc21hbGwgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHNtYWxsSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX3NtYWxsfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgbGFyZ2UgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIGxhcmdlSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX2xhcmdlfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cbiAgICovXG5cdHN0YXRpYyBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCkge1xuXHRcdGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0cG9zaXRpb246IHJlc3RhdXJhbnQubGF0bG5nLFxuXHRcdFx0dGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcblx0XHRcdHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcblx0XHRcdG1hcDogbWFwLFxuXHRcdFx0YW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUH1cblx0XHQpO1xuXHRcdHJldHVybiBtYXJrZXI7XG5cdH1cblxufVxuIl19
