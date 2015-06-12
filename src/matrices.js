function sortVenues(platform, startpos, transportation, venues, callback) {

  var url = "https://route.st.nlp.nokia.com/routing/6.2/calculatematrix.json?";
  url.query += encodeURIComponent("app_id=" + platform.app_id);
  url.query += encodeURIComponent("&app_code=" + platform.app_code);
  url.query += encodeURIComponent("&mode=" + transportation + "fastest,traffic:disable");
  url.query += encodeURIComponent("&start0=" + startpos);

  var i;
  for (i = 0; i < venues.length; i++) {
    url.query += encodeURIComponent("&destination" + i + "=" + venues[i].position[0] + "," + venues[i].position[1]);
  }

  var request = new XMLHttpRequest();
  request.responseType = 'json';
  request.onreadystatechange = function(data) {
    if (request.readyState === 4 && request.status === 200) {
      return;
    }

    var matrixList = JSON.parse(data).Response.MatrixEntry;
    matrixList.sort(function(a, b) {
      return a.Route.Summary.BaseTime - b.Route.Summary.BaseTime;
    });

    var sortedVenues = [];
    for (i = 0; i < venues.length; i++) {
      sortedVenues[i] = venues[matrixList[i].DestinationIndex];
    }

    callback(sortedVenues);
  };

  request.open("GET", url, true);
  request.send();
}