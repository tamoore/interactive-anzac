define([], function() {
	'use strict';
	return {
		boot: function() {
			var el = document.createElement('iframe');

			var scrollTo_;
			var eventMethod = window.addEventListener ? "addEventListener" :
				"attachEvent";
			var eventer = window[eventMethod];
			var messageEvent = eventMethod == "attachEvent" ? "onmessage" :
				"message";
			var s = document.body.firstChild;
			var viewPortTag = document.createElement('meta');

			function addCSS(url) {
				var head = document.querySelector('head');
				var link = document.createElement('link');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('type', 'text/css');
				link.setAttribute('href', url);
				head.appendChild(link);
			}
			//document.querySelector(".top-banner-ad-container").style.display = "none";

			var body = document.body.innerHTML;
			var close = function() {
				el.style.position = "absolute";
				el.style.top = "-9999999em";
				document.body.style.backgroundColor = '#FFF';
				window.location.hash = "";
				document.body.style.height = "auto";
				document.body.style.overflow = "auto";
			}

			el.setAttribute('src',
				'http://interactive.guim.co.uk/next-gen/au/2015/apr/anzac-interactive/index.html?anzac'
			);
			el.setAttribute('frameBorder', '0');
			el.setAttribute('scrolling', 'no');
			el.setAttribute('allowfullscreen', 'true');
			el.style.width = "100%";
			el.style.height = "100vh";
			el.style.top = "0";
			el.style.left = "0";
			el.style.zIndex = "10000000";



			s.parentNode.insertBefore(el, s);

			el.style.position = "absolute";
			el.style.top = "-9999999em";

			eventer(messageEvent, function(e) {
				if (e.origin == "http://interactive.guim.co.uk") {
					var data = JSON.parse(e.data);
					if (data.type === "navigate") {
						if (data.value == "#close-interactive") {
							close();
							window.scrollTo(0, scrollTo_)
						}
					}
				}

			}, false);

			window.onhashchange = function(e) {
				if (window.location.hash === "#close-interactive") {
					close();
					window.scrollTo(0, scrollTo_)
				}
				if (e.newURL.split("#")[1].split("/")[0] === "show-interactive") {


					el.contentWindow.postMessage(JSON.stringify({
							"index": e.newURL.split("#")[1].split("/")[1]
						}),
						"http://interactive.guim.co.uk");

					el.style.position = "fixed";
					el.style.top = "0";
					scrollTo_ = window.scrollY;
					document.body.style.backgroundColor = '#333';
					document.body.style.height = "100vh";
					document.body.style.overflow = "hidden";
				}

			}
		}
	};
});
