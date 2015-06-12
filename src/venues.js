var varMap, varVenueService;

//Get venue
$(document).ready(function() {
	var toSubmit = function() {
		var radius = parseInt($("#playground-input").val());
		var center = varMap.getCenter();
		var upperLeft = center.walk(315, radius);
		var lowerRight = center.walk(135, radius);
		
		//var boundingBox = new H.geo.Rect(upperLeft.lat, upperLeft.lng, lowerRight.lat, lowerRight.lng);
		//varMap.addObject(new H.map.Rect(boundingBox));
		
		varVenueService.discover({
			at: upperLeft.lat
				+ ',' + upperLeft.lng
				+ ',' + lowerRight.lat
				+ ',' + lowerRight.lng
			},
			onDiscover,
			onError
		);
	};
	
	var enterPressed = function() {
		$('#playground-input').keyup(function(event) {
			if(event.which == 13) {
				toSubmit();
			}
		});
	};
	enterPressed();
});

function onDiscover(result) {
	var size = result.results.items.length
	for(var i = 0; i < size; i++) {
		var position = result.results.items[i].position;
		varMap.addObject(new H.map.Marker({lat: position[1], lng: position[0]}));
	}
	//map.setCenter({lat: position[1], lng: position[0]});
};

function onError(error) {
	alert(error);
}

/**
 * Shows how to add venue objects to the map, change default styling
 * and change a floor level for all venues.
 */
function addVenueLayer(map, platform, renderControls) {
	varMap = map;
	varVenueService = platform.getVenueService();
	// Create a tile layer, which will display venues
	var customVenueLayer = varVenueService.createTileLayer({});
	
	// Get TileProvider from Venue Layer
	var venueProvider = customVenueLayer.getProvider();
	// Add venues layer to the map
	varMap.addLayer(customVenueLayer);
	
	// Use the custom function (i.e. not a part of the API)
	// to render buttons with corresponding click callbacks
	renderControls(varMap, 'Change floor', {
		'+1 Level': function () {
			// Increase global floor level on the venue provider
			venueProvider.setCurrentLevel(venueProvider.getCurrentLevel() + 1);
		},
		'-1 Level': function () {
			// Decrease global floor level on the venue provider
			venueProvider.setCurrentLevel(venueProvider.getCurrentLevel() - 1);
		}
	});
}
