define([
    'backbone',
    'mustache',
    'routes',
    'text!templates/appTemplate.html',
    'underscore',
    'views/analytics',
    'lazyload'
], function(
    Backbone,
    Mustache,
    routes,
    template,
    _,
    ga,
    lazy
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
                this.trackEvent(e);
                $(e.currentTarget).closest('.actorContainer').addClass('active');
            }else{
                if($(window).width()<960){
                    this.updateScrollposition(e);
                }else{
                    $(e.currentTarget).closest('.actorContainer').removeClass('active');
                    // $(e.currentTarget).closest('.actorContainer').addClass('inactive');
                }
            }
        },
        trackEvent:function(e){
            var actorId = $(e.currentTarget).attr('data-actor');
            window.ga('send', {
              'hitType': 'event',          // Required.
              'eventCategory': 'readmore',   // Required.
              'eventAction': 'click',      // Required.
              'eventLabel': actorId
            });
        },


        transitionBlock:function(actorContainer){
            console.log(actorContainer);
            $(actorContainer).find('.actorInformation').fadeOut(100,function(){
                $(actorContainer).addClass('active');
            });
            $(actorContainer).find('img')
                .animate({width:"40%"},{duration:400,queue:false});
            
            $(actorContainer).find('.actorInformation')
                .animate({width:"60%"},{duration:400,queue:false});
            
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

        lazyLoad: function(){
            lazy.init({
              offset: 800,
              throttle: 250,
              unload: false,
            });
        },

        render: function() {
            $('.l-side-margins').addClass('interactiveStyling');
            
            var screenSize = "big";
            if($(window).width() < 965){
                screenSize = "small";
            }
            

            var data = _.map(this.collection.toJSON(),function(actor){
                var paragraphs = actor.fulltext.split('\n');
                actor.fulltext = _.filter(paragraphs,function(paragraph){
                    return paragraph.length > 5;
                });
                return actor;
            });

            var furniture = {
                title: "Starry, starry night",
                subtitle: "Oscar winners on what it’s like to win Hollywood's biggest prize",
                standfirst: "Susan Sarandon thinks it's the luck of the draw, Juliette Binoche tussled with Lauren Bacall, and someone stood on Ben Kingsley's head: fourteen Oscar winners reveal what really goes on at the Academy Awards"
            };
            var title = furniture.title;
            var subtitle = furniture.subtitle;
            var headline = $('header.content__head h1');
            var standfirst = $('header.content__head .content__standfirst p');
            var byline = $('.content__main .content__meta-container.u-cf');


            if(headline.length > 0){
                headline = $(headline).get(0).textContent.split(':');
                title = headline[0];
                subtitle = headline[1];
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

            var templateData = { 
                actors: data,
                title: title,
                subtitle:subtitle,
                standfirst: standfirst,
                screenSize: screenSize,
                byline: byline
            };
            this.$el.html(Mustache.render(template, templateData));

            this.lazyLoad();
            return this;
        }
    });
});

