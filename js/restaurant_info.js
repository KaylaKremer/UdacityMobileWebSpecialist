let restaurant;
let map;
let liveMap = false;
let initLoad = true;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
	fetchRestaurantFromURL((error, restaurant) => {
		if (error) { 
			// Got an error!
			console.error(error, restaurant);
		} else {
			fillBreadcrumb();
		}
	});
};

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
	if (self.restaurant) { 
		// restaurant already fetched!
		callback(null, self.restaurant);
		return;
	}
	const id = getParameterByName('id');
	if (!id) { 
		// no id found in URL
		const error = 'No restaurant id in URL';
		callback(error, null);
	} else {
		DBHelper.fetchRestaurantById(id, (error, restaurant) => {
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

/* If a live map isn't already enabled, removes the static map image and replaces it with a live Google Map. */
const getLiveMap = (restaurant = self.restaurant) => {
	if(liveMap){
		return;
	} else {
		const staticMapImg = document.getElementById('static-map-img');
		staticMapImg.parentNode.removeChild(staticMapImg);
		self.map = new google
			.maps
			.Map(document.getElementById('map'), {
				zoom: 16,
				center: restaurant.latlng,
				scrollwheel: false
			});
		addMarkerToMap();
		liveMap = true;
	}
};

const fillRestaurantHTML = (restaurant = self.restaurant) => {
	/* Loads a static map image if it's the initial page load. Adds a click event listener so that when the user clicks on the map, it removes the static map image and loads a live map in its place. */
	if (initLoad){
		const staticMap = DBHelper.staticImageForMapRestaurantInfo(self.restaurant);
		const map = document.getElementById('map');
		const staticMapImg = document.createElement('img');
		staticMapImg.id = 'static-map-img';
		staticMapImg.alt = 'Static Google Maps image';
		staticMapImg.style.width = `${map.clientWidth}px`;
		staticMapImg.style.height = `${map.clientHeight}px`;
		staticMapImg.src = staticMap;
		staticMapImg.addEventListener('click', () => {
			getLiveMap(self.restaurant);
		});
		map.appendChild(staticMapImg);
		initLoad = false;
	} else {
		addMarkerToMap();
	}
	const name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;

	/* Creates a dynamic favorite button. When clicked, notifies user that restaurant favorite has been added or removed via visual cues and ARIA label changes. Also updates IDB with favorite status of the restaurant. */
	const favorite = document.getElementById('favorite-button');
	getFavoriteClass(restaurant, favorite);
	favorite.addEventListener('click', () => {
		let isFavorite;
		if(restaurant.is_favorite === 'false'){
			isFavorite = 'true';
			favorite.title = 'Remove from favorites';
			favorite.setAttribute('aria-label', 'Remove from favorites');
		} else {
			isFavorite = 'false';
			favorite.title = 'Add to favorites';
			favorite.setAttribute('aria-label', 'Add to favorites');
		}
		const restaurantId = restaurant.id;
		DBHelper.updateFavorite(restaurantId, isFavorite);
		restaurant.is_favorite = isFavorite;
		getFavoriteClass(restaurant, favorite);
	});

	/* Lazy loads small or large version of restaurant image based on data-srcset and auto data-sizes. Also dynamically sets alt and title text of the image. */
	const image = document.getElementById('restaurant-img');
	image.className = 'restaurant-img lazyload';
	image.setAttribute('data-src', `${DBHelper.smallImageUrlForRestaurant(restaurant)} 400w`);
	image.setAttribute('data-srcset',`${DBHelper.smallImageUrlForRestaurant(restaurant)} 400w, ${DBHelper.largeImageUrlForRestaurant(restaurant)} 800w`);
	image.setAttribute('data-sizes', 'auto');
	image.title = `${restaurant.name}`;
	image.alt = `${restaurant.name} in ${restaurant.neighborhood} - ${restaurant.cuisine_type} restaurant`;

	const cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;

	const address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	DBHelper.fetchReviewsById(restaurant.id, fillReviewsHTML);
};

/**
 * Change favorite icon to appear on or off with class change.
 */
const getFavoriteClass = (restaurant, favorite) => {
	if (restaurant.is_favorite === 'true'){
		favorite.classList.add('restaurant-favorite-true');
		favorite.classList.remove('restaurant-favorite-false');
		favorite.innerHTML = '<i class="fas fa-heart"></i>';
	} else {
		favorite.classList.add('restaurant-favorite-false');
		favorite.classList.remove('restaurant-favorite-true');
		favorite.innerHTML = '<i class="far fa-heart"></i>';
	}
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
	const hours = document.getElementById('restaurant-hours');
	for (let key in operatingHours) {
		const row = document.createElement('tr');
		const day = document.createElement('td');
		day.innerHTML = key;
		row.appendChild(day);
		const time = document.createElement('td');
		time.innerHTML = operatingHours[key];
		row.appendChild(time);
		hours.appendChild(row);
	}
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (error, reviews) => {
	if(error){
		console.log(error);
	}
	self.restaurant.reviews = reviews;
	const container = document.getElementById('reviews-container');
	const ul = document.getElementById('reviews-list');

	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.id = 'no-reviews';
		noReviews.innerHTML = 'No reviews yet!';
		container.insertBefore(noReviews, ul);
	} else {
		reviews.forEach(review => {
			ul.appendChild(createReviewHTML(review));
		});
		container.appendChild(ul);
	}
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
	const li = document.createElement('li');

	/* Create label for reviews submitted while offline. */
	if (!navigator.onLine) {
		const offlineLabel = document.createElement('div');
		offlineLabel.classList.add('offline-label');
		offlineLabel.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Offline Mode - Will submit review when network connection is reestablished`;
		li.appendChild(offlineLabel);
	}

	const name = document.createElement('p');
	name.classList.add('review-header');
	name.innerHTML = review.name;
	li.appendChild(name);

	/* Convert timestamp from epoch time into a more readable format. */
	const timestamp = document.createElement('p');
	timestamp.classList.add('review-header');
	const createdAtTimestamp = new Date(review.createdAt);
	const updatedAtTimestamp = new Date(review.updatedAt);
	if (createdAtTimestamp === updatedAtTimestamp){
		timestamp.innerHTML = createdAtTimestamp.toLocaleString();
	} else {
		timestamp.innerHTML = updatedAtTimestamp.toLocaleString();
	}
	li.appendChild(timestamp);

	const rating = document.createElement('div');
	rating.classList.add('review-rating');
	if (review.rating > 1){
		rating.title = `${review.rating} stars`;
		rating.setAttribute('aria-label', `${review.rating} stars`);
	} else {
		rating.title = `${review.rating} star`;
		rating.setAttribute('aria-label', `${review.rating} star`);
	}
	rating.innerHTML = `${review.rating} <i class="fas fa-star"></i>`;
	li.appendChild(rating);

	const comments = document.createElement('p');
	comments.innerHTML = review.comments;
	li.appendChild(comments);

	return li;
};

/**
 * Add user review to the page, store in IndexedDB, and reset form.
 */
const submitReview = () => {
	event.preventDefault();
	const restaurantId = getParameterByName('id');
	const name = document.getElementById('form-name').value;
	const rating = document.querySelector('#form-rating option:checked').value;
	const comments = document.getElementById('form-comments').value;
	const review = {
		restaurant_id: parseInt(restaurantId),
		name: name,
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		rating: parseInt(rating),
		comments: comments
	};
	const ul = document.getElementById('reviews-list');
	ul.appendChild(createReviewHTML(review));
	DBHelper.addReview(review, restaurantId, fillReviewsHTML);
	document.getElementById('form').reset();
	if(!navigator.onLine){
		console.log('Your review will be submitted when an online connection is re-established');
	} else {
		console.log('Your review has been submitted!');
	}
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');
	const li = document.createElement('li');
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
const getParameterByName = (name, url) => {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * Add marker for current restaurant to the map.
 */
const addMarkerToMap = (restaurant = self.restaurant) => {
	// Add marker to the map
	const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
	google.maps.event.addListener(marker, 'click', () => {
		window.location.href = marker.url;
	});
};

