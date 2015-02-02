define([
    'backbone',
    'mustache',
    'routes',
    'text!templates/appTemplate.html',
], function(
    Backbone,
    Mustache,
    routes,
    template
) {
    'use strict';

    return Backbone.View.extend({

        className: 'guInteractive',

        events: {
            'click .column-header': 'sortTable'
        },

        sortTable: function(event) {
            var $target = $(event.currentTarget);
            var sortColumn = $target.data('sort');

            
            this.collection.comparator = function(model) {
                return model.get(sortColumn);
            };
            
            this.collection.sort();
            $target.toggleClass('active');


            if ($target.hasClass('active')) {
                this.sortReversed = !this.sortReversed;
            }

            if (this.sortReversed) {
                this.collection.models.reverse();
            }
            this.render();
        },

        initialize: function() {
            // Listen to routes
            /*
            routes.on('route:default', this.defaultRender, this);
            routes.on('route:catalogue', this.catalogueRender, this);
            routes.on('route:singleGame', this.singleGameRender, this);
            */
           this.collection.on('sync', this.render, this);

           this.sortReversed = false;
        },

        render: function() {
            var templateData = { rows: this.collection.toJSON() };
            this.$el.html(Mustache.render(template, templateData));
            
            return this;
        }
    });
});

