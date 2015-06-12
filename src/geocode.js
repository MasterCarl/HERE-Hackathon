function geocode(platform, map, stext) {
  var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
      searchtext: stext,
      jsonattributes: 1
    };

  geocoder.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}
/**
 * This function will be called once the Geocoder REST API provides a response
 * @param  {Object} result          A JSONP object representing the  location(s) found.
 *
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
function onSuccess(result) {
  var location = result.response.view[0].result[0].location;
  var coord = {
    lat: location.displayPosition.latitude,
    lng: location.displayPosition.longitude
  };
  map.setCenter(coord);
  var marker = new H.map.Marker(coord);
  map.addObject(marker);
}