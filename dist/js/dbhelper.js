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
			var restaurantURL = void 0;
			id ? restaurantURL = DBHelper.DATABASE_URL + '/' + id : restaurantURL = '' + DBHelper.DATABASE_URL;
			fetch(restaurantURL).then(function (response) {
				if (response.ok) {
					return response.json().then(function (restaurants) {
						callback(null, restaurants);
					}).catch(function (error) {
						callback('Error: ' + error.message, null);
					});
				} else {
					throw response;
				}
			}).catch(function (error) {
				callback('Error: ' + error.message, null);
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
    * Changed to retrieve data from the server on localhost:1337.
    */
		get: function get() {
			var port = 1337; // Change this to your server port
			return 'http://localhost:' + port + '/restaurants';
		}
	}]);

	return DBHelper;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJpZCIsInJlc3RhdXJhbnRVUkwiLCJEQVRBQkFTRV9VUkwiLCJmZXRjaCIsInRoZW4iLCJyZXNwb25zZSIsIm9rIiwianNvbiIsInJlc3RhdXJhbnRzIiwiY2F0Y2giLCJlcnJvciIsIm1lc3NhZ2UiLCJmZXRjaFJlc3RhdXJhbnRzIiwicmVzdGF1cmFudCIsImZpbmQiLCJyIiwiY3Vpc2luZSIsInJlc3VsdHMiLCJmaWx0ZXIiLCJjdWlzaW5lX3R5cGUiLCJuZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsImkiLCJ1bmlxdWVOZWlnaGJvcmhvb2RzIiwiaW5kZXhPZiIsImN1aXNpbmVzIiwidW5pcXVlQ3Vpc2luZXMiLCJwaG90b2dyYXBoX3NtYWxsIiwicGhvdG9ncmFwaF9sYXJnZSIsIm1hcmtlciIsImdvb2dsZSIsIm1hcHMiLCJNYXJrZXIiLCJwb3NpdGlvbiIsImxhdGxuZyIsInRpdGxlIiwibmFtZSIsInVybCIsInVybEZvclJlc3RhdXJhbnQiLCJhbmltYXRpb24iLCJBbmltYXRpb24iLCJEUk9QIiwicG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7OztJQUdNQSxROzs7Ozs7Ozs7QUFXTDs7O21DQUd3QkMsUSxFQUFVQyxFLEVBQUk7QUFDckMsT0FBSUMsc0JBQUo7QUFDQUQsUUFBS0MsZ0JBQW1CSCxTQUFTSSxZQUE1QixTQUE0Q0YsRUFBakQsR0FBd0RDLHFCQUFtQkgsU0FBU0ksWUFBcEY7QUFDQUMsU0FBTUYsYUFBTixFQUFxQkcsSUFBckIsQ0FBMEIsb0JBQVk7QUFDckMsUUFBR0MsU0FBU0MsRUFBWixFQUFlO0FBQ2QsWUFBT0QsU0FBU0UsSUFBVCxHQUFnQkgsSUFBaEIsQ0FBcUIsdUJBQWU7QUFDMUNMLGVBQVMsSUFBVCxFQUFlUyxXQUFmO0FBQ0EsTUFGTSxFQUVKQyxLQUZJLENBRUUsaUJBQVM7QUFDakJWLDJCQUFtQlcs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LEVBQUs7QUFDOUMsT0FBTVMsU0FBUyxJQUFJQyxPQUFPQyxJQUFQLENBQVlDLE1BQWhCLENBQXVCO0FBQ3JDQyxjQUFVdEIsV0FBV3VCLE1BRGdCO0FBRXJDQyxXQUFPeEIsV0FBV3lCLElBRm1CO0FBR3JDQyxTQUFLekMsU0FBUzBDLGdCQUFULENBQTBCM0IsVUFBMUIsQ0FIZ0M7QUFJckNTLFNBQUtBLEdBSmdDO0FBS3JDbUIsZUFBV1QsT0FBT0MsSUFBUCxDQUFZUyxTQUFaLENBQXNCQyxJQUxJLEVBQXZCLENBQWY7QUFPQSxVQUFPWixNQUFQO0FBQ0E7Ozs7O0FBM0tEOzs7O3NCQUkwQjtBQUN6QixPQUFNYSxPQUFPLElBQWIsQ0FEeUIsQ0FDTjtBQUNuQixnQ0FBMkJBLElBQTNCO0FBQ0EiLCJmaWxlIjoiZGJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxuICovXG5jbGFzcyBEQkhlbHBlciB7XG5cblx0LyoqXG4gICAqIERhdGFiYXNlIFVSTC5cbiAgICogQ2hhbmdlZCB0byByZXRyaWV2ZSBkYXRhIGZyb20gdGhlIHNlcnZlciBvbiBsb2NhbGhvc3Q6MTMzNy5cbiAgICovXG5cdHN0YXRpYyBnZXQgREFUQUJBU0VfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmVzdGF1cmFudHNgO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCByZXN0YXVyYW50cy4gKENvZGUgaXMgcmVmYWN0b3JlZCBoZXJlIHRvIHVzZSBmZXRjaCBBUEkgaW5zdGVhZCBvZiBYSFIgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuKVxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2ssIGlkKSB7XG5cdFx0bGV0IHJlc3RhdXJhbnRVUkw7XG5cdFx0aWQgPyByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfVVJMfS8ke2lkfWAgOiByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfVVJMfWA7XG5cdFx0ZmV0Y2gocmVzdGF1cmFudFVSTCkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN0YXVyYW50cyA9PiB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudHMpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soYEVycm9yOiAke2Vycm9yLm1lc3NhZ2V9YCwgbnVsbCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgcmVzcG9uc2U7XG5cdFx0XHR9XG5cdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0Y2FsbGJhY2soYEVycm9yOiAke2Vycm9yLm1lc3NhZ2V9YCwgbnVsbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xuXHRcdC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT0gaWQpO1xuXHRcdFx0XHRpZiAocmVzdGF1cmFudCkgeyAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcblx0XHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcblx0XHRcdFx0fSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2Vcblx0XHRcdFx0XHRjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIHR5cGUgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lKGN1aXNpbmUsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzICB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZ1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gY3Vpc2luZSB0eXBlXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZChjdWlzaW5lLCBuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IHJlc3VsdHMgPSByZXN0YXVyYW50cztcblx0XHRcdFx0aWYgKGN1aXNpbmUgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IGN1aXNpbmVcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobmVpZ2hib3Job29kICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0XHRyZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoTmVpZ2hib3Job29kcyhjYWxsYmFjaykge1xuXHRcdC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuXHRcdERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yLCBudWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIG5laWdoYm9yaG9vZHNcblx0XHRcdFx0Y29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHVuaXF1ZU5laWdoYm9yaG9vZHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIGFsbCBjdWlzaW5lcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuXHRcdFx0XHRjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKTtcblx0XHRcdFx0Ly8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlQ3Vpc2luZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgdXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XG5cdFx0cmV0dXJuIChgLi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgc21hbGwgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIHNtYWxsSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX3NtYWxsfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIFJlc3RhdXJhbnQgbGFyZ2UgaW1hZ2UgVVJMLlxuICAgKi9cblx0c3RhdGljIGxhcmdlSW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBoX2xhcmdlfWApO1xuXHR9XG5cblx0LyoqXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cbiAgICovXG5cdHN0YXRpYyBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCkge1xuXHRcdGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0cG9zaXRpb246IHJlc3RhdXJhbnQubGF0bG5nLFxuXHRcdFx0dGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcblx0XHRcdHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcblx0XHRcdG1hcDogbWFwLFxuXHRcdFx0YW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUH1cblx0XHQpO1xuXHRcdHJldHVybiBtYXJrZXI7XG5cdH1cblxufVxuIl19
