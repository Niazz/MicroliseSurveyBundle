//if you put it into a set width div with "var parentWidth = $(this).parent().width() - 1;" there will be an error when it's resized

// shrinktofit is true by default

// ui-jqgrid-hdiv
// 		ui-jqgrid-htable - tables
// ui-jqgrid-bdiv
// 		ui-jqgrid-btable - body

;(function($) {
	'use strict';

		// 					// Fixes IE issue with in-place resizing when mousing-over frame bars.
		// 					if (width > 0 && Math.abs(width - $grid.width()) > 5) {
		// 						$grid.setGridWidth(width);
		// 					}

	var resizeTimeout;
	var lastWindowWidth = $(window).width();
	$(window).on('resize', function() {
		var windowWidth = $(window).width();
		if (lastWindowWidth != windowWidth) {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {
				$.resizeJqGrid();
			}, 200);
		}
		lastWindowWidth = windowWidth;
	});


	$.resizeJqGrid = function(){
		$('.ui-jqgrid.ui-widget.ui-widget-content.ui-corner-all:visible').each(function() {
			var $this = $(this),
				parentWidth = $this.parent().width() - 1, //this minus one is to stop scroll bar in tabs
				resize = true,
				lastContainerWidth = $this.data('lastContainerWidth');

			if (navigator.browser === 'IE6' || navigator.browser === 'IE7'){
				if (lastContainerWidth === parentWidth ){ // stop IE7 looping through this function in a way that makes no sense to me. At all.
					resize = false;
				}
				if (parentWidth < lastContainerWidth){
					parentWidth = 900; // stop weird slow resizing bug in IE7
				}
			}

			if (resize){
				var scrollbar = 0,
					padding = 1,
					diff;

				if ($this.find('.ui-jqgrid-btable').getGridParam('shrinkToFit') === true) {
					diff = $this.find('.ui-jqgrid-bdiv').width() - $this.find('.ui-jqgrid-btable').width();
					if (diff > 1){
						scrollbar = diff;
						padding = diff;
					}
				}else{
					$this.find('.ui-jqgrid-hbox').css('padding', '0'); // removes padding to make IE10 work
					if ($this.find('.ui-jqgrid-btable').height() > $this.find('.ui-jqgrid-bdiv').height()){
						scrollbar = 18; // this only needs to be higher than zero if there's a vertical scroll
						padding = 18;
					}else{
						scrollbar = 0;
						padding = 1;
					}
				}

				$this.find('.ui-jqgrid-btable').setGridWidth(parentWidth);

				$this.width(parentWidth);
					$this.find('.ui-jqgrid-view').width(parentWidth);
						$this.find('.ui-jqgrid-hdiv').width(parentWidth - scrollbar); // add margin here if has scroll bar
							$this.find('.ui-jqgrid-htable').width(parentWidth - padding);
						$this.find('.ui-jqgrid-bdiv').width(parentWidth);
							$this.find('.ui-jqgrid-btable').width(parentWidth - padding);
					$this.find('.ui-jqgrid-pager').width(parentWidth);
			}
			$this.data('lastContainerWidth', parentWidth);
		});
	};

	//no grids yet on page load so this is pointless, instead tie it into each jqgrid set up with loadComplete: function(){
	// $(document).ready(function () {
	// 	resizeJqGrid();
	// });

	$(document).on('tabs.change', function() {
		$.resizeJqGrid();
	});


	//resizes the screen on hide n slide events
	$(document).on('show', '.panel__body-container', function(e) {
		if (e.target === this) {
			$('.panel__container-content__inner').css('margin-left', '330px');
		}
	});
	$(document).on('hide', '.panel__body-container', function(e) {
		if (e.target === this) {
			$('.panel__container-content__inner').css('margin-left', '30px');
		}
	});

	$(document).on('hidden shown', '.panel__body-container', function() {
		$.resizeJqGrid();
	});


	// Add and removes the 'mb-selected' class depending on if the row has been selected or not
	$(document).on('change', '.ui-jqgrid [type="checkbox"]', function() {
		if (this.checked){
			$(this).parents('tr').addClass('mb-selected');
		}else{
			$(this).parents('tr').removeClass('mb-selected');
		}
	});
})(window.jQuery);