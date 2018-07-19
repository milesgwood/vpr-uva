(function ($, document, window) {
	
	'use strict';
	log("JS Loaded");
	$(document).ready(init);

	function init(e) {
		log('init');
	}
	
	
	// Prints arguments to console.log if allowed
	function log() {
		try {
			var args = [];
			for (var i = 0; i < arguments.length; i++){
				args[i] = arguments[i];
			}
			console.log("[cc_scripts]", arguments);
		} catch (err) {
		}
	}
  
  // Smooth scrolling taken from https://css-tricks.com/snippets/jquery/smooth-scrolling/
  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      // On-page links
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) 
      {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function() {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            }
          });
        }
      }
    });
	
})(jQuery, document, window);


