function addResultsToMap(map, results) {
	for(i = 0; i < results.length; i++)	{
		var marker = new H.map.Marker({lat: results[i].position[0], lng: results[i].position[1]});
  		map.addObject(marker);
	}
 }