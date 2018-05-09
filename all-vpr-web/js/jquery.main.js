// page init
jQuery(window).load(function(){
	initNavSlide();
	initAnchorLinks();
});

// smooth anchor links
function initAnchorLinks() {
	var animSpeed = 650,
		win  = jQuery(window);
		page = jQuery('html,body'),
		isWP8 = /MSIE 10.*Touch/.test(navigator.userAgent),
		btn = jQuery('a.btn-top');

	btn.click(function(e) {
		e.preventDefault();
		var targetId = this.getAttribute('href');
		var calcOffset = targetId.length > 1 ? jQuery(targetId).offset().top : 0;

			if (isWP8) {
				win.scrollTop(calcOffset);
			} else {
				page.animate({
					scrollTop: calcOffset
				}, animSpeed);
			}
	});
	win.on('scroll load', function() {
		if (jQuery(this).scrollTop() > 400) {
			btn.fadeIn(animSpeed);
		} else {
			btn.fadeOut(animSpeed);
		}
	})
};

// initNavSlide()
function initNavSlide() {
	var win = jQuery(window);
	var body = jQuery('body');
	var wrap = jQuery('#wrapper');
	var opener = wrap.find('#nav .opener');
	var nav = wrap.find('#nav');
	var drop = wrap.find('#nav ul');
	var slider = wrap.find('.slide-main');
	var headerHolder = wrap.find('.heading-bar');
	var animSpeed = 800;
	var widthWindow = win.width();

	function resizeHandler() {
		widthWindow = jQuery(this).width();
		wrap.removeClass('open');
		nav.css({marginLeft: 0});
		slider.css({marginLeft: 0});
		drop.css({width: widthWindow});
		headerHolder.css({marginLeft: 0});
	}
	function clickHandler() {
		if(wrap.hasClass('open')){
			wrap.removeClass('open');
			nav.animate({
				marginLeft: 0
			},animSpeed);
			slider.animate({
				marginLeft: 0
			},animSpeed);
			headerHolder.animate({
				marginLeft: 0
			},animSpeed);
		} else {
			var widthDrop = drop.outerWidth()
			wrap.addClass('open');
			nav.animate({
				marginLeft: widthDrop
			},animSpeed);
			slider.animate({
				marginLeft: widthDrop
			},animSpeed);
			headerHolder.animate({
				marginLeft: widthDrop
			},animSpeed);
		}
	}
	function clickBodyHandler(event) {
		var target = jQuery(event.target);
		if ((!target.is(drop) && target.closest(drop).length == 0)&&(!target.is(opener) && target.closest(opener).length == 0)) {
			wrap.removeClass('open');
			nav.animate({
				marginLeft: 0
			},animSpeed);
			slider.animate({
				marginLeft: 0
			},animSpeed);
			headerHolder.animate({
				marginLeft: 0
			},animSpeed);
		}
	}


	opener.on('click', clickHandler);

	// handle layout resize
	ResponsiveHelper.addRange({
		'..628': {
			on: function() {
				drop.css({
					minHeight: slider.outerHeight() + headerHolder.outerHeight(),
					width: 320
				})
				body.on('click.a', clickBodyHandler);
				win.on('resize.a inMobile', resizeHandler);
				win.trigger('inMobile');
			},
			off: function() {
				drop.css({
					minHeight: '',
					width: ''
				});
				setTimeout(function() {
					nav.removeAttr('style');
					body.off('click.a');
					win.off('resize.a inMobile');
				},20)
			}
		}
	});

	
}

/*
 * Responsive Layout helper
 */
ResponsiveHelper = (function($){
	// init variables
	var handlers = [];
	var win = $(window), prevWinWidth;
	var scrollBarWidth = 0;

	// prepare resize handler
	function resizeHandler() {
		var winWidth = win.width() + scrollBarWidth;
		if(winWidth !== prevWinWidth) {
			prevWinWidth = winWidth;

			// loop through range groups
			$.each(handlers, function(index, rangeObject){
				// disable current active area if needed
				$.each(rangeObject.data, function(property, item) {
					if((winWidth < item.range[0] || winWidth > item.range[1]) && item.currentActive) {
						item.currentActive = false;
						if(typeof item.disableCallback === 'function') {
							item.disableCallback();
						}
					}
				});

				// enable areas that match current width
				$.each(rangeObject.data, function(property, item) {
					if(winWidth >= item.range[0] && winWidth <= item.range[1] && !item.currentActive) {
						// make callback
						item.currentActive = true;
						if(typeof item.enableCallback === 'function') {
							item.enableCallback();
						}
					}
				});
			});
		}
	}
	win.bind('load', function(){
		if(window.addEventListener) {
			scrollBarWidth = window.innerWidth - $('body').width();
			resizeHandler();
		}
		win.bind('resize orientationchange', resizeHandler);
	});

	// range parser
	function parseRange(rangeStr) {
		var rangeData = rangeStr.split('..');
		var x1 = parseInt(rangeData[0], 10) || -Infinity;
		var x2 = parseInt(rangeData[1], 10) || Infinity;
		return [x1, x2].sort(function(a, b){
			return a - b;
		});
	}

	// export public functions
	return {
		addRange: function(ranges) {
			// parse data and add items to collection
			var result = {data:{}};
			$.each(ranges, function(property, data){
				result.data[property] = {
					range: parseRange(property),
					enableCallback: data.on,
					disableCallback: data.off
				};
			});
			handlers.push(result);

			// call resizeHandler to recalculate all events
			prevWinWidth = null;
			resizeHandler();
		}
	};
}(jQuery));