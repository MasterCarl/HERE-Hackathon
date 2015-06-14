var lastPolyline;

function addResultsToMap(map, results) {
  for (i = 0; i < results.length; i++) {
    var marker = new H.map.Marker({
      lat: results[i].position[1],
      lng: results[i].position[0]
    });
    map.addObject(marker);
  }
}

function calculateAddRoute(platform, map, from, to, mode) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: mode, //'fastest;car',
      representation: 'display',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      waypoint0: from.lat + "," + from.lng,
      waypoint1: to[1] + "," + to[0]
    };


  router.calculateRoute(
    routeRequestParams,
    onDisplayResultsSuccess,
    onError
  );
}

/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onDisplayResultsSuccess(result) {
  var route = result.response.route[0];

  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map

  if (lastPolyline != null)
    map.removeObject(lastPolyline);
  lastPolyline = polyline;
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);

}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Error' + error);
}