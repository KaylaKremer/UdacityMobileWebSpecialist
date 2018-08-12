let restaurants,
	neighborhoods,
	cuisines,
	map;
let liveMap = false;
let initLoad = true;
let markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
	fetchNeighborhoods();
	fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
	DBHelper.fetchNeighborhoods((error, neighborhoods) => {
		if (error) { 
			// Got an error
			console.error(error);
		} else {
			self.neighborhoods = neighborhoods;
			fillNeighborhoodsHTML();
		}
	});
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
	const select = document.getElementById('neighborhoods-select');
	neighborhoods.forEach(neighborhood => {
		const option = document.createElement('option');
		option.innerHTML = neighborhood;
		option.value = neighborhood;
		select.append(option);
	});
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
	DBHelper.fetchCuisines((error, cuisines) => {
		if (error) { 
			// Got an error!
			console.error(error);
		} else {
			self.cuisines = cuisines;
			fillCuisinesHTML();
		}
	});
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
	const select = document.getElementById('cuisines-select');

	cuisines.forEach(cuisine => {
		const option = document.createElement('option');
		option.innerHTML = cuisine;
		option.value = cuisine;
		select.append(option);
	});
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
	updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
	const cSelect = document.getElementById('cuisines-select');
	const nSelect = document.getElementById('neighborhoods-select');

	const cIndex = cSelect.selectedIndex;
	const nIndex = nSelect.selectedIndex;

	const cuisine = cSelect[cIndex].value;
	const neighborhood = nSelect[nIndex].value;

	DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			resetRestaurants(restaurants);
			fillRestaurantsHTML();
		}
	});
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
	// Remove all restaurants
	self.restaurants = [];
	const ul = document.getElementById('restaurants-list');
	ul.innerHTML = '';

	// Remove all map markers
	self.markers.forEach(m => m.setMap(null));
	self.markers = [];
	self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */

/* If a live map isn't already enabled, removes the static map image and replaces it with a live Google Map. */
const getLiveMap = () => {
	updateRestaurants();
	if(liveMap){
		return;
	} else {
		const staticMapImg = document.getElementById('static-map-img');
		staticMapImg.parentNode.removeChild(staticMapImg);
		let loc = {
			lat: 40.722216,
			lng: -73.987501
		};
		self.map = new google
			.maps
			.Map(document.getElementById('map'), {
				zoom: 12,
				center: loc,
				scrollwheel: false
			});
		liveMap = true;
	}
};

const fillRestaurantsHTML = (restaurants = self.restaurants) => {
	const ul = document.getElementById('restaurants-list');
	restaurants.forEach(restaurant => {
		ul.append(createRestaurantHTML(restaurant));
	});
	
	/* Loads a static map image if it's the initial page load. Adds a click event listener so that when the user clicks on the map, it removes the static map image and loads a live map in its place. */
	if (initLoad){
		fetchNeighborhoods();
		fetchCuisines();
		const staticMap = DBHelper.staticImageForMapIndex(self.restaurants);
		const map = document.getElementById('map');
		const staticMapImg = document.createElement('img');
		staticMapImg.id = 'static-map-img';
		staticMapImg.alt = 'Static Google Maps image';
		staticMapImg.style.width = `${map.clientWidth}px`;
		staticMapImg.style.height = `${map.clientHeight}px`;
		staticMapImg.src = staticMap;
		staticMapImg.addEventListener('click', () => {
			getLiveMap();
		});
		map.appendChild(staticMapImg);
		initLoad = false;
	} else {
		addMarkersToMap();
	}
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
	/* Lazy loads small or large version of restaurant image based on data-srcset and auto data-sizes. Also dynamically sets alt and title text of the image. */
	const li = document.createElement('li'); 
	const image = document.createElement('img');
	image.className = 'restaurant-img lazyload';
	image.setAttribute('data-src', `${DBHelper.smallImageUrlForRestaurant(restaurant)} 400w`);
	image.setAttribute('data-srcset',`${DBHelper.smallImageUrlForRestaurant(restaurant)} 400w, ${DBHelper.largeImageUrlForRestaurant(restaurant)} 800w`);
	image.setAttribute('data-sizes', 'auto');
	image.title = `${restaurant.name}`;
	image.alt = `${restaurant.name} in ${restaurant.neighborhood} - ${restaurant.cuisine_type} restaurant`;
	li.append(image);

	/* Creates header div to hold name & favorite button. */
	const header = document.createElement('div');
	header.id = "header";
	li.append(header);

	const name = document.createElement('h3');
	name.innerHTML = restaurant.name;
	header.append(name);

	/* Creates a dynamic favorite button. When clicked, notifies user that restaurant favorite has been added or removed via visual cues and ARIA label changes. Also updates IDB with favorite status of the restaurant. */
	const favorite = document.createElement('button');
	favorite.type = 'button';
	favorite.id = 'favorite-button';
	favorite.title = 'Add to favorites';
	favorite.setAttribute('aria-label', 'Add to favorites');
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
	header.append(favorite);

	const neighborhood = document.createElement('p');
	neighborhood.innerHTML = restaurant.neighborhood;
	li.append(neighborhood);

	const address = document.createElement('p');
	address.innerHTML = restaurant.address;
	li.append(address);

	/* Creates empty element so flex grow can be applied and create space to vertically align View Details buttons. */
	const empty = document.createElement('p');
	empty.className = 'restaurant-empty';
	li.append(empty);

	const more = document.createElement('a');
	more.innerHTML = 'View Restaurant Details';
	more.href = DBHelper.urlForRestaurant(restaurant);

	/* Dynamically sets title attribute. */
	more.title = `${restaurant.name} - View Restaurant Details`;

	/* Sets ARIA attributes to each restaurant link. */
	more.setAttribute('role', 'button');
	more.setAttribute('tabindex', '0');
	more.setAttribute('aria-label', 'View' + restaurant.name + 'Restaurant Details');
	li.append(more);

	return li;
};

/**
 * Change favorite icon to appear on or off with class change.
 */
const getFavoriteClass = (restaurant, favorite) => {
	if (restaurant.is_favorite === 'true'){
		favorite.classList.add('index-favorite-true');
		favorite.classList.remove('index-favorite-false');
		favorite.innerHTML = '<i class="fas fa-heart"></i>';
	} else {
		favorite.classList.add('index-favorite-false');
		favorite.classList.remove('index-favorite-true');
		favorite.innerHTML = '<i class="far fa-heart"></i>';
	}
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
	restaurants.forEach(restaurant => {
		// Add marker to the map
		const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
		google.maps.event.addListener(marker, 'click', () => {
			window.location.href = marker.url;
		});
		self.markers.push(marker);
	});
};

