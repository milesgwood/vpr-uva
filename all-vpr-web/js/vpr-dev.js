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
  
  $(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});
  
})(jQuery, document, window);


function show_all_news(){
	'use strict';
	jQuery('#home-news div:nth-child(1n+9)').css('display', "block");
	jQuery('#news-button').css('display', "none");
}

