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
					setTimeout(function(){
						$($(target).next()).addClass("saturate");
					}, 10000);

					target.next()[0].addEventListener("progress", function(e){

						//if(e.srcElement.currentTime >= 25){
						//	target.removeClass("on");
						//	timer = setTimeout(function() {
						//		target.parent().removeClass("parent-on");
						//		target.parent().addClass("off");
						//		target.next()[0].pause();
						//		$($(target).next()).removeClass("saturate");
						//	}, 10000);
						//}
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
				//var excerptparagraphs = actor.caption.split('\n');
                //
				//actor.caption = _.filter(excerptparagraphs, function(paragraph) {
				//	return paragraph.length > 5;
				//});

				return actor;
			});

			var furniture = {
				title: "<b>100</b> <span>years <em>of</em></span> <b>Anzac</b> ",
				subtitle: "Gallopli then and now.",
				standfirst: "Another dawn bruises the sky behind the Sphinx. There have been more than 36,000 sunrises since the events of 25 April 1915. The stillness today, as then, is broken only by the sound of water gently lapping the shore at Ari Burnu. Against a moonless backdrop, it's not hard to conjure a vision of the covering Anzac force approaching in complete darkness. <p> As the firing increased and the boats grounded, the original Anzacs staggered into battle on rocky footings, weighed down with heavy packs and wet clothing. Ahead lay the impossible scramble up steep hills to the heights they would get to know so intimately. Ahead, also, was that deadly dance of bravery, madness and fear that characterised the confused fighting of the first days at Gallipoli. </p><p> The story of the next 240 days was heat, cold, disease, flies and death. In all, 8,709 Australians and 2,701 New Zealanders perished. The number of Turkish dead and wounded across the peninsular is estimated at over 150,000. The records left to us from the cameras of journalists Charles Bean and Phillip Schuler – and from individual soldiers with their vest pocket cameras – remains an invaluable resource in telling the Anzac story. </p><p> While the debris of the conflict has rotted and rusted, and the hills have eroded onto the beaches of Anzac Cove, many of the natural features have remained. Changed, yes, but still very recognisable. </p><p> To honour all those who fought in and documented the war, Guardian photographer Mike Bowers travelled to Gallipoli and located the exact places where some of the iconic images of the campaign were taken a century ago. </p> "
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
			console.log(templateData);
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
