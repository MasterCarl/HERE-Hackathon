function sortVenues(platform, startpos, transMode, venues, callback) {

  var url = "https://route.st.nlp.nokia.com/routing/6.2/calculatematrix.json?";
  url.query += encodeURIComponent("app_id=" + platform.app_id);
  url.query += encodeURIComponent("&app_code=" + platform.app_code);
  url.query += encodeURIComponent("&mode=" + transMode + "fastest,traffic:disable");
  url.query += encodeURIComponent("&start0=" + startpos);


  var i;
  for (i = 0; i < venuesStoresMap.length; i++) {
    url.query += encodeURIComponent("&destination" + i + "=" + venues.venue.position[0] + "," + venues[i].venue.position[1]);
  }

  var request = new XMLHttpRequest();
  request.responseType = 'json';
  request.onreadystatechange = function(data) {
    if (request.readyState === 4 && request.status === 200) {

      var matrixList = JSON.parse(data).Response.MatrixEntry;
      // If a venue is less than 10 minutes away, but has more desired store, it will be classified as nearer
      matrixList.sort(function(a, b) {
        var timeDiff = a.Route.Summary.BaseTime - b.Route.Summary.BaseTime;
        var venueA = venues[a.DestinationIndex];
        var venueB = venues[b.DestinationIndex];
        var storeDiff = venueB.stores.length - venueA.stores.length;

        if (timeDiff < 0 && !(timeDiff > -600 * storeDiff)) {
          return -1;
        }
        return 1;
      });

      var sortedVenues = [];
      for (i = 0; i < venues.length; i++) {
        sortedVenues[i] = venues[matrixList[i].DestinationIndex];
      }

      callback(sortedVenues);
    }
  };

  request.open("GET", url, true);
  request.send();
}