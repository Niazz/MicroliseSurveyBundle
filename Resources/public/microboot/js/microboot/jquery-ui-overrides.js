; (function($, undefined) {
	'use strict';

	if ($.ui.autocomplete && $.ui.position) {
		// Replace matched term(s) with <strong>{term}</strong>.
		$.ui.autocomplete.prototype.options.open = function () {
			var autocomplete = $(this).data('ui-autocomplete'),
				regexp = new RegExp('(' + autocomplete.term.split(' ').join('|') + ')', 'gi');

			autocomplete.menu
				.element
				.find('a')
				.each(function() {
					var $menuLink = $(this),
						text = $menuLink.text();

					$menuLink.html(text.replace(regexp, '<strong>$1</strong>'));
				});
		};

		// The autocomplete menu will appear above the input when it's at the bottom of page.
		$.ui.autocomplete.prototype.options.position.collision = 'flip';

		$.ui.autocomplete.prototype.options.position.using = function (position, data) {
			// Add a gap between the input and the menu.
			if (data.target.top < data.element.top) {
				position.top += 2;
			}
			else {
				position.top -= 3;
			}

			$(this).css(position);
		};
	}
})($);

(function ($, namespace, undefined) {
	'use strict';

	if ($.Widget) {
		$.Widget.prototype.__createWidget = $.Widget.prototype._createWidget;

		$.Widget.prototype._createWidget = function (options, element) {
			var propertyNames = $.joinPropertyNames(this.options),
				toLowerCase = function (a, b) {
					return b.toLowerCase();
				},
				toUpperCase = function (a, b) {
					return b.toUpperCase();
				},
				$element,
				index,
				key,
				lastPart,
				length,
				ns,
				parts,
				propertyName,
				value;

			options = options || {};
			element = $(element || this.defaultElement || this)[0];
			$element = $(element);

			if (propertyNames) {
				for (index = 0, length = propertyNames.length; index < length; index++) {
					propertyName = propertyNames[index];

					key = propertyName.replace(/([A-Z])/g, toLowerCase)
							.replace(/\.([a-z])/g, toUpperCase);
					value = $element.data(key);

					if (value !== undefined) {
						parts = propertyName.split('.');

						if (parts.length === 1) {
							this.options[parts[0]] = value;
						}
						else {
							lastPart = parts.pop();
							ns = parts.join('.');
							namespace(ns, this.options)[lastPart] = value;
						}
					}
				}
			}

			$.Widget.prototype.__createWidget.call(this, options, element);
		};
	}
})(this.jQuery, this.namespace, undefined);

(function ($, window, document, undefined) {
	'use strict';

	if ($.datepicker) {
		var remove = function remove(target, props) {
			for (var name in props) {
				if (target[name]) {
					delete target[name];
				}
			}

			return target;
		};

		if ($.datepicker._defaults)
		{
			$.datepicker._defaults.buttonImageOnly = false;
			$.datepicker._defaults.buttonText = '<i class="icon-calendar"></i>';
			$.datepicker._defaults.nextText = '<i class="icon-forward"></i>';
			$.datepicker._defaults.prevText = '<i class="icon-back"></i>';
			$.datepicker._defaults.showOn = 'both';
			$.datepicker._defaults.showButtonPanel = true;

			// Time picker settings.
			$.datepicker._defaults.ampm = true;
			$.datepicker._defaults.seconds = true;
		}

		var _attachments = $.datepicker._attachments;
		$.datepicker._attachments = function (input, inst) {
			var that = this;

			if (!inst.inline) {
				_attachments.apply(that, arguments);
			}
		};

		// Force the number of months to 1.
		$.datepicker._getNumberOfMonths = function (inst) {
			return [1, 1];
		};

		// Override the today button so it actually selects today's date.
		var __gotoToday = $.datepicker._gotoToday;
		$.datepicker._gotoToday = function (id) {
			__gotoToday.call(this, id);

			var target = $(id),
				inst = this._getInst(target[0]);

			this._setDateDatepicker(target, new Date());
			this._selectDate(id, this._getDateDatepicker(target));

			if (!inst.inline && inst.input && !this._get(inst, 'showTime')) {
				inst.input.blur();
			}
		};

		// Don't allow the "buttonText", "nextText" or "prevText" to be overridden.
		// This prevents the default values (icons) being lost when changing the regional settings.
		var _setDefaults = $.datepicker.setDefaults;
		$.datepicker.setDefaults = function (settings) {
			var that = this;

			return _setDefaults.call(that, remove(settings, {
				buttonText: null,
				nextText: null,
				prevText: null
			}));
		};

		$(function () {
			// Set the defaults back to normal (if we include jquery-ui-i18n.js).
			$.datepicker.setDefaults($.datepicker.regional['']);
		});
	}
})(window.jQuery);

(function ($, undefined) {
	'use strict';

	if ($.ui.spinner) {
		$.ui.spinner.prototype._buttonHtml = function () {
			return '' +
				'<span class="add-on ui-spinner">' +
					'<span class="ui-spinner-button ui-spinner-up">' +
						'<i class="icon-up"></i>' +
					'</span>' +
					'<span class="ui-spinner-button ui-spinner-down">' +
						'<i class="icon-down"></i>' +
					'</span>' +
				'</span>';
		};

		$.ui.spinner.prototype._uiSpinnerHtml = function () {
			return "<div class='ui-spinner ui-widget ui-widget-content ui-corner-all input-append'>";
		};
	}
})(window.jQuery);

(function ($, undefined) {
	'use strict';

	if ($.ui.timepicker) {
		$.datepicker._defaults.culture = $.ui.timepicker.prototype.options.culture = 'en-GB';
		$.datepicker._defaults.seconds = $.ui.timepicker.prototype.options.seconds = false;
	}
})(window.jQuery);


// extends datepicker
(function( $, undefined ) {
	'use strict';

	var getElement = function (dateFormat, date, component) {
		//datepicker langauge files represent dates as "yy/mm/dd" when they mean "yyyy/MM/dd", the replace makes the dateFormat string match the length of the date string
		dateFormat = dateFormat.replace("yy","yyyy");
		var pos = dateFormat.indexOf(component);
		if (pos !== -1) {
			var day = date.substring(pos, pos + 2);
			if (!isNaN(day)) {
				//could be .1 which is a number
				return day;
			} else {
				return -1;
			}
		} else {
			return -1;
		}
	};

	var getElementYear = function (dateFormat, date) {
		//datepicker langauge files represent dates as "yy/mm/dd" when they mean "yyyy/MM/dd", the replace makes the dateFormat string match the length of the date string
		dateFormat = dateFormat.replace("yy","yyyy");
		var pos = dateFormat.indexOf("yyyy");
		if (pos !== -1) {
			var day = date.substring(pos, pos + 4);
			if (!isNaN(day)) {
				//could be .1 which is a number
				return day;
			} else {
				return -1;
			}
		} else {
			return -1;
		}
	};


	var setDefaults = $.datepicker.setDefaults;
	$.datepicker.setDefaults = function(settings) {
		var that = this;

		setDefaults.apply(that, arguments);

		if ("dateFormat" in settings){
			$("body").data("dateFormat", settings.dateFormat);
		}
	};


	var setDateNew = function(selector, dateFormat, date, day){
		date.setDate(day);

		var day = ("0"+date.getDate()).slice(-2);
		dateFormat = dateFormat.replace("dd", day);

		var month = ("0"+(date.getMonth()+1)).slice(-2);
		dateFormat = dateFormat.replace("mm", month);

		dateFormat = dateFormat.replace("yy", date.getFullYear());

		$(selector).val(dateFormat);


		var functionName = $(selector).attr('data-on-select');
		if (functionName !== undefined){
			window[functionName]();
			//window[functionName](dateText, inst);
		}
	};


	var alterDate = function(e, add){
		var selector = '#'+$(this).data("uuid");

		if ($(selector).val().trim() !== ""){
			var value = $(selector).val().trim();

			var dateFormat = $("body").data("dateFormat");

			var day = getElement(dateFormat, value, "dd"),
				month = getElement(dateFormat, value, "mm") - 1,
				year = getElementYear(dateFormat, value);

			if (!(day === -1 || month === -1 || year === -1)){
				var date = new Date(year, month, day);

				var dateRange = $(this).data('dateRange');
				if (dateRange === undefined){
					if (add === true){
						setDateNew(selector, dateFormat, date, Number(day)+1);
					}else{
						setDateNew(selector, dateFormat, date, Number(day)-1);
					}
				}else{
					var dayRange,
						monthRange,
						yearRange,
						dateRange;

					if (/^\d+$/.test(dateRange) === false){
						dayRange = getElement(dateFormat, dateRange, "dd");
						monthRange = getElement(dateFormat, dateRange, "mm") - 1;
						yearRange = getElementYear(dateFormat, dateRange);
					}else{
						var tmp = new Date();
						tmp.setDate(tmp.getDate() + Number(dateRange));

						dayRange = tmp.getDate();
						monthRange = tmp.getMonth();
						yearRange = tmp.getFullYear();
					}

					if (add === true){
						if (!(dayRange === -1 || monthRange === -1 || yearRange === -1)){
							dateRange = new Date(yearRange, monthRange, dayRange);
							if (date < dateRange){
								setDateNew(selector, dateFormat, date, Number(day)+1);
							}
						}else{
							setDateNew(selector, dateFormat, date, Number(day)+1);
						}
					}else{ //subtract
						if (!(dayRange === -1 || monthRange === -1 || yearRange === -1)){
							dateRange = new Date(yearRange, monthRange, dayRange);
							if (date > dateRange){
								setDateNew(selector, dateFormat, date, Number(day)-1);
							}
						}else{
							setDateNew(selector, dateFormat, date, Number(day)-1);
						}
					}
				}
			}
		}
	};


	var _connectDatepicker = $.datepicker._connectDatepicker;
	$.datepicker._connectDatepicker = function (target, inst) {
		var that = this;

		_connectDatepicker.apply(that, arguments);

		var input = $(target);

		if (input.filter("[data-option='increment'],[data-increment='true']").length) { //data-option='increment' is deprecated, remove in Microboot 2
			var triggerPresent = false,
				targetId = input.attr("id"),
				sel = "#"+targetId+" + button";

			if ($(sel).length > 0){
				var id = "ui-datepicker-trigger"+new Date().getTime();
				$(sel).attr("id", id);
				triggerPresent = true;
			}

			input.wrap('<div class="ui-spinner ui-widget ui-widget-content ui-corner-all input-append">');

			if (triggerPresent === true){
				input.parent().append($('#'+id));
			}

			input.after(
			'<span class="add-on ui-spinner">'+
				'<span class="ui-spinner-button" id="btnbefore'+targetId+'">'+
					'<i class="icon-up"></i>'+
				'</span>'+
				'<span class="ui-spinner-button ui-spinner-down" id="btnafter'+targetId+'">'+
					'<i class="icon-down"></i>'+
				'</span>'+
			'</span>');


			$("#btnbefore"+targetId).data("uuid", targetId);
			$("#btnafter"+targetId).data("uuid", targetId);

			$("#btnbefore"+targetId).data("dateRange", inst.settings.maxDate);
			$("#btnafter"+targetId).data("dateRange", inst.settings.minDate);

			$('#btnbefore'+targetId).on('click', function(e){
				// e.preventDefault();
				// e.stopPropagation();
				$(e.target).disableSelection();

				var arr = Array.prototype.slice.call(arguments);
				arr.push(true);
				alterDate.apply(this, arr);
			});

			$('#btnafter'+targetId).on('click', function(e){
				// e.preventDefault();
				// e.stopPropagation();
				$(e.target).disableSelection();

				var arr = Array.prototype.slice.call(arguments);
				arr.push(false);
				alterDate.apply(this, arr);
			});
		}
	};
})(window.jQuery);