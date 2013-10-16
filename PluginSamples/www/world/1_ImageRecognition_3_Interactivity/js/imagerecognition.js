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

		// Button image
		this.imgButton = new AR.ImageResource("assets/wwwButton.jpg");

		// Create overlay for page one
		var imgOne = new AR.ImageResource("assets/imageOne.png");
		var overlayOne = new AR.ImageDrawable(imgOne, 1, {
			offsetX: -0.15,
			offsetY: 0
		});
		var pageOneButton = this.createWwwButton("http://n1sco.com/specifications/", 0.1, {
			offsetX: -0.25,
			offsetY: -0.25,
			zOrder: 1
		});
		var pageOne = new AR.Trackable2DObject(this.tracker, "pageOne", {
			drawables: {
				cam: [overlayOne, pageOneButton]
			}
		});

		// Create overlay for page two
		var imgTwo = new AR.ImageResource("assets/imageTwo.png");
		var overlayTwo = new AR.ImageDrawable(imgTwo, 0.5, {
			offsetX: 0.12,
			offsetY: -0.01
		});
		var pageTwoButton = this.createWwwButton("http://goo.gl/qxck1", 0.15, {
			offsetX: 0,
			offsetY: -0.25,
			zOrder: 1
		});
		var pageTwo = new AR.Trackable2DObject(this.tracker, "pageTwo", {
			drawables: {
				cam: [overlayTwo, pageTwoButton]
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
		var cssDivRight1 = " style='display: table-cell;vertical-align: middle; text-align: left; padding-right: 15px; width: 38px'";
		var cssDivRight2 = " style='display: table-cell;vertical-align: middle; text-align: left; padding-right: 15px;'";
		document.getElementById('loadingMessage').innerHTML =
			"<div" + cssDivLeft + ">Scan Target &#35;1 (surfer) or &#35;2 (biker):</div>" +
			"<div" + cssDivRight1 + "><img src='assets/surfer.png'></img></div>" +
			"<div" + cssDivRight2 + "><img src='assets/bike.png'></img></div>";
	}
};

World.init();