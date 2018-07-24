'use strict';var restaurants=void 0,neighborhoods=void 0,cuisines=void 0;var map=void 0;var liveMap=false;var initLoad=true;var markers=[];/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */document.addEventListener('DOMContentLoaded',function(event){fetchNeighborhoods();fetchCuisines()});/**
 * Fetch all neighborhoods and set their HTML.
 */var fetchNeighborhoods=function fetchNeighborhoods(){DBHelper.fetchNeighborhoods(function(error,neighborhoods){if(error){// Got an error
console.error(error)}else{self.neighborhoods=neighborhoods;fillNeighborhoodsHTML()}})};/**
 * Set neighborhoods HTML.
 */var fillNeighborhoodsHTML=function fillNeighborhoodsHTML(){var neighborhoods=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.neighborhoods;var select=document.getElementById('neighborhoods-select');neighborhoods.forEach(function(neighborhood){var option=document.createElement('option');option.innerHTML=neighborhood;option.value=neighborhood;select.append(option)})};/**
 * Fetch all cuisines and set their HTML.
 */var fetchCuisines=function fetchCuisines(){DBHelper.fetchCuisines(function(error,cuisines){if(error){// Got an error!
console.error(error)}else{self.cuisines=cuisines;fillCuisinesHTML()}})};/**
 * Set cuisines HTML.
 */var fillCuisinesHTML=function fillCuisinesHTML(){var cuisines=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.cuisines;var select=document.getElementById('cuisines-select');cuisines.forEach(function(cuisine){var option=document.createElement('option');option.innerHTML=cuisine;option.value=cuisine;select.append(option)})};/**
 * Initialize Google map, called from HTML.
 */window.initMap=function(){updateRestaurants()};/**
 * Update page and map for current restaurants.
 */var updateRestaurants=function updateRestaurants(){var cSelect=document.getElementById('cuisines-select');var nSelect=document.getElementById('neighborhoods-select');var cIndex=cSelect.selectedIndex;var nIndex=nSelect.selectedIndex;var cuisine=cSelect[cIndex].value;var neighborhood=nSelect[nIndex].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine,neighborhood,function(error,restaurants){if(error){// Got an error!
console.error(error)}else{resetRestaurants(restaurants);fillRestaurantsHTML()}})};/**
 * Clear current restaurants, their HTML and remove their map markers.
 */var resetRestaurants=function resetRestaurants(restaurants){// Remove all restaurants
self.restaurants=[];var ul=document.getElementById('restaurants-list');ul.innerHTML='';// Remove all map markers
self.markers.forEach(function(m){return m.setMap(null)});self.markers=[];self.restaurants=restaurants};/**
 * Create all restaurants HTML and add them to the webpage.
 *///If a live map isn't already enabled, removes the static map image and replaces it with a live Google Map.
var getLiveMap=function getLiveMap(){updateRestaurants();if(liveMap===true){return}else{var staticMapImg=document.getElementById('static-map-img');staticMapImg.parentNode.removeChild(staticMapImg);var loc={lat:40.722216,lng:-73.987501};self.map=new google.maps.Map(document.getElementById('map'),{zoom:12,center:loc,scrollwheel:false});liveMap=true}};var fillRestaurantsHTML=function fillRestaurantsHTML(){var restaurants=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.restaurants;var ul=document.getElementById('restaurants-list');restaurants.forEach(function(restaurant){ul.append(createRestaurantHTML(restaurant))});//Loads a static map image if it's the initial page load. Adds a click event listener so that when the user clicks on the map, it removes the static map image and loads a live map in its place.
if(initLoad===true){fetchNeighborhoods();fetchCuisines();var staticMap=DBHelper.staticImageForMap(self.restaurants);var _map=document.getElementById('map');var staticMapImg=document.createElement('img');staticMapImg.id='static-map-img';staticMapImg.style.width=_map.clientWidth+'px';staticMapImg.style.height=_map.clientHeight+'px';staticMapImg.src=staticMap;staticMapImg.addEventListener('click',function(){getLiveMap()});_map.appendChild(staticMapImg);initLoad=false}else{addMarkersToMap()}};/**
 * Create restaurant HTML.
 */var createRestaurantHTML=function createRestaurantHTML(restaurant){// Lazy loads small or large version of restaurant image based on data-srcset and auto data-sizes. Also dynamically sets alt and title text of the image.
var li=document.createElement('li');var image=document.createElement('img');image.className='restaurant-img lazyload';/* Old backup code without lazy load
	image.src = DBHelper.smallImageUrlForRestaurant(restaurant);
	image.srcset = `${DBHelper.smallImageUrlForRestaurant(restaurant)} 400w, ${DBHelper.largeImageUrlForRestaurant(restaurant)} 800w`;
	image.sizes = '50vw';*/image.setAttribute('data-src',DBHelper.smallImageUrlForRestaurant(restaurant)+' 400w');image.setAttribute('data-srcset',DBHelper.smallImageUrlForRestaurant(restaurant)+' 400w, '+DBHelper.largeImageUrlForRestaurant(restaurant)+' 800w');image.setAttribute('data-sizes','auto');image.title=''+restaurant.name;image.alt=restaurant.name+' in '+restaurant.neighborhood+' - '+restaurant.cuisine_type+' restaurant';li.append(image);var name=document.createElement('h3');name.innerHTML=restaurant.name;li.append(name);var neighborhood=document.createElement('p');neighborhood.innerHTML=restaurant.neighborhood;li.append(neighborhood);var address=document.createElement('p');address.innerHTML=restaurant.address;li.append(address);//Create empty element so flex grow can be applied and create space to vertically align View Details buttons.
var empty=document.createElement('p');empty.className='restaurant-empty';li.append(empty);var more=document.createElement('a');more.innerHTML='View Restaurant Details';more.href=DBHelper.urlForRestaurant(restaurant);//Dynamically set title attribute
more.title=restaurant.name+' - View Restaurant Details';//Set ARIA attributes to each restaurant link
more.setAttribute('role','button');more.setAttribute('tabindex','0');more.setAttribute('aria-label','View'+restaurant.name+'Restaurant Details');li.append(more);return li};/**
 * Add markers for current restaurants to the map.
 */var addMarkersToMap=function addMarkersToMap(){var restaurants=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.restaurants;restaurants.forEach(function(restaurant){// Add marker to the map
var marker=DBHelper.mapMarkerForRestaurant(restaurant,self.map);google.maps.event.addListener(marker,'click',function(){window.location.href=marker.url});self.markers.push(marker)})};