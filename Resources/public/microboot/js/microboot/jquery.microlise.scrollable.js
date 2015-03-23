;(function($){
	'use strict';

	var scroll = function () {
		var $this = $(this);
		var	scrollHeight = $this.prop('scrollHeight');
		var height = $this.height();

		if (scrollHeight > height) {
			var $top = $this.find('.scrollable__more--top');
			var $bottom = $this.find('.scrollable__more--bottom');

			var scrollTop = $this.scrollTop();

			if (scrollTop === 0) {
				$top.addClass('hide');
				$bottom.removeClass('hide');
			}
			else if (scrollHeight - scrollTop === height) {
				$top.removeClass('hide');
				$bottom.addClass('hide');
			}
			else {
				$top.removeClass('hide');
				$bottom.removeClass('hide');
			}
		}else{
			$this.find('.scrollable__more--top').addClass('hide');
			$this.find('.scrollable__more--bottom').addClass('hide');
		}
	};


	$.fn.scrollable = function(){
		return this.each(function(){
			var $this = $(this);

			var maxHeight = '';
			if ($this.filter('[data-max-height]').length){
				maxHeight = 'style="max-height: ' + $this.attr('data-max-height') + 'px;"';
			}

			if (!$this.children('.scrollable__body').length) {
				$this.wrapInner('<div class="scrollable__body" '+maxHeight+'/>');
			}

			$this.find('.scrollable__body')
				.on('scroll', scroll)
				.each(function () {
					var $this = $(this);

					if (!$this.children('.scrollable__more--top').length) {
						$this.prepend('<div class="scrollable__more  scrollable__more--top  hide" />');
					}

					if (!$this.children('.scrollable_more--bottom').length) {
						$this.append('<div class="scrollable__more  scrollable__more--bottom  hide" />');
					}
				});

			$(window).load(function () {
				$this.find('.scrollable__body').each(function () {
					scroll.call(this);
				});
			});

			$(window).resize(function () {
				$this.find('.scrollable__body').each(function () {
					scroll.call(this);
				});
			});

			$(document).on('hidden', '.accordion-group', function(){
				$this.find('.scrollable__body').each(function () {
					scroll.call(this);
				});
			});

			$(document).on('shown', '.accordion-group', function(){
				$this.find('.scrollable__body').each(function () {
					scroll.call(this);
				});
			});
		});
	};
})(window.jQuery);