;(function($){
	'use strict';

	$.fancybox._setMaxHeight = function(){
		var $mbModalBody = $('.mb-modal__body');
		if ($mbModalBody.length){
			var head = $('.mb-modal__head').outerHeight();
			var foot = $('.mb-modal__foot').outerHeight();
			$mbModalBody.css('margin-bottom', foot+'px');
			var outerHeight = $('.fancybox-inner').outerHeight();

			// This didn't work an any version of IE
			// var padding = $mbModalBody.css('padding');
			// padding = Number(padding.substring(0, padding.length-2)) * 2;
			var padding = $mbModalBody.outerHeight() - $mbModalBody.height();

			outerHeight = outerHeight - head - foot - padding;
			$mbModalBody.css('max-height', outerHeight+'px');
		}
	};


	var $afterLoad = $.fancybox._afterLoad;
	$.fancybox._afterLoad = function(){
		$afterLoad.apply(this, arguments);

		this._setMaxHeight();
	};


	var $setDimension = $.fancybox._setDimension;
	$.fancybox._setDimension = function () {
		$setDimension.apply(this, arguments);

		setTimeout(function(){
			$.fancybox._setMaxHeight();
		}, 4);
	};
})(window.jQuery);