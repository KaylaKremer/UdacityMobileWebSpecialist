(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
        }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];return o(n || r);
        }, p, p.exports, r, e, n, t);
      }return n[i].exports;
    }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }return o;
  }return r;
})()({ 1: [function (require, module, exports) {
    "use strict";

    (function () {
      function r(e, n, t) {
        function o(i, f) {
          if (!n[i]) {
            if (!e[i]) {
              var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
            }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
              var n = e[i][1][r];return o(n || r);
            }, p, p.exports, r, e, n, t);
          }return n[i].exports;
        }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
          o(t[i]);
        }return o;
      }return r;
    })()({ 1: [function (require, module, exports) {
        "use strict";

        (function () {
          function r(e, n, t) {
            function o(i, f) {
              if (!n[i]) {
                if (!e[i]) {
                  var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                  var n = e[i][1][r];return o(n || r);
                }, p, p.exports, r, e, n, t);
              }return n[i].exports;
            }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
              o(t[i]);
            }return o;
          }return r;
        })()({ 1: [function (require, module, exports) {
            "use strict";

            (function () {
              function r(e, n, t) {
                function o(i, f) {
                  if (!n[i]) {
                    if (!e[i]) {
                      var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                    }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                      var n = e[i][1][r];return o(n || r);
                    }, p, p.exports, r, e, n, t);
                  }return n[i].exports;
                }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
                  o(t[i]);
                }return o;
              }return r;
            })()({ 1: [function (require, module, exports) {
                "use strict";

                (function () {
                  function r(e, n, t) {
                    function o(i, f) {
                      if (!n[i]) {
                        if (!e[i]) {
                          var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                        }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                          var n = e[i][1][r];return o(n || r);
                        }, p, p.exports, r, e, n, t);
                      }return n[i].exports;
                    }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
                      o(t[i]);
                    }return o;
                  }return r;
                })()({ 1: [function (require, module, exports) {
                    "use strict";

                    var _idb = require("idb");var _idb2 = _interopRequireDefault(_idb);function _interopRequireDefault(obj) {
                      return obj && obj.__esModule ? obj : { default: obj };
                    } // Establish version number of cache to remove outdated caches during an update
                    var cacheVersion = "v3"; // Created IndexedDB database
                    // Import IndexedDB
                    var dbPromise = _idb2.default.open("restaurant-reviews-db", 1, function (upgradeDB) {
                      switch (upgradeDB.oldVersion) {case 0:
                          upgradeDB.createObjectStore("restaurants-reviews", { keyPath: "id" });}
                    }); // Assets to cache for offline use
                    var cacheAssets = ["/", "/index.html", "/restaurant.html", "/restaurant.html?id=1", "/restaurant.html?id=2", "/restaurant.html?id=3", "/restaurant.html?id=4", "/restaurant.html?id=5", "/restaurant.html?id=6", "/restaurant.html?id=7", "/restaurant.html?id=8", "/restaurant.html?id=9", "/restaurant.html?id=10", "/css/styles.css", "/js/dbhelper.js", "/js/index.js", "/js/main.js", "/js/restaurant_info.js", "/img/1_large.jpg", "/img/2_large.jpg", "/img/3_large.jpg", "/img/4_large.jpg", "/img/5_large.jpg", "/img/6_large.jpg", "/img/7_large.jpg", "/img/8_large.jpg", "/img/9_large.jpg", "/img/10_large.jpg", "/img/1_small.jpg", "/img/2_small.jpg", "/img/3_small.jpg", "/img/4_small.jpg", "/img/5_small.jpg", "/img/6_small.jpg", "/img/7_small.jpg", "/img/8_small.jpg", "/img/9_small.jpg", "/img/10_small.jpg"]; // Installs a service worker and caches assets with current cache version as its name.
                    self.addEventListener("install", function (event) {
                      event.waitUntil(caches.open(cacheVersion + "-restaurant-reviews").then(function (cache) {
                        return cache.addAll(cacheAssets);
                      }).catch(function (error) {
                        console.log("Cache install failed: " + error);
                      }));console.log("Installed service worker and cached assets");
                    }); /* Updates the service worker with a newer version (if available in a waiting state). Activate fires once older service worker no longer controls current pages. Older cache(s) is also deleted. */self.addEventListener("activate", function (event) {
                      event.waitUntil(caches.keys().then(function (cacheNames) {
                        return Promise.all(cacheNames.filter(function (cacheName) {
                          return !cacheName.startsWith(cacheVersion);
                        }).map(function (cacheName) {
                          return caches.delete(cacheName);
                        }));
                      }));console.log("Deleted old cache and activated new service worker");
                    }); /* Code below is WIP */self.addEventListener("fetch", function (event) {
                      var requestURL = new URL(event.request.url);if (requestURL.port === "1337") {
                        console.log(requestURL.searchParams);if (requestURL.searchParams.get("id")) {
                          var id = requestURL.searchParams.get("id");console.log("id", id);handleIndexedDBRequest(event, id);
                        } else {
                          var _id = "0";console.log("id", _id);handleIndexedDBRequest(event, _id);
                        }
                      } else {
                        handleCacheRequest(event);
                      }
                    });function handleIndexedDBRequest(event, id) {
                      event.respondWith(dbPromise.then(function (db) {
                        var tx = db.transaction("restaurant-reviews");var restaurantReviewsStore = tx.objectStore("restaurant-reviews");return restaurantReviewsStore.get(id);
                      }).then(function (restaurantReview) {
                        if (restaurantReview.data) {
                          return restaurantReview.data;
                        } else {
                          fetch(event.request).then(function (fetchedRestaurantReview) {
                            fetchedRestaurantReview.json();
                          }).then(function (restaurantReview) {
                            return dbPromise.then(function (db) {
                              var tx = db.transaction("restaurant-reviews", "readwrite");var restaurantReviewsStore = tx.objectStore("restaurant-reviews");restaurantReviewsStore.put({ id: id, data: restaurantReview });return restaurantReview;
                            });
                          }).then(function (response) {
                            console.log(response);
                          }).catch(function (error) {
                            console.log("Failed to retrieve data from server: " + error);
                          });
                        }
                      }).catch(function (error) {
                        console.log("Failed to retrieve data from IndexedDB: " + error);
                      }));
                    }function handleCacheRequest(event) {
                      event.respondWith(caches.match(event.request).then(function (response) {
                        if (response) {
                          console.log("Found " + event.request.url + " in cache");return response;
                        }var fetchRequest = event.request.clone();console.log("Network request for " + event.request.url);return fetch(fetchRequest).then(function (response) {
                          if (!response || response.status !== 200 || response.type !== "basic") {
                            return response;
                          }var responseToCache = response.clone();caches.open(cacheVersion + "-restaurant-reviews").then(function (cache) {
                            cache.put(event.request, responseToCache);
                          });return response;
                        });
                      }));
                    }
                  }, { "idb": 2 }], 2: [function (require, module, exports) {
                    "use strict";

                    (function () {
                      function toArray(arr) {
                        return Array.prototype.slice.call(arr);
                      }function promisifyRequest(request) {
                        return new Promise(function (resolve, reject) {
                          request.onsuccess = function () {
                            resolve(request.result);
                          };request.onerror = function () {
                            reject(request.error);
                          };
                        });
                      }function promisifyRequestCall(obj, method, args) {
                        var request;var p = new Promise(function (resolve, reject) {
                          request = obj[method].apply(obj, args);promisifyRequest(request).then(resolve, reject);
                        });p.request = request;return p;
                      }function promisifyCursorRequestCall(obj, method, args) {
                        var p = promisifyRequestCall(obj, method, args);return p.then(function (value) {
                          if (!value) return;return new Cursor(value, p.request);
                        });
                      }function proxyProperties(ProxyClass, targetProp, properties) {
                        properties.forEach(function (prop) {
                          Object.defineProperty(ProxyClass.prototype, prop, { get: function get() {
                              return this[targetProp][prop];
                            }, set: function set(val) {
                              this[targetProp][prop] = val;
                            } });
                        });
                      }function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
                        properties.forEach(function (prop) {
                          if (!(prop in Constructor.prototype)) return;ProxyClass.prototype[prop] = function () {
                            return promisifyRequestCall(this[targetProp], prop, arguments);
                          };
                        });
                      }function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
                        properties.forEach(function (prop) {
                          if (!(prop in Constructor.prototype)) return;ProxyClass.prototype[prop] = function () {
                            return this[targetProp][prop].apply(this[targetProp], arguments);
                          };
                        });
                      }function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
                        properties.forEach(function (prop) {
                          if (!(prop in Constructor.prototype)) return;ProxyClass.prototype[prop] = function () {
                            return promisifyCursorRequestCall(this[targetProp], prop, arguments);
                          };
                        });
                      }function Index(index) {
                        this._index = index;
                      }proxyProperties(Index, "_index", ["name", "keyPath", "multiEntry", "unique"]);proxyRequestMethods(Index, "_index", IDBIndex, ["get", "getKey", "getAll", "getAllKeys", "count"]);proxyCursorRequestMethods(Index, "_index", IDBIndex, ["openCursor", "openKeyCursor"]);function Cursor(cursor, request) {
                        this._cursor = cursor;this._request = request;
                      }proxyProperties(Cursor, "_cursor", ["direction", "key", "primaryKey", "value"]);proxyRequestMethods(Cursor, "_cursor", IDBCursor, ["update", "delete"]); // proxy 'next' methods
                      ["advance", "continue", "continuePrimaryKey"].forEach(function (methodName) {
                        if (!(methodName in IDBCursor.prototype)) return;Cursor.prototype[methodName] = function () {
                          var cursor = this;var args = arguments;return Promise.resolve().then(function () {
                            cursor._cursor[methodName].apply(cursor._cursor, args);return promisifyRequest(cursor._request).then(function (value) {
                              if (!value) return;return new Cursor(value, cursor._request);
                            });
                          });
                        };
                      });function ObjectStore(store) {
                        this._store = store;
                      }ObjectStore.prototype.createIndex = function () {
                        return new Index(this._store.createIndex.apply(this._store, arguments));
                      };ObjectStore.prototype.index = function () {
                        return new Index(this._store.index.apply(this._store, arguments));
                      };proxyProperties(ObjectStore, "_store", ["name", "keyPath", "indexNames", "autoIncrement"]);proxyRequestMethods(ObjectStore, "_store", IDBObjectStore, ["put", "add", "delete", "clear", "get", "getAll", "getKey", "getAllKeys", "count"]);proxyCursorRequestMethods(ObjectStore, "_store", IDBObjectStore, ["openCursor", "openKeyCursor"]);proxyMethods(ObjectStore, "_store", IDBObjectStore, ["deleteIndex"]);function Transaction(idbTransaction) {
                        this._tx = idbTransaction;this.complete = new Promise(function (resolve, reject) {
                          idbTransaction.oncomplete = function () {
                            resolve();
                          };idbTransaction.onerror = function () {
                            reject(idbTransaction.error);
                          };idbTransaction.onabort = function () {
                            reject(idbTransaction.error);
                          };
                        });
                      }Transaction.prototype.objectStore = function () {
                        return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
                      };proxyProperties(Transaction, "_tx", ["objectStoreNames", "mode"]);proxyMethods(Transaction, "_tx", IDBTransaction, ["abort"]);function UpgradeDB(db, oldVersion, transaction) {
                        this._db = db;this.oldVersion = oldVersion;this.transaction = new Transaction(transaction);
                      }UpgradeDB.prototype.createObjectStore = function () {
                        return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
                      };proxyProperties(UpgradeDB, "_db", ["name", "version", "objectStoreNames"]);proxyMethods(UpgradeDB, "_db", IDBDatabase, ["deleteObjectStore", "close"]);function DB(db) {
                        this._db = db;
                      }DB.prototype.transaction = function () {
                        return new Transaction(this._db.transaction.apply(this._db, arguments));
                      };proxyProperties(DB, "_db", ["name", "version", "objectStoreNames"]);proxyMethods(DB, "_db", IDBDatabase, ["close"]); // Add cursor iterators
                      // TODO: remove this once browsers do the right thing with promises
                      ["openCursor", "openKeyCursor"].forEach(function (funcName) {
                        [ObjectStore, Index].forEach(function (Constructor) {
                          // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
                          if (!(funcName in Constructor.prototype)) return;Constructor.prototype[funcName.replace("open", "iterate")] = function () {
                            var args = toArray(arguments);var callback = args[args.length - 1];var nativeObject = this._store || this._index;var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));request.onsuccess = function () {
                              callback(request.result);
                            };
                          };
                        });
                      }); // polyfill getAll
                      [Index, ObjectStore].forEach(function (Constructor) {
                        if (Constructor.prototype.getAll) return;Constructor.prototype.getAll = function (query, count) {
                          var instance = this;var items = [];return new Promise(function (resolve) {
                            instance.iterateCursor(query, function (cursor) {
                              if (!cursor) {
                                resolve(items);return;
                              }items.push(cursor.value);if (count !== undefined && items.length == count) {
                                resolve(items);return;
                              }cursor.continue();
                            });
                          });
                        };
                      });var exp = { open: function open(name, version, upgradeCallback) {
                          var p = promisifyRequestCall(indexedDB, "open", [name, version]);var request = p.request;if (request) {
                            request.onupgradeneeded = function (event) {
                              if (upgradeCallback) {
                                upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
                              }
                            };
                          }return p.then(function (db) {
                            return new DB(db);
                          });
                        }, delete: function _delete(name) {
                          return promisifyRequestCall(indexedDB, "deleteDatabase", [name]);
                        } };if (typeof module !== "undefined") {
                        module.exports = exp;module.exports.default = module.exports;
                      } else {
                        self.idb = exp;
                      }
                    })();
                  }, {}] }, {}, [1]);
              }, { "idb": 2 }], 2: [function (require, module, exports) {
                "use strict";

                (function () {
                  function toArray(arr) {
                    return Array.prototype.slice.call(arr);
                  }function promisifyRequest(request) {
                    return new Promise(function (resolve, reject) {
                      request.onsuccess = function () {
                        resolve(request.result);
                      };request.onerror = function () {
                        reject(request.error);
                      };
                    });
                  }function promisifyRequestCall(obj, method, args) {
                    var request;var p = new Promise(function (resolve, reject) {
                      request = obj[method].apply(obj, args);promisifyRequest(request).then(resolve, reject);
                    });p.request = request;return p;
                  }function promisifyCursorRequestCall(obj, method, args) {
                    var p = promisifyRequestCall(obj, method, args);return p.then(function (value) {
                      if (!value) return;return new Cursor(value, p.request);
                    });
                  }function proxyProperties(ProxyClass, targetProp, properties) {
                    properties.forEach(function (prop) {
                      Object.defineProperty(ProxyClass.prototype, prop, { get: function get() {
                          return this[targetProp][prop];
                        }, set: function set(val) {
                          this[targetProp][prop] = val;
                        } });
                    });
                  }function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
                    properties.forEach(function (prop) {
                      if (!(prop in Constructor.prototype)) return;ProxyClass.prototype[prop] = function () {
                        return promisifyRequestCall(this[targetProp], prop, arguments);
                      };
                    });
                  }function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
                    properties.forEach(function (prop) {
                      if (!(prop in Constructor.prototype)) return;ProxyClass.prototype[prop] = function () {
                        return this[targetProp][prop].apply(this[targetProp], arguments);
                      };
                    });
                  }function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
                    properties.forEach(function (prop) {
                      if (!(prop in Constructor.prototype)) return;ProxyClass.prototype[prop] = function () {
                        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
                      };
                    });
                  }function Index(index) {
                    this._index = index;
                  }proxyProperties(Index, "_index", ["name", "keyPath", "multiEntry", "unique"]);proxyRequestMethods(Index, "_index", IDBIndex, ["get", "getKey", "getAll", "getAllKeys", "count"]);proxyCursorRequestMethods(Index, "_index", IDBIndex, ["openCursor", "openKeyCursor"]);function Cursor(cursor, request) {
                    this._cursor = cursor;this._request = request;
                  }proxyProperties(Cursor, "_cursor", ["direction", "key", "primaryKey", "value"]);proxyRequestMethods(Cursor, "_cursor", IDBCursor, ["update", "delete"]); // proxy 'next' methods
                  ["advance", "continue", "continuePrimaryKey"].forEach(function (methodName) {
                    if (!(methodName in IDBCursor.prototype)) return;Cursor.prototype[methodName] = function () {
                      var cursor = this;var args = arguments;return Promise.resolve().then(function () {
                        cursor._cursor[methodName].apply(cursor._cursor, args);return promisifyRequest(cursor._request).then(function (value) {
                          if (!value) return;return new Cursor(value, cursor._request);
                        });
                      });
                    };
                  });function ObjectStore(store) {
                    this._store = store;
                  }ObjectStore.prototype.createIndex = function () {
                    return new Index(this._store.createIndex.apply(this._store, arguments));
                  };ObjectStore.prototype.index = function () {
                    return new Index(this._store.index.apply(this._store, arguments));
                  };proxyProperties(ObjectStore, "_store", ["name", "keyPath", "indexNames", "autoIncrement"]);proxyRequestMethods(ObjectStore, "_store", IDBObjectStore, ["put", "add", "delete", "clear", "get", "getAll", "getKey", "getAllKeys", "count"]);proxyCursorRequestMethods(ObjectStore, "_store", IDBObjectStore, ["openCursor", "openKeyCursor"]);proxyMethods(ObjectStore, "_store", IDBObjectStore, ["deleteIndex"]);function Transaction(idbTransaction) {
                    this._tx = idbTransaction;this.complete = new Promise(function (resolve, reject) {
                      idbTransaction.oncomplete = function () {
                        resolve();
                      };idbTransaction.onerror = function () {
                        reject(idbTransaction.error);
                      };idbTransaction.onabort = function () {
                        reject(idbTransaction.error);
                      };
                    });
                  }Transaction.prototype.objectStore = function () {
                    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
                  };proxyProperties(Transaction, "_tx", ["objectStoreNames", "mode"]);proxyMethods(Transaction, "_tx", IDBTransaction, ["abort"]);function UpgradeDB(db, oldVersion, transaction) {
                    this._db = db;this.oldVersion = oldVersion;this.transaction = new Transaction(transaction);
                  }UpgradeDB.prototype.createObjectStore = function () {
                    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
                  };proxyProperties(UpgradeDB, "_db", ["name", "version", "objectStoreNames"]);proxyMethods(UpgradeDB, "_db", IDBDatabase, ["deleteObjectStore", "close"]);function DB(db) {
                    this._db = db;
                  }DB.prototype.transaction = function () {
                    return new Transaction(this._db.transaction.apply(this._db, arguments));
                  };proxyProperties(DB, "_db", ["name", "version", "objectStoreNames"]);proxyMethods(DB, "_db", IDBDatabase, ["close"]); // Add cursor iterators
                  // TODO: remove this once browsers do the right thing with promises
                  ["openCursor", "openKeyCursor"].forEach(function (funcName) {
                    [ObjectStore, Index].forEach(function (Constructor) {
                      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
                      if (!(funcName in Constructor.prototype)) return;Constructor.prototype[funcName.replace("open", "iterate")] = function () {
                        var args = toArray(arguments);var callback = args[args.length - 1];var nativeObject = this._store || this._index;var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));request.onsuccess = function () {
                          callback(request.result);
                        };
                      };
                    });
                  }); // polyfill getAll
                  [Index, ObjectStore].forEach(function (Constructor) {
                    if (Constructor.prototype.getAll) return;Constructor.prototype.getAll = function (query, count) {
                      var instance = this;var items = [];return new Promise(function (resolve) {
                        instance.iterateCursor(query, function (cursor) {
                          if (!cursor) {
                            resolve(items);return;
                          }items.push(cursor.value);if (count !== undefined && items.length == count) {
                            resolve(items);return;
                          }cursor.continue();
                        });
                      });
                    };
                  });var exp = { open: function open(name, version, upgradeCallback) {
                      var p = promisifyRequestCall(indexedDB, "open", [name, version]);var request = p.request;if (request) {
                        request.onupgradeneeded = function (event) {
                          if (upgradeCallback) {
                            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
                          }
                        };
                      }return p.then(function (db) {
                        return new DB(db);
                      });
                    }, delete: function _delete(name) {
                      return promisifyRequestCall(indexedDB, "deleteDatabase", [name]);
                    } };if (typeof module !== "undefined") {
                    module.exports = exp;module.exports.default = module.exports;
                  } else {
                    self.idb = exp;
                  }
                })();
              }, {}] }, {}, [1]);
          }, { "idb": 2 }], 2: [function (require, module, exports) {
            'use strict';

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
          }, {}] }, {}, [1]);
      }, { "idb": 2 }], 2: [function (require, module, exports) {
        'use strict';

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
      }, {}] }, {}, [1]);
  }, { "idb": 2 }], 2: [function (require, module, exports) {
    'use strict';

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
  }, {}] }, {}, [1]);

},{"idb":2}],2:[function(require,module,exports){
'use strict';

(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        },
        set: function(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
      idbTransaction.onabort = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
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
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      if (request) {
        request.onupgradeneeded = function(event) {
          if (upgradeCallback) {
            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
          }
        };
      }

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = exp;
    module.exports.default = module.exports;
  }
  else {
    self.idb = exp;
  }
}());

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3N3LmpzIiwiZGlzdC9kaXN0L25vZGVfbW9kdWxlcy9pZGIvbGliL2lkYi5qcyIsImRpc3Qvbm9kZV9tb2R1bGVzL2lkYi9saWIvaWRiLmpzIiwibm9kZV9tb2R1bGVzL2lkYi9saWIvaWRiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFBLFlBQUE7QUFBQSxXQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLGFBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7QUFBQSxVQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQTtBQUFBLFlBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBO0FBQUEsY0FBQSxJQUFBLGNBQUEsT0FBQSxPQUFBLElBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxDQUFBLHlCQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEVBQUEsSUFBQSxHQUFBLGtCQUFBLEVBQUEsQ0FBQTtBQUFBLGFBQUEsSUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLENBQUEsRUFBQTtBQUFBLGNBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBO0FBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsY0FBQSxFQUFBLENBQUEsRUFBQSxPQUFBO0FBQUEsVUFBQSxJQUFBLElBQUEsY0FBQSxPQUFBLE9BQUEsSUFBQSxPQUFBLEVBQUEsSUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxHQUFBO0FBQUEsUUFBQSxFQUFBLENBQUEsQ0FBQTtBQUFBLEtBQUEsT0FBQSxDQUFBO0FBQUEsVUFBQSxDQUFBO0FBQUEsQ0FBQSxJQUFBLEVBQUEsR0FBQSxDQUFBLFVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUE7OztBQUFBLEtBQUEsWUFBQTtBQUFBLGVBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsaUJBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7QUFBQSxjQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQTtBQUFBLGdCQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQTtBQUFBLGtCQUFBLElBQUEsY0FBQSxPQUFBLE9BQUEsSUFBQSxPQUFBLENBQUEsSUFBQSxDQUFBLENBQUEsSUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLENBQUEseUJBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsRUFBQSxJQUFBLEdBQUEsa0JBQUEsRUFBQSxDQUFBO0FBQUEsaUJBQUEsSUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLENBQUEsRUFBQTtBQUFBLGtCQUFBLElBQUEsRUFBQSxD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QU5BLGVBQUE7QUFEQSxhQUFBO0FBVUE7O0FBRUEsbUJBQUEsbUJBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSx1QkFBQSxPQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxrQkFBQSxFQUFBLFFBQUEsWUFBQSxTQUFBLENBQUEsRUFBQTtBQUNBLHlCQUFBLFNBQUEsQ0FBQSxJQUFBLElBQUEsWUFBQTtBQUNBLHVCQUFBLHFCQUFBLEtBQUEsVUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsQ0FBQTtBQURBLGVBQUE7QUFGQSxhQUFBO0FBTUE7O0FBRUEsbUJBQUEsWUFBQSxDQUFBLFVBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQTtBQUNBLHVCQUFBLE9BQUEsQ0FBQSxVQUFBLElBQUEsRUFBQTtBQUNBLGtCQUFBLEVBQUEsUUFBQSxZQUFBLFNBQUEsQ0FBQSxFQUFBO0FBQ0EseUJBQUEsU0FBQSxDQUFBLElBQUEsSUFBQSxZQUFBO0FBQ0EsdUJBQUEsS0FBQSxVQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsQ0FBQSxLQUFBLFVBQUEsQ0FBQSxFQUFBLFNBQUEsQ0FBQTtBQURBLGVBQUE7QUFGQSxhQUFBO0FBTUE7O0FBRUEsbUJBQUEseUJBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSx1QkFBQSxPQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxrQkFBQSxFQUFBLFFBQUEsWUFBQSxTQUFBLENBQUEsRUFBQTtBQUNBLHlCQUFBLFNBQUEsQ0FBQSxJQUFBLElBQUEsWUFBQTtBQUNBLHVCQUFBLDJCQUFBLEtBQUEsVUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsQ0FBQTtBQURBLGVBQUE7QUFGQSxhQUFBO0FBTUE7O0FBRUEsbUJBQUEsS0FBQSxDQUFBLEtBQUEsRUFBQTtBQUNBLGlCQUFBLE1BQUEsR0FBQSxLQUFBO0FBQ0E7O0FBRUEsMEJBQUEsS0FBQSxFQUFBLFFBQUEsRUFBQSxDQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsWUFBQSxFQUFBLFFBQUEsQ0FBQTs7QUFPQSw4QkFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxDQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLENBQUE7O0FBUUEsb0NBQUEsS0FBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsQ0FBQSxZQUFBLEVBQUEsZUFBQSxDQUFBOztBQUtBLG1CQUFBLE1BQUEsQ0FBQSxNQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsaUJBQUEsT0FBQSxHQUFBLE1BQUE7QUFDQSxpQkFBQSxRQUFBLEdBQUEsT0FBQTtBQUNBOztBQUVBLDBCQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsS0FBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLENBQUE7O0FBT0EsOEJBQUEsTUFBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsQ0FBQSxRQUFBLEVBQUEsUUFBQSxDQUFBOztBQUtBO0FBQ0EsV0FBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLG9CQUFBLEVBQUEsT0FBQSxDQUFBLFVBQUEsVUFBQSxFQUFBO0FBQ0EsZ0JBQUEsRUFBQSxjQUFBLFVBQUEsU0FBQSxDQUFBLEVBQUE7QUFDQSxtQkFBQSxTQUFBLENBQUEsVUFBQSxJQUFBLFlBQUE7QUFDQSxrQkFBQSxTQUFBLElBQUE7QUFDQSxrQkFBQSxPQUFBLFNBQUE7QUFDQSxxQkFBQSxRQUFBLE9BQUEsR0FBQSxJQUFBLENBQUEsWUFBQTtBQUNBLHVCQUFBLE9BQUEsQ0FBQSxVQUFBLEVBQUEsS0FBQSxDQUFBLE9BQUEsT0FBQSxFQUFBLElBQUE7QUFDQSx1QkFBQSxpQkFBQSxPQUFBLFFBQUEsRUFBQSxJQUFBLENBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLEtBQUEsRUFBQTtBQUNBLHlCQUFBLElBQUEsTUFBQSxDQUFBLEtBQUEsRUFBQSxPQUFBLFFBQUEsQ0FBQTtBQUZBLGlCQUFBLENBQUE7QUFGQSxlQUFBLENBQUE7QUFIQSxhQUFBO0FBRkEsV0FBQTs7QUFlQSxtQkFBQSxXQUFBLENBQUEsS0FBQSxFQUFBO0FBQ0EsaUJBQUEsTUFBQSxHQUFBLEtBQUE7QUFDQTs7QUFFQSxzQkFBQSxTQUFBLENBQUEsV0FBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxJQUFBLEtBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxXQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsTUFBQSxFQUFBLFNBQUEsQ0FBQSxDQUFBO0FBREEsV0FBQTs7QUFJQSxzQkFBQSxTQUFBLENBQUEsS0FBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxJQUFBLEtBQUEsQ0FBQSxLQUFBLE1BQUEsQ0FBQSxLQUFBLENBQUEsS0FBQSxDQUFBLEtBQUEsTUFBQSxFQUFBLFNBQUEsQ0FBQSxDQUFBO0FBREEsV0FBQTs7QUFJQSwwQkFBQSxXQUFBLEVBQUEsUUFBQSxFQUFBLENBQUEsTUFBQSxFQUFBLFNBQUEsRUFBQSxZQUFBLEVBQUEsZUFBQSxDQUFBOztBQU9BLDhCQUFBLFdBQUEsRUFBQSxRQUFBLEVBQUEsY0FBQSxFQUFBLENBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsUUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLENBQUE7O0FBWUEsb0NBQUEsV0FBQSxFQUFBLFFBQUEsRUFBQSxjQUFBLEVBQUEsQ0FBQSxZQUFBLEVBQUEsZUFBQSxDQUFBOztBQUtBLHVCQUFBLFdBQUEsRUFBQSxRQUFBLEVBQUEsY0FBQSxFQUFBLENBQUEsYUFBQSxDQUFBOztBQUlBLG1CQUFBLFdBQUEsQ0FBQSxjQUFBLEVBQUE7QUFDQSxpQkFBQSxHQUFBLEdBQUEsY0FBQTtBQUNBLGlCQUFBLFFBQUEsR0FBQSxJQUFBLE9BQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSw2QkFBQSxVQUFBLEdBQUEsWUFBQTtBQUNBO0FBREEsZUFBQTtBQUdBLDZCQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsdUJBQUEsZUFBQSxLQUFBO0FBREEsZUFBQTtBQUdBLDZCQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsdUJBQUEsZUFBQSxLQUFBO0FBREEsZUFBQTtBQVBBLGFBQUEsQ0FBQTtBQVdBOztBQUVBLHNCQUFBLFNBQUEsQ0FBQSxXQUFBLEdBQUEsWUFBQTtBQUNBLG1CQUFBLElBQUEsV0FBQSxDQUFBLEtBQUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxLQUFBLENBQUEsS0FBQSxHQUFBLEVBQUEsU0FBQSxDQUFBLENBQUE7QUFEQSxXQUFBOztBQUlBLDBCQUFBLFdBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxrQkFBQSxFQUFBLE1BQUEsQ0FBQTs7QUFLQSx1QkFBQSxXQUFBLEVBQUEsS0FBQSxFQUFBLGNBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQTs7QUFJQSxtQkFBQSxTQUFBLENBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUE7QUFDQSxpQkFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLGlCQUFBLFVBQUEsR0FBQSxVQUFBO0FBQ0EsaUJBQUEsV0FBQSxHQUFBLElBQUEsV0FBQSxDQUFBLFdBQUEsQ0FBQTtBQUNBOztBQUVBLG9CQUFBLFNBQUEsQ0FBQSxpQkFBQSxHQUFBLFlBQUE7QUFDQSxtQkFBQSxJQUFBLFdBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTtBQURBLFdBQUE7O0FBSUEsMEJBQUEsU0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsa0JBQUEsQ0FBQTs7QUFNQSx1QkFBQSxTQUFBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxDQUFBLG1CQUFBLEVBQUEsT0FBQSxDQUFBOztBQUtBLG1CQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7QUFDQSxpQkFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBOztBQUVBLGFBQUEsU0FBQSxDQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsbUJBQUEsSUFBQSxXQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTtBQURBLFdBQUE7O0FBSUEsMEJBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLE1BQUEsRUFBQSxTQUFBLEVBQUEsa0JBQUEsQ0FBQTs7QUFNQSx1QkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxDQUFBLE9BQUEsQ0FBQTs7QUFJQTtBQUNBO0FBQ0EsV0FBQSxZQUFBLEVBQUEsZUFBQSxFQUFBLE9BQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGFBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLENBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQTtBQUNBLGtCQUFBLEVBQUEsWUFBQSxZQUFBLFNBQUEsQ0FBQSxFQUFBOztBQUVBLDBCQUFBLFNBQUEsQ0FBQSxTQUFBLE9BQUEsQ0FBQSxNQUFBLEVBQUEsU0FBQSxDQUFBLElBQUEsWUFBQTtBQUNBLG9CQUFBLE9BQUEsUUFBQSxTQUFBLENBQUE7QUFDQSxvQkFBQSxXQUFBLEtBQUEsS0FBQSxNQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQ0Esb0JBQUEsZUFBQSxLQUFBLE1BQUEsSUFBQSxLQUFBLE1BQUE7QUFDQSxvQkFBQSxVQUFBLGFBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxZQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFDQSx3QkFBQSxTQUFBLEdBQUEsWUFBQTtBQUNBLDJCQUFBLFFBQUEsTUFBQTtBQURBLGlCQUFBO0FBTEEsZUFBQTtBQUpBLGFBQUE7QUFEQSxXQUFBOztBQWlCQTtBQUNBLFdBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxPQUFBLENBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxnQkFBQSxZQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSx3QkFBQSxTQUFBLENBQUEsTUFBQSxHQUFBLFVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQTtBQUNBLGtCQUFBLFdBQUEsSUFBQTtBQUNBLGtCQUFBLFFBQUEsRUFBQTs7QUFFQSxxQkFBQSxJQUFBLE9BQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQTtBQUNBLHlCQUFBLGFBQUEsQ0FBQSxLQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUE7QUFDQSxzQkFBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLDRCQUFBLEtBQUE7QUFDQTtBQUNBO0FBQ0Esd0JBQUEsSUFBQSxDQUFBLE9BQUEsS0FBQTs7QUFFQSxzQkFBQSxVQUFBLFNBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxLQUFBLEVBQUE7QUFDQSw0QkFBQSxLQUFBO0FBQ0E7QUFDQTtBQUNBLHlCQUFBLFFBQUE7QUFYQSxpQkFBQTtBQURBLGVBQUEsQ0FBQTtBQUpBLGFBQUE7QUFGQSxXQUFBOztBQXdCQSxjQUFBLE1BQUE7QUFDQSxrQkFBQSxTQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLGVBQUEsRUFBQTtBQUNBLGtCQUFBLElBQUEscUJBQUEsU0FBQSxFQUFBLE1BQUEsRUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLENBQUEsQ0FBQTtBQUNBLGtCQUFBLFVBQUEsRUFBQSxPQUFBOztBQUVBLGtCQUFBLE9BQUEsRUFBQTtBQUNBLHdCQUFBLGVBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLHNCQUFBLGVBQUEsRUFBQTtBQUNBLG9DQUFBLElBQUEsU0FBQSxDQUFBLFFBQUEsTUFBQSxFQUFBLE1BQUEsVUFBQSxFQUFBLFFBQUEsV0FBQSxDQUFBO0FBQ0E7QUFIQSxpQkFBQTtBQUtBOztBQUVBLHFCQUFBLEVBQUEsSUFBQSxDQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0EsdUJBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBO0FBREEsZUFBQSxDQUFBO0FBYkEsYUFBQTtBQWlCQSxvQkFBQSxTQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUE7QUFDQSxxQkFBQSxxQkFBQSxTQUFBLEVBQUEsZ0JBQUEsRUFBQSxDQUFBLElBQUEsQ0FBQSxDQUFBO0FBQ0E7QUFuQkEsV0FBQTs7QUFzQkEsY0FBQSxPQUFBLE1BQUEsS0FBQSxXQUFBLEVBQUE7QUFDQSxtQkFBQSxPQUFBLEdBQUEsR0FBQTtBQUNBLG1CQUFBLE9BQUEsQ0FBQSxPQUFBLEdBQUEsT0FBQSxPQUFBO0FBRkEsV0FBQSxNQUlBO0FBQ0EsaUJBQUEsR0FBQSxHQUFBLEdBQUE7QUFDQTtBQXhUQSxTQUFBO1NGRkEsRSxDQUFBLEVBQUEsRUFBQSxFQUFBLEUsQ0FBQSxDLENBQUE7R0FBQSxFLFlBQUEsQ0FBQSxFO0FHQUE7O0FBRUEsaUJBQUE7QUFDQSxlQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsU0FBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUEsR0FBQSxDQUFBO0FBQ0E7O0FBRUEsZUFBQSxnQkFBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLGVBQUEsSUFBQSxPQUFBLENBQUEsVUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ0Esa0JBQUEsU0FBQSxHQUFBLFlBQUE7QUFDQSxvQkFBQSxRQUFBLE1BQUE7QUFDQSxXQUZBOztBQUlBLGtCQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsbUJBQUEsUUFBQSxLQUFBO0FBQ0EsV0FGQTtBQUdBLFNBUkEsQ0FBQTtBQVNBOztBQUVBLGVBQUEsb0JBQUEsQ0FBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQTtBQUNBLFlBQUEsT0FBQTtBQUNBLFlBQUEsSUFBQSxJQUFBLE9BQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSxvQkFBQSxJQUFBLE1BQUEsRUFBQSxLQUFBLENBQUEsR0FBQSxFQUFBLElBQUEsQ0FBQTtBQUNBLDJCQUFBLE9BQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxFQUFBLE1BQUE7QUFDQSxTQUhBLENBQUE7O0FBS0EsVUFBQSxPQUFBLEdBQUEsT0FBQTtBQUNBLGVBQUEsQ0FBQTtBQUNBOztBQUVBLGVBQUEsMEJBQUEsQ0FBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQTtBQUNBLFlBQUEsSUFBQSxxQkFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsQ0FBQTtBQUNBLGVBQUEsRUFBQSxJQUFBLENBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxjQUFBLENBQUEsS0FBQSxFQUFBO0FBQ0EsaUJBQUEsSUFBQSxNQUFBLENBQUEsS0FBQSxFQUFBLEVBQUEsT0FBQSxDQUFBO0FBQ0EsU0FIQSxDQUFBO0FBSUE7O0FBRUEsZUFBQSxlQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSxtQkFBQSxPQUFBLENBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxpQkFBQSxjQUFBLENBQUEsV0FBQSxTQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ0EsaUJBQUEsZUFBQTtBQUNBLHFCQUFBLEtBQUEsVUFBQSxFQUFBLElBQUEsQ0FBQTtBQUNBLGFBSEE7QUFJQSxpQkFBQSxhQUFBLEdBQUEsRUFBQTtBQUNBLG1CQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsR0FBQTtBQUNBO0FBTkEsV0FBQTtBQVFBLFNBVEE7QUFVQTs7QUFFQSxlQUFBLG1CQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBO0FBQ0EsbUJBQUEsT0FBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxFQUFBLFFBQUEsWUFBQSxTQUFBLENBQUEsRUFBQTtBQUNBLHFCQUFBLFNBQUEsQ0FBQSxJQUFBLElBQUEsWUFBQTtBQUNBLG1CQUFBLHFCQUFBLEtBQUEsVUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsQ0FBQTtBQUNBLFdBRkE7QUFHQSxTQUxBO0FBTUE7O0FBRUEsZUFBQSxZQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBO0FBQ0EsbUJBQUEsT0FBQSxDQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsY0FBQSxFQUFBLFFBQUEsWUFBQSxTQUFBLENBQUEsRUFBQTtBQUNBLHFCQUFBLFNBQUEsQ0FBQSxJQUFBLElBQUEs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LFdBQUEsRUFBQSxRQUFBLEVBQUEsY0FBQSxFQUFBLENBQ0EsS0FEQSxFQUVBLEtBRkEsRUFHQSxRQUhBLEVBSUEsT0FKQSxFQUtBLEtBTEEsRUFNQSxRQU5BLEVBT0EsUUFQQSxFQVFBLFlBUkEsRUFTQSxPQVRBLENBQUE7O0FBWUEsZ0NBQUEsV0FBQSxFQUFBLFFBQUEsRUFBQSxjQUFBLEVBQUEsQ0FDQSxZQURBLEVBRUEsZUFGQSxDQUFBOztBQUtBLG1CQUFBLFdBQUEsRUFBQSxRQUFBLEVBQUEsY0FBQSxFQUFBLENBQ0EsYUFEQSxDQUFBOztBQUlBLGVBQUEsV0FBQSxDQUFBLGNBQUEsRUFBQTtBQUNBLGFBQUEsR0FBQSxHQUFBLGNBQUE7QUFDQSxhQUFBLFFBQUEsR0FBQSxJQUFBLE9BQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSx5QkFBQSxVQUFBLEdBQUEsWUFBQTtBQUNBO0FBQ0EsV0FGQTtBQUdBLHlCQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsbUJBQUEsZUFBQSxLQUFBO0FBQ0EsV0FGQTtBQUdBLHlCQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsbUJBQUEsZUFBQSxLQUFBO0FBQ0EsV0FGQTtBQUdBLFNBVkEsQ0FBQTtBQVdBOztBQUVBLGtCQUFBLFNBQUEsQ0FBQSxXQUFBLEdBQUEsWUFBQTtBQUNBLGVBQUEsSUFBQSxXQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTtBQUNBLE9BRkE7O0FBSUEsc0JBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxDQUNBLGtCQURBLEVBRUEsTUFGQSxDQUFBOztBQUtBLG1CQUFBLFdBQUEsRUFBQSxLQUFBLEVBQUEsY0FBQSxFQUFBLENBQ0EsT0FEQSxDQUFBOztBQUlBLGVBQUEsU0FBQSxDQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBO0FBQ0EsYUFBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLGFBQUEsVUFBQSxHQUFBLFVBQUE7QUFDQSxhQUFBLFdBQUEsR0FBQSxJQUFBLFdBQUEsQ0FBQSxXQUFBLENBQUE7QUFDQTs7QUFFQSxnQkFBQSxTQUFBLENBQUEsaUJBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxJQUFBLFdBQUEsQ0FBQSxLQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTtBQUNBLE9BRkE7O0FBSUEsc0JBQUEsU0FBQSxFQUFBLEtBQUEsRUFBQSxDQUNBLE1BREEsRUFFQSxTQUZBLEVBR0Esa0JBSEEsQ0FBQTs7QUFNQSxtQkFBQSxTQUFBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxDQUNBLG1CQURBLEVBRUEsT0FGQSxDQUFBOztBQUtBLGVBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTtBQUNBLGFBQUEsR0FBQSxHQUFBLEVBQUE7QUFDQTs7QUFFQSxTQUFBLFNBQUEsQ0FBQSxXQUFBLEdBQUEsWUFBQTtBQUNBLGVBQUEsSUFBQSxXQUFBLENBQUEsS0FBQSxHQUFBLENBQUEsV0FBQSxDQUFBLEtBQUEsQ0FBQSxLQUFBLEdBQUEsRUFBQSxTQUFBLENBQUEsQ0FBQTtBQUNBLE9BRkE7O0FBSUEsc0JBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxDQUNBLE1BREEsRUFFQSxTQUZBLEVBR0Esa0JBSEEsQ0FBQTs7QUFNQSxtQkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxDQUNBLE9BREEsQ0FBQTs7QUFJQTtBQUNBO0FBQ0EsT0FBQSxZQUFBLEVBQUEsZUFBQSxFQUFBLE9BQUEsQ0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLFNBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLENBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQTtBQUNBLGNBQUEsRUFBQSxZQUFBLFlBQUEsU0FBQSxDQUFBLEVBQUE7O0FBRUEsc0JBQUEsU0FBQSxDQUFBLFNBQUEsT0FBQSxDQUFBLE1BQUEsRUFBQSxTQUFBLENBQUEsSUFBQSxZQUFBO0FBQ0EsZ0JBQUEsT0FBQSxRQUFBLFNBQUEs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKyl7byh0W2ldKX1yZXR1cm4gb31yZXR1cm4gcn0pKCkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiOyhmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspe28odFtpXSl9cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjt2YXIgX2lkYj1yZXF1aXJlKFwiaWRiXCIpO3ZhciBfaWRiMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pZGIpO2Z1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKXtyZXR1cm4gb2JqJiZvYmouX19lc01vZHVsZT9vYmo6e2RlZmF1bHQ6b2JqfX0vLyBFc3RhYmxpc2ggdmVyc2lvbiBudW1iZXIgb2YgY2FjaGUgdG8gcmVtb3ZlIG91dGRhdGVkIGNhY2hlcyBkdXJpbmcgYW4gdXBkYXRlXG52YXIgY2FjaGVWZXJzaW9uPVwidjNcIjsvLyBDcmVhdGVkIEluZGV4ZWREQiBkYXRhYmFzZVxuLy8gSW1wb3J0IEluZGV4ZWREQlxudmFyIGRiUHJvbWlzZT1faWRiMi5kZWZhdWx0Lm9wZW4oXCJyZXN0YXVyYW50LXJldmlld3MtZGJcIiwxLGZ1bmN0aW9uKHVwZ3JhZGVEQil7c3dpdGNoKHVwZ3JhZGVEQi5vbGRWZXJzaW9uKXtjYXNlIDA6dXBncmFkZURCLmNyZWF0ZU9iamVjdFN0b3JlKFwicmVzdGF1cmFudHMtcmV2aWV3c1wiLHtrZXlQYXRoOlwiaWRcIn0pO319KTsvLyBBc3NldHMgdG8gY2FjaGUgZm9yIG9mZmxpbmUgdXNlXG52YXIgY2FjaGVBc3NldHM9W1wiL1wiLFwiL2luZGV4Lmh0bWxcIixcIi9yZXN0YXVyYW50Lmh0bWxcIixcIi9yZXN0YXVyYW50Lmh0bWw/aWQ9MVwiLFwiL3Jlc3RhdXJhbnQuaHRtbD9pZD0yXCIsXCIvcmVzdGF1cmFudC5odG1sP2lkPTNcIixcIi9yZXN0YXVyYW50Lmh0bWw/aWQ9NFwiLFwiL3Jlc3RhdXJhbnQuaHRtbD9pZD01XCIsXCIvcmVzdGF1cmFudC5odG1sP2lkPTZcIixcIi9yZXN0YXVyYW50Lmh0bWw/aWQ9N1wiLFwiL3Jlc3RhdXJhbnQuaHRtbD9pZD04XCIsXCIvcmVzdGF1cmFudC5odG1sP2lkPTlcIixcIi9yZXN0YXVyYW50Lmh0bWw/aWQ9MTBcIixcIi9jc3Mvc3R5bGVzLmNzc1wiLFwiL2pzL2RiaGVscGVyLmpzXCIsXCIvanMvaW5kZXguanNcIixcIi9qcy9tYWluLmpzXCIsXCIvanMvcmVzdGF1cmFudF9pbmZvLmpzXCIsXCIvaW1nLzFfbGFyZ2UuanBnXCIsXCIvaW1nLzJfbGFyZ2UuanBnXCIsXCIvaW1nLzNfbGFyZ2UuanBnXCIsXCIvaW1nLzRfbGFyZ2UuanBnXCIsXCIvaW1nLzVfbGFyZ2UuanBnXCIsXCIvaW1nLzZfbGFyZ2UuanBnXCIsXCIvaW1nLzdfbGFyZ2UuanBnXCIsXCIvaW1nLzhfbGFyZ2UuanBnXCIsXCIvaW1nLzlfbGFyZ2UuanBnXCIsXCIvaW1nLzEwX2xhcmdlLmpwZ1wiLFwiL2ltZy8xX3NtYWxsLmpwZ1wiLFwiL2ltZy8yX3NtYWxsLmpwZ1wiLFwiL2ltZy8zX3NtYWxsLmpwZ1wiLFwiL2ltZy80X3NtYWxsLmpwZ1wiLFwiL2ltZy81X3NtYWxsLmpwZ1wiLFwiL2ltZy82X3NtYWxsLmpwZ1wiLFwiL2ltZy83X3NtYWxsLmpwZ1wiLFwiL2ltZy84X3NtYWxsLmpwZ1wiLFwiL2ltZy85X3NtYWxsLmpwZ1wiLFwiL2ltZy8xMF9zbWFsbC5qcGdcIl07Ly8gSW5zdGFsbHMgYSBzZXJ2aWNlIHdvcmtlciBhbmQgY2FjaGVzIGFzc2V0cyB3aXRoIGN1cnJlbnQgY2FjaGUgdmVyc2lvbiBhcyBpdHMgbmFtZS5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImluc3RhbGxcIixmdW5jdGlvbihldmVudCl7ZXZlbnQud2FpdFVudGlsKGNhY2hlcy5vcGVuKGNhY2hlVmVyc2lvbitcIi1yZXN0YXVyYW50LXJldmlld3NcIikudGhlbihmdW5jdGlvbihjYWNoZSl7cmV0dXJuIGNhY2hlLmFkZEFsbChjYWNoZUFzc2V0cyl9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7Y29uc29sZS5sb2coXCJDYWNoZSBpbnN0YWxsIGZhaWxlZDogXCIrZXJyb3IpfSkpO2NvbnNvbGUubG9nKFwiSW5zdGFsbGVkIHNlcnZpY2Ugd29ya2VyIGFuZCBjYWNoZWQgYXNzZXRzXCIpfSk7LyogVXBkYXRlcyB0aGUgc2VydmljZSB3b3JrZXIgd2l0aCBhIG5ld2VyIHZlcnNpb24gKGlmIGF2YWlsYWJsZSBpbiBhIHdhaXRpbmcgc3RhdGUpLiBBY3RpdmF0ZSBmaXJlcyBvbmNlIG9sZGVyIHNlcnZpY2Ugd29ya2VyIG5vIGxvbmdlciBjb250cm9scyBjdXJyZW50IHBhZ2VzLiBPbGRlciBjYWNoZShzKSBpcyBhbHNvIGRlbGV0ZWQuICovc2VsZi5hZGRFdmVudExpc3RlbmVyKFwiYWN0aXZhdGVcIixmdW5jdGlvbihldmVudCl7ZXZlbnQud2FpdFVudGlsKGNhY2hlcy5rZXlzKCkudGhlbihmdW5jdGlvbihjYWNoZU5hbWVzKXtyZXR1cm4gUHJvbWlzZS5hbGwoY2FjaGVOYW1lcy5maWx0ZXIoZnVuY3Rpb24oY2FjaGVOYW1lKXtyZXR1cm4hY2FjaGVOYW1lLnN0YXJ0c1dpdGgoY2FjaGVWZXJzaW9uKX0pLm1hcChmdW5jdGlvbihjYWNoZU5hbWUpe3JldHVybiBjYWNoZXMuZGVsZXRlKGNhY2hlTmFtZSl9KSl9KSk7Y29uc29sZS5sb2coXCJEZWxldGVkIG9sZCBjYWNoZSBhbmQgYWN0aXZhdGVkIG5ldyBzZXJ2aWNlIHdvcmtlclwiKX0pOy8qIENvZGUgYmVsb3cgaXMgV0lQICovc2VsZi5hZGRFdmVudExpc3RlbmVyKFwiZmV0Y2hcIixmdW5jdGlvbihldmVudCl7dmFyIHJlcXVlc3RVUkw9bmV3IFVSTChldmVudC5yZXF1ZXN0LnVybCk7aWYocmVxdWVzdFVSTC5wb3J0PT09XCIxMzM3XCIpe2NvbnNvbGUubG9nKHJlcXVlc3RVUkwuc2VhcmNoUGFyYW1zKTtpZihyZXF1ZXN0VVJMLnNlYXJjaFBhcmFtcy5nZXQoXCJpZFwiKSl7dmFyIGlkPXJlcXVlc3RVUkwuc2VhcmNoUGFyYW1zLmdldChcImlkXCIpO2NvbnNvbGUubG9nKFwiaWRcIixpZCk7aGFuZGxlSW5kZXhlZERCUmVxdWVzdChldmVudCxpZCl9ZWxzZXt2YXIgX2lkPVwiMFwiO2NvbnNvbGUubG9nKFwiaWRcIixfaWQpO2hhbmRsZUluZGV4ZWREQlJlcXVlc3QoZXZlbnQsX2lkKX19ZWxzZXtoYW5kbGVDYWNoZVJlcXVlc3QoZXZlbnQpfX0pO2Z1bmN0aW9uIGhhbmRsZUluZGV4ZWREQlJlcXVlc3QoZXZlbnQsaWQpe2V2ZW50LnJlc3BvbmRXaXRoKGRiUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRiKXt2YXIgdHg9ZGIudHJhbnNhY3Rpb24oXCJyZXN0YXVyYW50LXJldmlld3NcIik7dmFyIHJlc3RhdXJhbnRSZXZpZXdzU3RvcmU9dHgub2JqZWN0U3RvcmUoXCJyZXN0YXVyYW50LXJldmlld3NcIik7cmV0dXJuIHJlc3RhdXJhbnRSZXZpZXdzU3RvcmUuZ2V0KGlkKX0pLnRoZW4oZnVuY3Rpb24ocmVzdGF1cmFudFJldmlldyl7aWYocmVzdGF1cmFudFJldmlldy5kYXRhKXtyZXR1cm4gcmVzdGF1cmFudFJldmlldy5kYXRhfWVsc2V7ZmV0Y2goZXZlbnQucmVxdWVzdCkudGhlbihmdW5jdGlvbihmZXRjaGVkUmVzdGF1cmFudFJldmlldyl7ZmV0Y2hlZFJlc3RhdXJhbnRSZXZpZXcuanNvbigpfSkudGhlbihmdW5jdGlvbihyZXN0YXVyYW50UmV2aWV3KXtyZXR1cm4gZGJQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGIpe3ZhciB0eD1kYi50cmFuc2FjdGlvbihcInJlc3RhdXJhbnQtcmV2aWV3c1wiLFwicmVhZHdyaXRlXCIpO3ZhciByZXN0YXVyYW50UmV2aWV3c1N0b3JlPXR4Lm9iamVjdFN0b3JlKFwicmVzdGF1cmFudC1yZXZpZXdzXCIpO3Jlc3RhdXJhbnRSZXZpZXdzU3RvcmUucHV0KHtpZDppZCxkYXRhOnJlc3RhdXJhbnRSZXZpZXd9KTtyZXR1cm4gcmVzdGF1cmFudFJldmlld30pfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7Y29uc29sZS5sb2cocmVzcG9uc2UpfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe2NvbnNvbGUubG9nKFwiRmFpbGVkIHRvIHJldHJpZXZlIGRhdGEgZnJvbSBzZXJ2ZXI6IFwiK2Vycm9yKX0pfX0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtjb25zb2xlLmxvZyhcIkZhaWxlZCB0byByZXRyaWV2ZSBkYXRhIGZyb20gSW5kZXhlZERCOiBcIitlcnJvcil9KSl9ZnVuY3Rpb24gaGFuZGxlQ2FjaGVSZXF1ZXN0KGV2ZW50KXtldmVudC5yZXNwb25kV2l0aChjYWNoZXMubWF0Y2goZXZlbnQucmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7aWYocmVzcG9uc2Upe2NvbnNvbGUubG9nKFwiRm91bmQgXCIrZXZlbnQucmVxdWVzdC51cmwrXCIgaW4gY2FjaGVcIik7cmV0dXJuIHJlc3BvbnNlfXZhciBmZXRjaFJlcXVlc3Q9ZXZlbnQucmVxdWVzdC5jbG9uZSgpO2NvbnNvbGUubG9nKFwiTmV0d29yayByZXF1ZXN0IGZvciBcIitldmVudC5yZXF1ZXN0LnVybCk7cmV0dXJuIGZldGNoKGZldGNoUmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7aWYoIXJlc3BvbnNlfHxyZXNwb25zZS5zdGF0dXMhPT0yMDB8fHJlc3BvbnNlLnR5cGUhPT1cImJhc2ljXCIpe3JldHVybiByZXNwb25zZX12YXIgcmVzcG9uc2VUb0NhY2hlPXJlc3BvbnNlLmNsb25lKCk7Y2FjaGVzLm9wZW4oY2FjaGVWZXJzaW9uK1wiLXJlc3RhdXJhbnQtcmV2aWV3c1wiKS50aGVuKGZ1bmN0aW9uKGNhY2hlKXtjYWNoZS5wdXQoZXZlbnQucmVxdWVzdCxyZXNwb25zZVRvQ2FjaGUpfSk7cmV0dXJuIHJlc3BvbnNlfSl9KSl9fSx7XCJpZGJcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdG9BcnJheShhcnIpe3JldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpfWZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCl7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtyZXF1ZXN0Lm9uc3VjY2Vzcz1mdW5jdGlvbigpe3Jlc29sdmUocmVxdWVzdC5yZXN1bHQpfTtyZXF1ZXN0Lm9uZXJyb3I9ZnVuY3Rpb24oKXtyZWplY3QocmVxdWVzdC5lcnJvcil9fSl9ZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdENhbGwob2JqLG1ldGhvZCxhcmdzKXt2YXIgcmVxdWVzdDt2YXIgcD1uZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7cmVxdWVzdD1vYmpbbWV0aG9kXS5hcHBseShvYmosYXJncyk7cHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KS50aGVuKHJlc29sdmUscmVqZWN0KX0pO3AucmVxdWVzdD1yZXF1ZXN0O3JldHVybiBwfWZ1bmN0aW9uIHByb21pc2lmeUN1cnNvclJlcXVlc3RDYWxsKG9iaixtZXRob2QsYXJncyl7dmFyIHA9cHJvbWlzaWZ5UmVxdWVzdENhbGwob2JqLG1ldGhvZCxhcmdzKTtyZXR1cm4gcC50aGVuKGZ1bmN0aW9uKHZhbHVlKXtpZighdmFsdWUpcmV0dXJuO3JldHVybiBuZXcgQ3Vyc29yKHZhbHVlLHAucmVxdWVzdCl9KX1mdW5jdGlvbiBwcm94eVByb3BlcnRpZXMoUHJveHlDbGFzcyx0YXJnZXRQcm9wLHByb3BlcnRpZXMpe3Byb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJveHlDbGFzcy5wcm90b3R5cGUscHJvcCx7Z2V0OmZ1bmN0aW9uIGdldCgpe3JldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdfSxzZXQ6ZnVuY3Rpb24gc2V0KHZhbCl7dGhpc1t0YXJnZXRQcm9wXVtwcm9wXT12YWx9fSl9KX1mdW5jdGlvbiBwcm94eVJlcXVlc3RNZXRob2RzKFByb3h5Q2xhc3MsdGFyZ2V0UHJvcCxDb25zdHJ1Y3Rvcixwcm9wZXJ0aWVzKXtwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7aWYoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpcmV0dXJuO1Byb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdPWZ1bmN0aW9uKCl7cmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKHRoaXNbdGFyZ2V0UHJvcF0scHJvcCxhcmd1bWVudHMpfX0pfWZ1bmN0aW9uIHByb3h5TWV0aG9kcyhQcm94eUNsYXNzLHRhcmdldFByb3AsQ29uc3RydWN0b3IscHJvcGVydGllcyl7cHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3Ape2lmKCEocHJvcCBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKXJldHVybjtQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXT1mdW5jdGlvbigpe3JldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sYXJndW1lbnRzKX19KX1mdW5jdGlvbiBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKFByb3h5Q2xhc3MsdGFyZ2V0UHJvcCxDb25zdHJ1Y3Rvcixwcm9wZXJ0aWVzKXtwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7aWYoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpcmV0dXJuO1Byb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdPWZ1bmN0aW9uKCl7cmV0dXJuIHByb21pc2lmeUN1cnNvclJlcXVlc3RDYWxsKHRoaXNbdGFyZ2V0UHJvcF0scHJvcCxhcmd1bWVudHMpfX0pfWZ1bmN0aW9uIEluZGV4KGluZGV4KXt0aGlzLl9pbmRleD1pbmRleH1wcm94eVByb3BlcnRpZXMoSW5kZXgsXCJfaW5kZXhcIixbXCJuYW1lXCIsXCJrZXlQYXRoXCIsXCJtdWx0aUVudHJ5XCIsXCJ1bmlxdWVcIl0pO3Byb3h5UmVxdWVzdE1ldGhvZHMoSW5kZXgsXCJfaW5kZXhcIixJREJJbmRleCxbXCJnZXRcIixcImdldEtleVwiLFwiZ2V0QWxsXCIsXCJnZXRBbGxLZXlzXCIsXCJjb3VudFwiXSk7cHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhJbmRleCxcIl9pbmRleFwiLElEQkluZGV4LFtcIm9wZW5DdXJzb3JcIixcIm9wZW5LZXlDdXJzb3JcIl0pO2Z1bmN0aW9uIEN1cnNvcihjdXJzb3IscmVxdWVzdCl7dGhpcy5fY3Vyc29yPWN1cnNvcjt0aGlzLl9yZXF1ZXN0PXJlcXVlc3R9cHJveHlQcm9wZXJ0aWVzKEN1cnNvcixcIl9jdXJzb3JcIixbXCJkaXJlY3Rpb25cIixcImtleVwiLFwicHJpbWFyeUtleVwiLFwidmFsdWVcIl0pO3Byb3h5UmVxdWVzdE1ldGhvZHMoQ3Vyc29yLFwiX2N1cnNvclwiLElEQkN1cnNvcixbXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSk7Ly8gcHJveHkgJ25leHQnIG1ldGhvZHNcbltcImFkdmFuY2VcIixcImNvbnRpbnVlXCIsXCJjb250aW51ZVByaW1hcnlLZXlcIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtpZighKG1ldGhvZE5hbWUgaW4gSURCQ3Vyc29yLnByb3RvdHlwZSkpcmV0dXJuO0N1cnNvci5wcm90b3R5cGVbbWV0aG9kTmFtZV09ZnVuY3Rpb24oKXt2YXIgY3Vyc29yPXRoaXM7dmFyIGFyZ3M9YXJndW1lbnRzO3JldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7Y3Vyc29yLl9jdXJzb3JbbWV0aG9kTmFtZV0uYXBwbHkoY3Vyc29yLl9jdXJzb3IsYXJncyk7cmV0dXJuIHByb21pc2lmeVJlcXVlc3QoY3Vyc29yLl9yZXF1ZXN0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtpZighdmFsdWUpcmV0dXJuO3JldHVybiBuZXcgQ3Vyc29yKHZhbHVlLGN1cnNvci5fcmVxdWVzdCl9KX0pfX0pO2Z1bmN0aW9uIE9iamVjdFN0b3JlKHN0b3JlKXt0aGlzLl9zdG9yZT1zdG9yZX1PYmplY3RTdG9yZS5wcm90b3R5cGUuY3JlYXRlSW5kZXg9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEluZGV4KHRoaXMuX3N0b3JlLmNyZWF0ZUluZGV4LmFwcGx5KHRoaXMuX3N0b3JlLGFyZ3VtZW50cykpfTtPYmplY3RTdG9yZS5wcm90b3R5cGUuaW5kZXg9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEluZGV4KHRoaXMuX3N0b3JlLmluZGV4LmFwcGx5KHRoaXMuX3N0b3JlLGFyZ3VtZW50cykpfTtwcm94eVByb3BlcnRpZXMoT2JqZWN0U3RvcmUsXCJfc3RvcmVcIixbXCJuYW1lXCIsXCJrZXlQYXRoXCIsXCJpbmRleE5hbWVzXCIsXCJhdXRvSW5jcmVtZW50XCJdKTtwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLFwiX3N0b3JlXCIsSURCT2JqZWN0U3RvcmUsW1wicHV0XCIsXCJhZGRcIixcImRlbGV0ZVwiLFwiY2xlYXJcIixcImdldFwiLFwiZ2V0QWxsXCIsXCJnZXRLZXlcIixcImdldEFsbEtleXNcIixcImNvdW50XCJdKTtwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLFwiX3N0b3JlXCIsSURCT2JqZWN0U3RvcmUsW1wib3BlbkN1cnNvclwiLFwib3BlbktleUN1cnNvclwiXSk7cHJveHlNZXRob2RzKE9iamVjdFN0b3JlLFwiX3N0b3JlXCIsSURCT2JqZWN0U3RvcmUsW1wiZGVsZXRlSW5kZXhcIl0pO2Z1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKXt0aGlzLl90eD1pZGJUcmFuc2FjdGlvbjt0aGlzLmNvbXBsZXRlPW5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlPWZ1bmN0aW9uKCl7cmVzb2x2ZSgpfTtpZGJUcmFuc2FjdGlvbi5vbmVycm9yPWZ1bmN0aW9uKCl7cmVqZWN0KGlkYlRyYW5zYWN0aW9uLmVycm9yKX07aWRiVHJhbnNhY3Rpb24ub25hYm9ydD1mdW5jdGlvbigpe3JlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcil9fSl9VHJhbnNhY3Rpb24ucHJvdG90eXBlLm9iamVjdFN0b3JlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBPYmplY3RTdG9yZSh0aGlzLl90eC5vYmplY3RTdG9yZS5hcHBseSh0aGlzLl90eCxhcmd1bWVudHMpKX07cHJveHlQcm9wZXJ0aWVzKFRyYW5zYWN0aW9uLFwiX3R4XCIsW1wib2JqZWN0U3RvcmVOYW1lc1wiLFwibW9kZVwiXSk7cHJveHlNZXRob2RzKFRyYW5zYWN0aW9uLFwiX3R4XCIsSURCVHJhbnNhY3Rpb24sW1wiYWJvcnRcIl0pO2Z1bmN0aW9uIFVwZ3JhZGVEQihkYixvbGRWZXJzaW9uLHRyYW5zYWN0aW9uKXt0aGlzLl9kYj1kYjt0aGlzLm9sZFZlcnNpb249b2xkVmVyc2lvbjt0aGlzLnRyYW5zYWN0aW9uPW5ldyBUcmFuc2FjdGlvbih0cmFuc2FjdGlvbil9VXBncmFkZURCLnByb3RvdHlwZS5jcmVhdGVPYmplY3RTdG9yZT1mdW5jdGlvbigpe3JldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fZGIuY3JlYXRlT2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fZGIsYXJndW1lbnRzKSl9O3Byb3h5UHJvcGVydGllcyhVcGdyYWRlREIsXCJfZGJcIixbXCJuYW1lXCIsXCJ2ZXJzaW9uXCIsXCJvYmplY3RTdG9yZU5hbWVzXCJdKTtwcm94eU1ldGhvZHMoVXBncmFkZURCLFwiX2RiXCIsSURCRGF0YWJhc2UsW1wiZGVsZXRlT2JqZWN0U3RvcmVcIixcImNsb3NlXCJdKTtmdW5jdGlvbiBEQihkYil7dGhpcy5fZGI9ZGJ9REIucHJvdG90eXBlLnRyYW5zYWN0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBUcmFuc2FjdGlvbih0aGlzLl9kYi50cmFuc2FjdGlvbi5hcHBseSh0aGlzLl9kYixhcmd1bWVudHMpKX07cHJveHlQcm9wZXJ0aWVzKERCLFwiX2RiXCIsW1wibmFtZVwiLFwidmVyc2lvblwiLFwib2JqZWN0U3RvcmVOYW1lc1wiXSk7cHJveHlNZXRob2RzKERCLFwiX2RiXCIsSURCRGF0YWJhc2UsW1wiY2xvc2VcIl0pOy8vIEFkZCBjdXJzb3IgaXRlcmF0b3JzXG4vLyBUT0RPOiByZW1vdmUgdGhpcyBvbmNlIGJyb3dzZXJzIGRvIHRoZSByaWdodCB0aGluZyB3aXRoIHByb21pc2VzXG5bXCJvcGVuQ3Vyc29yXCIsXCJvcGVuS2V5Q3Vyc29yXCJdLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpe1tPYmplY3RTdG9yZSxJbmRleF0uZm9yRWFjaChmdW5jdGlvbihDb25zdHJ1Y3Rvcil7Ly8gRG9uJ3QgY3JlYXRlIGl0ZXJhdGVLZXlDdXJzb3IgaWYgb3BlbktleUN1cnNvciBkb2Vzbid0IGV4aXN0LlxuaWYoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKXJldHVybjtDb25zdHJ1Y3Rvci5wcm90b3R5cGVbZnVuY05hbWUucmVwbGFjZShcIm9wZW5cIixcIml0ZXJhdGVcIildPWZ1bmN0aW9uKCl7dmFyIGFyZ3M9dG9BcnJheShhcmd1bWVudHMpO3ZhciBjYWxsYmFjaz1hcmdzW2FyZ3MubGVuZ3RoLTFdO3ZhciBuYXRpdmVPYmplY3Q9dGhpcy5fc3RvcmV8fHRoaXMuX2luZGV4O3ZhciByZXF1ZXN0PW5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LGFyZ3Muc2xpY2UoMCwtMSkpO3JlcXVlc3Qub25zdWNjZXNzPWZ1bmN0aW9uKCl7Y2FsbGJhY2socmVxdWVzdC5yZXN1bHQpfX19KX0pOy8vIHBvbHlmaWxsIGdldEFsbFxuW0luZGV4LE9iamVjdFN0b3JlXS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKXtpZihDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsKXJldHVybjtDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsPWZ1bmN0aW9uKHF1ZXJ5LGNvdW50KXt2YXIgaW5zdGFuY2U9dGhpczt2YXIgaXRlbXM9W107cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe2luc3RhbmNlLml0ZXJhdGVDdXJzb3IocXVlcnksZnVuY3Rpb24oY3Vyc29yKXtpZighY3Vyc29yKXtyZXNvbHZlKGl0ZW1zKTtyZXR1cm59aXRlbXMucHVzaChjdXJzb3IudmFsdWUpO2lmKGNvdW50IT09dW5kZWZpbmVkJiZpdGVtcy5sZW5ndGg9PWNvdW50KXtyZXNvbHZlKGl0ZW1zKTtyZXR1cm59Y3Vyc29yLmNvbnRpbnVlKCl9KX0pfX0pO3ZhciBleHA9e29wZW46ZnVuY3Rpb24gb3BlbihuYW1lLHZlcnNpb24sdXBncmFkZUNhbGxiYWNrKXt2YXIgcD1wcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsXCJvcGVuXCIsW25hbWUsdmVyc2lvbl0pO3ZhciByZXF1ZXN0PXAucmVxdWVzdDtpZihyZXF1ZXN0KXtyZXF1ZXN0Lm9udXBncmFkZW5lZWRlZD1mdW5jdGlvbihldmVudCl7aWYodXBncmFkZUNhbGxiYWNrKXt1cGdyYWRlQ2FsbGJhY2sobmV3IFVwZ3JhZGVEQihyZXF1ZXN0LnJlc3VsdCxldmVudC5vbGRWZXJzaW9uLHJlcXVlc3QudHJhbnNhY3Rpb24pKX19fXJldHVybiBwLnRoZW4oZnVuY3Rpb24oZGIpe3JldHVybiBuZXcgREIoZGIpfSl9LGRlbGV0ZTpmdW5jdGlvbiBfZGVsZXRlKG5hbWUpe3JldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsXCJkZWxldGVEYXRhYmFzZVwiLFtuYW1lXSl9fTtpZih0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZXhwO21vZHVsZS5leHBvcnRzLmRlZmF1bHQ9bW9kdWxlLmV4cG9ydHN9ZWxzZXtzZWxmLmlkYj1leHB9fSkoKX0se31dfSx7fSxbMV0pfSx7XCJpZGJcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdG9BcnJheShhcnIpe3JldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpfWZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCl7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtyZXF1ZXN0Lm9uc3VjY2Vzcz1mdW5jdGlvbigpe3Jlc29sdmUocmVxdWVzdC5yZXN1bHQpfTtyZXF1ZXN0Lm9uZXJyb3I9ZnVuY3Rpb24oKXtyZWplY3QocmVxdWVzdC5lcnJvcil9fSl9ZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdENhbGwob2JqLG1ldGhvZCxhcmdzKXt2YXIgcmVxdWVzdDt2YXIgcD1uZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7cmVxdWVzdD1vYmpbbWV0aG9kXS5hcHBseShvYmosYXJncyk7cHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KS50aGVuKHJlc29sdmUscmVqZWN0KX0pO3AucmVxdWVzdD1yZXF1ZXN0O3JldHVybiBwfWZ1bmN0aW9uIHByb21pc2lmeUN1cnNvclJlcXVlc3RDYWxsKG9iaixtZXRob2QsYXJncyl7dmFyIHA9cHJvbWlzaWZ5UmVxdWVzdENhbGwob2JqLG1ldGhvZCxhcmdzKTtyZXR1cm4gcC50aGVuKGZ1bmN0aW9uKHZhbHVlKXtpZighdmFsdWUpcmV0dXJuO3JldHVybiBuZXcgQ3Vyc29yKHZhbHVlLHAucmVxdWVzdCl9KX1mdW5jdGlvbiBwcm94eVByb3BlcnRpZXMoUHJveHlDbGFzcyx0YXJnZXRQcm9wLHByb3BlcnRpZXMpe3Byb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJveHlDbGFzcy5wcm90b3R5cGUscHJvcCx7Z2V0OmZ1bmN0aW9uIGdldCgpe3JldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdfSxzZXQ6ZnVuY3Rpb24gc2V0KHZhbCl7dGhpc1t0YXJnZXRQcm9wXVtwcm9wXT12YWx9fSl9KX1mdW5jdGlvbiBwcm94eVJlcXVlc3RNZXRob2RzKFByb3h5Q2xhc3MsdGFyZ2V0UHJvcCxDb25zdHJ1Y3Rvcixwcm9wZXJ0aWVzKXtwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7aWYoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpcmV0dXJuO1Byb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdPWZ1bmN0aW9uKCl7cmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKHRoaXNbdGFyZ2V0UHJvcF0scHJvcCxhcmd1bWVudHMpfX0pfWZ1bmN0aW9uIHByb3h5TWV0aG9kcyhQcm94eUNsYXNzLHRhcmdldFByb3AsQ29uc3RydWN0b3IscHJvcGVydGllcyl7cHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3Ape2lmKCEocHJvcCBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKXJldHVybjtQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXT1mdW5jdGlvbigpe3JldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sYXJndW1lbnRzKX19KX1mdW5jdGlvbiBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKFByb3h5Q2xhc3MsdGFyZ2V0UHJvcCxDb25zdHJ1Y3Rvcixwcm9wZXJ0aWVzKXtwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7aWYoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpcmV0dXJuO1Byb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdPWZ1bmN0aW9uKCl7cmV0dXJuIHByb21pc2lmeUN1cnNvclJlcXVlc3RDYWxsKHRoaXNbdGFyZ2V0UHJvcF0scHJvcCxhcmd1bWVudHMpfX0pfWZ1bmN0aW9uIEluZGV4KGluZGV4KXt0aGlzLl9pbmRleD1pbmRleH1wcm94eVByb3BlcnRpZXMoSW5kZXgsXCJfaW5kZXhcIixbXCJuYW1lXCIsXCJrZXlQYXRoXCIsXCJtdWx0aUVudHJ5XCIsXCJ1bmlxdWVcIl0pO3Byb3h5UmVxdWVzdE1ldGhvZHMoSW5kZXgsXCJfaW5kZXhcIixJREJJbmRleCxbXCJnZXRcIixcImdldEtleVwiLFwiZ2V0QWxsXCIsXCJnZXRBbGxLZXlzXCIsXCJjb3VudFwiXSk7cHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhJbmRleCxcIl9pbmRleFwiLElEQkluZGV4LFtcIm9wZW5DdXJzb3JcIixcIm9wZW5LZXlDdXJzb3JcIl0pO2Z1bmN0aW9uIEN1cnNvcihjdXJzb3IscmVxdWVzdCl7dGhpcy5fY3Vyc29yPWN1cnNvcjt0aGlzLl9yZXF1ZXN0PXJlcXVlc3R9cHJveHlQcm9wZXJ0aWVzKEN1cnNvcixcIl9jdXJzb3JcIixbXCJkaXJlY3Rpb25cIixcImtleVwiLFwicHJpbWFyeUtleVwiLFwidmFsdWVcIl0pO3Byb3h5UmVxdWVzdE1ldGhvZHMoQ3Vyc29yLFwiX2N1cnNvclwiLElEQkN1cnNvcixbXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSk7Ly8gcHJveHkgJ25leHQnIG1ldGhvZHNcbltcImFkdmFuY2VcIixcImNvbnRpbnVlXCIsXCJjb250aW51ZVByaW1hcnlLZXlcIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtpZighKG1ldGhvZE5hbWUgaW4gSURCQ3Vyc29yLnByb3RvdHlwZSkpcmV0dXJuO0N1cnNvci5wcm90b3R5cGVbbWV0aG9kTmFtZV09ZnVuY3Rpb24oKXt2YXIgY3Vyc29yPXRoaXM7dmFyIGFyZ3M9YXJndW1lbnRzO3JldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7Y3Vyc29yLl9jdXJzb3JbbWV0aG9kTmFtZV0uYXBwbHkoY3Vyc29yLl9jdXJzb3IsYXJncyk7cmV0dXJuIHByb21pc2lmeVJlcXVlc3QoY3Vyc29yLl9yZXF1ZXN0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtpZighdmFsdWUpcmV0dXJuO3JldHVybiBuZXcgQ3Vyc29yKHZhbHVlLGN1cnNvci5fcmVxdWVzdCl9KX0pfX0pO2Z1bmN0aW9uIE9iamVjdFN0b3JlKHN0b3JlKXt0aGlzLl9zdG9yZT1zdG9yZX1PYmplY3RTdG9yZS5wcm90b3R5cGUuY3JlYXRlSW5kZXg9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEluZGV4KHRoaXMuX3N0b3JlLmNyZWF0ZUluZGV4LmFwcGx5KHRoaXMuX3N0b3JlLGFyZ3VtZW50cykpfTtPYmplY3RTdG9yZS5wcm90b3R5cGUuaW5kZXg9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEluZGV4KHRoaXMuX3N0b3JlLmluZGV4LmFwcGx5KHRoaXMuX3N0b3JlLGFyZ3VtZW50cykpfTtwcm94eVByb3BlcnRpZXMoT2JqZWN0U3RvcmUsXCJfc3RvcmVcIixbXCJuYW1lXCIsXCJrZXlQYXRoXCIsXCJpbmRleE5hbWVzXCIsXCJhdXRvSW5jcmVtZW50XCJdKTtwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLFwiX3N0b3JlXCIsSURCT2JqZWN0U3RvcmUsW1wicHV0XCIsXCJhZGRcIixcImRlbGV0ZVwiLFwiY2xlYXJcIixcImdldFwiLFwiZ2V0QWxsXCIsXCJnZXRLZXlcIixcImdldEFsbEtleXNcIixcImNvdW50XCJdKTtwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLFwiX3N0b3JlXCIsSURCT2JqZWN0U3RvcmUsW1wib3BlbkN1cnNvclwiLFwib3BlbktleUN1cnNvclwiXSk7cHJveHlNZXRob2RzKE9iamVjdFN0b3JlLFwiX3N0b3JlXCIsSURCT2JqZWN0U3RvcmUsW1wiZGVsZXRlSW5kZXhcIl0pO2Z1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKXt0aGlzLl90eD1pZGJUcmFuc2FjdGlvbjt0aGlzLmNvbXBsZXRlPW5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlPWZ1bmN0aW9uKCl7cmVzb2x2ZSgpfTtpZGJUcmFuc2FjdGlvbi5vbmVycm9yPWZ1bmN0aW9uKCl7cmVqZWN0KGlkYlRyYW5zYWN0aW9uLmVycm9yKX07aWRiVHJhbnNhY3Rpb24ub25hYm9ydD1mdW5jdGlvbigpe3JlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcil9fSl9VHJhbnNhY3Rpb24ucHJvdG90eXBlLm9iamVjdFN0b3JlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBPYmplY3RTdG9yZSh0aGlzLl90eC5vYmplY3RTdG9yZS5hcHBseSh0aGlzLl90eCxhcmd1bWVudHMpKX07cHJveHlQcm9wZXJ0aWVzKFRyYW5zYWN0aW9uLFwiX3R4XCIsW1wib2JqZWN0U3RvcmVOYW1lc1wiLFwibW9kZVwiXSk7cHJveHlNZXRob2RzKFRyYW5zYWN0aW9uLFwiX3R4XCIsSURCVHJhbnNhY3Rpb24sW1wiYWJvcnRcIl0pO2Z1bmN0aW9uIFVwZ3JhZGVEQihkYixvbGRWZXJzaW9uLHRyYW5zYWN0aW9uKXt0aGlzLl9kYj1kYjt0aGlzLm9sZFZlcnNpb249b2xkVmVyc2lvbjt0aGlzLnRyYW5zYWN0aW9uPW5ldyBUcmFuc2FjdGlvbih0cmFuc2FjdGlvbil9VXBncmFkZURCLnByb3RvdHlwZS5jcmVhdGVPYmplY3RTdG9yZT1mdW5jdGlvbigpe3JldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fZGIuY3JlYXRlT2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fZGIsYXJndW1lbnRzKSl9O3Byb3h5UHJvcGVydGllcyhVcGdyYWRlREIsXCJfZGJcIixbXCJuYW1lXCIsXCJ2ZXJzaW9uXCIsXCJvYmplY3RTdG9yZU5hbWVzXCJdKTtwcm94eU1ldGhvZHMoVXBncmFkZURCLFwiX2RiXCIsSURCRGF0YWJhc2UsW1wiZGVsZXRlT2JqZWN0U3RvcmVcIixcImNsb3NlXCJdKTtmdW5jdGlvbiBEQihkYil7dGhpcy5fZGI9ZGJ9REIucHJvdG90eXBlLnRyYW5zYWN0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBUcmFuc2FjdGlvbih0aGlzLl9kYi50cmFuc2FjdGlvbi5hcHBseSh0aGlzLl9kYixhcmd1bWVudHMpKX07cHJveHlQcm9wZXJ0aWVzKERCLFwiX2RiXCIsW1wibmFtZVwiLFwidmVyc2lvblwiLFwib2JqZWN0U3RvcmVOYW1lc1wiXSk7cHJveHlNZXRob2RzKERCLFwiX2RiXCIsSURCRGF0YWJhc2UsW1wiY2xvc2VcIl0pOy8vIEFkZCBjdXJzb3IgaXRlcmF0b3JzXG4vLyBUT0RPOiByZW1vdmUgdGhpcyBvbmNlIGJyb3dzZXJzIGRvIHRoZSByaWdodCB0aGluZyB3aXRoIHByb21pc2VzXG5bXCJvcGVuQ3Vyc29yXCIsXCJvcGVuS2V5Q3Vyc29yXCJdLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpe1tPYmplY3RTdG9yZSxJbmRleF0uZm9yRWFjaChmdW5jdGlvbihDb25zdHJ1Y3Rvcil7Ly8gRG9uJ3QgY3JlYXRlIGl0ZXJhdGVLZXlDdXJzb3IgaWYgb3BlbktleUN1cnNvciBkb2Vzbid0IGV4aXN0LlxuaWYoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKXJldHVybjtDb25zdHJ1Y3Rvci5wcm90b3R5cGVbZnVuY05hbWUucmVwbGFjZShcIm9wZW5cIixcIml0ZXJhdGVcIildPWZ1bmN0aW9uKCl7dmFyIGFyZ3M9dG9BcnJheShhcmd1bWVudHMpO3ZhciBjYWxsYmFjaz1hcmdzW2FyZ3MubGVuZ3RoLTFdO3ZhciBuYXRpdmVPYmplY3Q9dGhpcy5fc3RvcmV8fHRoaXMuX2luZGV4O3ZhciByZXF1ZXN0PW5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LGFyZ3Muc2xpY2UoMCwtMSkpO3JlcXVlc3Qub25zdWNjZXNzPWZ1bmN0aW9uKCl7Y2FsbGJhY2socmVxdWVzdC5yZXN1bHQpfX19KX0pOy8vIHBvbHlmaWxsIGdldEFsbFxuW0luZGV4LE9iamVjdFN0b3JlXS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKXtpZihDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsKXJldHVybjtDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsPWZ1bmN0aW9uKHF1ZXJ5LGNvdW50KXt2YXIgaW5zdGFuY2U9dGhpczt2YXIgaXRlbXM9W107cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe2luc3RhbmNlLml0ZXJhdGVDdXJzb3IocXVlcnksZnVuY3Rpb24oY3Vyc29yKXtpZighY3Vyc29yKXtyZXNvbHZlKGl0ZW1zKTtyZXR1cm59aXRlbXMucHVzaChjdXJzb3IudmFsdWUpO2lmKGNvdW50IT09dW5kZWZpbmVkJiZpdGVtcy5sZW5ndGg9PWNvdW50KXtyZXNvbHZlKGl0ZW1zKTtyZXR1cm59Y3Vyc29yLmNvbnRpbnVlKCl9KX0pfX0pO3ZhciBleHA9e29wZW46ZnVuY3Rpb24gb3BlbihuYW1lLHZlcnNpb24sdXBncmFkZUNhbGxiYWNrKXt2YXIgcD1wcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsXCJvcGVuXCIsW25hbWUsdmVyc2lvbl0pO3ZhciByZXF1ZXN0PXAucmVxdWVzdDtpZihyZXF1ZXN0KXtyZXF1ZXN0Lm9udXBncmFkZW5lZWRlZD1mdW5jdGlvbihldmVudCl7aWYodXBncmFkZUNhbGxiYWNrKXt1cGdyYWRlQ2FsbGJhY2sobmV3IFVwZ3JhZGVEQihyZXF1ZXN0LnJlc3VsdCxldmVudC5vbGRWZXJzaW9uLHJlcXVlc3QudHJhbnNhY3Rpb24pKX19fXJldHVybiBwLnRoZW4oZnVuY3Rpb24oZGIpe3JldHVybiBuZXcgREIoZGIpfSl9LGRlbGV0ZTpmdW5jdGlvbiBfZGVsZXRlKG5hbWUpe3JldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsXCJkZWxldGVEYXRhYmFzZVwiLFtuYW1lXSl9fTtpZih0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZXhwO21vZHVsZS5leHBvcnRzLmRlZmF1bHQ9bW9kdWxlLmV4cG9ydHN9ZWxzZXtzZWxmLmlkYj1leHB9fSkoKX0se31dfSx7fSxbMV0pO1xuXG59LHtcImlkYlwiOjJ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB0b0FycmF5KGFycikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XG4gICAgdmFyIHJlcXVlc3Q7XG4gICAgdmFyIHAgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlcXVlc3QgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG5cbiAgICBwLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5Q3Vyc29yUmVxdWVzdENhbGwob2JqLCBtZXRob2QsIGFyZ3MpIHtcbiAgICB2YXIgcCA9IHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKTtcbiAgICByZXR1cm4gcC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICByZXR1cm4gbmV3IEN1cnNvcih2YWx1ZSwgcC5yZXF1ZXN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5UHJvcGVydGllcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eUNsYXNzLnByb3RvdHlwZSwgcHJvcCwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgIHRoaXNbdGFyZ2V0UHJvcF1bcHJvcF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEluZGV4KGluZGV4KSB7XG4gICAgdGhpcy5faW5kZXggPSBpbmRleDtcbiAgfVxuXG4gIHByb3h5UHJvcGVydGllcyhJbmRleCwgJ19pbmRleCcsIFtcbiAgICAnbmFtZScsXG4gICAgJ2tleVBhdGgnLFxuICAgICdtdWx0aUVudHJ5JyxcbiAgICAndW5pcXVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnZ2V0JyxcbiAgICAnZ2V0S2V5JyxcbiAgICAnZ2V0QWxsJyxcbiAgICAnZ2V0QWxsS2V5cycsXG4gICAgJ2NvdW50J1xuICBdKTtcblxuICBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnb3BlbkN1cnNvcicsXG4gICAgJ29wZW5LZXlDdXJzb3InXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIEN1cnNvcihjdXJzb3IsIHJlcXVlc3QpIHtcbiAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cblxuICBwcm94eVByb3BlcnRpZXMoQ3Vyc29yLCAnX2N1cnNvcicsIFtcbiAgICAnZGlyZWN0aW9uJyxcbiAgICAna2V5JyxcbiAgICAncHJpbWFyeUtleScsXG4gICAgJ3ZhbHVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEN1cnNvciwgJ19jdXJzb3InLCBJREJDdXJzb3IsIFtcbiAgICAndXBkYXRlJyxcbiAgICAnZGVsZXRlJ1xuICBdKTtcblxuICAvLyBwcm94eSAnbmV4dCcgbWV0aG9kc1xuICBbJ2FkdmFuY2UnLCAnY29udGludWUnLCAnY29udGludWVQcmltYXJ5S2V5J10uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgaWYgKCEobWV0aG9kTmFtZSBpbiBJREJDdXJzb3IucHJvdG90eXBlKSkgcmV0dXJuO1xuICAgIEN1cnNvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJzb3IgPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgY3Vyc29yLl9jdXJzb3JbbWV0aG9kTmFtZV0uYXBwbHkoY3Vyc29yLl9jdXJzb3IsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChjdXJzb3IuX3JlcXVlc3QpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuIG5ldyBDdXJzb3IodmFsdWUsIGN1cnNvci5fcmVxdWVzdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gT2JqZWN0U3RvcmUoc3RvcmUpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlO1xuICB9XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmNyZWF0ZUluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5jcmVhdGVJbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5pbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgcHJveHlQcm9wZXJ0aWVzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgW1xuICAgICduYW1lJyxcbiAgICAna2V5UGF0aCcsXG4gICAgJ2luZGV4TmFtZXMnLFxuICAgICdhdXRvSW5jcmVtZW50J1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAncHV0JyxcbiAgICAnYWRkJyxcbiAgICAnZGVsZXRlJyxcbiAgICAnY2xlYXInLFxuICAgICdnZXQnLFxuICAgICdnZXRBbGwnLFxuICAgICdnZXRLZXknLFxuICAgICdnZXRBbGxLZXlzJyxcbiAgICAnY291bnQnXG4gIF0pO1xuXG4gIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xuICAgICdvcGVuQ3Vyc29yJyxcbiAgICAnb3BlbktleUN1cnNvcidcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAnZGVsZXRlSW5kZXgnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fdHggPSBpZGJUcmFuc2FjdGlvbjtcbiAgICB0aGlzLmNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH07XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcik7XG4gICAgICB9O1xuICAgICAgaWRiVHJhbnNhY3Rpb24ub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QoaWRiVHJhbnNhY3Rpb24uZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5vYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fdHgub2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fdHgsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhUcmFuc2FjdGlvbiwgJ190eCcsIFtcbiAgICAnb2JqZWN0U3RvcmVOYW1lcycsXG4gICAgJ21vZGUnXG4gIF0pO1xuXG4gIHByb3h5TWV0aG9kcyhUcmFuc2FjdGlvbiwgJ190eCcsIElEQlRyYW5zYWN0aW9uLCBbXG4gICAgJ2Fib3J0J1xuICBdKTtcblxuICBmdW5jdGlvbiBVcGdyYWRlREIoZGIsIG9sZFZlcnNpb24sIHRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgICB0aGlzLm9sZFZlcnNpb24gPSBvbGRWZXJzaW9uO1xuICAgIHRoaXMudHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pO1xuICB9XG5cbiAgVXBncmFkZURCLnByb3RvdHlwZS5jcmVhdGVPYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fZGIuY3JlYXRlT2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhVcGdyYWRlREIsICdfZGInLCBbXG4gICAgJ25hbWUnLFxuICAgICd2ZXJzaW9uJyxcbiAgICAnb2JqZWN0U3RvcmVOYW1lcydcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKFVwZ3JhZGVEQiwgJ19kYicsIElEQkRhdGFiYXNlLCBbXG4gICAgJ2RlbGV0ZU9iamVjdFN0b3JlJyxcbiAgICAnY2xvc2UnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIERCKGRiKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgfVxuXG4gIERCLnByb3RvdHlwZS50cmFuc2FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb24odGhpcy5fZGIudHJhbnNhY3Rpb24uYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhEQiwgJ19kYicsIFtcbiAgICAnbmFtZScsXG4gICAgJ3ZlcnNpb24nLFxuICAgICdvYmplY3RTdG9yZU5hbWVzJ1xuICBdKTtcblxuICBwcm94eU1ldGhvZHMoREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xuICAgICdjbG9zZSdcbiAgXSk7XG5cbiAgLy8gQWRkIGN1cnNvciBpdGVyYXRvcnNcbiAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgb25jZSBicm93c2VycyBkbyB0aGUgcmlnaHQgdGhpbmcgd2l0aCBwcm9taXNlc1xuICBbJ29wZW5DdXJzb3InLCAnb3BlbktleUN1cnNvciddLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpIHtcbiAgICBbT2JqZWN0U3RvcmUsIEluZGV4XS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG4gICAgICAvLyBEb24ndCBjcmVhdGUgaXRlcmF0ZUtleUN1cnNvciBpZiBvcGVuS2V5Q3Vyc29yIGRvZXNuJ3QgZXhpc3QuXG4gICAgICBpZiAoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG5cbiAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZVtmdW5jTmFtZS5yZXBsYWNlKCdvcGVuJywgJ2l0ZXJhdGUnKV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIG5hdGl2ZU9iamVjdCA9IHRoaXMuX3N0b3JlIHx8IHRoaXMuX2luZGV4O1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LCBhcmdzLnNsaWNlKDAsIC0xKSk7XG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gcG9seWZpbGwgZ2V0QWxsXG4gIFtJbmRleCwgT2JqZWN0U3RvcmVdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEFsbCkgcmV0dXJuO1xuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihxdWVyeSwgY291bnQpIHtcbiAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XG4gICAgICB2YXIgaXRlbXMgPSBbXTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgaW5zdGFuY2UuaXRlcmF0ZUN1cnNvcihxdWVyeSwgZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKCFjdXJzb3IpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSk7XG5cbiAgICAgICAgICBpZiAoY291bnQgIT09IHVuZGVmaW5lZCAmJiBpdGVtcy5sZW5ndGggPT0gY291bnQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICB2YXIgZXhwID0ge1xuICAgIG9wZW46IGZ1bmN0aW9uKG5hbWUsIHZlcnNpb24sIHVwZ3JhZGVDYWxsYmFjaykge1xuICAgICAgdmFyIHAgPSBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsICdvcGVuJywgW25hbWUsIHZlcnNpb25dKTtcbiAgICAgIHZhciByZXF1ZXN0ID0gcC5yZXF1ZXN0O1xuXG4gICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKHVwZ3JhZGVDYWxsYmFjaykge1xuICAgICAgICAgICAgdXBncmFkZUNhbGxiYWNrKG5ldyBVcGdyYWRlREIocmVxdWVzdC5yZXN1bHQsIGV2ZW50Lm9sZFZlcnNpb24sIHJlcXVlc3QudHJhbnNhY3Rpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwLnRoZW4oZnVuY3Rpb24oZGIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEQihkYik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKGluZGV4ZWREQiwgJ2RlbGV0ZURhdGFiYXNlJywgW25hbWVdKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBleHA7XG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzO1xuICB9XG4gIGVsc2Uge1xuICAgIHNlbGYuaWRiID0gZXhwO1xuICB9XG59KCkpO1xuXG59LHt9XX0se30sWzFdKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB0b0FycmF5KGFycikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XG4gICAgdmFyIHJlcXVlc3Q7XG4gICAgdmFyIHAgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlcXVlc3QgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG5cbiAgICBwLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5Q3Vyc29yUmVxdWVzdENhbGwob2JqLCBtZXRob2QsIGFyZ3MpIHtcbiAgICB2YXIgcCA9IHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKTtcbiAgICByZXR1cm4gcC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICByZXR1cm4gbmV3IEN1cnNvcih2YWx1ZSwgcC5yZXF1ZXN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5UHJvcGVydGllcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eUNsYXNzLnByb3RvdHlwZSwgcHJvcCwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgIHRoaXNbdGFyZ2V0UHJvcF1bcHJvcF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEluZGV4KGluZGV4KSB7XG4gICAgdGhpcy5faW5kZXggPSBpbmRleDtcbiAgfVxuXG4gIHByb3h5UHJvcGVydGllcyhJbmRleCwgJ19pbmRleCcsIFtcbiAgICAnbmFtZScsXG4gICAgJ2tleVBhdGgnLFxuICAgICdtdWx0aUVudHJ5JyxcbiAgICAndW5pcXVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnZ2V0JyxcbiAgICAnZ2V0S2V5JyxcbiAgICAnZ2V0QWxsJyxcbiAgICAnZ2V0QWxsS2V5cycsXG4gICAgJ2NvdW50J1xuICBdKTtcblxuICBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnb3BlbkN1cnNvcicsXG4gICAgJ29wZW5LZXlDdXJzb3InXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIEN1cnNvcihjdXJzb3IsIHJlcXVlc3QpIHtcbiAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cblxuICBwcm94eVByb3BlcnRpZXMoQ3Vyc29yLCAnX2N1cnNvcicsIFtcbiAgICAnZGlyZWN0aW9uJyxcbiAgICAna2V5JyxcbiAgICAncHJpbWFyeUtleScsXG4gICAgJ3ZhbHVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEN1cnNvciwgJ19jdXJzb3InLCBJREJDdXJzb3IsIFtcbiAgICAndXBkYXRlJyxcbiAgICAnZGVsZXRlJ1xuICBdKTtcblxuICAvLyBwcm94eSAnbmV4dCcgbWV0aG9kc1xuICBbJ2FkdmFuY2UnLCAnY29udGludWUnLCAnY29udGludWVQcmltYXJ5S2V5J10uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgaWYgKCEobWV0aG9kTmFtZSBpbiBJREJDdXJzb3IucHJvdG90eXBlKSkgcmV0dXJuO1xuICAgIEN1cnNvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJzb3IgPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgY3Vyc29yLl9jdXJzb3JbbWV0aG9kTmFtZV0uYXBwbHkoY3Vyc29yLl9jdXJzb3IsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChjdXJzb3IuX3JlcXVlc3QpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuIG5ldyBDdXJzb3IodmFsdWUsIGN1cnNvci5fcmVxdWVzdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gT2JqZWN0U3RvcmUoc3RvcmUpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlO1xuICB9XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmNyZWF0ZUluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5jcmVhdGVJbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5pbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgcHJveHlQcm9wZXJ0aWVzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgW1xuICAgICduYW1lJyxcbiAgICAna2V5UGF0aCcsXG4gICAgJ2luZGV4TmFtZXMnLFxuICAgICdhdXRvSW5jcmVtZW50J1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAncHV0JyxcbiAgICAnYWRkJyxcbiAgICAnZGVsZXRlJyxcbiAgICAnY2xlYXInLFxuICAgICdnZXQnLFxuICAgICdnZXRBbGwnLFxuICAgICdnZXRLZXknLFxuICAgICdnZXRBbGxLZXlzJyxcbiAgICAnY291bnQnXG4gIF0pO1xuXG4gIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xuICAgICdvcGVuQ3Vyc29yJyxcbiAgICAnb3BlbktleUN1cnNvcidcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAnZGVsZXRlSW5kZXgnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fdHggPSBpZGJUcmFuc2FjdGlvbjtcbiAgICB0aGlzLmNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH07XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcik7XG4gICAgICB9O1xuICAgICAgaWRiVHJhbnNhY3Rpb24ub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QoaWRiVHJhbnNhY3Rpb24uZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5vYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fdHgub2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fdHgsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhUcmFuc2FjdGlvbiwgJ190eCcsIFtcbiAgICAnb2JqZWN0U3RvcmVOYW1lcycsXG4gICAgJ21vZGUnXG4gIF0pO1xuXG4gIHByb3h5TWV0aG9kcyhUcmFuc2FjdGlvbiwgJ190eCcsIElEQlRyYW5zYWN0aW9uLCBbXG4gICAgJ2Fib3J0J1xuICBdKTtcblxuICBmdW5jdGlvbiBVcGdyYWRlREIoZGIsIG9sZFZlcnNpb24sIHRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgICB0aGlzLm9sZFZlcnNpb24gPSBvbGRWZXJzaW9uO1xuICAgIHRoaXMudHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pO1xuICB9XG5cbiAgVXBncmFkZURCLnByb3RvdHlwZS5jcmVhdGVPYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fZGIuY3JlYXRlT2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhVcGdyYWRlREIsICdfZGInLCBbXG4gICAgJ25hbWUnLFxuICAgICd2ZXJzaW9uJyxcbiAgICAnb2JqZWN0U3RvcmVOYW1lcydcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKFVwZ3JhZGVEQiwgJ19kYicsIElEQkRhdGFiYXNlLCBbXG4gICAgJ2RlbGV0ZU9iamVjdFN0b3JlJyxcbiAgICAnY2xvc2UnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIERCKGRiKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgfVxuXG4gIERCLnByb3RvdHlwZS50cmFuc2FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb24odGhpcy5fZGIudHJhbnNhY3Rpb24uYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhEQiwgJ19kYicsIFtcbiAgICAnbmFtZScsXG4gICAgJ3ZlcnNpb24nLFxuICAgICdvYmplY3RTdG9yZU5hbWVzJ1xuICBdKTtcblxuICBwcm94eU1ldGhvZHMoREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xuICAgICdjbG9zZSdcbiAgXSk7XG5cbiAgLy8gQWRkIGN1cnNvciBpdGVyYXRvcnNcbiAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgb25jZSBicm93c2VycyBkbyB0aGUgcmlnaHQgdGhpbmcgd2l0aCBwcm9taXNlc1xuICBbJ29wZW5DdXJzb3InLCAnb3BlbktleUN1cnNvciddLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpIHtcbiAgICBbT2JqZWN0U3RvcmUsIEluZGV4XS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG4gICAgICAvLyBEb24ndCBjcmVhdGUgaXRlcmF0ZUtleUN1cnNvciBpZiBvcGVuS2V5Q3Vyc29yIGRvZXNuJ3QgZXhpc3QuXG4gICAgICBpZiAoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG5cbiAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZVtmdW5jTmFtZS5yZXBsYWNlKCdvcGVuJywgJ2l0ZXJhdGUnKV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIG5hdGl2ZU9iamVjdCA9IHRoaXMuX3N0b3JlIHx8IHRoaXMuX2luZGV4O1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LCBhcmdzLnNsaWNlKDAsIC0xKSk7XG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gcG9seWZpbGwgZ2V0QWxsXG4gIFtJbmRleCwgT2JqZWN0U3RvcmVdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEFsbCkgcmV0dXJuO1xuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihxdWVyeSwgY291bnQpIHtcbiAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XG4gICAgICB2YXIgaXRlbXMgPSBbXTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgaW5zdGFuY2UuaXRlcmF0ZUN1cnNvcihxdWVyeSwgZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKCFjdXJzb3IpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSk7XG5cbiAgICAgICAgICBpZiAoY291bnQgIT09IHVuZGVmaW5lZCAmJiBpdGVtcy5sZW5ndGggPT0gY291bnQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICB2YXIgZXhwID0ge1xuICAgIG9wZW46IGZ1bmN0aW9uKG5hbWUsIHZlcnNpb24sIHVwZ3JhZGVDYWxsYmFjaykge1xuICAgICAgdmFyIHAgPSBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsICdvcGVuJywgW25hbWUsIHZlcnNpb25dKTtcbiAgICAgIHZhciByZXF1ZXN0ID0gcC5yZXF1ZXN0O1xuXG4gICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKHVwZ3JhZGVDYWxsYmFjaykge1xuICAgICAgICAgICAgdXBncmFkZUNhbGxiYWNrKG5ldyBVcGdyYWRlREIocmVxdWVzdC5yZXN1bHQsIGV2ZW50Lm9sZFZlcnNpb24sIHJlcXVlc3QudHJhbnNhY3Rpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwLnRoZW4oZnVuY3Rpb24oZGIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEQihkYik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKGluZGV4ZWREQiwgJ2RlbGV0ZURhdGFiYXNlJywgW25hbWVdKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBleHA7XG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzO1xuICB9XG4gIGVsc2Uge1xuICAgIHNlbGYuaWRiID0gZXhwO1xuICB9XG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHRvQXJyYXkoYXJyKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG4gIH1cblxuICBmdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzdWx0KTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdENhbGwob2JqLCBtZXRob2QsIGFyZ3MpIHtcbiAgICB2YXIgcmVxdWVzdDtcbiAgICB2YXIgcCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVxdWVzdCA9IG9ialttZXRob2RdLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcblxuICAgIHAucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBmdW5jdGlvbiBwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbChvYmosIG1ldGhvZCwgYXJncykge1xuICAgIHZhciBwID0gcHJvbWlzaWZ5UmVxdWVzdENhbGwob2JqLCBtZXRob2QsIGFyZ3MpO1xuICAgIHJldHVybiBwLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICghdmFsdWUpIHJldHVybjtcbiAgICAgIHJldHVybiBuZXcgQ3Vyc29yKHZhbHVlLCBwLnJlcXVlc3QpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlQcm9wZXJ0aWVzKFByb3h5Q2xhc3MsIHRhcmdldFByb3AsIHByb3BlcnRpZXMpIHtcbiAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb3h5Q2xhc3MucHJvdG90eXBlLCBwcm9wLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNbdGFyZ2V0UHJvcF1bcHJvcF07XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgdGhpc1t0YXJnZXRQcm9wXVtwcm9wXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm94eVJlcXVlc3RNZXRob2RzKFByb3h5Q2xhc3MsIHRhcmdldFByb3AsIENvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIGlmICghKHByb3AgaW4gQ29uc3RydWN0b3IucHJvdG90eXBlKSkgcmV0dXJuO1xuICAgICAgUHJveHlDbGFzcy5wcm90b3R5cGVbcHJvcF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKHRoaXNbdGFyZ2V0UHJvcF0sIHByb3AsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlNZXRob2RzKFByb3h5Q2xhc3MsIHRhcmdldFByb3AsIENvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIGlmICghKHByb3AgaW4gQ29uc3RydWN0b3IucHJvdG90eXBlKSkgcmV0dXJuO1xuICAgICAgUHJveHlDbGFzcy5wcm90b3R5cGVbcHJvcF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbdGFyZ2V0UHJvcF1bcHJvcF0uYXBwbHkodGhpc1t0YXJnZXRQcm9wXSwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKFByb3h5Q2xhc3MsIHRhcmdldFByb3AsIENvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIGlmICghKHByb3AgaW4gQ29uc3RydWN0b3IucHJvdG90eXBlKSkgcmV0dXJuO1xuICAgICAgUHJveHlDbGFzcy5wcm90b3R5cGVbcHJvcF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeUN1cnNvclJlcXVlc3RDYWxsKHRoaXNbdGFyZ2V0UHJvcF0sIHByb3AsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gSW5kZXgoaW5kZXgpIHtcbiAgICB0aGlzLl9pbmRleCA9IGluZGV4O1xuICB9XG5cbiAgcHJveHlQcm9wZXJ0aWVzKEluZGV4LCAnX2luZGV4JywgW1xuICAgICduYW1lJyxcbiAgICAna2V5UGF0aCcsXG4gICAgJ211bHRpRW50cnknLFxuICAgICd1bmlxdWUnXG4gIF0pO1xuXG4gIHByb3h5UmVxdWVzdE1ldGhvZHMoSW5kZXgsICdfaW5kZXgnLCBJREJJbmRleCwgW1xuICAgICdnZXQnLFxuICAgICdnZXRLZXknLFxuICAgICdnZXRBbGwnLFxuICAgICdnZXRBbGxLZXlzJyxcbiAgICAnY291bnQnXG4gIF0pO1xuXG4gIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoSW5kZXgsICdfaW5kZXgnLCBJREJJbmRleCwgW1xuICAgICdvcGVuQ3Vyc29yJyxcbiAgICAnb3BlbktleUN1cnNvcidcbiAgXSk7XG5cbiAgZnVuY3Rpb24gQ3Vyc29yKGN1cnNvciwgcmVxdWVzdCkge1xuICAgIHRoaXMuX2N1cnNvciA9IGN1cnNvcjtcbiAgICB0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuXG4gIHByb3h5UHJvcGVydGllcyhDdXJzb3IsICdfY3Vyc29yJywgW1xuICAgICdkaXJlY3Rpb24nLFxuICAgICdrZXknLFxuICAgICdwcmltYXJ5S2V5JyxcbiAgICAndmFsdWUnXG4gIF0pO1xuXG4gIHByb3h5UmVxdWVzdE1ldGhvZHMoQ3Vyc29yLCAnX2N1cnNvcicsIElEQkN1cnNvciwgW1xuICAgICd1cGRhdGUnLFxuICAgICdkZWxldGUnXG4gIF0pO1xuXG4gIC8vIHByb3h5ICduZXh0JyBtZXRob2RzXG4gIFsnYWR2YW5jZScsICdjb250aW51ZScsICdjb250aW51ZVByaW1hcnlLZXknXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICBpZiAoIShtZXRob2ROYW1lIGluIElEQkN1cnNvci5wcm90b3R5cGUpKSByZXR1cm47XG4gICAgQ3Vyc29yLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGN1cnNvciA9IHRoaXM7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBjdXJzb3IuX2N1cnNvclttZXRob2ROYW1lXS5hcHBseShjdXJzb3IuX2N1cnNvciwgYXJncyk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KGN1cnNvci5fcmVxdWVzdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcbiAgICAgICAgICByZXR1cm4gbmV3IEN1cnNvcih2YWx1ZSwgY3Vyc29yLl9yZXF1ZXN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICBmdW5jdGlvbiBPYmplY3RTdG9yZShzdG9yZSkge1xuICAgIHRoaXMuX3N0b3JlID0gc3RvcmU7XG4gIH1cblxuICBPYmplY3RTdG9yZS5wcm90b3R5cGUuY3JlYXRlSW5kZXggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEluZGV4KHRoaXMuX3N0b3JlLmNyZWF0ZUluZGV4LmFwcGx5KHRoaXMuX3N0b3JlLCBhcmd1bWVudHMpKTtcbiAgfTtcblxuICBPYmplY3RTdG9yZS5wcm90b3R5cGUuaW5kZXggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEluZGV4KHRoaXMuX3N0b3JlLmluZGV4LmFwcGx5KHRoaXMuX3N0b3JlLCBhcmd1bWVudHMpKTtcbiAgfTtcblxuICBwcm94eVByb3BlcnRpZXMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBbXG4gICAgJ25hbWUnLFxuICAgICdrZXlQYXRoJyxcbiAgICAnaW5kZXhOYW1lcycsXG4gICAgJ2F1dG9JbmNyZW1lbnQnXG4gIF0pO1xuXG4gIHByb3h5UmVxdWVzdE1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xuICAgICdwdXQnLFxuICAgICdhZGQnLFxuICAgICdkZWxldGUnLFxuICAgICdjbGVhcicsXG4gICAgJ2dldCcsXG4gICAgJ2dldEFsbCcsXG4gICAgJ2dldEtleScsXG4gICAgJ2dldEFsbEtleXMnLFxuICAgICdjb3VudCdcbiAgXSk7XG5cbiAgcHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhPYmplY3RTdG9yZSwgJ19zdG9yZScsIElEQk9iamVjdFN0b3JlLCBbXG4gICAgJ29wZW5DdXJzb3InLFxuICAgICdvcGVuS2V5Q3Vyc29yJ1xuICBdKTtcblxuICBwcm94eU1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xuICAgICdkZWxldGVJbmRleCdcbiAgXSk7XG5cbiAgZnVuY3Rpb24gVHJhbnNhY3Rpb24oaWRiVHJhbnNhY3Rpb24pIHtcbiAgICB0aGlzLl90eCA9IGlkYlRyYW5zYWN0aW9uO1xuICAgIHRoaXMuY29tcGxldGUgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlkYlRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfTtcbiAgICAgIGlkYlRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KGlkYlRyYW5zYWN0aW9uLmVycm9yKTtcbiAgICAgIH07XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcik7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgVHJhbnNhY3Rpb24ucHJvdG90eXBlLm9iamVjdFN0b3JlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RTdG9yZSh0aGlzLl90eC5vYmplY3RTdG9yZS5hcHBseSh0aGlzLl90eCwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgcHJveHlQcm9wZXJ0aWVzKFRyYW5zYWN0aW9uLCAnX3R4JywgW1xuICAgICdvYmplY3RTdG9yZU5hbWVzJyxcbiAgICAnbW9kZSdcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKFRyYW5zYWN0aW9uLCAnX3R4JywgSURCVHJhbnNhY3Rpb24sIFtcbiAgICAnYWJvcnQnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIFVwZ3JhZGVEQihkYiwgb2xkVmVyc2lvbiwgdHJhbnNhY3Rpb24pIHtcbiAgICB0aGlzLl9kYiA9IGRiO1xuICAgIHRoaXMub2xkVmVyc2lvbiA9IG9sZFZlcnNpb247XG4gICAgdGhpcy50cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbih0cmFuc2FjdGlvbik7XG4gIH1cblxuICBVcGdyYWRlREIucHJvdG90eXBlLmNyZWF0ZU9iamVjdFN0b3JlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RTdG9yZSh0aGlzLl9kYi5jcmVhdGVPYmplY3RTdG9yZS5hcHBseSh0aGlzLl9kYiwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgcHJveHlQcm9wZXJ0aWVzKFVwZ3JhZGVEQiwgJ19kYicsIFtcbiAgICAnbmFtZScsXG4gICAgJ3ZlcnNpb24nLFxuICAgICdvYmplY3RTdG9yZU5hbWVzJ1xuICBdKTtcblxuICBwcm94eU1ldGhvZHMoVXBncmFkZURCLCAnX2RiJywgSURCRGF0YWJhc2UsIFtcbiAgICAnZGVsZXRlT2JqZWN0U3RvcmUnLFxuICAgICdjbG9zZSdcbiAgXSk7XG5cbiAgZnVuY3Rpb24gREIoZGIpIHtcbiAgICB0aGlzLl9kYiA9IGRiO1xuICB9XG5cbiAgREIucHJvdG90eXBlLnRyYW5zYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBUcmFuc2FjdGlvbih0aGlzLl9kYi50cmFuc2FjdGlvbi5hcHBseSh0aGlzLl9kYiwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgcHJveHlQcm9wZXJ0aWVzKERCLCAnX2RiJywgW1xuICAgICduYW1lJyxcbiAgICAndmVyc2lvbicsXG4gICAgJ29iamVjdFN0b3JlTmFtZXMnXG4gIF0pO1xuXG4gIHByb3h5TWV0aG9kcyhEQiwgJ19kYicsIElEQkRhdGFiYXNlLCBbXG4gICAgJ2Nsb3NlJ1xuICBdKTtcblxuICAvLyBBZGQgY3Vyc29yIGl0ZXJhdG9yc1xuICAvLyBUT0RPOiByZW1vdmUgdGhpcyBvbmNlIGJyb3dzZXJzIGRvIHRoZSByaWdodCB0aGluZyB3aXRoIHByb21pc2VzXG4gIFsnb3BlbkN1cnNvcicsICdvcGVuS2V5Q3Vyc29yJ10uZm9yRWFjaChmdW5jdGlvbihmdW5jTmFtZSkge1xuICAgIFtPYmplY3RTdG9yZSwgSW5kZXhdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcbiAgICAgIC8vIERvbid0IGNyZWF0ZSBpdGVyYXRlS2V5Q3Vyc29yIGlmIG9wZW5LZXlDdXJzb3IgZG9lc24ndCBleGlzdC5cbiAgICAgIGlmICghKGZ1bmNOYW1lIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcblxuICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlW2Z1bmNOYW1lLnJlcGxhY2UoJ29wZW4nLCAnaXRlcmF0ZScpXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IHRvQXJyYXkoYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuICAgICAgICB2YXIgbmF0aXZlT2JqZWN0ID0gdGhpcy5fc3RvcmUgfHwgdGhpcy5faW5kZXg7XG4gICAgICAgIHZhciByZXF1ZXN0ID0gbmF0aXZlT2JqZWN0W2Z1bmNOYW1lXS5hcHBseShuYXRpdmVPYmplY3QsIGFyZ3Muc2xpY2UoMCwgLTEpKTtcbiAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjYWxsYmFjayhyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBwb2x5ZmlsbCBnZXRBbGxcbiAgW0luZGV4LCBPYmplY3RTdG9yZV0uZm9yRWFjaChmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgIGlmIChDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsKSByZXR1cm47XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKHF1ZXJ5LCBjb3VudCkge1xuICAgICAgdmFyIGluc3RhbmNlID0gdGhpcztcbiAgICAgIHZhciBpdGVtcyA9IFtdO1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBpbnN0YW5jZS5pdGVyYXRlQ3Vyc29yKHF1ZXJ5LCBmdW5jdGlvbihjdXJzb3IpIHtcbiAgICAgICAgICBpZiAoIWN1cnNvcikge1xuICAgICAgICAgICAgcmVzb2x2ZShpdGVtcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGl0ZW1zLnB1c2goY3Vyc29yLnZhbHVlKTtcblxuICAgICAgICAgIGlmIChjb3VudCAhPT0gdW5kZWZpbmVkICYmIGl0ZW1zLmxlbmd0aCA9PSBjb3VudCkge1xuICAgICAgICAgICAgcmVzb2x2ZShpdGVtcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4gIHZhciBleHAgPSB7XG4gICAgb3BlbjogZnVuY3Rpb24obmFtZSwgdmVyc2lvbiwgdXBncmFkZUNhbGxiYWNrKSB7XG4gICAgICB2YXIgcCA9IHByb21pc2lmeVJlcXVlc3RDYWxsKGluZGV4ZWREQiwgJ29wZW4nLCBbbmFtZSwgdmVyc2lvbl0pO1xuICAgICAgdmFyIHJlcXVlc3QgPSBwLnJlcXVlc3Q7XG5cbiAgICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBpZiAodXBncmFkZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICB1cGdyYWRlQ2FsbGJhY2sobmV3IFVwZ3JhZGVEQihyZXF1ZXN0LnJlc3VsdCwgZXZlbnQub2xkVmVyc2lvbiwgcmVxdWVzdC50cmFuc2FjdGlvbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHAudGhlbihmdW5jdGlvbihkYikge1xuICAgICAgICByZXR1cm4gbmV3IERCKGRiKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdENhbGwoaW5kZXhlZERCLCAnZGVsZXRlRGF0YWJhc2UnLCBbbmFtZV0pO1xuICAgIH1cbiAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGV4cDtcbiAgICBtb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gbW9kdWxlLmV4cG9ydHM7XG4gIH1cbiAgZWxzZSB7XG4gICAgc2VsZi5pZGIgPSBleHA7XG4gIH1cbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gdG9BcnJheShhcnIpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0Q2FsbChvYmosIG1ldGhvZCwgYXJncykge1xuICAgIHZhciByZXF1ZXN0O1xuICAgIHZhciBwID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXF1ZXN0ID0gb2JqW21ldGhvZF0uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuXG4gICAgcC5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICByZXR1cm4gcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb21pc2lmeUN1cnNvclJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XG4gICAgdmFyIHAgPSBwcm9taXNpZnlSZXF1ZXN0Q2FsbChvYmosIG1ldGhvZCwgYXJncyk7XG4gICAgcmV0dXJuIHAudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xuICAgICAgcmV0dXJuIG5ldyBDdXJzb3IodmFsdWUsIHAucmVxdWVzdCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm94eVByb3BlcnRpZXMoUHJveHlDbGFzcywgdGFyZ2V0UHJvcCwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJveHlDbGFzcy5wcm90b3R5cGUsIHByb3AsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpc1t0YXJnZXRQcm9wXVtwcm9wXTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICB0aGlzW3RhcmdldFByb3BdW3Byb3BdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5UmVxdWVzdE1ldGhvZHMoUHJveHlDbGFzcywgdGFyZ2V0UHJvcCwgQ29uc3RydWN0b3IsIHByb3BlcnRpZXMpIHtcbiAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgaWYgKCEocHJvcCBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG4gICAgICBQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdENhbGwodGhpc1t0YXJnZXRQcm9wXSwgcHJvcCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm94eU1ldGhvZHMoUHJveHlDbGFzcywgdGFyZ2V0UHJvcCwgQ29uc3RydWN0b3IsIHByb3BlcnRpZXMpIHtcbiAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgaWYgKCEocHJvcCBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG4gICAgICBQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpc1t0YXJnZXRQcm9wXVtwcm9wXS5hcHBseSh0aGlzW3RhcmdldFByb3BdLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoUHJveHlDbGFzcywgdGFyZ2V0UHJvcCwgQ29uc3RydWN0b3IsIHByb3BlcnRpZXMpIHtcbiAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgaWYgKCEocHJvcCBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG4gICAgICBQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5Q3Vyc29yUmVxdWVzdENhbGwodGhpc1t0YXJnZXRQcm9wXSwgcHJvcCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBJbmRleChpbmRleCkge1xuICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XG4gIH1cblxuICBwcm94eVByb3BlcnRpZXMoSW5kZXgsICdfaW5kZXgnLCBbXG4gICAgJ25hbWUnLFxuICAgICdrZXlQYXRoJyxcbiAgICAnbXVsdGlFbnRyeScsXG4gICAgJ3VuaXF1ZSdcbiAgXSk7XG5cbiAgcHJveHlSZXF1ZXN0TWV0aG9kcyhJbmRleCwgJ19pbmRleCcsIElEQkluZGV4LCBbXG4gICAgJ2dldCcsXG4gICAgJ2dldEtleScsXG4gICAgJ2dldEFsbCcsXG4gICAgJ2dldEFsbEtleXMnLFxuICAgICdjb3VudCdcbiAgXSk7XG5cbiAgcHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhJbmRleCwgJ19pbmRleCcsIElEQkluZGV4LCBbXG4gICAgJ29wZW5DdXJzb3InLFxuICAgICdvcGVuS2V5Q3Vyc29yJ1xuICBdKTtcblxuICBmdW5jdGlvbiBDdXJzb3IoY3Vyc29yLCByZXF1ZXN0KSB7XG4gICAgdGhpcy5fY3Vyc29yID0gY3Vyc29yO1xuICAgIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG5cbiAgcHJveHlQcm9wZXJ0aWVzKEN1cnNvciwgJ19jdXJzb3InLCBbXG4gICAgJ2RpcmVjdGlvbicsXG4gICAgJ2tleScsXG4gICAgJ3ByaW1hcnlLZXknLFxuICAgICd2YWx1ZSdcbiAgXSk7XG5cbiAgcHJveHlSZXF1ZXN0TWV0aG9kcyhDdXJzb3IsICdfY3Vyc29yJywgSURCQ3Vyc29yLCBbXG4gICAgJ3VwZGF0ZScsXG4gICAgJ2RlbGV0ZSdcbiAgXSk7XG5cbiAgLy8gcHJveHkgJ25leHQnIG1ldGhvZHNcbiAgWydhZHZhbmNlJywgJ2NvbnRpbnVlJywgJ2NvbnRpbnVlUHJpbWFyeUtleSddLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgIGlmICghKG1ldGhvZE5hbWUgaW4gSURCQ3Vyc29yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICBDdXJzb3IucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY3Vyc29yID0gdGhpcztcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGN1cnNvci5fY3Vyc29yW21ldGhvZE5hbWVdLmFwcGx5KGN1cnNvci5fY3Vyc29yLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QoY3Vyc29yLl9yZXF1ZXN0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xuICAgICAgICAgIHJldHVybiBuZXcgQ3Vyc29yKHZhbHVlLCBjdXJzb3IuX3JlcXVlc3QpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIE9iamVjdFN0b3JlKHN0b3JlKSB7XG4gICAgdGhpcy5fc3RvcmUgPSBzdG9yZTtcbiAgfVxuXG4gIE9iamVjdFN0b3JlLnByb3RvdHlwZS5jcmVhdGVJbmRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSW5kZXgodGhpcy5fc3RvcmUuY3JlYXRlSW5kZXguYXBwbHkodGhpcy5fc3RvcmUsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIE9iamVjdFN0b3JlLnByb3RvdHlwZS5pbmRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSW5kZXgodGhpcy5fc3RvcmUuaW5kZXguYXBwbHkodGhpcy5fc3RvcmUsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhPYmplY3RTdG9yZSwgJ19zdG9yZScsIFtcbiAgICAnbmFtZScsXG4gICAgJ2tleVBhdGgnLFxuICAgICdpbmRleE5hbWVzJyxcbiAgICAnYXV0b0luY3JlbWVudCdcbiAgXSk7XG5cbiAgcHJveHlSZXF1ZXN0TWV0aG9kcyhPYmplY3RTdG9yZSwgJ19zdG9yZScsIElEQk9iamVjdFN0b3JlLCBbXG4gICAgJ3B1dCcsXG4gICAgJ2FkZCcsXG4gICAgJ2RlbGV0ZScsXG4gICAgJ2NsZWFyJyxcbiAgICAnZ2V0JyxcbiAgICAnZ2V0QWxsJyxcbiAgICAnZ2V0S2V5JyxcbiAgICAnZ2V0QWxsS2V5cycsXG4gICAgJ2NvdW50J1xuICBdKTtcblxuICBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAnb3BlbkN1cnNvcicsXG4gICAgJ29wZW5LZXlDdXJzb3InXG4gIF0pO1xuXG4gIHByb3h5TWV0aG9kcyhPYmplY3RTdG9yZSwgJ19zdG9yZScsIElEQk9iamVjdFN0b3JlLCBbXG4gICAgJ2RlbGV0ZUluZGV4J1xuICBdKTtcblxuICBmdW5jdGlvbiBUcmFuc2FjdGlvbihpZGJUcmFuc2FjdGlvbikge1xuICAgIHRoaXMuX3R4ID0gaWRiVHJhbnNhY3Rpb247XG4gICAgdGhpcy5jb21wbGV0ZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaWRiVHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9O1xuICAgICAgaWRiVHJhbnNhY3Rpb24ub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QoaWRiVHJhbnNhY3Rpb24uZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIGlkYlRyYW5zYWN0aW9uLm9uYWJvcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KGlkYlRyYW5zYWN0aW9uLmVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBUcmFuc2FjdGlvbi5wcm90b3R5cGUub2JqZWN0U3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IE9iamVjdFN0b3JlKHRoaXMuX3R4Lm9iamVjdFN0b3JlLmFwcGx5KHRoaXMuX3R4LCBhcmd1bWVudHMpKTtcbiAgfTtcblxuICBwcm94eVByb3BlcnRpZXMoVHJhbnNhY3Rpb24sICdfdHgnLCBbXG4gICAgJ29iamVjdFN0b3JlTmFtZXMnLFxuICAgICdtb2RlJ1xuICBdKTtcblxuICBwcm94eU1ldGhvZHMoVHJhbnNhY3Rpb24sICdfdHgnLCBJREJUcmFuc2FjdGlvbiwgW1xuICAgICdhYm9ydCdcbiAgXSk7XG5cbiAgZnVuY3Rpb24gVXBncmFkZURCKGRiLCBvbGRWZXJzaW9uLCB0cmFuc2FjdGlvbikge1xuICAgIHRoaXMuX2RiID0gZGI7XG4gICAgdGhpcy5vbGRWZXJzaW9uID0gb2xkVmVyc2lvbjtcbiAgICB0aGlzLnRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKTtcbiAgfVxuXG4gIFVwZ3JhZGVEQi5wcm90b3R5cGUuY3JlYXRlT2JqZWN0U3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IE9iamVjdFN0b3JlKHRoaXMuX2RiLmNyZWF0ZU9iamVjdFN0b3JlLmFwcGx5KHRoaXMuX2RiLCBhcmd1bWVudHMpKTtcbiAgfTtcblxuICBwcm94eVByb3BlcnRpZXMoVXBncmFkZURCLCAnX2RiJywgW1xuICAgICduYW1lJyxcbiAgICAndmVyc2lvbicsXG4gICAgJ29iamVjdFN0b3JlTmFtZXMnXG4gIF0pO1xuXG4gIHByb3h5TWV0aG9kcyhVcGdyYWRlREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xuICAgICdkZWxldGVPYmplY3RTdG9yZScsXG4gICAgJ2Nsb3NlJ1xuICBdKTtcblxuICBmdW5jdGlvbiBEQihkYikge1xuICAgIHRoaXMuX2RiID0gZGI7XG4gIH1cblxuICBEQi5wcm90b3R5cGUudHJhbnNhY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zYWN0aW9uKHRoaXMuX2RiLnRyYW5zYWN0aW9uLmFwcGx5KHRoaXMuX2RiLCBhcmd1bWVudHMpKTtcbiAgfTtcblxuICBwcm94eVByb3BlcnRpZXMoREIsICdfZGInLCBbXG4gICAgJ25hbWUnLFxuICAgICd2ZXJzaW9uJyxcbiAgICAnb2JqZWN0U3RvcmVOYW1lcydcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKERCLCAnX2RiJywgSURCRGF0YWJhc2UsIFtcbiAgICAnY2xvc2UnXG4gIF0pO1xuXG4gIC8vIEFkZCBjdXJzb3IgaXRlcmF0b3JzXG4gIC8vIFRPRE86IHJlbW92ZSB0aGlzIG9uY2UgYnJvd3NlcnMgZG8gdGhlIHJpZ2h0IHRoaW5nIHdpdGggcHJvbWlzZXNcbiAgWydvcGVuQ3Vyc29yJywgJ29wZW5LZXlDdXJzb3InXS5mb3JFYWNoKGZ1bmN0aW9uKGZ1bmNOYW1lKSB7XG4gICAgW09iamVjdFN0b3JlLCBJbmRleF0uZm9yRWFjaChmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgICAgLy8gRG9uJ3QgY3JlYXRlIGl0ZXJhdGVLZXlDdXJzb3IgaWYgb3BlbktleUN1cnNvciBkb2Vzbid0IGV4aXN0LlxuICAgICAgaWYgKCEoZnVuY05hbWUgaW4gQ29uc3RydWN0b3IucHJvdG90eXBlKSkgcmV0dXJuO1xuXG4gICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGVbZnVuY05hbWUucmVwbGFjZSgnb3BlbicsICdpdGVyYXRlJyldID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gdG9BcnJheShhcmd1bWVudHMpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG4gICAgICAgIHZhciBuYXRpdmVPYmplY3QgPSB0aGlzLl9zdG9yZSB8fCB0aGlzLl9pbmRleDtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuYXRpdmVPYmplY3RbZnVuY05hbWVdLmFwcGx5KG5hdGl2ZU9iamVjdCwgYXJncy5zbGljZSgwLCAtMSkpO1xuICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNhbGxiYWNrKHJlcXVlc3QucmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIHBvbHlmaWxsIGdldEFsbFxuICBbSW5kZXgsIE9iamVjdFN0b3JlXS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRBbGwpIHJldHVybjtcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24ocXVlcnksIGNvdW50KSB7XG4gICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzO1xuICAgICAgdmFyIGl0ZW1zID0gW107XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIGluc3RhbmNlLml0ZXJhdGVDdXJzb3IocXVlcnksIGZ1bmN0aW9uKGN1cnNvcikge1xuICAgICAgICAgIGlmICghY3Vyc29yKSB7XG4gICAgICAgICAgICByZXNvbHZlKGl0ZW1zKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaXRlbXMucHVzaChjdXJzb3IudmFsdWUpO1xuXG4gICAgICAgICAgaWYgKGNvdW50ICE9PSB1bmRlZmluZWQgJiYgaXRlbXMubGVuZ3RoID09IGNvdW50KSB7XG4gICAgICAgICAgICByZXNvbHZlKGl0ZW1zKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgdmFyIGV4cCA9IHtcbiAgICBvcGVuOiBmdW5jdGlvbihuYW1lLCB2ZXJzaW9uLCB1cGdyYWRlQ2FsbGJhY2spIHtcbiAgICAgIHZhciBwID0gcHJvbWlzaWZ5UmVxdWVzdENhbGwoaW5kZXhlZERCLCAnb3BlbicsIFtuYW1lLCB2ZXJzaW9uXSk7XG4gICAgICB2YXIgcmVxdWVzdCA9IHAucmVxdWVzdDtcblxuICAgICAgaWYgKHJlcXVlc3QpIHtcbiAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIGlmICh1cGdyYWRlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHVwZ3JhZGVDYWxsYmFjayhuZXcgVXBncmFkZURCKHJlcXVlc3QucmVzdWx0LCBldmVudC5vbGRWZXJzaW9uLCByZXF1ZXN0LnRyYW5zYWN0aW9uKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcC50aGVuKGZ1bmN0aW9uKGRiKSB7XG4gICAgICAgIHJldHVybiBuZXcgREIoZGIpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsICdkZWxldGVEYXRhYmFzZScsIFtuYW1lXSk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwO1xuICAgIG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBtb2R1bGUuZXhwb3J0cztcbiAgfVxuICBlbHNlIHtcbiAgICBzZWxmLmlkYiA9IGV4cDtcbiAgfVxufSgpKTtcbiJdfQ==
