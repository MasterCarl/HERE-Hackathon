/**
 * Changes the default style for H&M shops
 */
function onSpaceCreated(space) {
  if (space.getData().preview === 'H&M') {
    space.setStyle({
      fillColor: 'rgba(0,255,0,0.3)'
    });
  }
}

/**
 * Shows how to add venue objects to the map, change default styling
 * and change a floor level for all venues.
 */
function addVenueLayer(map, platform, renderControls) {
  // Create a tile layer, which will display venues
  var customVenueLayer = platform.getVenueService().createTileLayer({
    // Provide a callback that will be called for each newly created space
    onSpaceCreated: onSpaceCreated
  });

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
