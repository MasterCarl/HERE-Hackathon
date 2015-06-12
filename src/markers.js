var MarkerManager = function(map) {
	var me = {};

	var group = new H.map.Group();
	map.addObject(group);

	// add 'tap' event listener, that opens info bubble, to the group
	group.addEventListener('tap', function (evt) {
		// event target is the marker itself, group is a parent event target
		// for all objects that it contains
		var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
			// read custom data
			content: evt.target.getData()
		});
		// show info bubble
		ui.addBubble(bubble);
	}, false);

	me.add = function(lat, lng, html) {
		var marker = new H.map.Marker({lat: lat, lng: lng});
		// add custom data to the marker
		marker.setData(html);
		group.addObject(marker);
	};

	return me;
};
