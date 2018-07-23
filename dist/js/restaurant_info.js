'use strict';var restaurant=void 0;var map=void 0;/**
 * Initialize Google map, called from HTML.
 */window.initMap=function(){fetchRestaurantFromURL(function(error,restaurant){if(error){// Got an error!
console.error(error)}else{self.map=new google.maps.Map(document.getElementById('map'),{zoom:16,center:restaurant.latlng,scrollwheel:false});fillBreadcrumb();DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)}})};/**
 * Get current restaurant from page URL.
 */var fetchRestaurantFromURL=function fetchRestaurantFromURL(callback){if(self.restaurant){// restaurant already fetched!
callback(null,self.restaurant);return}var id=getParameterByName('id');if(!id){// no id found in URL
error='No restaurant id in URL';callback(error,null)}else{DBHelper.fetchRestaurantById(id,function(error,restaurant){self.restaurant=restaurant;if(!restaurant){console.error(error);return}fillRestaurantHTML();callback(null,restaurant)})}};/**
 * Create restaurant HTML and add it to the webpage
 */var fillRestaurantHTML=function fillRestaurantHTML(){var restaurant=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.restaurant;var name=document.getElementById('restaurant-name');name.innerHTML=restaurant.name;var address=document.getElementById('restaurant-address');address.innerHTML=restaurant.address;// Loads small or large version of restaurant image based on srcset and sizes. Also dynamically sets alt and title text of the image. 
var image=document.getElementById('restaurant-img');image.className='restaurant-img lazyload';//image.src = DBHelper.largeImageUrlForRestaurant(restaurant);
//image.srcset = `${DBHelper.smallImageUrlForRestaurant(restaurant)} 400w, ${DBHelper.largeImageUrlForRestaurant(restaurant)} 800w`;
//image.sizes = '50vw';
image.setAttribute('data-src',DBHelper.smallImageUrlForRestaurant(restaurant)+' 400w');image.setAttribute('data-srcset',DBHelper.smallImageUrlForRestaurant(restaurant)+' 400w, '+DBHelper.largeImageUrlForRestaurant(restaurant)+' 800w');image.setAttribute('data-sizes','auto');image.title=''+restaurant.name;image.alt=restaurant.name+' in '+restaurant.neighborhood+' - '+restaurant.cuisine_type+' restaurant';var cuisine=document.getElementById('restaurant-cuisine');cuisine.innerHTML=restaurant.cuisine_type;// fill operating hours
if(restaurant.operating_hours){fillRestaurantHoursHTML()}// fill reviews
fillReviewsHTML()};/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */var fillRestaurantHoursHTML=function fillRestaurantHoursHTML(){var operatingHours=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.restaurant.operating_hours;var hours=document.getElementById('restaurant-hours');for(var key in operatingHours){var row=document.createElement('tr');var day=document.createElement('td');day.innerHTML=key;row.appendChild(day);var time=document.createElement('td');time.innerHTML=operatingHours[key];row.appendChild(time);hours.appendChild(row)}};/**
 * Create all reviews HTML and add them to the webpage.
 */var fillReviewsHTML=function fillReviewsHTML(){var reviews=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.restaurant.reviews;var container=document.getElementById('reviews-container');var title=document.createElement('h2');title.innerHTML='Reviews';container.appendChild(title);if(!reviews){var noReviews=document.createElement('p');noReviews.innerHTML='No reviews yet!';container.appendChild(noReviews);return}var ul=document.getElementById('reviews-list');reviews.forEach(function(review){ul.appendChild(createReviewHTML(review))});container.appendChild(ul)};/**
 * Create review HTML and add it to the webpage.
 */var createReviewHTML=function createReviewHTML(review){var li=document.createElement('li');var name=document.createElement('p');name.innerHTML=review.name;li.appendChild(name);var date=document.createElement('p');date.innerHTML=review.date;li.appendChild(date);var rating=document.createElement('p');rating.innerHTML='Rating: '+review.rating;li.appendChild(rating);var comments=document.createElement('p');comments.innerHTML=review.comments;li.appendChild(comments);return li};/**
 * Add restaurant name to the breadcrumb navigation menu
 */var fillBreadcrumb=function fillBreadcrumb(){var restaurant=arguments.length>0&&arguments[0]!==undefined?arguments[0]:self.restaurant;var breadcrumb=document.getElementById('breadcrumb');var li=document.createElement('li');li.innerHTML=restaurant.name;//Set ARIA attributes so screenreader knows its on the current page for the restaurant in the breadcrumb trail.
li.setAttribute('aria-label',restaurant.name);li.setAttribute('aria-describedby','breadcrumb-description');li.setAttribute('tabindex','0');//Dynamically set title attribute
li.title=restaurant.name;breadcrumb.appendChild(li)};/**
 * Get a parameter by name from page URL.
 */var getParameterByName=function getParameterByName(name,url){if(!url)url=window.location.href;name=name.replace(/[\[\]]/g,'\\$&');var regex=new RegExp('[?&]'+name+'(=([^&#]*)|&|#|$)'),results=regex.exec(url);if(!results)return null;if(!results[2])return'';return decodeURIComponent(results[2].replace(/\+/g,' '))};