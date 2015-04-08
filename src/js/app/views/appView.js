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
	var timer;
	return Backbone.View.extend({

		className: 'guInteractive',

		events: {
			'click .collapseButton': 'expandText',
			'click .before-image': 'handleBeforeImageClick',
			'click .open-gallery': 'handleOpenGalleryClick'
		},
		expandText: function(e) {
			var state = $(e.currentTarget).attr('data-toggle');

			if (state === "readMore") {
				this.trackEvent(e);
				$(e.currentTarget).closest('.actorContainer').addClass('active');
			} else {
				if ($(window).width() < 960) {
					this.updateScrollposition(e);
				} else {
					$(e.currentTarget).closest('.actorContainer').removeClass('active');
					// $(e.currentTarget).closest('.actorContainer').addClass('inactive');
				}
			}
		},
		trackEvent: function(e) {
			var actorId = $(e.currentTarget).attr('data-actor');
			window.ga('send', {
				'hitType': 'event', // Required.
				'eventCategory': 'readmore', // Required.
				'eventAction': 'click', // Required.
				'eventLabel': actorId
			});
		},


		transitionBlock: function(actorContainer) {
			$(actorContainer).find('.actorInformation').fadeOut(100, function() {
				$(actorContainer).addClass('active');
			});
			$(actorContainer).find('img, video')
				.animate({
					width: "40%"
				}, {
					duration: 400,
					queue: false
				});

			$(actorContainer).find('.actorInformation')
				.animate({
					width: "60%"
				}, {
					duration: 400,
					queue: false
				});

			$(actorContainer).find('.actorInformation').fadeIn(700);
		},

		updateScrollposition: function(event) {
			var elScrolltop = $(event.currentTarget).offset().top;
			var currentScrollHeight = $(window).scrollTop();
			var difference = elScrolltop - currentScrollHeight;

			$(event.currentTarget).closest('.actorContainer').removeClass('active');

			elScrolltop = $(event.currentTarget)
				.closest('.actorContainer')
				.find('.descriptionShort .collapseButton')
				.offset().top;

			window.scrollTo(0, elScrolltop - difference);
		},


		initialize: function() {
			this.collection.on('sync', this.render, this);

			this.sortReversed = false;
		},

		lazyLoad: function() {
			lazy.init({
				offset: 800,
				throttle: 250,
				unload: false,
			});
		},
		handleBeforeImageClick: function(e) {
			var target = $(e.target)

			if (target.hasClass("on")) {
				target.removeClass("on");
				timer = setTimeout(function() {
					target.parent().removeClass("parent-on");
					target.parent().addClass("off");
					if (target.next()[0].pause) {
						target.next()[0].pause();
					}

				}, 10000);
			} else {
				clearTimeout(timer);
				if (target.next()[0].play) {
					target.next()[0].play();
					target.next()[0].addEventListener("progress", function(e){

						if(e.srcElement.currentTime >= 25){
							target.removeClass("on");
							timer = setTimeout(function() {
								target.parent().removeClass("parent-on");
								target.parent().addClass("off");
								target.next()[0].pause();
							}, 10000);
						}
					});
				}
				target.parent().removeClass("off");
				target.parent().addClass("parent-on");
				target.addClass("on");

			}
		},
		handleOpenGalleryClick: function(e) {
			var index = $(e.target).parent().parent().attr('rel');
			window.location.hash = "#show-interactive/" + index;

		},
		render: function() {
			$('.l-side-margins').addClass('interactiveStyling');
			$('#article-body').addClass('interactivePadding');
			var isWeb = true;
			var screenSize = "big";
			if ($(window).width() < 965) {
				screenSize = "small";
			}


			var data = _.map(this.collection.toJSON(), function(actor) {
				var paragraphs = actor.fulltext.split('\n');
				var excerptparagraphs = actor.excerpt.split('\n');

				actor.fulltext = _.filter(paragraphs, function(paragraph) {
					return paragraph.length > 5;
				});

				actor.excerpt = _.filter(excerptparagraphs, function(paragraph) {
					return paragraph.length > 5;
				});
				return actor;
			});

			var furniture = {
				title: "<b>100</b> <span><i>years <em>of</em></i></span> <b>Anzac</b> ",
				subtitle: "Gallopli then and now.",
				standfirst: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
			};
			var title = furniture.title;
			var subtitle = furniture.subtitle;
			var headline = $('header.content__head h1');
			var standfirst = $('header.content__head .content__standfirst p');
			var byline = $('.content__main .content__meta-container.u-cf');


			if (headline.length > 0) {
				headline = $(headline).get(0).textContent.split(':');
				title = headline[0];
				subtitle = headline[1];
			} else {
				headline = furniture.title;
			}

			if (standfirst.length > 0) {
				standfirst = $(standfirst).get(0).textContent;
			} else {
				standfirst = furniture.standfirst;
			}

			if (byline.length > 0) {
				byline = $(byline).get(0).outerHTML;
			} else {
				byline = "";
			}
			if (typeof window.guardian === "undefined") {
				isWeb = false;
			}

			var templateData = {
				actors: data,
				title: title,
				subtitle: subtitle,
				standfirst: standfirst,
				screenSize: screenSize,
				byline: byline,
				isWeb: isWeb,
				video: (screenSize == "big" ? true : false),
				image: (screenSize != "big" ? true : false)
			};

			this.$el.html(Mustache.render(template, templateData));
			this.$el.find(".before-image").on("load", function(e){
				e.target.style.visibility = "visible";
				e.target.style.opacity = 1;
				$(e.target).parent().addClass("ready");
				$(e.target).next().css("visibility", "visible");
				$(e.target).next().css("opacity", 0);
			})
			this.lazyLoad();
			return this;
		}
	});
});
