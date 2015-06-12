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
function onSuccess(result, map) {
  var location = result.response.view[0].result;
  map.setCenter({
    lat: location.position[0],
    lng: location.position[1]
  });
  var marker = new H.map.Marker({
    lat: location.position[0],
    lng: location.position[1]
  });
  map.addObject(marker);
}