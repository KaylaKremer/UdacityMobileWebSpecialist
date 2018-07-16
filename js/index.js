(function () {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(reg => {
			console.log('ServiceWorker registration successful!');
		}).catch(err => {
			console.log(err.message);
		});
	} else {
		console.log('ServiceWorker is not supported');
	}
}());