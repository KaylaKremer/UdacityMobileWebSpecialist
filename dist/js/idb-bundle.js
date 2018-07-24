'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	function toArray(arr) {
		return Array.prototype.slice.call(arr);
	}

	function promisifyRequest(request) {
		return new Promise(function (resolve, reject) {
			request.onsuccess = function () {
				resolve(request.result);
			};

			request.onerror = function () {
				reject(request.error);
			};
		});
	}

	function promisifyRequestCall(obj, method, args) {
		var request;
		var p = new Promise(function (resolve, reject) {
			request = obj[method].apply(obj, args);
			promisifyRequest(request).then(resolve, reject);
		});

		p.request = request;
		return p;
	}

	function promisifyCursorRequestCall(obj, method, args) {
		var p = promisifyRequestCall(obj, method, args);
		return p.then(function (value) {
			if (!value) return;
			return new Cursor(value, p.request);
		});
	}

	function proxyProperties(ProxyClass, targetProp, properties) {
		properties.forEach(function (prop) {
			Object.defineProperty(ProxyClass.prototype, prop, {
				get: function get() {
					return this[targetProp][prop];
				},
				set: function set(val) {
					this[targetProp][prop] = val;
				}
			});
		});
	}

	function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
		properties.forEach(function (prop) {
			if (!(prop in Constructor.prototype)) return;
			ProxyClass.prototype[prop] = function () {
				return promisifyRequestCall(this[targetProp], prop, arguments);
			};
		});
	}

	function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
		properties.forEach(function (prop) {
			if (!(prop in Constructor.prototype)) return;
			ProxyClass.prototype[prop] = function () {
				return this[targetProp][prop].apply(this[targetProp], arguments);
			};
		});
	}

	function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
		properties.forEach(function (prop) {
			if (!(prop in Constructor.prototype)) return;
			ProxyClass.prototype[prop] = function () {
				return promisifyCursorRequestCall(this[targetProp], prop, arguments);
			};
		});
	}

	function Index(index) {
		this._index = index;
	}

	proxyProperties(Index, '_index', ['name', 'keyPath', 'multiEntry', 'unique']);

	proxyRequestMethods(Index, '_index', IDBIndex, ['get', 'getKey', 'getAll', 'getAllKeys', 'count']);

	proxyCursorRequestMethods(Index, '_index', IDBIndex, ['openCursor', 'openKeyCursor']);

	function Cursor(cursor, request) {
		this._cursor = cursor;
		this._request = request;
	}

	proxyProperties(Cursor, '_cursor', ['direction', 'key', 'primaryKey', 'value']);

	proxyRequestMethods(Cursor, '_cursor', IDBCursor, ['update', 'delete']);

	// proxy 'next' methods
	['advance', 'continue', 'continuePrimaryKey'].forEach(function (methodName) {
		if (!(methodName in IDBCursor.prototype)) return;
		Cursor.prototype[methodName] = function () {
			var cursor = this;
			var args = arguments;
			return Promise.resolve().then(function () {
				cursor._cursor[methodName].apply(cursor._cursor, args);
				return promisifyRequest(cursor._request).then(function (value) {
					if (!value) return;
					return new Cursor(value, cursor._request);
				});
			});
		};
	});

	function ObjectStore(store) {
		this._store = store;
	}

	ObjectStore.prototype.createIndex = function () {
		return new Index(this._store.createIndex.apply(this._store, arguments));
	};

	ObjectStore.prototype.index = function () {
		return new Index(this._store.index.apply(this._store, arguments));
	};

	proxyProperties(ObjectStore, '_store', ['name', 'keyPath', 'indexNames', 'autoIncrement']);

	proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, ['put', 'add', 'delete', 'clear', 'get', 'getAll', 'getKey', 'getAllKeys', 'count']);

	proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, ['openCursor', 'openKeyCursor']);

	proxyMethods(ObjectStore, '_store', IDBObjectStore, ['deleteIndex']);

	function Transaction(idbTransaction) {
		this._tx = idbTransaction;
		this.complete = new Promise(function (resolve, reject) {
			idbTransaction.oncomplete = function () {
				resolve();
			};
			idbTransaction.onerror = function () {
				reject(idbTransaction.error);
			};
			idbTransaction.onabort = function () {
				reject(idbTransaction.error);
			};
		});
	}

	Transaction.prototype.objectStore = function () {
		return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
	};

	proxyProperties(Transaction, '_tx', ['objectStoreNames', 'mode']);

	proxyMethods(Transaction, '_tx', IDBTransaction, ['abort']);

	function UpgradeDB(db, oldVersion, transaction) {
		this._db = db;
		this.oldVersion = oldVersion;
		this.transaction = new Transaction(transaction);
	}

	UpgradeDB.prototype.createObjectStore = function () {
		return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
	};

	proxyProperties(UpgradeDB, '_db', ['name', 'version', 'objectStoreNames']);

	proxyMethods(UpgradeDB, '_db', IDBDatabase, ['deleteObjectStore', 'close']);

	function DB(db) {
		this._db = db;
	}

	DB.prototype.transaction = function () {
		return new Transaction(this._db.transaction.apply(this._db, arguments));
	};

	proxyProperties(DB, '_db', ['name', 'version', 'objectStoreNames']);

	proxyMethods(DB, '_db', IDBDatabase, ['close']);

	// Add cursor iterators
	// TODO: remove this once browsers do the right thing with promises
	['openCursor', 'openKeyCursor'].forEach(function (funcName) {
		[ObjectStore, Index].forEach(function (Constructor) {
			// Don't create iterateKeyCursor if openKeyCursor doesn't exist.
			if (!(funcName in Constructor.prototype)) return;

			Constructor.prototype[funcName.replace('open', 'iterate')] = function () {
				var args = toArray(arguments);
				var callback = args[args.length - 1];
				var nativeObject = this._store || this._index;
				var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
				request.onsuccess = function () {
					callback(request.result);
				};
			};
		});
	});

	// polyfill getAll
	[Index, ObjectStore].forEach(function (Constructor) {
		if (Constructor.prototype.getAll) return;
		Constructor.prototype.getAll = function (query, count) {
			var instance = this;
			var items = [];

			return new Promise(function (resolve) {
				instance.iterateCursor(query, function (cursor) {
					if (!cursor) {
						resolve(items);
						return;
					}
					items.push(cursor.value);

					if (count !== undefined && items.length == count) {
						resolve(items);
						return;
					}
					cursor.continue();
				});
			});
		};
	});

	var exp = {
		open: function open(name, version, upgradeCallback) {
			var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
			var request = p.request;

			if (request) {
				request.onupgradeneeded = function (event) {
					if (upgradeCallback) {
						upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
					}
				};
			}

			return p.then(function (db) {
				return new DB(db);
			});
		},
		delete: function _delete(name) {
			return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
		}
	};

	if (typeof module !== 'undefined') {
		module.exports = exp;
		module.exports.default = module.exports;
	} else {
		self.idb = exp;
	}
})();
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
    * Static map image to be displayed when page initially loads.
    */

	}, {
		key: 'staticImageForMap',
		value: function staticImageForMap(restaurants) {
			var loc = {
				lat: 40.722216,
				lng: -73.987501
			};
			var staticMap = 'http://maps.googleapis.com/maps/api/staticmap?center=' + loc.lat + ',' + loc.lng + '&zoom=12&size=400x400&markers=color:red';
			restaurants.forEach(function (restaurant) {
				staticMap += '|' + restaurant.latlng.lat + ',' + restaurant.latlng.lng;
			});
			staticMap += '&key=AIzaSyByOElG6Eai0CEZ27dYL5Vw6NzJOt9FZAc';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkYi1idW5kbGUuanMiXSwibmFtZXMiOlsidG9BcnJheSIsImFyciIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwicHJvbWlzaWZ5UmVxdWVzdCIsInJlcXVlc3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uc3VjY2VzcyIsInJlc3VsdCIsIm9uZXJyb3IiLCJlcnJvciIsInByb21pc2lmeVJlcXVlc3RDYWxsIiwib2JqIiwibWV0aG9kIiwiYXJncyIsInAiLCJhcHBseSIsInRoZW4iLCJwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbCIsInZhbHVlIiwiQ3Vyc29yIiwicHJveHlQcm9wZXJ0aWVzIiwiUHJveHlDbGFzcyIsInRhcmdldFByb3AiLCJwcm9wZXJ0aWVzIiwiZm9yRWFjaCIsInByb3AiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInNldCIsInZhbCIsInByb3h5UmVxdWVzdE1ldGhvZHMiLCJDb25zdHJ1Y3RvciIsImFyZ3VtZW50cyIsInByb3h5TWV0aG9kcyIsInByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMiLCJJbmRleCIsImluZGV4IiwiX2luZGV4IiwiSURCSW5kZXgiLCJjdXJzb3IiLCJfY3Vyc29yIiwiX3JlcXVlc3QiLCJJREJDdXJzb3IiLCJtZXRob2ROYW1lIiwiT2JqZWN0U3RvcmUiLCJzdG9yZSIsIl9zdG9yZSIsImNyZWF0ZUluZGV4IiwiSURCT2JqZWN0U3RvcmUiLCJUcmFuc2FjdGlvbiIsImlkYlRyYW5zYWN0aW9uIiwiX3R4IiwiY29tcGxldGUiLCJvbmNvbXBsZXRlIiwib25hYm9ydCIsIm9iamVjdFN0b3JlIiwiSURCVHJhbnNhY3Rpb24iLCJVcGdyYWRlREIiLCJkYiIsIm9sZFZlcnNpb24iLCJ0cmFuc2FjdGlvbiIsIl9kYiIsImNyZWF0ZU9iamVjdFN0b3JlIiwiSURCRGF0YWJhc2UiLCJEQiIsImZ1bmNOYW1lIiwicmVwbGFjZSIsImNhbGxiYWNrIiwibGVuZ3RoIiwibmF0aXZlT2JqZWN0IiwiZ2V0QWxsIiwicXVlcnkiLCJjb3VudCIsImluc3RhbmNlIiwiaXRlbXMiLCJpdGVyYXRlQ3Vyc29yIiwicHVzaCIsInVuZGVmaW5lZCIsImNvbnRpbnVlIiwiZXhwIiwib3BlbiIsIm5hbWUiLCJ2ZXJzaW9uIiwidXBncmFkZUNhbGxiYWNrIiwiaW5kZXhlZERCIiwib251cGdyYWRlbmVlZGVkIiwiZXZlbnQiLCJkZWxldGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVmYXVsdCIsInNlbGYiLCJpZGIiLCJEQkhlbHBlciIsImlkIiwiZGJQcm9taXNlIiwidXBncmFkZURCIiwia2V5UGF0aCIsInJlc3RhdXJhbnRVUkwiLCJEQVRBQkFTRV9VUkwiLCJmZXRjaCIsInJlc3BvbnNlIiwib2siLCJqc29uIiwidHgiLCJyZXN0YXVyYW50UmV2aWV3c1N0b3JlIiwicmVzdGF1cmFudFJldmlld3MiLCJwdXQiLCJyZXN0YXVyYW50UmV2aWV3IiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3RhdXJhbnRzIiwicmVzdGF1cmFudCIsImZpbmQiLCJyIiwicGFyc2VJbnQiLCJjdWlzaW5lIiwicmVzdWx0cyIsImZpbHRlciIsImN1aXNpbmVfdHlwZSIsIm5laWdoYm9yaG9vZCIsIm5laWdoYm9yaG9vZHMiLCJtYXAiLCJ2IiwiaSIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGhfc21hbGwiLCJwaG90b2dyYXBoX2xhcmdlIiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJ1cmwiLCJ1cmxGb3JSZXN0YXVyYW50IiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsImxvYyIsImxhdCIsImxuZyIsInN0YXRpY01hcCIsInBvcnQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQyxhQUFXO0FB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QUM5QyxPQUFNUyxTQUFTLElBQUlDLE9BQU9DLElBQVAsQ0FBWUMsTUFBaEIsQ0FBdUI7QUFDckNDLGNBQVV2QixXQUFXd0IsTUFEZ0I7QUFFckNDLFdBQU96QixXQUFXakMsSUFGbUI7QUFHckMyRCxTQUFLL0MsU0FBU2dELGdCQUFULENBQTBCM0IsVUFBMUIsQ0FIZ0M7QUFJckNVLFNBQUtBLEdBSmdDO0FBS3JDa0IsZUFBV1IsT0FBT0MsSUFBUCxDQUFZUSxTQUFaLENBQXNCQyxJQUxJLEVBQXZCLENBQWY7QUFPQSxVQUFPWCxNQUFQO0FBQ0E7O0FBRUQ7Ozs7OztvQ0FHeUJwQixXLEVBQWE7QUFDckMsT0FBSWdDLE1BQU07QUFDVEMsU0FBSyxTQURJO0FBRVRDLFNBQUssQ0FBQztBQUZHLElBQVY7QUFJQSxPQUFJQyxzRUFDSEgsSUFBSUMsR0FERCxTQUNRRCxJQUFJRSxHQURaLDRDQUFKO0FBRUFsQyxlQUFZMUYsT0FBWixDQUFvQixzQkFBYztBQUNqQzZILHVCQUFpQmxDLFdBQVd3QixNQUFYLENBQWtCUSxHQUFuQyxTQUEwQ2hDLFdBQVd3QixNQUFYLENBQWtCUyxHQUE1RDtBQUNBLElBRkQ7QUFHQUM7QUFDQSxVQUFPQSxTQUFQO0FBQ0E7Ozs7O0FBdE5EOzs7O3NCQUkwQjtBQUN6QixPQUFNQyxPQUFPLElBQWIsQ0FEeUIsQ0FDTjtBQUNuQixnQ0FBMkJBLElBQTNCO0FBQ0EiLCJmaWxlIjoiaWRiLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCkge1xuXHRmdW5jdGlvbiB0b0FycmF5KGFycikge1xuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XG5cdFx0dmFyIHJlcXVlc3Q7XG5cdFx0dmFyIHAgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHJlcXVlc3QgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIGFyZ3MpO1xuXHRcdFx0cHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG5cdFx0fSk7XG5cblx0XHRwLnJlcXVlc3QgPSByZXF1ZXN0O1xuXHRcdHJldHVybiBwO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJvbWlzaWZ5Q3Vyc29yUmVxdWVzdENhbGwob2JqLCBtZXRob2QsIGFyZ3MpIHtcblx0XHR2YXIgcCA9IHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKTtcblx0XHRyZXR1cm4gcC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIXZhbHVlKSByZXR1cm47XG5cdFx0XHRyZXR1cm4gbmV3IEN1cnNvcih2YWx1ZSwgcC5yZXF1ZXN0KTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByb3h5UHJvcGVydGllcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBwcm9wZXJ0aWVzKSB7XG5cdFx0cHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eUNsYXNzLnByb3RvdHlwZSwgcHJvcCwge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuXHRcdFx0XHRcdHRoaXNbdGFyZ2V0UHJvcF1bcHJvcF0gPSB2YWw7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJveHlSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuXHRcdHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcblx0XHRcdFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHByb3h5TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuXHRcdHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcblx0XHRcdFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuXHRcdHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0XHRpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcblx0XHRcdFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIEluZGV4KGluZGV4KSB7XG5cdFx0dGhpcy5faW5kZXggPSBpbmRleDtcblx0fVxuXG5cdHByb3h5UHJvcGVydGllcyhJbmRleCwgJ19pbmRleCcsIFtcblx0XHQnbmFtZScsXG5cdFx0J2tleVBhdGgnLFxuXHRcdCdtdWx0aUVudHJ5Jyxcblx0XHQndW5pcXVlJ1xuXHRdKTtcblxuXHRwcm94eVJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcblx0XHQnZ2V0Jyxcblx0XHQnZ2V0S2V5Jyxcblx0XHQnZ2V0QWxsJyxcblx0XHQnZ2V0QWxsS2V5cycsXG5cdFx0J2NvdW50J1xuXHRdKTtcblxuXHRwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcblx0XHQnb3BlbkN1cnNvcicsXG5cdFx0J29wZW5LZXlDdXJzb3InXG5cdF0pO1xuXG5cdGZ1bmN0aW9uIEN1cnNvcihjdXJzb3IsIHJlcXVlc3QpIHtcblx0XHR0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG5cdFx0dGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG5cdH1cblxuXHRwcm94eVByb3BlcnRpZXMoQ3Vyc29yLCAnX2N1cnNvcicsIFtcblx0XHQnZGlyZWN0aW9uJyxcblx0XHQna2V5Jyxcblx0XHQncHJpbWFyeUtleScsXG5cdFx0J3ZhbHVlJ1xuXHRdKTtcblxuXHRwcm94eVJlcXVlc3RNZXRob2RzKEN1cnNvciwgJ19jdXJzb3InLCBJREJDdXJzb3IsIFtcblx0XHQndXBkYXRlJyxcblx0XHQnZGVsZXRlJ1xuXHRdKTtcblxuXHQvLyBwcm94eSAnbmV4dCcgbWV0aG9kc1xuXHRbJ2FkdmFuY2UnLCAnY29udGludWUnLCAnY29udGludWVQcmltYXJ5S2V5J10uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG5cdFx0aWYgKCEobWV0aG9kTmFtZSBpbiBJREJDdXJzb3IucHJvdG90eXBlKSkgcmV0dXJuO1xuXHRcdEN1cnNvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjdXJzb3IgPSB0aGlzO1xuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0Y3Vyc29yLl9jdXJzb3JbbWV0aG9kTmFtZV0uYXBwbHkoY3Vyc29yLl9jdXJzb3IsIGFyZ3MpO1xuXHRcdFx0XHRyZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChjdXJzb3IuX3JlcXVlc3QpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0XHRpZiAoIXZhbHVlKSByZXR1cm47XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBDdXJzb3IodmFsdWUsIGN1cnNvci5fcmVxdWVzdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gT2JqZWN0U3RvcmUoc3RvcmUpIHtcblx0XHR0aGlzLl9zdG9yZSA9IHN0b3JlO1xuXHR9XG5cblx0T2JqZWN0U3RvcmUucHJvdG90eXBlLmNyZWF0ZUluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5jcmVhdGVJbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0T2JqZWN0U3RvcmUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5pbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG5cdH07XG5cblx0cHJveHlQcm9wZXJ0aWVzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgW1xuXHRcdCduYW1lJyxcblx0XHQna2V5UGF0aCcsXG5cdFx0J2luZGV4TmFtZXMnLFxuXHRcdCdhdXRvSW5jcmVtZW50J1xuXHRdKTtcblxuXHRwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcblx0XHQncHV0Jyxcblx0XHQnYWRkJyxcblx0XHQnZGVsZXRlJyxcblx0XHQnY2xlYXInLFxuXHRcdCdnZXQnLFxuXHRcdCdnZXRBbGwnLFxuXHRcdCdnZXRLZXknLFxuXHRcdCdnZXRBbGxLZXlzJyxcblx0XHQnY291bnQnXG5cdF0pO1xuXG5cdHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xuXHRcdCdvcGVuQ3Vyc29yJyxcblx0XHQnb3BlbktleUN1cnNvcidcblx0XSk7XG5cblx0cHJveHlNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcblx0XHQnZGVsZXRlSW5kZXgnXG5cdF0pO1xuXG5cdGZ1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKSB7XG5cdFx0dGhpcy5fdHggPSBpZGJUcmFuc2FjdGlvbjtcblx0XHR0aGlzLmNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdH07XG5cdFx0XHRpZGJUcmFuc2FjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcik7XG5cdFx0XHR9O1xuXHRcdFx0aWRiVHJhbnNhY3Rpb24ub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZWplY3QoaWRiVHJhbnNhY3Rpb24uZXJyb3IpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdFRyYW5zYWN0aW9uLnByb3RvdHlwZS5vYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fdHgub2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fdHgsIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdHByb3h5UHJvcGVydGllcyhUcmFuc2FjdGlvbiwgJ190eCcsIFtcblx0XHQnb2JqZWN0U3RvcmVOYW1lcycsXG5cdFx0J21vZGUnXG5cdF0pO1xuXG5cdHByb3h5TWV0aG9kcyhUcmFuc2FjdGlvbiwgJ190eCcsIElEQlRyYW5zYWN0aW9uLCBbXG5cdFx0J2Fib3J0J1xuXHRdKTtcblxuXHRmdW5jdGlvbiBVcGdyYWRlREIoZGIsIG9sZFZlcnNpb24sIHRyYW5zYWN0aW9uKSB7XG5cdFx0dGhpcy5fZGIgPSBkYjtcblx0XHR0aGlzLm9sZFZlcnNpb24gPSBvbGRWZXJzaW9uO1xuXHRcdHRoaXMudHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pO1xuXHR9XG5cblx0VXBncmFkZURCLnByb3RvdHlwZS5jcmVhdGVPYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fZGIuY3JlYXRlT2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdHByb3h5UHJvcGVydGllcyhVcGdyYWRlREIsICdfZGInLCBbXG5cdFx0J25hbWUnLFxuXHRcdCd2ZXJzaW9uJyxcblx0XHQnb2JqZWN0U3RvcmVOYW1lcydcblx0XSk7XG5cblx0cHJveHlNZXRob2RzKFVwZ3JhZGVEQiwgJ19kYicsIElEQkRhdGFiYXNlLCBbXG5cdFx0J2RlbGV0ZU9iamVjdFN0b3JlJyxcblx0XHQnY2xvc2UnXG5cdF0pO1xuXG5cdGZ1bmN0aW9uIERCKGRiKSB7XG5cdFx0dGhpcy5fZGIgPSBkYjtcblx0fVxuXG5cdERCLnByb3RvdHlwZS50cmFuc2FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBuZXcgVHJhbnNhY3Rpb24odGhpcy5fZGIudHJhbnNhY3Rpb24uYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuXHR9O1xuXG5cdHByb3h5UHJvcGVydGllcyhEQiwgJ19kYicsIFtcblx0XHQnbmFtZScsXG5cdFx0J3ZlcnNpb24nLFxuXHRcdCdvYmplY3RTdG9yZU5hbWVzJ1xuXHRdKTtcblxuXHRwcm94eU1ldGhvZHMoREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xuXHRcdCdjbG9zZSdcblx0XSk7XG5cblx0Ly8gQWRkIGN1cnNvciBpdGVyYXRvcnNcblx0Ly8gVE9ETzogcmVtb3ZlIHRoaXMgb25jZSBicm93c2VycyBkbyB0aGUgcmlnaHQgdGhpbmcgd2l0aCBwcm9taXNlc1xuXHRbJ29wZW5DdXJzb3InLCAnb3BlbktleUN1cnNvciddLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpIHtcblx0XHRbT2JqZWN0U3RvcmUsIEluZGV4XS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG5cdFx0XHQvLyBEb24ndCBjcmVhdGUgaXRlcmF0ZUtleUN1cnNvciBpZiBvcGVuS2V5Q3Vyc29yIGRvZXNuJ3QgZXhpc3QuXG5cdFx0XHRpZiAoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG5cblx0XHRcdENvbnN0cnVjdG9yLnByb3RvdHlwZVtmdW5jTmFtZS5yZXBsYWNlKCdvcGVuJywgJ2l0ZXJhdGUnKV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cyk7XG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblx0XHRcdFx0dmFyIG5hdGl2ZU9iamVjdCA9IHRoaXMuX3N0b3JlIHx8IHRoaXMuX2luZGV4O1xuXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LCBhcmdzLnNsaWNlKDAsIC0xKSk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2socmVxdWVzdC5yZXN1bHQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fSk7XG5cblx0Ly8gcG9seWZpbGwgZ2V0QWxsXG5cdFtJbmRleCwgT2JqZWN0U3RvcmVdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcblx0XHRpZiAoQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEFsbCkgcmV0dXJuO1xuXHRcdENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihxdWVyeSwgY291bnQpIHtcblx0XHRcdHZhciBpbnN0YW5jZSA9IHRoaXM7XG5cdFx0XHR2YXIgaXRlbXMgPSBbXTtcblxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcblx0XHRcdFx0aW5zdGFuY2UuaXRlcmF0ZUN1cnNvcihxdWVyeSwgZnVuY3Rpb24oY3Vyc29yKSB7XG5cdFx0XHRcdFx0aWYgKCFjdXJzb3IpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoaXRlbXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSk7XG5cblx0XHRcdFx0XHRpZiAoY291bnQgIT09IHVuZGVmaW5lZCAmJiBpdGVtcy5sZW5ndGggPT0gY291bnQpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoaXRlbXMpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjdXJzb3IuY29udGludWUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHR9KTtcblxuXHR2YXIgZXhwID0ge1xuXHRcdG9wZW46IGZ1bmN0aW9uKG5hbWUsIHZlcnNpb24sIHVwZ3JhZGVDYWxsYmFjaykge1xuXHRcdFx0dmFyIHAgPSBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsICdvcGVuJywgW25hbWUsIHZlcnNpb25dKTtcblx0XHRcdHZhciByZXF1ZXN0ID0gcC5yZXF1ZXN0O1xuXG5cdFx0XHRpZiAocmVxdWVzdCkge1xuXHRcdFx0XHRyZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKHVwZ3JhZGVDYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0dXBncmFkZUNhbGxiYWNrKG5ldyBVcGdyYWRlREIocmVxdWVzdC5yZXN1bHQsIGV2ZW50Lm9sZFZlcnNpb24sIHJlcXVlc3QudHJhbnNhY3Rpb24pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwLnRoZW4oZnVuY3Rpb24oZGIpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBEQihkYik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGRlbGV0ZTogZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0cmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKGluZGV4ZWREQiwgJ2RlbGV0ZURhdGFiYXNlJywgW25hbWVdKTtcblx0XHR9XG5cdH07XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHA7XG5cdFx0bW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHNlbGYuaWRiID0gZXhwO1xuXHR9XG59KCkpO1xuLyoqXG4gKiBDb21tb24gZGF0YWJhc2UgaGVscGVyIGZ1bmN0aW9ucy5cbiAqL1xuY2xhc3MgREJIZWxwZXIge1xuXHRcblx0LyoqXG4gICAqIERhdGFiYXNlIFVSTC5cbiAgICogQ2hhbmdlZCB0byByZXRyaWV2ZSBkYXRhIGZyb20gdGhlIHNlcnZlciBvbiBsb2NhbGhvc3Q6MTMzNy5cbiAgICovXG5cdHN0YXRpYyBnZXQgREFUQUJBU0VfVVJMKCkge1xuXHRcdGNvbnN0IHBvcnQgPSAxMzM3OyAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XG5cdFx0cmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vcmVzdGF1cmFudHNgO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoZXMgYWxsIHJlc3RhdXJhbnQgcmV2aWV3cyBkYXRhLiBDcmVhdGVzIGFuIEluZGV4ZWREQiBkYXRhYmFzZSBuYW1lZCAncmVzdGF1cmFudC1yZXZpZXdzLWRiJyB3aXRoIGFuIG9iamVjdCBzdG9yZSBvZiAncmVzdGF1cmFudC1yZXZpZXdzJy4gSWYgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGlzIG9rLCBzdG9yZXMgZGF0YSByZWNlaXZlZCBpbnRvIHRoZSBkYXRhYmFzZSBhbmQgdGhlbiByZXR1cm5zIHRoZSBkYXRhLiBJZiByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgZmFpbHMsIGxvb2sgaW4gdGhlIGRhdGFiYXNlIHRvIHNlZSBpZiB0aGVyZSBpcyBkYXRhIGFscmVhZHkgc3RvcmVkIHRoZXJlIGFuZCByZXR1cm4gdGhlIGRhdGEuIENhdGNoZXMgYW5kIGhhbmRsZXMgZXJyb3JzIGFwcHJvcHJpYXRlbHkgd2hlbiBkYXRhIGNhbm5vdCBiZSByZXRyaWV2ZWQuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cyhjYWxsYmFjaywgaWQpIHtcblx0XHRjb25zdCBkYlByb21pc2UgPSBpZGIub3BlbigncmVzdGF1cmFudC1yZXZpZXdzLWRiJywgMSwgdXBncmFkZURCID0+IHtcblx0XHRcdHN3aXRjaCAodXBncmFkZURCLm9sZFZlcnNpb24pe1xuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHR1cGdyYWRlREIuY3JlYXRlT2JqZWN0U3RvcmUoJ3Jlc3RhdXJhbnQtcmV2aWV3cycsIHtrZXlQYXRoOiAnaWQnfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bGV0IHJlc3RhdXJhbnRVUkw7XG5cdFx0aWQgPyByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfVVJMfS8ke2lkfWAgOiByZXN0YXVyYW50VVJMID0gYCR7REJIZWxwZXIuREFUQUJBU0VfVVJMfWA7XG5cdFx0ZmV0Y2gocmVzdGF1cmFudFVSTCkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZS5vayl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCkudGhlbihyZXN0YXVyYW50UmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0ZGJQcm9taXNlLnRoZW4oZGIgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudC1yZXZpZXdzJywgJ3JlYWR3cml0ZScpO1xuXHRcdFx0XHRcdFx0bGV0IHJlc3RhdXJhbnRSZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudC1yZXZpZXdzJyk7XG5cdFx0XHRcdFx0XHRyZXN0YXVyYW50UmV2aWV3cy5mb3JFYWNoKHJlc3RhdXJhbnRSZXZpZXcgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXN0YXVyYW50UmV2aWV3c1N0b3JlLnB1dChyZXN0YXVyYW50UmV2aWV3KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIHJlc3RhdXJhbnRSZXZpZXdzU3RvcmUuZ2V0QWxsKCk7XG5cdFx0XHRcdFx0fSkudGhlbihyZXN0YXVyYW50UmV2aWV3cyA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgU3VjZXNzZnVsbHkgZmV0Y2hlZCBkYXRhIGZyb20gc2VydmVyICYgc3RvcmVkIGluIEluZGV4ZWREQiFgKTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnRSZXZpZXdzKTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhgRmFpbGVkIHRvIGZldGNoIGRhdGEgZnJvbSBzZXJ2ZXIgJiBzdG9yZSBuIEluZGV4ZWREQjogJHtlcnJvcn1gLCBudWxsKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkYlByb21pc2UudGhlbihkYiA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzdGF1cmFudC1yZXZpZXdzJywgJ3JlYWRvbmx5Jyk7XG5cdFx0XHRcdFx0bGV0IHJlc3RhdXJhbnRSZXZpZXdzU3RvcmUgPSB0eC5vYmplY3RTdG9yZSgncmVzdGF1cmFudC1yZXZpZXdzJyk7XG5cdFx0XHRcdFx0Ly9pZiAocmVzdGF1cmFudFJldmlld3NTdG9yZXMuZ2V0QWxsKCkpXG5cdFx0XHRcdFx0cmV0dXJuIHR4LmNvbXBsZXRlICYmIHJlc3RhdXJhbnRSZXZpZXdzU3RvcmUuZ2V0QWxsKCk7XG5cdFx0XHRcdH0pLnRoZW4ocmVzdGF1cmFudFJldmlld3MgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBTdWNlc3NmdWxseSBmZXRjaGVkIGRhdGEgZnJvbSBJbmRleGVkREIhYCk7XG5cdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudFJldmlld3MpO1xuXHRcdFx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soYEZhaWxlZCB0byBmZXRjaCBkYXRhIGZyb20gSW5kZXhlZERCOiAke2Vycm9yfWAsIG51bGwpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KS5jYXRjaChlcnJvciA9PiB7XG5cdFx0XHRjYWxsYmFjayhgRmV0Y2ggcmVxdWVzdCBmb3IgZGF0YSBmcm9tIHNlcnZlciBmYWlsZWQ6ICR7ZXJyb3J9YCwgbnVsbCk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xuXHRcdC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT09IHBhcnNlSW50KGlkKSk7XG5cdFx0XHRcdGlmIChyZXN0YXVyYW50KSB7IC8vIEdvdCB0aGUgcmVzdGF1cmFudFxuXHRcdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xuXHRcdFx0XHR9IGVsc2UgeyAvLyBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBkYXRhYmFzZVxuXHRcdFx0XHRcdGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG5cdHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBuZWlnaGJvcmhvb2Rcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSBhbmQgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzO1xuXHRcdFx0XHRpZiAoY3Vpc2luZSAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuZWlnaGJvcmhvb2QgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxuXHRcdFx0XHRcdHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuXHRzdGF0aWMgZmV0Y2hOZWlnaGJvcmhvb2RzKGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyb3IsIG51bGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XG5cdFx0XHRcdC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gbmVpZ2hib3Job29kc1xuXHRcdFx0XHRjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PSBpKTtcblx0XHRcdFx0Y2FsbGJhY2sobnVsbCwgdW5pcXVlTmVpZ2hib3Job29kcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxuICAgKi9cblx0c3RhdGljIGZldGNoQ3Vpc2luZXMoY2FsbGJhY2spIHtcblx0XHQvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcblx0XHREQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBHZXQgYWxsIGN1aXNpbmVzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG5cdFx0XHRcdGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xuXHRcdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXG5cdFx0XHRcdGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09IGkpO1xuXHRcdFx0XHRjYWxsYmFjayhudWxsLCB1bmlxdWVDdWlzaW5lcyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cbiAgICovXG5cdHN0YXRpYyB1cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcblx0XHRyZXR1cm4gKGAuL3Jlc3RhdXJhbnQuaHRtbD9pZD0ke3Jlc3RhdXJhbnQuaWR9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBzbWFsbCBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgc21hbGxJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfc21hbGx9YCk7XG5cdH1cblxuXHQvKipcbiAgICogUmVzdGF1cmFudCBsYXJnZSBpbWFnZSBVUkwuXG4gICAqL1xuXHRzdGF0aWMgbGFyZ2VJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuXHRcdHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGhfbGFyZ2V9YCk7XG5cdH1cblxuXHQvKipcbiAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxuICAgKi9cblx0c3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XG5cdFx0Y29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXG5cdFx0XHR0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuXHRcdFx0dXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxuXHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QfVxuXHRcdCk7XG5cdFx0cmV0dXJuIG1hcmtlcjtcblx0fVxuXG5cdC8qKlxuICAgKiBTdGF0aWMgbWFwIGltYWdlIHRvIGJlIGRpc3BsYXllZCB3aGVuIHBhZ2UgaW5pdGlhbGx5IGxvYWRzLlxuICAgKi9cblx0c3RhdGljIHN0YXRpY0ltYWdlRm9yTWFwKHJlc3RhdXJhbnRzKSB7XG5cdFx0bGV0IGxvYyA9IHtcblx0XHRcdGxhdDogNDAuNzIyMjE2LFxuXHRcdFx0bG5nOiAtNzMuOTg3NTAxXG5cdFx0fTtcblx0XHRsZXQgc3RhdGljTWFwID0gYGh0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0YXRpY21hcD9jZW50ZXI9JHtcblx0XHRcdGxvYy5sYXR9LCR7bG9jLmxuZ30mem9vbT0xMiZzaXplPTQwMHg0MDAmbWFya2Vycz1jb2xvcjpyZWRgO1xuXHRcdHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XG5cdFx0XHRzdGF0aWNNYXAgKz0gYHwke3Jlc3RhdXJhbnQubGF0bG5nLmxhdH0sJHtyZXN0YXVyYW50LmxhdGxuZy5sbmd9YDtcblx0XHR9KTtcblx0XHRzdGF0aWNNYXAgKz0gYCZrZXk9QUl6YVN5QnlPRWxHNkVhaTBDRVoyN2RZTDVWdzZOekpPdDlGWkFjYDtcblx0XHRyZXR1cm4gc3RhdGljTWFwO1xuXHR9XG59Il19
