//Get venue
$(document).ready(function() {
	var toSubmit = function() {
		var radius = parseInt($("#playground-input").val());
		var center = map.getCenter();
		var upperLeft = center.walk(315, radius);
		var lowerRight = center.walk(135, radius);
		
		//var boundingBox = new H.geo.Rect(upperLeft.lat, upperLeft.lng, lowerRight.lat, lowerRight.lng);
		//map.addObject(new H.map.Rect(boundingBox));
		
		venueService.discover({
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
	Markers.clear();
	for(var i = 0; i < size; i++) {
		var venue = result.results.items[i]
		var position = venue.position;
        Markers.add(position[1], position[0], venue.title);
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
	venueService = platform.getVenueService();
	// Create a tile layer, which will display venues
	var customVenueLayer = venueService.createTileLayer({});
	
	// Get TileProvider from Venue Layer
	var venueProvider = customVenueLayer.getProvider();
	// Add venues layer to the map
	map.addLayer(customVenueLayer);
	
	// Use the custom function (i.e. not a part of the API)
	// to render buttons with corresponding click callbacks
	renderControls(map, 'Change floor', {
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
