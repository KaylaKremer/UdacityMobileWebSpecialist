//Registers service worker if browser supports it
(function () {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(reg => {
			console.log(`ServiceWorker registration successful! ${reg.scope}`);
		}).catch(error => {
			console.log(`ServiceWorker registration failed! ${error}`);
		});
	} else {
		console.log('ServiceWorker is not supported');
	}
}());