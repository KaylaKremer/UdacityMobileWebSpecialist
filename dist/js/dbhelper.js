'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * Common database helper functions.
 */var DBHelper=function(){function DBHelper(){_classCallCheck(this,DBHelper)}_createClass(DBHelper,null,[{key:'fetchRestaurants',/**
   * Fetches all restaurant reviews data. Creates an IndexedDB database named 'restaurant-reviews-db' with an object store of 'restaurant-reviews'. If response from the server is ok, stores data received into the database and then returns the data. If response from the server fails, look in the database to see if there is data already stored there and return the data. Catches and handles errors appropriately when data cannot be retrieved.
   */value:function fetchRestaurants(callback,id){var dbPromise=idb.open('restaurant-reviews-db',1,function(upgradeDB){switch(upgradeDB.oldVersion){case 0:upgradeDB.createObjectStore('restaurant-reviews',{keyPath:'id'});}});var restaurantURL=void 0;id?restaurantURL=DBHelper.DATABASE_URL+'/'+id:restaurantURL=''+DBHelper.DATABASE_URL;fetch(restaurantURL).then(function(response){if(response.ok){return response.json().then(function(restaurantReviews){dbPromise.then(function(db){var tx=db.transaction('restaurant-reviews','readwrite');var restaurantReviewsStore=tx.objectStore('restaurant-reviews');restaurantReviews.forEach(function(restaurantReview){restaurantReviewsStore.put(restaurantReview)});return tx.complete&&restaurantReviewsStore.getAll()}).then(function(restaurantReviews){console.log('Sucessfully fetched data from server & stored in IndexedDB!');callback(null,restaurantReviews)}).catch(function(error){callback('Failed to fetch data from server & store n IndexedDB: '+error,null)})})}else{dbPromise.then(function(db){var tx=db.transaction('restaurant-reviews','readonly');var restaurantReviewsStore=tx.objectStore('restaurant-reviews');//if (restaurantReviewsStores.getAll())
return tx.complete&&restaurantReviewsStore.getAll()}).then(function(restaurantReviews){console.log('Sucessfully fetched data from IndexedDB!');callback(null,restaurantReviews)}).catch(function(error){callback('Failed to fetch data from IndexedDB: '+error,null)})}}).catch(function(error){callback('Fetch request for data from server failed: '+error,null)})}/**
   * Fetch a restaurant by its ID.
   */},{key:'fetchRestaurantById',value:function fetchRestaurantById(id,callback){// fetch all restaurants with proper error handling.
DBHelper.fetchRestaurants(function(error,restaurants){if(error){callback(error,null)}else{var restaurant=restaurants.find(function(r){return r.id===parseInt(id)});if(restaurant){// Got the restaurant
callback(null,restaurant)}else{// Restaurant does not exist in the database
callback('Restaurant does not exist',null)}}})}/**
   * Fetch restaurants by a cuisine type with proper error handling.
   */},{key:'fetchRestaurantByCuisine',value:function fetchRestaurantByCuisine(cuisine,callback){// Fetch all restaurants  with proper error handling
DBHelper.fetchRestaurants(function(error,restaurants){if(error){callback(error,null)}else{// Filter restaurants to have only given cuisine type
var results=restaurants.filter(function(r){return r.cuisine_type==cuisine});callback(null,results)}})}/**
   * Fetch restaurants by a neighborhood with proper error handling.
   */},{key:'fetchRestaurantByNeighborhood',value:function fetchRestaurantByNeighborhood(neighborhood,callback){// Fetch all restaurants
DBHelper.fetchRestaurants(function(error,restaurants){if(error){callback(error,null)}else{// Filter restaurants to have only given neighborhood
var results=restaurants.filter(function(r){return r.neighborhood==neighborhood});callback(null,results)}})}/**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */},{key:'fetchRestaurantByCuisineAndNeighborhood',value:function fetchRestaurantByCuisineAndNeighborhood(cuisine,neighborhood,callback){// Fetch all restaurants
DBHelper.fetchRestaurants(function(error,restaurants){if(error){callback(error,null)}else{var results=restaurants;if(cuisine!='all'){// filter by cuisine
results=results.filter(function(r){return r.cuisine_type==cuisine})}if(neighborhood!='all'){// filter by neighborhood
results=results.filter(function(r){return r.neighborhood==neighborhood})}callback(null,results)}})}/**
   * Fetch all neighborhoods with proper error handling.
   */},{key:'fetchNeighborhoods',value:function fetchNeighborhoods(callback){// Fetch all restaurants
DBHelper.fetchRestaurants(function(error,restaurants){if(error){callback(error,null)}else{// Get all neighborhoods from all restaurants
var neighborhoods=restaurants.map(function(v,i){return restaurants[i].neighborhood});// Remove duplicates from neighborhoods
var uniqueNeighborhoods=neighborhoods.filter(function(v,i){return neighborhoods.indexOf(v)==i});callback(null,uniqueNeighborhoods)}})}/**
   * Fetch all cuisines with proper error handling.
   */},{key:'fetchCuisines',value:function fetchCuisines(callback){// Fetch all restaurants
DBHelper.fetchRestaurants(function(error,restaurants){if(error){callback(error,null)}else{// Get all cuisines from all restaurants
var cuisines=restaurants.map(function(v,i){return restaurants[i].cuisine_type});// Remove duplicates from cuisines
var uniqueCuisines=cuisines.filter(function(v,i){return cuisines.indexOf(v)==i});callback(null,uniqueCuisines)}})}/**
   * Restaurant page URL.
   */},{key:'urlForRestaurant',value:function urlForRestaurant(restaurant){return'./restaurant.html?id='+restaurant.id}/**
   * Restaurant small image URL.
   */},{key:'smallImageUrlForRestaurant',value:function smallImageUrlForRestaurant(restaurant){return'/img/'+restaurant.photograph_small}/**
   * Restaurant large image URL.
   */},{key:'largeImageUrlForRestaurant',value:function largeImageUrlForRestaurant(restaurant){return'/img/'+restaurant.photograph_large}/**
   * Map marker for a restaurant.
   */},{key:'mapMarkerForRestaurant',value:function mapMarkerForRestaurant(restaurant,map){var marker=new google.maps.Marker({position:restaurant.latlng,title:restaurant.name,url:DBHelper.urlForRestaurant(restaurant),map:map,animation:google.maps.Animation.DROP});return marker}/**
   * Static map image to be displayed when page initially loads.
   */},{key:'staticImageForMap',value:function staticImageForMap(restaurants){var loc={lat:40.722216,lng:-73.987501};var map=document.getElementById('map');var mapWidth=map.clientWidth;var mapHeight=map.clientHeight;var staticMap='http://maps.googleapis.com/maps/api/staticmap?center='+loc.lat+','+loc.lng+'&zoom=12&size='+mapWidth+'x'+mapHeight+'&markers=color:red';restaurants.forEach(function(restaurant){staticMap+='|'+restaurant.latlng.lat+','+restaurant.latlng.lng});staticMap+='&key=AIzaSyByOElG6Eai0CEZ27dYL5Vw6NzJOt9FZAc';return staticMap}},{key:'DATABASE_URL',/**
   * Database URL.
   * Changed to retrieve data from the server on localhost:1337.
   */get:function get(){var port=1337;// Change this to your server port
return'http://localhost:'+port+'/restaurants'}}]);return DBHelper}();