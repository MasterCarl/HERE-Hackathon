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
        at: upperLeft.lat + ',' + upperLeft.lng + ',' + lowerRight.lat + ',' + lowerRight.lng
      },
      onDiscover,
      onError
    );
  };

  $('#playground-input').keyup(function(event) {
    if (event.which == 13) {
      toSubmit();
    }
  });

  toSubmit();
});

function onDiscover(result) {
  var size = result.results.items.length
  var venueList = new H.map.Group;
  Markers.clear();
  var i;
  for (i = 0; i < size; i++) {
    var venue = result.results.items[i];

    var venueStorePair = {};
    venueStorePair['venue'] = venue;

    getVenueDetailsURL(venue.id, venueStorePair);

    var position = venue.position;
    Markers.add(position[1], position[0], venue.title);

    venueStoreMap[i] = venueStorePair;
  }
  //map.setCenter({lat: position[1], lng: position[0]});
};

function onError(error) {
  alert(error);
};

function setSignatureTokens(venueID, venueStorePair) {
  var app_id = "***REMOVED***";
  var app_code = "***REMOVED***";

  var url = 'https://signature.venue.maps.cit.api.here.com/venues/signature/v1?app_id=' + app_id + '&app_code=' + app_code;
  $.get(url).done(function(result) {
    var signature = result.SignatureTokens.Signature.trim();
    var policy = result.SignatureTokens.Policy.trim();
    var key_pair_id = result.SignatureTokens['Key-Pair-Id'].trim();
    var url2 = 'https://static-1.venue.maps.cit.api.here.com/1/models-poi/' + venueID + '.js?app_id=' + app_id + '&app_code=' +
      app_code + '&Signature=' + signature + '&Policy=' + policy + '&Key-Pair-Id=' + key_pair_id;

    console.log(url2);
    var dataObj = {};
    dataObj['app_id'] = app_id;
    dataObj['app_code'] = app_code;
    dataObj['Signature'] = signature;
    dataObj['Policy'] = policy;
    dataObj['Key-Pair-Id'] = key_pair_id;
    $.ajax({
      url: url2,
      dataType: 'html',
      //jsonp: 'jsoncallback',
      type: "GET",
      success: function(result2) {

        var actualContents;
        JSON.venues = function(foo, contents) {
          actualContents = contents;
        };
        eval(result2);
        //alert("WTF");
        fillshopList(actualContents, venueStorePair);
      },
      error: function(error) {
        console.log(JSON.stringify(error));
      }
    });
  });
}

function getVenueDetailsURL(venueID, venueStorePair) {
  setSignatureTokens(venueID, venueStorePair);
};

function fillshopList(placesJSON, venueStorePair) {
  var shops = [];
  for (var i in placesJSON.levels) {
    var level = placesJSON.levels[i];
    for (var j in level.outerAreas) {
      var area = level.outerAreas[j];
      for (var k in area.spaces) {
        var space = area.spaces[k];
        if (space.content != null) {
          shops[shops.length] = space.content;
        }
      }
    }
  }

  venueStorePair['items'] = shops;
}

function calculate(platform, map, venueStoreMap, startpos2) {
  if(startpos2 == null){
    startpos2 = map.getCenter();
  }

  var inputShopList = $("#storeTextInput").val();
  var shopList = inputShopList.split(',');

  var endCallback = function(sortedVenueMap) {
    var i;
    Markers.clear();
    for (i = 0; i < sortedVenueMap.length; i++) {
      var venue = sortedVenueMap[i].venue;
      var venue_description = "<b>" + venue.title + "</b> <br>" +
        venue.address.street + " " + venue.address.house + "<br>" +
        venue.address.postalCode + " " + venue.address.city + "<br><br>" +
        (Math.round(sortedVenueMap[i].time / 30) / 2) + " minutes away<br>";
      if (sortedVenueMap[i].stores.length > 0) {
        venue_description += "<br>Has: <br><br>"
      }

      var j;
      for (j = 0; j < sortedVenueMap[i].stores.length; j++) {
        var store = sortedVenueMap[i].stores[j];
        //Markers.add(store.position[0], venue.position[1], "<b>" + Object.keys(store.names)[0] + "</b>");

        venue_description += (j + 1) + ". " + store.names[Object.keys(store.names)[0]] + "<br>";
        if (store.phoneNumber != null) {
          venue_description += store.phoneNumber + "<br>"
        }
      }

      Markers.add(venue.position[1], venue.position[0], venue_description);
    }
    Markers.add(startpos2.lat, startpos2.lng, "You");
    calculateAddRoute(platform, map, startpos2, sortedVenueMap[0].venue.position, getRouteMode());
  }

  var i, filteredVenues = [];
  for (i = 0; i < venueStoreMap.length; i++) {
    var filteredVenue = {};

    filteredVenue['venue'] = venueStoreMap[i].venue;
    var stores = [];
    for (var j in venueStoreMap[i].items) {
      var item = venueStoreMap[i].items[j];
      var itemName = item.names[Object.keys(item.names)[0]].toLowerCase();
      for (var k in shopList) {
        var queryName = shopList[k].trim().toLowerCase();
        if (queryName.length > 0 && itemName.indexOf(queryName) > -1) {
          stores[stores.length] = item;
          shopList[k] = "";
          break;
        }
      }
    }
    if (stores.length > 0) {
      console.log(JSON.stringify(stores));
      filteredVenue['stores'] = stores;
      filteredVenues[filteredVenues.length] = filteredVenue;
    }

    shopList = inputShopList.split(',');
  }

  sortVenues(platform, startpos2, getRouteMode(), filteredVenues, endCallback);
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
    '+1 Level': function() {
      // Increase global floor level on the venue provider
      venueProvider.setCurrentLevel(venueProvider.getCurrentLevel() + 1);
    },
    '-1 Level': function() {
      //Decrease global floor level on the venue provider
      venueProvider.setCurrentLevel(venueProvider.getCurrentLevel() - 1);
    }
  });
}