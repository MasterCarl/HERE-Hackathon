var sortedVenueMap, i;
Markers.clear();
for (i = 0; i < sortedVenueMap.length; i++) {
  var venue = sortedVenueMap[i].venue;
  Markers.add(venue.position[0], venue.position[1],
    "<b>" + venue.title + "</b> <br>" +
    venue.address.street + " " + venue.address.house + "<br>" +
    venue.address.postalCode + " " + venue.address.city + "<br><br>" +
    (sortedVenueMap[i].time / 60) + " minutes away");
}
calculateAddRoute(platform, map, startpos, sortedVenues[0].position, getRouteMode());