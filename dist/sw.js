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
		'use strict';

		//Establish version number of cache to remove outdated caches during an update

		var cacheVersion = 'v2';

		//Assets to cache for offline use
		var cacheAssets = ['/', '/index.html', '/restaurant.html', '/restaurant.html?id=1', '/restaurant.html?id=2', '/restaurant.html?id=3', '/restaurant.html?id=4', '/restaurant.html?id=5', '/restaurant.html?id=6', '/restaurant.html?id=7', '/restaurant.html?id=8', '/restaurant.html?id=9', '/restaurant.html?id=10', '../data/restaurants.json', '/css/styles.css', '/js/dbhelper.js', '/js/index.js', '/js/main.js', '/js/restaurant_info.js', '/img/1_large.jpg', '/img/2_large.jpg', '/img/3_large.jpg', '/img/4_large.jpg', '/img/5_large.jpg', '/img/6_large.jpg', '/img/7_large.jpg', '/img/8_large.jpg', '/img/9_large.jpg', '/img/10_large.jpg', '/img/1_small.jpg', '/img/2_small.jpg', '/img/3_small.jpg', '/img/4_small.jpg', '/img/5_small.jpg', '/img/6_small.jpg', '/img/7_small.jpg', '/img/8_small.jpg', '/img/9_small.jpg', '/img/10_small.jpg'];

		//Installs a service worker and caches assets with current cache version as its name.
		self.addEventListener('install', function (event) {
			event.waitUntil(caches.open(cacheVersion + '-restaurant').then(function (cache) {
				return cache.addAll(cacheAssets);
			}));
			console.log('Installed service worker and cached assets');
		});

		/* Updates the service worker with a newer version (if available in a waiting state). Activate fires once older service worker no longer controls current pages. Older cache(s) is also deleted. */
		self.addEventListener('activate', function (event) {
			event.waitUntil(caches.keys().then(function (cacheNames) {
				return Promise.all(cacheNames.filter(function (cacheName) {
					return !cacheName.startsWith(cacheVersion);
				}).map(function (cacheName) {
					return caches.delete(cacheName);
				}));
			}));
			console.log('Deleted old cache and activated new service worker');
		});

		/* Fetches assets from the cache the service worker created if a matching response is found. If not, fetches assets from the network and adds these new asset requests to the cache. */
		self.addEventListener('fetch', function (event) {
			event.respondWith(caches.match(event.request).then(function (response) {
				if (response) {
					console.log('Found ' + event.request.url + ' in cache');
					return response;
				}
				var fetchRequest = event.request.clone();
				console.log('Network request for ' + event.request.url);
				return fetch(fetchRequest).then(function (response) {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}
					var responseToCache = response.clone();
					caches.open(cacheVersion + '-restaurant').then(function (cache) {
						cache.put(event.request, responseToCache);
					});
					return response;
				});
			}));
		});
	}, {}] }, {}, [1]);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3N3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFBLFlBQUE7QUFBQSxVQUFBLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFdBQUEsQ0FBQSxDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7QUFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLENBQUEsRUFBQTtBQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxFQUFBO0FBQUEsU0FBQSxJQUFBLGNBQUEsT0FBQSxPQUFBLElBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxDQUFBLHlCQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsQ0FBQSxNQUFBLEVBQUEsSUFBQSxHQUFBLGtCQUFBLEVBQUEsQ0FBQTtBQUFBLFNBQUEsSUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLENBQUEsRUFBQTtBQUFBLFNBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBO0FBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsV0FBQSxFQUFBLENBQUEsRUFBQSxPQUFBO0FBQUEs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ZUFBQSxhQUFBLEVBQUEsSUFBQSxDQUErQyxVQUFBLEtBQUEsRUFBUztBQUN2RCxZQUFBLEdBQUEsQ0FBVSxNQUFWLE9BQUEsRUFBQSxlQUFBO0FBREQsTUFBQTtBQUdBLFlBQUEsUUFBQTtBQVJELEtBQU8sQ0FBUDtBQVJGLElBQ0MsQ0FERDtBQURELEdBQUE7RURyRUEsRSxFQUFBLENBQUEsRUFBQSxFLEVBQUEsRSxHQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vRXN0YWJsaXNoIHZlcnNpb24gbnVtYmVyIG9mIGNhY2hlIHRvIHJlbW92ZSBvdXRkYXRlZCBjYWNoZXMgZHVyaW5nIGFuIHVwZGF0ZVxuY29uc3QgY2FjaGVWZXJzaW9uID0gJ3YyJztcblxuLy9Bc3NldHMgdG8gY2FjaGUgZm9yIG9mZmxpbmUgdXNlXG5jb25zdCBjYWNoZUFzc2V0cyA9IFtcblx0Jy8nLFxuXHQnL2luZGV4Lmh0bWwnLFxuXHQnL3Jlc3RhdXJhbnQuaHRtbCcsXG5cdCcvcmVzdGF1cmFudC5odG1sP2lkPTEnLFxuXHQnL3Jlc3RhdXJhbnQuaHRtbD9pZD0yJyxcblx0Jy9yZXN0YXVyYW50Lmh0bWw/aWQ9MycsXG5cdCcvcmVzdGF1cmFudC5odG1sP2lkPTQnLFxuXHQnL3Jlc3RhdXJhbnQuaHRtbD9pZD01Jyxcblx0Jy9yZXN0YXVyYW50Lmh0bWw/aWQ9NicsXG5cdCcvcmVzdGF1cmFudC5odG1sP2lkPTcnLFxuXHQnL3Jlc3RhdXJhbnQuaHRtbD9pZD04Jyxcblx0Jy9yZXN0YXVyYW50Lmh0bWw/aWQ9OScsXG5cdCcvcmVzdGF1cmFudC5odG1sP2lkPTEwJyxcblx0Jy4uL2RhdGEvcmVzdGF1cmFudHMuanNvbicsXG5cdCcvY3NzL3N0eWxlcy5jc3MnLFxuXHQnL2pzL2RiaGVscGVyLmpzJyxcblx0Jy9qcy9pbmRleC5qcycsXG5cdCcvanMvbWFpbi5qcycsXG5cdCcvanMvcmVzdGF1cmFudF9pbmZvLmpzJyxcblx0Jy9pbWcvMV9sYXJnZS5qcGcnLFxuXHQnL2ltZy8yX2xhcmdlLmpwZycsXG5cdCcvaW1nLzNfbGFyZ2UuanBnJyxcblx0Jy9pbWcvNF9sYXJnZS5qcGcnLFxuXHQnL2ltZy81X2xhcmdlLmpwZycsXG5cdCcvaW1nLzZfbGFyZ2UuanBnJyxcblx0Jy9pbWcvN19sYXJnZS5qcGcnLFxuXHQnL2ltZy84X2xhcmdlLmpwZycsXG5cdCcvaW1nLzlfbGFyZ2UuanBnJyxcblx0Jy9pbWcvMTBfbGFyZ2UuanBnJyxcblx0Jy9pbWcvMV9zbWFsbC5qcGcnLFxuXHQnL2ltZy8yX3NtYWxsLmpwZycsXG5cdCcvaW1nLzNfc21hbGwuanBnJyxcblx0Jy9pbWcvNF9zbWFsbC5qcGcnLFxuXHQnL2ltZy81X3NtYWxsLmpwZycsXG5cdCcvaW1nLzZfc21hbGwuanBnJyxcblx0Jy9pbWcvN19zbWFsbC5qcGcnLFxuXHQnL2ltZy84X3NtYWxsLmpwZycsXG5cdCcvaW1nLzlfc21hbGwuanBnJyxcblx0Jy9pbWcvMTBfc21hbGwuanBnJ1xuXTtcblxuLy9JbnN0YWxscyBhIHNlcnZpY2Ugd29ya2VyIGFuZCBjYWNoZXMgYXNzZXRzIHdpdGggY3VycmVudCBjYWNoZSB2ZXJzaW9uIGFzIGl0cyBuYW1lLlxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgZXZlbnQgPT4ge1xuXHRldmVudC53YWl0VW50aWwoXG5cdFx0Y2FjaGVzLm9wZW4oYCR7Y2FjaGVWZXJzaW9ufS1yZXN0YXVyYW50YCkudGhlbihjYWNoZSA9PiB7XG5cdFx0XHRyZXR1cm4gY2FjaGUuYWRkQWxsKGNhY2hlQXNzZXRzKTtcblx0XHR9KVxuXHQpO1xuXHRjb25zb2xlLmxvZygnSW5zdGFsbGVkIHNlcnZpY2Ugd29ya2VyIGFuZCBjYWNoZWQgYXNzZXRzJyk7XG59KTtcblxuLyogVXBkYXRlcyB0aGUgc2VydmljZSB3b3JrZXIgd2l0aCBhIG5ld2VyIHZlcnNpb24gKGlmIGF2YWlsYWJsZSBpbiBhIHdhaXRpbmcgc3RhdGUpLiBBY3RpdmF0ZSBmaXJlcyBvbmNlIG9sZGVyIHNlcnZpY2Ugd29ya2VyIG5vIGxvbmdlciBjb250cm9scyBjdXJyZW50IHBhZ2VzLiBPbGRlciBjYWNoZShzKSBpcyBhbHNvIGRlbGV0ZWQuICovXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgZXZlbnQgPT4ge1xuXHRldmVudC53YWl0VW50aWwoY2FjaGVzLmtleXMoKS50aGVuKGNhY2hlTmFtZXMgPT4ge1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChjYWNoZU5hbWVzLmZpbHRlcihjYWNoZU5hbWUgPT4ge1xuXHRcdFx0cmV0dXJuICFjYWNoZU5hbWUuc3RhcnRzV2l0aChjYWNoZVZlcnNpb24pO1xuXHRcdH0pLm1hcChjYWNoZU5hbWUgPT4ge1xuXHRcdFx0cmV0dXJuIGNhY2hlcy5kZWxldGUoY2FjaGVOYW1lKTtcblx0XHR9KSk7XG5cdH0pKTtcblx0Y29uc29sZS5sb2coJ0RlbGV0ZWQgb2xkIGNhY2hlIGFuZCBhY3RpdmF0ZWQgbmV3IHNlcnZpY2Ugd29ya2VyJyk7XG59KTtcblxuLyogRmV0Y2hlcyBhc3NldHMgZnJvbSB0aGUgY2FjaGUgdGhlIHNlcnZpY2Ugd29ya2VyIGNyZWF0ZWQgaWYgYSBtYXRjaGluZyByZXNwb25zZSBpcyBmb3VuZC4gSWYgbm90LCBmZXRjaGVzIGFzc2V0cyBmcm9tIHRoZSBuZXR3b3JrIGFuZCBhZGRzIHRoZXNlIG5ldyBhc3NldCByZXF1ZXN0cyB0byB0aGUgY2FjaGUuICovXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2ZldGNoJywgZXZlbnQgPT4ge1xuXHRldmVudC5yZXNwb25kV2l0aChcblx0XHRjYWNoZXMubWF0Y2goZXZlbnQucmVxdWVzdCkudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZihyZXNwb25zZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgRm91bmQgJHtldmVudC5yZXF1ZXN0LnVybH0gaW4gY2FjaGVgKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgZmV0Y2hSZXF1ZXN0ID0gZXZlbnQucmVxdWVzdC5jbG9uZSgpO1xuXHRcdFx0Y29uc29sZS5sb2coYE5ldHdvcmsgcmVxdWVzdCBmb3IgJHtldmVudC5yZXF1ZXN0LnVybH1gKTtcblx0XHRcdHJldHVybiBmZXRjaChmZXRjaFJlcXVlc3QpLnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHRpZighcmVzcG9uc2UgfHwgcmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgfHwgcmVzcG9uc2UudHlwZSAhPT0gJ2Jhc2ljJykge1xuXHRcdFx0XHRcdHJldHVybiByZXNwb25zZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCByZXNwb25zZVRvQ2FjaGUgPSByZXNwb25zZS5jbG9uZSgpO1xuXHRcdFx0XHRjYWNoZXMub3BlbihgJHtjYWNoZVZlcnNpb259LXJlc3RhdXJhbnRgKS50aGVuKGNhY2hlID0+IHtcblx0XHRcdFx0XHRjYWNoZS5wdXQoZXZlbnQucmVxdWVzdCwgcmVzcG9uc2VUb0NhY2hlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZTtcblx0XHRcdH0pO1xuXHRcdH0pXG5cdCk7XG59KTtcblxuIl19
