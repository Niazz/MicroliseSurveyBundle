; (function ($) {
	'use strict';

	if (typeof String.prototype.contains === 'undefined') {
		String.prototype.contains = function (value) {
			return (this.indexOf(value) !== -1);
		};
	}

	// if (typeof String.prototype.endsWith === 'undefined') {
	// 	String.prototype.endsWith = function (suffix) {
	// 		return (this.substr(this.length - suffix.length) === suffix);
	// 	};
	// }

	if (typeof String.format === 'undefined') {
		String.format = function () {
			return String._format(arguments);
		};
	}

	if (typeof String._format === 'undefined') {
		String._format = function (args) {
			if (!args) {
				throw new Error('format stringFormatNull');
			}

			var result = '';
			var format = args[0];

			if (args.length === 1) {
				return format;
			}

			for (var i = 0; ;) {
				var open = format.indexOf('{', i);
				var close = format.indexOf('}', i);

				if ((open < 0) && (close < 0)) {
					result += format.slice(i);
					break;
				}

				if ((close > 0) && ((close < open) || (open < 0))) {
					if (format.charAt(close + 1) !== '}') {
						throw new Error('format stringFormatBraceMismatch');
					}

					result += format.slice(i, close + 1);
					i = close + 2;

					continue;
				}

				result += format.slice(i, open);
				i = open + 1;

				if (format.charAt(i) === '{') {
					result += '{';
					i++;

					continue;
				}

				if (close < 0) {
					throw new Error('format stringFormatBraceMismatch');
				}

				var brace = format.substring(i, close);
				var colonIndex = brace.indexOf(':');
				var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;

				if (isNaN(argNumber)) {
					throw new Error('format stringFormatInvalid');
				}

				var arguement = args[argNumber].toString();

				if (!arguement) {
					arguement = '';
				}

				result += arguement.toString();

				i = close + 1;
			}

			return result;
		};
	}

	// if (typeof String.prototype.htmlDecode === 'undefined') {
	// 	String.prototype.htmlDecode = function () {
	// 		return $('<div/>').html(this).text();
	// 	};
	// }

	// if (typeof String.prototype.htmlEncode === 'undefined') {
	// 	String.prototype.htmlEncode = function () {
	// 		return $('<div/>').text(this).html();
	// 	};
	// }

	// if (typeof String.prototype.isDecimal === 'undefined') {
	// 	String.prototype.isDecimal = function () {
	// 		return (this.search(/^[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/) !== -1);
	// 	};
	// }

	// if (typeof String.prototype.startsWith === 'undefined') {
	// 	String.prototype.startsWith = function (prefix) {
	// 		return (this.substr(0, prefix.length) === prefix);
	// 	};
	// }

	if (typeof String.prototype.trim === 'undefined') {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

	// if (typeof String.prototype.trimEnd === 'undefined') {
	// 	String.prototype.trimEnd = function () {
	// 		return this.replace(/\s+$/, '');
	// 	};
	// }

	// if (typeof String.prototype.trimStart === 'undefined') {
	// 	String.prototype.trimStart = function () {
	// 		return this.replace(/^\s+/, '');
	// 	};
	// }

	if (typeof String.prototype.insert === 'undefined'){
		String.prototype.insert = function(index, string){
			if (index > 0){
				return this.substring(0, index) + string + this.substring(index, this.length);
			}else{
				return string + this;
			}
		};
	}
})(window.jQuery);