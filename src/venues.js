var shopList;

//Get venue
$(function() {
      $("#actionButton").click( function() {
			//shop list
			var inputShopList = $("#storeTextInput").val();
			var shopList = inputShopList.split(', ');
			
			//venues
			var radius = parseInt($("#radius").val());
			var center = map.getCenter();
			var upperLeft = center.walk(315, radius);
			var lowerRight = center.walk(135, radius);
			
			venueService.discover({
				at: upperLeft.lat
					+ ',' + upperLeft.lng
					+ ',' + lowerRight.lat
					+ ',' + lowerRight.lng
				},
				onDiscover,
				onError
			);
           }
      );
});

function onDiscover(result) {
	var size = result.results.items.length
	var venueList = new H.map.Group;
	Markers.clear();
	for(var i = 0; i < size; i++) {
		var venue = result.results.items[i];
		getVenueDetailsURL(venue.id);
		
		var position = venue.position;
        Markers.add(position[1], position[0], venue.title);
	}
	//map.setCenter({lat: position[1], lng: position[0]});
};

function onError(error) {
	alert(error);
};
 
 function setSignatureTokens(venueID) {
	var url = 'https://signature.venue.maps.cit.api.here.com/venues/signature/v1?app_id='
		+ app_id
		+ '&app_code='
		+ app_code;
	$.get(url).done(function( result ) {
		signature = result.SignatureTokens.Signature;
		policy = result.SignatureTokens.Policy;
		key_pair_id = result.SignatureTokens['Key-Pair-Id'];
		var url2 = 'https://static-1.venue.maps.cit.api.here.com/1/models-poi/'
		+ venueID
		+ '.js?app_id='
		+ app_id
		+ '&app_code='
		+ app_code
		+ '&Signature='
		+ signature
		+ '&Policy='
		+ policy
		+ '&Key-Pair-Id='
		+ key_pair_id;
		
		$.ajax({
			url: url2,
			success: function ( result2 ) {
				var actualContents;
				JSON.venues = function(foo, contents) {
					actualContents = contents;
				}
				eval(result2);
				alert("WTF");
				console.log(actualContents);
			},
			error: function(error) {
				console.log(error);
			},
			dataType: 'html'
		});
	});
 };

function getVenueDetailsURL(venueID) {
	setSignatureTokens(venueID);
	
};

function venueContainsShop(venue, shopList) {
};

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
