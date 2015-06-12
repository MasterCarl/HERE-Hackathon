 function calculate() {
   sortVenues(platform, startpos, getRouteMode(), venues, function(sortedVenues) {
     var venueStoresPairs = [],
       bestIndex, i;
     for (i = 0; i < sortedVenues.length; i++) {
       var venueStores = {};
       venueStores['venue'] = sortedVenue[i];

       var stores = [];
       // get stores

     }


     // TODO: set markers of venues, including their places
     var marker = new H.map.object();
     map.addObject(marker);

     calculateAddRoute(platform, map, startpos, venueStoresPairs[bestIndex].position, getRouteMode());
   });
 }