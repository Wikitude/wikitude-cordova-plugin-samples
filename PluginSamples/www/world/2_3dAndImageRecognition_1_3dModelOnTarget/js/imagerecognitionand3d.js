var World = {
	loaded: false,
	rotating: false,

	init: function initFn() {
		/* Disable all sensors in "IR-only" Worlds to save performance. If the property is set to true, any geo-related components (such as GeoObjects and ActionRanges) are active. If the property is set to false, any geo-related components will not be visible on the screen, and triggers will not fire.*/
		AR.context.services.sensors = false;
		this.createOverlays();
	},

	createOverlays: function createOverlaysFn() {
		// Initialize Tracker
		this.tracker = new AR.Tracker("assets/tracker.wtc", {
			onLoaded: this.loadingStep
		});

		this.modelCar = new AR.Model("assets/car.wt3", {
			onLoaded: this.loadingStep,
			scale: {
				x: 0.045,
				y: 0.045,
				z: 0.045
			},
			translate: {
				x: 0.0,
				y: 0.05,
				z: 0.0
			},
			rotate: {
				roll: -25
			}
		});

		var trackable = new AR.Trackable2DObject(this.tracker, "carAd", {
			drawables: {
				cam: [this.modelCar]
			},
			onEnterFieldOfVision: this.appear
		});
	},

	loadingStep: function loadingStepFn() {
		if (!World.loaded && World.tracker.isLoaded() && World.modelCar.isLoaded()) {
			World.loaded = true;
			var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
			var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
			document.getElementById('loadingMessage').innerHTML =
				"<div" + cssDivLeft + ">Scan CarAd Tracker Image:</div>" +
				"<div" + cssDivRight + "><img src='assets/car.png'></img></div>";
		}
	}
};

World.init();