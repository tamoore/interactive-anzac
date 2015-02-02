define([
    'backbone',
    'collections/sheetCollection',
    'views/appView',
    'json!data/sampleData.json',
    'iframeMessenger'
], function(
    Backbone,
    SheetCollection,
    AppView,
    SampleData,
    iframeMessenger
) {
   'use strict';

    var appView;
    
    // Your proxied Google spreadsheet goes here
    var key = '1Kg05zsGhLx9j7kyAGchrRvzlEKfUUARopV7Q_fOxnOw';

    function init(el, context, config, mediator) {
        // DEBUG: What we get given on boot
        console.log(el, context, config, mediator);

        // Load local JSON data
        console.log(SampleData);

        // Create collection from Google spreadsheet key and sheetname
        // from live external data
        var videogameCollection = new SheetCollection({
            key: key,
            sheetname: 'videogames'
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