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

		// Create play button
		var playButtonImg = new AR.ImageResource("assets/playButton.png");
		var playButton = new AR.ImageDrawable(playButtonImg, 0.3, {
			enabled: false,
			clicked: false,
			onClick: function playButtonClicked() {
				video.play(1);
				video.playing = true;
				playButton.clicked = true;
			},
			offsetY: -0.3
		});

		// Create video drawable
		var video = new AR.VideoDrawable("assets/video.mp4", 0.40, {
			offsetY: playButton.offsetY,
			onLoaded: function videoLoaded() {
				playButton.enabled = true;
			},
			onPlaybackStarted: function videoPlaying() {
				playButton.enabled = false;
				video.enabled = true;
			},
			onFinishedPlaying: function videoFinished() {
				playButton.enabled = true;
				video.playing = false;
				video.enabled = false;
			},
			onClick: function videoClicked() {
				if (playButton.clicked) {
					playButton.clicked = false;					
				} else if (video.playing) {
					video.pause();
					video.playing = false;
				} else {
					video.resume();
					video.playing = true;
				}
			}
		});

		var pageOne = new AR.Trackable2DObject(this.tracker, "pageOne", {
			drawables: {
				cam: [video, playButton]
			},
			onEnterFieldOfVision: function onEnterFieldOfViewFn() {
				if (video.playing) {
					video.resume();
				}
			},
			onExitFieldOfVision: function onExitFieldOfView() {
				if (video.playing) {
					video.pause();
				}
			}
		});
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