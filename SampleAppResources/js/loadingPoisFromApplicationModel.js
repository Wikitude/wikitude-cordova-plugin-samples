
/* this is a dummy implementation to create poi-data, which are passed over to JS / Wikitude SDK on first location update */
function onLocationUpdated(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var altitude = position.coords.altitude;
	var placesAmount = 10;
	var poiData = [];

	// creates dummy poi-data around given lat/lon
	for (var i=0; i< placesAmount; i++) {
		poiData.push({ 'id': (i+1), 'longitude': longitude + 0.001 * ( 5 - getRandomInt(1,10) ), 'latitude' : latitude + 0.001 * (5 - getRandomInt(1,10)), 'description': 'This is the description of POI#'+(i+1), 'altitude' : 100.0, 'name': 'POI#'+(i+1)})
	}

	// inject POI data in JSON-format to JS
	app.wikitudePlugin.callJavaScript( "World.loadPoisFromJsonData(" + JSON.stringify( poiData ) +");");
}

function onLocationError(error) {
	alert("Not able to fetch location.");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
