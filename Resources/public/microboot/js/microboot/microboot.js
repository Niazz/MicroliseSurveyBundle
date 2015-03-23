; (function ($, window, document) {
	'use strict';

	$.fn.microboot = function () {
		var $this = $(this);

		// Carousel.
		$this.find('[data-toggle="carousel"]').carouFredSel({
			infinite: false,
			circular: false,
			auto: false,
			prev: '.previous',
			next: '.next',
			pagination: '.pager-pips',
			mousewheel: true
		});

		// Countdown bar.
		$this.find('[data-toggle="countdown"]').countdownBar();

		// Date picker.
		$this.find('[data-toggle="date"]').each(function(){
			var $this = $(this),
				object = {};

			if ($this.filter('[data-min]').length){
				object.minDate = $(this).attr('data-min');
			}
			if ($this.filter('[data-max]').length){
				object.maxDate = $(this).attr('data-max');
			}
			if ($this.filter('[data-on-select]').length){
				object.onSelect = function(dateText, inst){
					window[$(this).attr('data-on-select')](dateText, inst); // more secure than eval or new Function
				};
			}
			$this.datepicker(object);
		});

		// Date and time picker.
		$this.find('[data-toggle="datetime"]').datepicker({
			showTime: true
		});

		// Deadline.
		$this.find('[data-toggle="deadline"]').deadline();

		// Genereated content polyfill (e.g. semi-colons).
		if ($.fn.generatedContent) {
			$this.generatedContent();
		}

		// Modals (Fancybox).
		$this.find('[data-toggle="modal"]').each(function(){
			var object = {autoSize: false},
				$this = $(this);

			if ($this.filter('[data-autosize="true"]').length){
				object.autoSize = true;
			}
			if ($this.filter('[data-padding]').length){
				object.padding = Number($this.attr('data-padding'));
			}
			if ($this.filter('[data-ajax]').length){
				object.type = 'ajax';
				object.ajax = { type: 'GET' };
				object.beforeShow = function(){
					$('.fancybox-inner').microboot();
				};
        	}
			object.closeBtn = false;

			$this.fancybox(object);
		});
		$this.on('click', '[data-dismiss="modal"]', function(){
			parent.$.fancybox.close();
		});

		// Multiselect.
		$this.find('[data-transform="multiselect"]').multiselect();

		// Placeholder polyfill.
		if ($.fn.placeholder) {
			$this.find('[placeholder]').placeholder();
		}

		$this.find('[data-toggle="select2"]').select2();

		// Slider.
		$this.find('[data-toggle="slider"]').slider();

		// Spinner.
		$this.find('[data-toggle="spinner"]').spinner();

		// Time picker.
		$this.find('[data-toggle="time"]').timepicker();

		// Toggle button.
		$this.find('[data-toggle="button"]').toggleButtons();

		// Tree.
		$this.find('[data-toggle="tree"]').tree();

		// Scrollable
		$this.find('.scrollable').scrollable();

		// Remove all title attributes from the Multiselect plugin.
		$('.ui-multiselect [title]').removeAttr('title');

		// Tooltips (always do before Popover).
		// Tooltips can't be used on table cells because the markup is inserted directly after the target element, thus creating invalid markup and weird behaviour in some browsers.
		$this.find('[title]:not(th, td)').tooltip();

		// Popovers.
		$this.find('[rel=popover]').popover();

		// Tabs.
		$('li.active', $this).find('[data-toggle="tab"], [data-toggle="pill"]').each(function() {
			$(this).loadTabs(false);
		});

		// Clear input buttons
		$('input[data-clear]').clearInput();
	};

	$(function () {
		$(document).microboot();
	});
})(this.jQuery, this, document);