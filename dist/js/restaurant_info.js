'use strict';

var restaurant = void 0;
var map = void 0;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
	fetchRestaurantFromURL(function (error, restaurant) {
		if (error) {
			// Got an error!
			console.error(error);
		} else {
			self.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 16,
				center: restaurant.latlng,
				scrollwheel: false
			});
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
		}
	});
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
	if (self.restaurant) {
		// restaurant already fetched!
		callback(null, self.restaurant);
		return;
	}
	var id = getParameterByName('id');
	if (!id) {
		// no id found in URL
		error = 'No restaurant id in URL';
		callback(error, null);
	} else {
		DBHelper.fetchRestaurantById(id, function (error, restaurant) {
			self.restaurant = restaurant;
			if (!restaurant) {
				console.error(error);
				return;
			}
			fillRestaurantHTML();
			callback(null, restaurant);
		});
	}
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = function fillRestaurantHTML() {
	var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

	var name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;

	var address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;

	// Loads small or large version of restaurant image based on srcset and sizes. Also dynamically sets alt and title text of the image. 
	var image = document.getElementById('restaurant-img');
	image.className = 'restaurant-img';
	image.src = DBHelper.largeImageUrlForRestaurant(restaurant);
	image.srcset = DBHelper.smallImageUrlForRestaurant(restaurant) + ' 400w, ' + DBHelper.largeImageUrlForRestaurant(restaurant) + ' 800w';
	image.sizes = '50vw';
	image.title = '' + restaurant.name;
	image.alt = restaurant.name + ' in ' + restaurant.neighborhood + ' - ' + restaurant.cuisine_type + ' restaurant';

	var cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
	var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

	var hours = document.getElementById('restaurant-hours');
	for (var key in operatingHours) {
		var row = document.createElement('tr');

		var day = document.createElement('td');
		day.innerHTML = key;
		row.appendChild(day);

		var time = document.createElement('td');
		time.innerHTML = operatingHours[key];
		row.appendChild(time);

		hours.appendChild(row);
	}
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = function fillReviewsHTML() {
	var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

	var container = document.getElementById('reviews-container');
	var title = document.createElement('h2');
	title.innerHTML = 'Reviews';
	container.appendChild(title);

	if (!reviews) {
		var noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		container.appendChild(noReviews);
		return;
	}
	var ul = document.getElementById('reviews-list');
	reviews.forEach(function (review) {
		ul.appendChild(createReviewHTML(review));
	});
	container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = function createReviewHTML(review) {
	var li = document.createElement('li');
	var name = document.createElement('p');
	name.innerHTML = review.name;
	li.appendChild(name);

	var date = document.createElement('p');
	date.innerHTML = review.date;
	li.appendChild(date);

	var rating = document.createElement('p');
	rating.innerHTML = 'Rating: ' + review.rating;
	li.appendChild(rating);

	var comments = document.createElement('p');
	comments.innerHTML = review.comments;
	li.appendChild(comments);

	return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = function fillBreadcrumb() {
	var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

	var breadcrumb = document.getElementById('breadcrumb');
	var li = document.createElement('li');
	li.innerHTML = restaurant.name;
	//Set ARIA attributes so screenreader knows its on the current page for the restaurant in the breadcrumb trail.
	li.setAttribute('aria-label', restaurant.name);
	li.setAttribute('aria-describedby', 'breadcrumb-description');
	li.setAttribute('tabindex', '0');
	//Dynamically set title attribute
	li.title = restaurant.name;
	breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwibWFwIiwid2luZG93IiwiaW5pdE1hcCIsImZldGNoUmVzdGF1cmFudEZyb21VUkwiLCJlcnJvciIsImNvbnNvbGUiLCJzZWxmIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ6b29tIiwiY2VudGVyIiwibGF0bG5nIiwic2Nyb2xsd2hlZWwiLCJmaWxsQnJlYWRjcnVtYiIsIkRCSGVscGVyIiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsImNhbGxiYWNrIiwiaWQiLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwiZmlsbFJlc3RhdXJhbnRIVE1MIiwibmFtZSIsImlubmVySFRNTCIsImFkZHJlc3MiLCJpbWFnZSIsImNsYXNzTmFtZSIsInNyYyIsImxhcmdlSW1hZ2VVcmxGb3JSZXN0YXVyYW50Iiwic3Jjc2V0Iiwic21hbGxJbWFnZVVybEZvclJlc3RhdXJhbnQiLCJzaXplcyIsInRpdGxlIiwiYWx0IiwibmVpZ2hib3Job29kIiwiY3Vpc2luZV90eXBlIiwiY3Vpc2luZSIsIm9wZXJhdGluZ19ob3VycyIsImZpbGxSZXN0YXVyYW50SG91cnNIVE1MIiwiZmlsbFJldmlld3NIVE1MIiwib3BlcmF0aW5nSG91cnMiLCJob3VycyIsImtleSIsInJvdyIsImNyZWF0ZUVsZW1lbnQiLCJkYXkiLCJhcHBlbmRDaGlsZCIsInRpbWUiLCJyZXZpZXdzIiwiY29udGFpbmVyIiwibm9SZXZpZXdzIiwidWwiLCJmb3JFYWNoIiwiY3JlYXRlUmV2aWV3SFRNTCIsInJldmlldyIsImxpIiwiZGF0ZSIsInJhdGluZyIsImNvbW1lbnRzIiwiYnJlYWRjcnVtYiIsInNldEF0dHJpYnV0ZSIsInVybCIsImxvY2F0aW9uIiwiaHJlZiIsInJlcGxhY2UiLCJyZWdleCIsIlJlZ0V4cCIsInJlc3VsdHMiLCJleGVjIiwiZGVj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LElBQXpDO0FBQ0FpQyxJQUFHSyxZQUFILENBQWdCLGtCQUFoQixFQUFvQyx3QkFBcEM7QUFDQUwsSUFBR0ssWUFBSCxDQUFnQixVQUFoQixFQUE0QixHQUE1QjtBQUNBO0FBQ0FMLElBQUd2QixLQUFILEdBQVduQyxXQUFXeUIsSUFBdEI7QUFDQXFDLFlBQVdiLFdBQVgsQ0FBdUJTLEVBQXZCO0FBQ0EsQ0FYRDs7QUFhQTs7O0FBR0FwQyxxQkFBcUIsNEJBQUNHLElBQUQsRUFBT3VDLEdBQVAsRUFBZTtBQUNuQyxLQUFJLENBQUNBLEdBQUwsRUFDQ0EsTUFBTTlELE9BQU8rRCxRQUFQLENBQWdCQyxJQUF0QjtBQUNEekMsUUFBT0EsS0FBSzBDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLE1BQXhCLENBQVA7QUFDQSxLQUFNQyxRQUFRLElBQUlDLE1BQUosVUFBa0I1QyxJQUFsQix1QkFBZDtBQUFBLEtBQ0M2QyxVQUFVRixNQUFNRyxJQUFOLENBQVdQLEdBQVgsQ0FEWDtBQUVBLEtBQUksQ0FBQ00sT0FBTCxFQUNDLE9BQU8sSUFBUDtBQUNELEtBQUksQ0FBQ0EsUUFBUSxDQUFSLENBQUwsRUFDQyxPQUFPLEVBQVA7QUFDRCxRQUFPRSxtQkFBbUJGLFFBQVEsQ0FBUixFQUFXSCxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCLENBQW5CLENBQVA7QUFDQSxDQVhEIiwiZmlsZSI6InJlc3RhdXJhbnRfaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCByZXN0YXVyYW50O1xubGV0IG1hcDtcblxuLyoqXG4gKiBJbml0aWFsaXplIEdvb2dsZSBtYXAsIGNhbGxlZCBmcm9tIEhUTUwuXG4gKi9cbndpbmRvdy5pbml0TWFwID0gKCkgPT4ge1xuXHRmZXRjaFJlc3RhdXJhbnRGcm9tVVJMKChlcnJvciwgcmVzdGF1cmFudCkgPT4ge1xuXHRcdGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3IhXG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VsZi5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuXHRcdFx0XHR6b29tOiAxNixcblx0XHRcdFx0Y2VudGVyOiByZXN0YXVyYW50LmxhdGxuZyxcblx0XHRcdFx0c2Nyb2xsd2hlZWw6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHRcdGZpbGxCcmVhZGNydW1iKCk7XG5cdFx0XHREQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHNlbGYucmVzdGF1cmFudCwgc2VsZi5tYXApO1xuXHRcdH1cblx0fSk7XG59O1xuXG4vKipcbiAqIEdldCBjdXJyZW50IHJlc3RhdXJhbnQgZnJvbSBwYWdlIFVSTC5cbiAqL1xuZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCA9IChjYWxsYmFjaykgPT4ge1xuXHRpZiAoc2VsZi5yZXN0YXVyYW50KSB7IC8vIHJlc3RhdXJhbnQgYWxyZWFkeSBmZXRjaGVkIVxuXHRcdGNhbGxiYWNrKG51bGwsIHNlbGYucmVzdGF1cmFudCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuXHRpZiAoIWlkKSB7IC8vIG5vIGlkIGZvdW5kIGluIFVSTFxuXHRcdGVycm9yID0gJ05vIHJlc3RhdXJhbnQgaWQgaW4gVVJMJztcblx0XHRjYWxsYmFjayhlcnJvciwgbnVsbCk7XG5cdH0gZWxzZSB7XG5cdFx0REJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XG5cdFx0XHRzZWxmLnJlc3RhdXJhbnQgPSByZXN0YXVyYW50O1xuXHRcdFx0aWYgKCFyZXN0YXVyYW50KSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRmaWxsUmVzdGF1cmFudEhUTUwoKTtcblx0XHRcdGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xuXHRcdH0pO1xuXHR9XG59O1xuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZVxuICovXG5maWxsUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuXHRjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuXHRuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcblxuXHRjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtYWRkcmVzcycpO1xuXHRhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcblxuXHQvLyBMb2FkcyBzbWFsbCBvciBsYXJnZSB2ZXJzaW9uIG9mIHJlc3RhdXJhbnQgaW1hZ2UgYmFzZWQgb24gc3Jjc2V0IGFuZCBzaXplcy4gQWxzbyBkeW5hbWljYWxseSBzZXRzIGFsdCBhbmQgdGl0bGUgdGV4dCBvZiB0aGUgaW1hZ2UuIFxuXHRjb25zdCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWltZycpO1xuXHRpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnO1xuXHRpbWFnZS5zcmMgPSBEQkhlbHBlci5sYXJnZUltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcblx0aW1hZ2Uuc3Jjc2V0ID0gYCR7REJIZWxwZXIuc21hbGxJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCl9IDQwMHcsICR7REJIZWxwZXIubGFyZ2VJbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCl9IDgwMHdgO1xuXHRpbWFnZS5zaXplcyA9ICc1MHZ3Jztcblx0aW1hZ2UudGl0bGUgPSBgJHtyZXN0YXVyYW50Lm5hbWV9YDtcblx0aW1hZ2UuYWx0ID0gYCR7cmVzdGF1cmFudC5uYW1lfSBpbiAke3Jlc3RhdXJhbnQubmVpZ2hib3Job29kfSAtICR7cmVzdGF1cmFudC5jdWlzaW5lX3R5cGV9IHJlc3RhdXJhbnRgO1xuXG5cdGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1jdWlzaW5lJyk7XG5cdGN1aXNpbmUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5jdWlzaW5lX3R5cGU7XG5cblx0Ly8gZmlsbCBvcGVyYXRpbmcgaG91cnNcblx0aWYgKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSB7XG5cdFx0ZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwoKTtcblx0fVxuXHQvLyBmaWxsIHJldmlld3Ncblx0ZmlsbFJldmlld3NIVE1MKCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXN0YXVyYW50SG91cnNIVE1MID0gKG9wZXJhdGluZ0hvdXJzID0gc2VsZi5yZXN0YXVyYW50Lm9wZXJhdGluZ19ob3VycykgPT4ge1xuXHRjb25zdCBob3VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWhvdXJzJyk7XG5cdGZvciAobGV0IGtleSBpbiBvcGVyYXRpbmdIb3Vycykge1xuXHRcdGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cblx0XHRjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuXHRcdGRheS5pbm5lckhUTUwgPSBrZXk7XG5cdFx0cm93LmFwcGVuZENoaWxkKGRheSk7XG5cblx0XHRjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcblx0XHR0aW1lLmlubmVySFRNTCA9IG9wZXJhdGluZ0hvdXJzW2tleV07XG5cdFx0cm93LmFwcGVuZENoaWxkKHRpbWUpO1xuXG5cdFx0aG91cnMuYXBwZW5kQ2hpbGQocm93KTtcblx0fVxufTtcblxuLyoqXG4gKiBDcmVhdGUgYWxsIHJldmlld3MgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXZpZXdzSFRNTCA9IChyZXZpZXdzID0gc2VsZi5yZXN0YXVyYW50LnJldmlld3MpID0+IHtcblx0Y29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtY29udGFpbmVyJyk7XG5cdGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcblx0dGl0bGUuaW5uZXJIVE1MID0gJ1Jldmlld3MnO1xuXHRjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG5cdGlmICghcmV2aWV3cykge1xuXHRcdGNvbnN0IG5vUmV2aWV3cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0XHRub1Jldmlld3MuaW5uZXJIVE1MID0gJ05vIHJldmlld3MgeWV0ISc7XG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKG5vUmV2aWV3cyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtbGlzdCcpO1xuXHRyZXZpZXdzLmZvckVhY2gocmV2aWV3ID0+IHtcblx0XHR1bC5hcHBlbmRDaGlsZChjcmVhdGVSZXZpZXdIVE1MKHJldmlldykpO1xuXHR9KTtcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHJldmlldyBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmNyZWF0ZVJldmlld0hUTUwgPSAocmV2aWV3KSA9PiB7XG5cdGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcblx0Y29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0bmFtZS5pbm5lckhUTUwgPSByZXZpZXcubmFtZTtcblx0bGkuYXBwZW5kQ2hpbGQobmFtZSk7XG5cblx0Y29uc3QgZGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0ZGF0ZS5pbm5lckhUTUwgPSByZXZpZXcuZGF0ZTtcblx0bGkuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cblx0Y29uc3QgcmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRyYXRpbmcuaW5uZXJIVE1MID0gYFJhdGluZzogJHtyZXZpZXcucmF0aW5nfWA7XG5cdGxpLmFwcGVuZENoaWxkKHJhdGluZyk7XG5cblx0Y29uc3QgY29tbWVudHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdGNvbW1lbnRzLmlubmVySFRNTCA9IHJldmlldy5jb21tZW50cztcblx0bGkuYXBwZW5kQ2hpbGQoY29tbWVudHMpO1xuXG5cdHJldHVybiBsaTtcbn07XG5cbi8qKlxuICogQWRkIHJlc3RhdXJhbnQgbmFtZSB0byB0aGUgYnJlYWRjcnVtYiBuYXZpZ2F0aW9uIG1lbnVcbiAqL1xuZmlsbEJyZWFkY3J1bWIgPSAocmVzdGF1cmFudD1zZWxmLnJlc3RhdXJhbnQpID0+IHtcblx0Y29uc3QgYnJlYWRjcnVtYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmVhZGNydW1iJyk7XG5cdGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcblx0bGkuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xuXHQvL1NldCBBUklBIGF0dHJpYnV0ZXMgc28gc2NyZWVucmVhZGVyIGtub3dzIGl0cyBvbiB0aGUgY3VycmVudCBwYWdlIGZvciB0aGUgcmVzdGF1cmFudCBpbiB0aGUgYnJlYWRjcnVtYiB0cmFpbC5cblx0bGkuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcmVzdGF1cmFudC5uYW1lKTtcblx0bGkuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgJ2JyZWFkY3J1bWItZGVzY3JpcHRpb24nKTtcblx0bGkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG5cdC8vRHluYW1pY2FsbHkgc2V0IHRpdGxlIGF0dHJpYnV0ZVxuXHRsaS50aXRsZSA9IHJlc3RhdXJhbnQubmFtZTtcblx0YnJlYWRjcnVtYi5hcHBlbmRDaGlsZChsaSk7XG59O1xuXG4vKipcbiAqIEdldCBhIHBhcmFtZXRlciBieSBuYW1lIGZyb20gcGFnZSBVUkwuXG4gKi9cbmdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lLCB1cmwpID0+IHtcblx0aWYgKCF1cmwpXG5cdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcblx0Y29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCksXG5cdFx0cmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcblx0aWYgKCFyZXN1bHRzKVxuXHRcdHJldHVybiBudWxsO1xuXHRpZiAoIXJlc3VsdHNbMl0pXG5cdFx0cmV0dXJuICcnO1xuXHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufTtcbiJdfQ==
