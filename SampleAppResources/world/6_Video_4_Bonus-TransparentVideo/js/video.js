var World = {
	loaded: false,

	init: function initFn() {
		/* Disable all sensors in "IR-only" Worlds to save performance. If the property is set to true, any geo-related components (such as GeoObjects and ActionRanges) are active. If the property is set to false, any geo-related components will not be visible on the screen, and triggers will not fire.*/
		AR.context.services.sensors = false;
		this.createOverlays();
	},

	createOverlays: function createOverlaysFn() {
		// Initialize Tracker
		this.tracker = new AR.Tracker("assets/magazine.wtc", {
			onLoaded: this.worldLoaded
		});

		// Create a transparent video drawable
		var video = new AR.VideoDrawable("assets/transparentVideo.mp4", 0.7, {
			offsetX: -0.2,
			offsetY: -0.12,
			isTransparent: true
		});

		// Button
		this.imgButton = new AR.ImageResource("assets/wwwButton.jpg");
		var pageOneButton = this.createWwwButton("http://n1sco.com/specifications/", 0.1, {
			offsetX: -0.05,
			offsetY: 0.2,
			zOrder: 1
		});
		video.play(-1);
		video.pause();

		var pageOne = new AR.Trackable2DObject(this.tracker, "pageOne", {
			drawables: {
				cam: [video, pageOneButton]
			},
			onEnterFieldOfVision: function onEnterFieldOfVisionFn() {
				video.resume();
			},
			onExitFieldOfVision: function onExitFieldOfVisionFn() {
				video.pause();
			}
		});
	},

	createWwwButton: function createWwwButtonFn(url, size, options) {
		options.onClick = function() {
			AR.context.openInBrowser(url);
		};
		return new AR.ImageDrawable(this.imgButton, size, options);
	},

	worldLoaded: function worldLoadedFn() {
		var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
		var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
		document.getElementById('loadingMessage').innerHTML =
			"<div" + cssDivLeft + ">Scan Red Bulletin Target:</div>" +
			"<div" + cssDivRight + "><img src='assets/surfer.png'></img></div>";
		
		// Remove Scan target message after 10 sec.
		setTimeout(function() {var e =document.getElementById('loadingMessage'); e.parentElement.removeChild(e);}, 10000);
	}
};

World.init();