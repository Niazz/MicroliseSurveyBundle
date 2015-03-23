; (function ($, window, document, undefined) {
	'use strict';

	// (option) classNames
	// (event) change

	// Tests

	$.widget('microboot.deadline', {
		_create: function () {
			var that = this;

			if (typeof that.options.value !== 'number') {
				return;
			}

			that.options._refreshRate = 1000 / that.options.framesPerSecond
			that.options._value = that.options.value;

			var start = new Date(),
			    previousTime;

			(function render() {
				var elapsed = new Date() - start,
				    currentTime,
					delay;

				that._refresh(that.options._value - elapsed);

				currentTime = new Date().getTime();
				delay = Math.max(0, that.options._refreshRate - (currentTime - (previousTime || currentTime)));

				that._timeout = window.setTimeout(render, delay);

				previousTime = currentTime + delay;
			})();

			$.microboot.deadline.instances.push(that.element);
		},
		_destroy: function () {
			var that = this;

			clearTimeout(that._timeout);

			that.element.html('')
				.removeAttr('title')
				.removeClass(that.options.classNames.overdue);

			var position = $.inArray(that.element, $.microboot.deadline.instances);

			if (position > -1) {
				$.microboot.deadline.instances.splice(position, 1);
			}
		},
		_setOption: function (key, value) {
			var that = this;

			that._super(key, value);

			if (key === 'framesPerSecond' && value > 0) {
				that.options._refreshRate = 1000 / value
			}
			else if (key === 'value' && typeof that.options.value !== 'number') {
				that._value = value;
			}
		},
		options: {
			classNames: {
				overdue: 'deadline--overdue'
			},
			framesPerSecond: 2,
			strings: {
				day: '1 day',
				days: '{0} days',
				hour: '1 hour',
				hours: '{0} hours',
				minute: '1 minute',
				minutes: '{0} minutes',
				now: 'now',
				second: '1 second',
				seconds: '{0} seconds',
				suffixFuture: '',
				suffixPast: 'ago',
				wordSeparator: ' ',
				year: '1 year',
				years: '{0} years'
			},
			value: 0
		},
		_refresh: function (value) {
			var that = this,
				offset,
				offsetLong,
				offsetParts,
				parsed = {},
				rounded = {
					seconds: 0
				},
				suffix = '',
				unrounded = {},
				tooltip;

			unrounded.seconds = Math.abs(value) / 1000;
			unrounded.minutes = unrounded.seconds / 60;
			unrounded.hours = unrounded.minutes / 60;
			unrounded.days = unrounded.hours / 24;
			unrounded.years = unrounded.days / 365.25;

			if (value > 0) {
				suffix = that.options.strings.suffixFuture;

				rounded.seconds = Math.ceil(unrounded.seconds);
				rounded.minutes = Math.ceil(unrounded.minutes);
				rounded.hours = Math.ceil(unrounded.hours);
				rounded.days = Math.ceil(unrounded.days);
				rounded.years = Math.ceil(unrounded.years);
			}
			else if (value < 0) {
				suffix = that.options.strings.suffixPast;

				rounded.seconds = Math.floor(unrounded.seconds);
				rounded.minutes = Math.floor(unrounded.minutes);
				rounded.hours = Math.floor(unrounded.hours);
				rounded.days = Math.floor(unrounded.days);
				rounded.years = Math.floor(unrounded.years);
			}

			offset = rounded.seconds < 1 && that.options.strings.now ||
				rounded.seconds === 1 && that.options.strings.second ||
				rounded.seconds < 60 && String.format(that.options.strings.seconds, rounded.seconds) ||
				rounded.minutes === 1 && that.options.strings.minute ||
				rounded.minutes < 60 && String.format(that.options.strings.minutes, rounded.minutes) ||
				rounded.hours === 1 && that.options.strings.hour ||
				rounded.hours < 24 && String.format(that.options.strings.hours, rounded.hours) ||
				rounded.days === 1 && that.options.strings.day ||
				rounded.days < 365 && String.format(that.options.strings.days, rounded.days) ||
				rounded.years === 1 && that.options.strings.year ||
				String.format(that.options.strings.years, rounded.years);

			if (offset !== that.options.strings.now) {
				offset = $.trim([offset, suffix].join(that.options.strings.wordSeparator));
			}

			if (that.element.text() !== offset) {
				that.element.text(offset);
			}

			// Removed to improve performance...!

			//parsed.milliseconds = Math.abs(value);
			//parsed.years = Math.floor(parsed.milliseconds / 31536000000);
			//parsed.days = Math.floor((parsed.milliseconds % 31536000000) / 86400000);
			//parsed.hours = Math.floor(((parsed.milliseconds % 31536000000) % 86400000) / 3600000);
			//parsed.minutes = Math.floor((((parsed.milliseconds % 31536000000) % 86400000) % 3600000) / 60000);
			//parsed.seconds = Math.floor(((((parsed.milliseconds % 31536000000) % 86400000) % 3600000) % 60000) / 1000);

			//offsetParts = [];

			//if (parsed.years > 0) {
			//	offsetParts.push(String.format(parsed.years === 1 ? that.options.strings.year : that.options.strings.years, parsed.years.toString()));
			//}

			//if (parsed.years > 0 || parsed.days > 0) {
			//	offsetParts.push(String.format(parsed.days === 1 ? that.options.strings.day : that.options.strings.days, parsed.days.toString()));
			//}

			//if (parsed.years > 0 || parsed.days > 0 || parsed.hours > 0) {
			//	offsetParts.push(String.format(parsed.hours === 1 ? that.options.strings.hour : that.options.strings.hours, parsed.hours.toString()));
			//}

			//if (parsed.years > 0 || parsed.days > 0 || parsed.hours > 0 || parsed.minutes > 0) {
			//	offsetParts.push(String.format(parsed.minutes === 1 ? that.options.strings.minute : that.options.strings.minutes, parsed.minutes.toString()));
			//}

			//if (parsed.years > 0 || parsed.days > 0 || parsed.hours > 0 || parsed.minutes > 0 || parsed.seconds > 0) {
			//	offsetParts.push(String.format(parsed.seconds === 1 ? that.options.strings.second : that.options.strings.seconds, parsed.seconds.toString()));
			//}

			//offsetLong = offsetParts.join(' ');
			//offsetLong = $.trim([offsetLong, suffix].join(that.options.strings.wordSeparator));

			//if ($.fn.tooltip) {
			//	tooltip = that.element.data('tooltip');

			//	if (tooltip) {
			//		that.element.attr('data-original-title', offsetLong || offset);

			//		if (tooltip.tip().hasClass('in')) {
			//			tooltip.tip().find('.tooltip-inner')[tooltip.options.html ? 'html' : 'text'](offsetLong || offset);
			//		}
			//	}
			//	else {
			//		that.element.tooltip({
			//			title: offsetLong || offset
			//		});
			//	}
			//}
			//else {
			//	that.element.prop('title', offsetLong);
			//}

			that.element[value < 0 ? 'addClass' : 'removeClass'](that.options.classNames.overdue);

			//that._trigger('change', null, { value: value });
		}
	});

	$.extend($.microboot.deadline, {
		instances: []
	});

	$(function () {
		$('[data-progress="deadline"]').deadline();
	});
})(window.jQuery, window, document);