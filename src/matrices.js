function sortVenues(platform, startpos, transMode, venues, callback) {

  var dataObj = {}
  dataObj['app_id'] = "***REMOVED***";
  dataObj['app_code'] = "***REMOVED***";
  dataObj['mode'] = transMode + "traffic:disabled;";
  dataObj['start0'] = startpos.lat + "," + startpos.lng;

  var i;
  for (i = 0; i < venues.length; i++) {
    var pos2 = venues[i].venue.position[0];
    var pos1 = venues[i].venue.position[1];

    dataObj['destination' + i] = pos1 + "," + pos2;
  }

  $.ajax({
    url: "https://route.st.nlp.nokia.com/routing/6.2/calculatematrix.json",
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    type: "GET",
    data: dataObj,
    success: function(data) {
      console.log(JSON.stringify(data));
      var matrixList = data.Response.MatrixEntry;
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
        sortedVenues[i]['time'] = matrixList[i].Route.Summary.BaseTime;
      }

      callback(sortedVenues);
    },
    error: function(error) {
      console.log(error);
    }
  });
}