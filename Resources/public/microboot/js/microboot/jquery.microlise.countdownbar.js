; (function ($, window, document, undefined) {
	'use strict';

	// (option) classNames

	// Tests
	// Negative and zero value.
	// Negative and zero duration.

	$.widget('microboot.countdownBar', {
		_create: function () {
			var that = this;

			var $bar = that.element.children(String.format('.{0}:first', that.options.classNames.bar));

			that.oldValue = that.options.value = that._constrainedValue();
			that.bar = $bar.length ? $bar : $(String.format('<div class="{0}" />', that.options.classNames.bar));

			if (that.options.duration > 0) {
				that.bar.width(that._valuePercentage(that.options.value) + '%');
			}

			that.element.addClass([that.options.classNames.progress, that.options.classNames.countdown].join(' '))
				.append(that.bar);

			if (that.options.value === that.options.min || that.options.duration <= 0) {
				that.element.addClass(that.options.classNames.empty);

				//that._trigger('complete');
			}
			else {
				if (that.options.striped) {
					that.element.addClass(that.options.classNames.striped);
				}

				that._high = that.options.duration * 0.5;
				that._medium = that.options.duration * 0.25;

				var refreshRate = 1000 / that.options.framesPerSecond,
					finish,
					previousTime;

				(function render(timeRemaining) {
					var currentTime,
						delay;

					that._refresh(timeRemaining);

					if (timeRemaining <= 0) {
						that.element.addClass(that.options.classNames.empty);

						//that._trigger('complete');
					}
					else {
						if (!finish) {
							finish = new Date().setTime(new Date().getTime() + timeRemaining);
						}

						currentTime = new Date().getTime();
						delay = Math.max(0, refreshRate - (currentTime - (previousTime || currentTime)));

						window.setTimeout(function () {
							render(finish - new Date());
						}, delay);

						previousTime = currentTime + delay;
					}
				})(that.options.duration);

			}

			$.microboot.countdownBar.instances.push(that.element);
		},
		_destroy: function () {
			var that = this;

			clearTimeout(that._timeout);

			that.element.removeClass([that.options.classNames.progress, that.options.classNames.countdown, that.options.classNames.empty].join(' '));
			that.bar.remove();

			var position = $.inArray(that.element, $.microboot.countdownBar.instances);

			if (position > -1) {
				$.microboot.countdownBar.instances.splice(position, 1);
			}
		},
		options: {
			classNames: {
				bar: 'bar',
				countdown: 'countdown',
				empty: 'progress--empty',
				high: 'bar-success',
				low: 'bar-danger',
				medium: 'bar-warning',
				progress: 'progress'
			},
			duration: 0,
			framesPerSecond: 2,
			max: 100,
			min: 0,
			striped: false,
			value: 100
		},
		_constrainedValue: function (newValue) {
			var that = this;

			if (newValue === undefined) {
				newValue = that.options.value;
			}

			if (typeof newValue !== 'number') {
				newValue = 0;
			}

			return Math.min(Math.max(that.options.min, newValue), that.options.max);
		},
		_valuePercentage: function (value) {
			var that = this;

			return (value - that.options.min) / (that.options.max - that.options.min) * 100;
		},
		_refresh: function (timeRemaining) {
			var that = this,
			    width =  that._constrainedValue(timeRemaining > 0 ? timeRemaining / that.options.duration * 100 : 0),
				valuePercentage = that._valuePercentage(width);

			that.bar.width(valuePercentage + '%');

			//that._trigger('change', null, { value: width});

			if (timeRemaining >= that._high) {
				if (that._state !== 'high') {
					that._state = 'high';

					that.bar.removeClass([that.options.classNames.medium, that.options.classNames.low].join(' '))
						.addClass(that.options.classNames.high);
				}
			}
			else if (timeRemaining >= that._medium) {
				if (that._state !== 'medium') {
					that._state = 'medium';

					that.bar.removeClass([that.options.classNames.high, that.options.classNames.low].join(' '))
						.addClass(that.options.classNames.medium);
				}
			}
			else if (that._state !== 'low') {
				that._state = 'low';

				that.bar.removeClass([that.options.classNames.high, that.options.classNames.medium].join(' '))
					.addClass(that.options.classNames.low);
			}
		}
	});

	$.extend($.microboot.countdownBar, {
		instances: []
	});

	$(function () {
		$('[data-progress="countdownbar"]').countdownBar();
	});
})(window.jQuery, window, document);