var CarGame = {
	images : {},
    screens : {},

	status : {
		preloadRequest : 0,
		preloadComplete : 0
	}
};

//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function() {
	console.log('Loading resources...');
	Modernizr.load([
		{
			load : [
                'preload!scripts/text.js',
                'preload!scripts/collisionDetection.js',
                'preload!scripts/carTimer.js',
                'preload!scripts/carArena.js',
                'preload!scripts/lostScreen.js',
                'preload!scripts/input.js',
                'preload!scripts/persistence.js',
                'preload!scripts/carGameScreens.js',
                'preload!scripts/mainmenu.js',
                'preload!scripts/carModel.js',
                'preload!scripts/carBoulder.js',
				'preload!scripts/carGame.js',
                'preload!scripts/highscores.js',
                'preload!scripts/help.js',
                'preload!scripts/about.js',
                'preload!images/Background.png',
                'preload!images/Boulder.png',
                'preload!images/Car.png',
                'preload!images/Clock.png',
                'preload!images/Fire.png',
                'preload!images/smoke.png',
                'preload!images/White.png'
			],
			complete : function() {
				console.log('All files requested for loading...');
			}
		}
	]);
}, false);

//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
	console.log('preloading: ' + resource.url);

	CarGame.status.preloadRequest += 1;
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
	resource.noexec = isImage;
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			CarGame.images[resource.url] = image;
		}
		CarGame.status.preloadComplete += 1;
		
		//
		// When everything has finished preloading, go ahead and start the game
		if (CarGame.status.preloadComplete === CarGame.status.preloadRequest) {
			console.log('Preloading complete!');
            CarGame.game.initialize();
		}
	};
	
	return resource;
});
