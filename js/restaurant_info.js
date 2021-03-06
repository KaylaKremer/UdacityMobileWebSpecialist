let restaurant;
let map;
let liveMap = false;
let initLoad = true;
let offlineReviewCounter = 0;
let offlineFavoriteCounter = 0;

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

	createFavoriteButton(restaurant);

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
 * Creates a favorite button. When clicked, notifies user that restaurant favorite has been added or removed via visual cues and ARIA label changes. Also updates server and IndexedDB with favorite status of the restaurant. If user clicks on favorite button while offline, stores favorite status in local storage and creates an offline label to notify user favorite status will be updated when network connection is reestablished. 
 */
const createFavoriteButton = (restaurant) => {
	const favoriteButton = document.getElementById('favorite-button');
	const restaurantId = restaurant.id;
	let isFavorite = restaurant.is_favorite;
	let noOfflineLabel = true;

	changeFavoriteButton(isFavorite, favoriteButton);

	favoriteButton.addEventListener('click', () => {
		if(!navigator.onLine){
			if (isFavorite === 'false'){
				isFavorite = 'true';
			} else {
				isFavorite = 'false';
			}
			/* Creates unique id to reference favorite status in local storage. */
			offlineFavoriteCounter++;
			let favoriteId = offlineFavoriteCounter.toString();
			/* Make sure only one offline label is created no matter how many times user clicks on favorite button */
			if(noOfflineLabel){
				const offlineFavoriteLabel = document.createElement('div');
				offlineFavoriteLabel.classList.add('offline-favorite-label');
				offlineFavoriteLabel.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Offline Mode - Favorite status will submit when network connection is reestablished`;
				const restaurantHeader = document.getElementById('restaurant-header');
				restaurantHeader.parentNode.insertBefore(offlineFavoriteLabel, restaurantHeader);
				noOfflineLabel = false;
			}
			DBHelper.updateFavorite(favoriteId, restaurantId, isFavorite);
			restaurant.is_favorite = isFavorite;
			changeFavoriteButton(isFavorite, favoriteButton);
			return;
		}

		if (isFavorite === 'false'){
			isFavorite = 'true';
		} else {
			isFavorite = 'false';
		}  
		DBHelper.updateFavorite(null, restaurantId, isFavorite);
		restaurant.is_favorite = isFavorite;
		changeFavoriteButton(isFavorite, favoriteButton);
	});
};

/**
 * Change favorite button to appear on or off with class change.
 */
const changeFavoriteButton = (isFavorite, favoriteButton) => {
	if (isFavorite === 'true'){
		favoriteButton.title = 'Remove from favorites';
		favoriteButton.setAttribute('aria-label', 'Remove from favorites');
		favoriteButton.classList.add('restaurant-favorite-true');
		favoriteButton.classList.remove('restaurant-favorite-false');
		favoriteButton.innerHTML = '<i class="fas fa-heart"></i>';
	} else {
		favoriteButton.title = 'Add to favorites';
		favoriteButton.setAttribute('aria-label', 'Add to favorites');
		favoriteButton.classList.add('restaurant-favorite-false');
		favoriteButton.classList.remove('restaurant-favorite-true');
		favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
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
	const reviewsList = document.getElementById('reviews-list');
	reviewsList.innerHTML = '';
	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.id = 'no-reviews';
		noReviews.innerHTML = 'No reviews yet!';
		container.insertBefore(noReviews, reviewsList);
	} else {
		reviews.forEach(review => {
			reviewsList.appendChild(createReviewHTML(review));
		});
		container.appendChild(reviewsList);
	}
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
	const li = document.createElement('li');

	/* Create label for reviews submitted while offline. */
	if (!navigator.onLine) {
		const offlineReviewLabel = document.createElement('div');
		offlineReviewLabel.classList.add('offline-review-label');
		offlineReviewLabel.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Offline Mode - Review will submit when network connection is reestablished`;
		li.appendChild(offlineReviewLabel);
	}

	/* Create delete button to remove reviews */
	const deleteButton = document.createElement('button');
	deleteButton.type = 'button';
	deleteButton.classList.add('delete-button');
	deleteButton.title = 'Delete review';
	deleteButton.setAttribute('aria-label', 'Delete review');
	deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
	li.appendChild(deleteButton);
	deleteButton.addEventListener('click', event => {
		event.preventDefault();
		deleteReview(deleteButton, review);
	});

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
 * Add user review to the page, store review data in server & IndexedDB, and reset form. For offline submitted reviews, creates a counter to provide a unique ID number for each offline review saved in local storage.
 */
const submitReview = () => {
	event.preventDefault();
	offlineReviewCounter++;
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
		comments: comments,
		offline_id: offlineReviewCounter.toString(),
	};
	const reviewsList = document.getElementById('reviews-list');
	reviewsList.appendChild(createReviewHTML(review));
	DBHelper.addReview(review, restaurantId, fillReviewsHTML);
	document.getElementById('form').reset();
	if(!navigator.onLine){
		console.log('Your review will be submitted when an online connection is reestablished');
	} else {
		console.log('Your review has been submitted!');
	}
};

/**
 * Delete user review from the page and remove review data from server & IndexedDB.
 */
const deleteReview = (deleteButton, review) => {
	const reviewToDelete = deleteButton.parentNode;
	const reviewId = review.id;
	const offlineId = review.offline_id;
	const restaurantId = getParameterByName('id');
	DBHelper.removeReview(reviewId, offlineId, restaurantId, fillReviewsHTML);
	const reviewsList = document.getElementById('reviews-list');
	reviewsList.removeChild(reviewToDelete);
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

