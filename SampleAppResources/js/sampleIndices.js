var samples = [];

samples[0] = ["www/world/1_ImageRecognition_1_ImageOnTarget/index.html",
			  "www/world/1_ImageRecognition_2_MultipleTargets/index.html",
			  "www/world/1_ImageRecognition_3_Interactivity/index.html",
			  "www/world/1_ImageRecognition_4_HtmlDrawable/index.html",
			  "www/world/1_ImageRecognition_5_Bonus-Sparkles/index.html"
			];
samples[1] = ["www/world/2_3dAndImageRecognition_1_3dModelOnTarget/index.html",
			 "www/world/2_3dAndImageRecognition_2_AppearingAnimation/index.html",
			 "www/world/2_3dAndImageRecognition_3_Interactivity/index.html",
			 "www/world/2_3dAndImageRecognition_4_SnapToScreen/index.html"
		 	];

samples[2] = ["www/world/3_PointOfInterest_1_PoiAtLocation/index.html",
			 "www/world/3_PointOfInterest_2_PoiWithLabel/index.html",
			 "www/world/3_PointOfInterest_3_MultiplePois/index.html",
			 "www/world/3_PointOfInterest_4_SelectingPois/index.html"
		 	];

samples[3] = ["www/world/4_ObtainPoiData_1_FromApplicationModel/index.html",
			 "www/world/4_ObtainPoiData_2_FromLocalResource/index.html",
			 "www/world/4_ObtainPoiData_3_FromWebservice/index.html"
		 	];

samples[4] = ["www/world/5_BrowsingPois_1_PresentingDetails/index.html",
			 "www/world/5_BrowsingPois_2_AddingRadar/index.html",
			 "www/world/5_BrowsingPois_3_LimitingRange/index.html",
			 "www/world/5_BrowsingPois_4_ReloadingContent/index.html",
			 "www/world/5_BrowsingPois_6_CaptureScreenBonus/index.html"
		 	];

samples[5] = ["www/world/6_Video_1_SimpleVideo/index.html",
			 "www/world/6_Video_2_PlaybackStates/index.html",
			 "www/world/6_Video_3_SnappingVideo/index.html",
			 "www/world/6_Video_4_Bonus-TransparentVideo/index.html"
			];

samples[6] = ["www/world/99_Demo_1_ImageRecognitionAndGeo/index.html",
			 "www/world/99_Demo_2_SolarSystem(Geo)/index.html",
			 "www/world/99_Demo_3_SolarSystem(ImageRecognition)/index.html"
		 	];

function getSamplePath(category, sample) {
	return samples[category][sample];
}
