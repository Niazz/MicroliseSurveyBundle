; (function ($, undefined) {
	'use strict';

	$.joinPropertyNames = function (obj, separator) {
		if (obj && typeof obj === 'object') {
			var propertyNames = [];

			separator = separator || '.';

			for (var key in obj) {
				var value = obj[key];

				var childPropertyNames = $.joinPropertyNames(value);

				if (childPropertyNames && childPropertyNames.length) {
					for (var i = 0; i < childPropertyNames.length; i++) {
						propertyNames.push(key + separator + childPropertyNames[i]);
					}
				}
				else {
					propertyNames.push(key);
				}
			}

			return propertyNames;
		}
	};
})(window.jQuery);

(function ($, undefined) {
	'use strict';

	// TODO Think of a better name!
	$.fn.text2 = function () {
		return $(this).clone()
			.children()
			.remove()
			.end()
			.text();
	};
})(window.jQuery);