// This file and "jquery.placeholder.js" are no longer loaded in Modernizer because this file has to always be loaded as these functions are used to side step a bug with the validation/placeholder
// polyfill combination on the page after this "http://pintavs9/Trunk/JCB/WebApp/fleetmanagement/locations/createsite"

;(function($){
	'use strict';

	if (typeof $.removePlaceholder === 'undefined') {
		$.removePlaceholder = function($dom) {
			if ('placeholder' in document.createElement('input') === false) {
				//if ($dom !== undefined) {
				//    setTimeout(function () {
				//        $dom.find('[placeholder]').each(function () {
				//            //$(this).css('border','3px solid red');
				//            this.value = '';
				//        });
				//        alert('counterrrrrrrrrrrrrssss');
				//    }, 2000);
				//} else {
				//    setTimeout(function () {
						$('.placeholder').each(function () {
							var placeholder = this.getAttribute('placeholder');
							if (this.value == placeholder) {
								this.value = '';
							}
						});
					//    alert('count');
					//}, 2000);
				//}
			}
		};
	}


	if (typeof $.reinstatePlaceholder === 'undefined') {
		$.reinstatePlaceholder = function() {
			if ('placeholder' in document.createElement('input') === false) {
				$('.placeholder').each(function() {
					var placeholder = this.getAttribute('placeholder');
					if (this.value == '') {
						this.value = placeholder;
					}
				});
			}
		};
	}
})(window.jQuery);