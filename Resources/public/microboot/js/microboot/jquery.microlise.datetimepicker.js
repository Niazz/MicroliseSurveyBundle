// this always adds a "ui-timepicker-div" div to the page whether it's called or not, get rid of this in new datetime picker and remove exception in markup-tester.js
; (function ($, window, document, globalize, undefined) {
	'use strict';

	var PROP_NAME = 'datepicker';

    // Add "timeText" for the default regional settings.
    $.datepicker.regional[''].timeText = 'Time';
	$.datepicker.setDefaults($.datepicker.regional['']);
	$('#datepicker').datepicker($.datepicker.regional['']);

	var _adjustDate = $.datepicker._adjustDate;
	$.datepicker._adjustDate = function (id, offset, period) {
		var that = this;

		var target = $(id);
		var inst = this._getInst(target[0]);

		_adjustDate.apply(that, arguments);

		$.timepicker._updateTimepicker(inst);
	};

	var _connectDatepicker = $.datepicker._connectDatepicker;
	$.datepicker._connectDatepicker = function (target, inst) {
		var that = this;

		_connectDatepicker.apply(that, arguments);

		if (that._get(inst, 'showTime')) {
			inst.settings['showButtonPanel'] = true; // The button panel is required to stop the process.
		}

		var showOn = that._get(inst, 'showOn');

		if (showOn === 'button' || showOn === 'both') {
			inst.trigger.unbind('click');

			inst.trigger.click(function () {
				if (that._datepickerShowing && that._lastInput === target) {
					that._hideDatepicker(null); // This override is all about the "null".
				}
				else {
					that._showDatepicker(target);
				}

				return false;
			});
		}
	};

	var _checkExternalClick = $.datepicker._checkExternalClick;
	$.datepicker._checkExternalClick = function (e) {
		var that = $.datepicker;

		if (!that._curInst) {
			return;
		}

		var $target = $(e.target);

		if (($target.parents('#' + $.timepicker._mainDivId).length === 0)) {
			_checkExternalClick.apply(that, arguments);
		}
	};


	// TODO Finish this...
	var _doKeyUp = $.datepicker._doKeyUp;
	$.datepicker._doKeyUp = function (event) {
		var that = this;
		var inst = $.datepicker._getInst(event.target);

		_doKeyUp.apply(that, arguments);

		if ($.datepicker._get(inst, 'showTime')) {
			$.timepicker._setTimeFromField(inst);

			// This will prevent the time defaulting back to 12:00.
			$.timepicker._updateTimepicker(inst);
			$.datepicker._updateAlternate(inst);
		}
	};

	var _hideDatepicker = $.datepicker._hideDatepicker;
	$.datepicker._hideDatepicker = function (input) {
		var that = this;
		var inst = that._curInst;

		if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
			return;
		}

		// Hide the timepicker if enabled.
		if (that._get(inst, 'showTime')) {
			$.timepicker._hideTimepicker(input);
		}

		// Hide the datepicker.
		_hideDatepicker.apply(that, arguments);
	};

	var _inlineDatepicker = $.datepicker._inlineDatepicker;
	$.datepicker._inlineDatepicker = function (target, inst) {
		var that = this;

		_inlineDatepicker.apply(that, arguments);

		var divSpan;

		if (that._get(inst, 'showTime')) {
			divSpan = $(target);
			divSpan.addClass(this.markerClassName).append(inst.tpDiv);

			$.timepicker._updateTimepicker(inst);
			that._updateAlternate(inst);

			//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
			if (inst.settings.disabled) {
				//$.timepicker._disableTimepicker(target);
			}

			inst.tpDiv.css('display', 'block');
		}
	};

	var _newInst = $.datepicker._newInst;
	$.datepicker._newInst = function (target, inline) {
		var that = this;

		var inst = _newInst.apply(that, arguments);
		inst.tpDiv = inline ? $('<div class="form-inline ' + $.timepicker._inlineClass + '">') : $.timepicker.tpDiv;

		return inst;
	};

	var _optionDatepicker = $.datepicker._optionDatepicker;
	$.datepicker._optionDatepicker = function (target, name, value) {
		var that = this;
		var inst = that._getInst(target);

		_optionDatepicker.apply(that, arguments);

		if (that._get(inst, 'showTime')) {
			$.timepicker._updateTimepicker(inst);
			that._setDate(inst, this._getDateDatepicker(target, true));
			that._updateAlternate(inst);
		}
	};

	var _possibleChars = $.datepicker._possibleChars;
	$.datepicker._possibleChars = function (format) {
		var that = this;
		var inst = that._curInst;
		var chars = _possibleChars.apply(that, arguments);
		var culture;
		var i;
		var amLength;
		var pmLength;

		if (that._get(inst, 'showTime')) {
			chars += ':';
			chars += ' ';

			if (that._get(inst, 'ampm')) {
				culture = $.timepicker._getCulture(inst);

				if (culture.patterns.T.indexOf('t') > -1 || culture.patterns.t.indexOf('t') > -1) {
					if (culture.AM) {
						amLength = culture.AM.length;

						for (i = 0; i < amLength; i++) {
							chars += '\'' + culture.AM[i] + '\'';
						}
					}

					if (culture.PM) {
						pmLength = culture.PM.length;

						for (i = 0; i < pmLength; i++) {
							chars += '\'' + culture.PM[i] + '\'';
						}
					}
				}
			}
		}

		return chars;
	};

	$.datepicker._selectDate = function (id, dateStr) {
		var that = this;

		var onSelect;
		var target = $(id);
		var inst = that._getInst(target[0]);
		var showTime = that._get(inst, 'showTime');

		dateStr = dateStr === null ? that._formatDate(inst) : dateStr;

		if (inst.input) {
			inst.input.val(dateStr);

			if (showTime) {
				dateStr = $.timepicker._formatDateTime(inst, dateStr);

				inst.input.val(dateStr);
			}
		}

		this._updateAlternate(inst);

		onSelect = this._get(inst, 'onSelect');

		if (onSelect) {
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]); // Trigger custom callback.
		}
		else if (inst.input) {
			inst.input.trigger('change'); // Fire the change event.
		}

		if (inst.inline || showTime) {
			that._updateDatepicker(inst);

			if (showTime && inst.timeInput) {
				$.timepicker._updateTimepicker(inst);
			}
		}
		else {
			that._hideDatepicker();
			that._lastInput = inst.input[0];

			if (typeof (inst.input[0]) !== 'object') {
				inst.input.focus(); // Restore focus.
			}

			that._lastInput = null;
		}
	};

	var _setDate = $.datepicker._setDate;
	$.datepicker._setDate = function (inst, date, noChange) {
		var that = this;
		var clear = !date;

		_setDate.apply(that, arguments);

		if (inst.input && that._get(inst, 'showTime')) {
			inst.input.val(clear ? '' : $.timepicker._formatDateTime(inst, that._formatDate(inst)));
		}
	};

	var _showDatepicker = $.datepicker._showDatepicker;
	$.datepicker._showDatepicker = function (input) {
		var that = $.datepicker;

		input = input.target || input;

		if (input.nodeName.toLowerCase() !== 'input') {
			input = $('input', input.parentNode)[0];
		}

		if (that._isDisabledDatepicker(input) || that._lastInput === input) {
			return;
		}

		var inst = that._getInst(input);

		_showDatepicker.apply(that, arguments);

		if (that._get(inst, 'showTime')) {
			$.timepicker._showTimepicker(input);
		}
	};

	$.datepicker._updateAlternate = function (inst) {
		var that = this;
		var altFormat;
		var date;
		var dateStr;
		var altField = that._get(inst, 'altField');

		if (altField) {
			altFormat = that._get(inst, 'altFormat') || that._get(inst, 'dateFormat');
			date = that._getDate(inst);
			dateStr = that.formatDate(altFormat, date, that._getFormatConfig(inst));

			if (dateStr && that._get(inst, 'showTime')) {
				dateStr = $.timepicker._formatDateTime(inst, dateStr);
			}

			$(altField).each(function () {
				$(this).val(dateStr);
			});
		}
	};

	function Timepicker() {
		var that = this;

		that._inlineClass = 'ui-timepicker-inline';
		that._mainDivId = 'ui-timepicker-div';
		that._timepickerShowing = false;
		that.tpDiv = $('<div id="' + this._mainDivId + '" class="form-inline" style="display: none;">');
	}

	Timepicker.prototype = {
		_hideTimepicker: function () {
			var that = this;

			var inst = $.datepicker._curInst;
			var showAnim;
			var duration;
			var complete = function () {
				inst.dpDiv.removeClass('ui-datetimepicker');
			};

			if (that._timepickerShowing) {
				showAnim = $.datepicker._get(inst, 'showAnim');
				duration = $.datepicker._get(inst, 'duration');

				// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed.
				if ($.effects && ($.effects.effect[showAnim] || $.effects[showAnim])) {
					inst.tpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, complete);
				}
				else {
					inst.tpDiv[(showAnim === 'slideDown' ? 'slideUp' : (showAnim === 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), complete);
				}

				that._timepickerShowing = false;
			}
		},
		_showTimepicker: function (input) {
			var that = this;
			var inst = $.datepicker._getInst(input);
			var beforeShow;
			var beforeShowSettings;
			var showAnim;
			var duration;

			inst.tpDiv.stop(true, true);

			if (inst && that._timepickerShowing) {
				that.hideTimepicker($.datepicker._curInst.input[0]);
			}

			beforeShow = $.datepicker._get(inst, 'beforeShow');
			beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};

			if (beforeShowSettings === false) {
				return;
			}

			inst.lastTimeVal = null;

			inst.dpDiv.addClass('ui-datetimepicker');

			that._setTimeFromField(inst);
			that._updateTimepicker(inst);

			if (!inst.inline) {
				showAnim = $.datepicker._get(inst, 'showAnim');
				duration = $.datepicker._get(inst, 'duration');
				that._timepickerShowing = true;

				if ($.effects && $.effects.effect[showAnim]) {
					inst.tpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration);
				}
				else {
					inst.tpDiv[showAnim || 'show'](showAnim ? duration : null);
				}
			}
		},
		_formatDateTime: function (inst, dateStr, timeStr) {
			var that = this;

			if (!inst.timeInput) {
				return dateStr;
			}

			if (timeStr === undefined) {
				timeStr = inst.timeInput.val();
			}

			return dateStr ? dateStr + ' ' + timeStr : timeStr;
		},
		_getCulture: function (inst) {
			return globalize ? globalize.culture($.datepicker._get(inst, 'culture')).calendars.standard : $.ui.timepicker.prototype._getCulture();
		},
		_setTimeFromField: function (inst) {
			var that = this;
			var dateTimeStr;

			if (!inst.input) {
				return null;
			}

			dateTimeStr = inst.input.val();

			inst.time = that._parseTime(inst, dateTimeStr);
		},
		_parseTime: function (inst, dateTimeStr) {
			var that = this;
			var culture;
			var timeStr = '';
			var timePattern;
			var result;
			var am = false;
			var pm = false;
			var i;
			var hour;

			if (!dateTimeStr) {
				return null;
			}

			culture = that._getCulture(inst);
			timePattern = culture.patterns[$.datepicker._get(inst, 'seconds') ? 'T' : 't']
				.replace('hh', '(0[0-9]|1[0-2])')
				.replace('h', '([0-9]|1[0-2])')
				.replace('HH', '(0[0-9]|1[0-9]|2[0-3])')
				.replace('H', '([0-9]|1[0-9]|2[0-3])')
				.replace('mm', '(0[0-9]|[1-5][0-9])')
				.replace('m', '([0-9]|[1-5][0-9])')
				.replace('ss', '(0[0-9]|[1-5][0-9])')
				.replace('s', '([0-9]|[1-5][0-9])')
				.replace('tt', '')
				.replace('t', '');
			//.replace('tt', '(' + (culture.AM ? culture.AM.join('|').concat(['|']) : []).concat((culture.PM || []).join('|')) + ')_?');

			result = new RegExp(timePattern).exec(dateTimeStr);

			if (!result) {
				return null;
			}

			// Check for AM.
			if ($.datepicker._get(inst, 'ampm')) {
				if (culture.AM && new RegExp(culture.AM.join('|')).test(dateTimeStr)) {
					am = true;
				}
				else if (culture.PM && new RegExp(culture.PM.join('|')).test(dateTimeStr)) {
					pm = true;
				}
			}

			hour = parseInt(result[1], 10);
			timeStr += am && hour >= 12 ? hour - 12 : pm && hour < 12 ? hour + 12 : hour;

			if (result[2]) {
				timeStr += ':' + parseInt(result[2], 10);
			}

			if (result[3]) {
				timeStr += ':' + parseInt(result[3], 10);
			}

			return timeStr;
		},
		_updateTimepicker: function (inst) {
			var that = this;

			// Wire the events up using ._on().
			inst.timeInput = $('<input type="text" class="ui-datetimepicker-input input-small" />').on('blur', function () {
				var id = '#' + inst.id.replace(/\\\\/g, '\\');

				inst.time = inst.timeInput.timepicker('value');

				$.datepicker._selectDate(id, $.datepicker._formatDate(inst, inst.currentDay, inst.currentMonth, inst.currentYear));
			});

			inst.tpDiv.empty()
				.append('<label class="control-label">' + $.datepicker._get(inst, 'timeText') + '</label>')
				.append(inst.timeInput);

			inst.timepicker = inst.timeInput.timepicker({
				culture: $.datepicker._get(inst, 'culture'),
				ampm: $.datepicker._get(inst, 'ampm'),
				seconds: $.datepicker._get(inst, 'seconds')
			})
				.data('ui-timepicker');

			if (inst.time) {
				inst.timeInput.timepicker('value', inst.time);
			}

			inst.dpDiv.addClass('ui-datetimepicker')
				.find('.ui-datepicker-calendar')
				.after(inst.tpDiv);
		}
	};

	$.timepicker = new Timepicker(); // Singleton.

	$(function () {
		if ($('#' + $.timepicker._mainDivId).length === 0) {
			$('body').append($.timepicker.tpDiv);
		}
	});
})(window.jQuery, window, window.document, window.Globalize);