define([
    'backbone',
    'mustache',
    'routes',
    'text!templates/appTemplate.html',
    'underscore'
], function(
    Backbone,
    Mustache,
    routes,
    template,
    _
) {
    'use strict';

    return Backbone.View.extend({

        className: 'guInteractive',

        events: {
            'click .collapseButton': 'expandText'
        },
        expandText: function(e){
            var state = $(e.currentTarget).attr('data-toggle');
            // var currentActor = $(e.currentTarget).attr('data-actor');
            // var currentActorObject = _.findWhere(this.collection.toJSON(),{id:currentActor});
            console.log(state);
            if(state==="readMore"){
                $(e.currentTarget).closest('.actorContainer').addClass('active');
            }else{
                $(e.currentTarget).closest('.actorContainer').removeClass('active');
                // Update scroll position too
            }
            
        },
        

        initialize: function() {
           this.collection.on('sync', this.render, this);

           this.sortReversed = false;
        },

        render: function() {
            var screenSize = "big";

            var furniture = {
                title: "The celebrated unknowns",
                standfirst: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            }

            var templateData = { 
                actors: this.collection.toJSON(),
                furniture: furniture,
                screenSize: screenSize,
                byline: ""
            };
            this.$el.html(Mustache.render(template, templateData));
            
            return this;
        }
    });
});

