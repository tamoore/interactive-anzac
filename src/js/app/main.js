define([
	'backbone',
	'collections/sheetCollection',
	'views/appView',
	'iframeMessenger',
	'./frame'
], function(
	Backbone,
	SheetCollection,
	AppView,
	iframeMessenger,
	frame
) {
	'use strict';
	frame.boot();

	var appView;

	// Your proxied Google spreadsheet goes here
	var key = '15sc0DGXCE1ltJ4gQJRHnSUnL8ack0nj5qwElf0_4cYw';

	function init(el, context, config, mediator) {
		// DEBUG: What we get given on boot
		// console.log(el, context, config, mediator);

		// Create collection from Google spreadsheet key and sheetname
		// from live external data
		var videogameCollection = new SheetCollection({
			key: key,
			sheetname: 'Sheet1'
		});

		// Create an app view, passing along the collection made above
		appView = new AppView({
			el: el,
			collection: videogameCollection
		});

		// Fetch data
		videogameCollection.fetch();

		// Start listening to URL #paths
		Backbone.history.start();

		// Enable iframe resizing on the GU site
		iframeMessenger.enableAutoResize();
	}

	return {
		init: init
	};
});
