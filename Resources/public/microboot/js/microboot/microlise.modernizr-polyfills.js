;(function(modernizr, microlise, yepnope) {
	'use strict';

	if (typeof modernizr.load !== 'function' && yepnope) {
		modernizr.load = function () {
			yepnope.apply(window, [].slice.call(arguments, 0));
		};
	}

	var url = namespace('microlise.urls.modernizr');
	// url.placeholder = '/js/microboot/polyfill/jquery.placeholder.js';

	// var polyfills = [];

	// polyfills.push({
	// 	test: modernizr.placeholder,
	// 	nope: url.placeholder
	// });

	// modernizr.load(polyfills);
})(window.Modernizr, window.microlise, window.yepnope);