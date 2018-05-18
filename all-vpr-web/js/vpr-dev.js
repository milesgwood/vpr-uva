(function ($, document, window) {
	
	'use strict';
	log("JS Loaded");
	$(document).ready(init);

	function init(e) {
		log('init');
	}
	
	/**
	* Prints arguments to console.log if allowed
	*/
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
	
	
})(jQuery, document, window);


