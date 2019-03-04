
var poiData = [];

function prepareApplicationDataModel() {
    if ( !poiData.length ) {
        navigator.geolocation.getCurrentPosition(onLocationUpdated, onLocationError, {maximumAge:Infinity, timeout:10000});
    } else {
        if ( app.isArchitectWorldLoaded == true ) {
            injectGeneratedPoiJsonData();
        }
    }
}

/* this is a dummy implementation to create poi-data, which are passed over to JS / Wikitude SDK on first location update */
/* in this function we generate poi data that will then be injected once the example is fully loaded. The injection is done in the 'injectGeneratedPoiJsonData' function defined in this file. */
function onLocationUpdated(position) {

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var altitude = position.coords.altitudeAccuracy !== null ? position.coords.altitude : -32768.0;
    var placesAmount = 10;

    poiData = [];

    // creates dummy poi-data around given lat/lon
    for (var i=0; i< placesAmount; i++) {
        poiData.push({ 'id': (i+1), 'longitude': longitude + 0.001 * ( 5 - getRandomInt(1,10) ), 'latitude' : latitude + 0.001 * (5 - getRandomInt(1,10)), 'description': 'This is the description of POI#'+(i+1), 'altitude' : altitude, 'name': 'POI#'+(i+1)})
    }

    if ( app.isArchitectWorldLoaded == true ) {
           injectGeneratedPoiJsonData();
    }
}

function injectGeneratedPoiJsonData() {
    // inject POI data in JSON-format to JS
    if ( poiData.length > 0 && app.isArchitectWorldLoaded == true ) {
        app.wikitudePlugin.callJavaScript("World.loadPoisFromJsonData(" + JSON.stringify( poiData ) +");");
    }
}

function onLocationError(error) {
	alert("Not able to fetch location.");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
