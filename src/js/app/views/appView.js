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
            if(state==="readMore"){
                $(e.currentTarget).closest('.actorContainer').addClass('active');
            if($(window).width()>=960){
                
                // this.transitionBlock($(e.currentTarget).closest('.actorContainer'));
            }
            }else{
                if($(window).width()<960){
                    this.updateScrollposition(e);
                }else{
                    $(e.currentTarget).closest('.actorContainer').removeClass('active');
                }
            }
        },

        transitionBlock:function(actorContainer){
            console.log(actorContainer);
            $(actorContainer).find('.actorInformation').fadeOut(100,function(){
                $(actorContainer).addClass('active');
            });
            $(actorContainer).find('img').animate({width:"40%"},{duration:400,queue:false})
            $(actorContainer).find('.actorInformation').animate({width:"60%"},{duration:400,queue:false})
            $(actorContainer).find('.actorInformation').fadeIn(700);


        },

        updateScrollposition: function(event){
            var elScrolltop = $(event.currentTarget).offset().top;
            var currentScrollHeight = $(window).scrollTop();
            var difference = elScrolltop - currentScrollHeight;

            $(event.currentTarget).closest('.actorContainer').removeClass('active');
            
            elScrolltop = $(event.currentTarget)
                .closest('.actorContainer')
                .find('.descriptionShort .collapseButton')
                .offset().top;

            window.scrollTo(0,elScrolltop - difference);
        },
        

        initialize: function() {
           this.collection.on('sync', this.render, this);

           this.sortReversed = false;
        },

        render: function() {
            var screenSize = "big";

            var data = _.map(this.collection.toJSON(),function(actor){
                var paragraphs = actor.fulltext.split('\n');
                actor.fulltext = _.filter(paragraphs,function(paragraph){
                    return paragraph.length > 5;
                });
                return actor;
            });

            var furniture = {
                title: "The celebrated unknowns",
                standfirst: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            };

            var headline = $('header.content__head h1');
            var standfirst = $('header.content__head .content__standfirst p');
            var byline = $('.content__main .content__meta-container.u-cf');

            if(headline.length > 0){
                headline = $(headline).get(0).textContent;
            }else{
                headline = furniture.title;
            }

            if(standfirst.length > 0){
                standfirst = $(standfirst).get(0).textContent;
            }else{
                standfirst = furniture.standfirst;
            }

            if(byline.length > 0){
                byline = $(byline).get(0).outerHTML;
            }else{
                byline = "";
            }
            console.log(byline)


            var templateData = { 
                actors: data,
                title: headline,
                standfirst: standfirst,
                screenSize: screenSize,
                byline: byline
            };
            this.$el.html(Mustache.render(template, templateData));
            
            return this;
        }
    });
});

