;(function($){
	'use strict';

	// When 'data-checkbox-group' toggle checkbox is changed/clicked it updates the state of its child checkboxes
	// This line has to be 'click' not 'change' otherwise the collapsible well in the filter will collapse
	$(document).on('click', '[data-checkbox-group]', function(e){
		e.stopPropagation();
		e.cancelBubble = true;
		e.preventDefault(); // Firefox only, doesn't make any sense

		// Get the 'data-checkbox-group' value and then search the page to see how many instances of checkboxes with matching 'data-checkbox' attributes have been checked.
		var target = $(this).attr('data-checkbox-group'),
			checked = 0,
			$dataCheckboxTarget = $('[data-checkbox="'+target+'"]');
		$dataCheckboxTarget.each(function(){
			if ($(this).prop('checked') ){
				checked++;
			}
		});

		// If there was at least one checked checkbox that set all checkboxes of that type to unchecked, otherwise turn them all to be checked.
		if (checked > 0){
			$dataCheckboxTarget
				.prop('checked', false)
				.trigger('change');
		}else{
			$dataCheckboxTarget
				.prop('checked', true)
				.trigger('change');
		}

		// Set data-checkbox-group toggle checkbox to be on or off, it is in a setTimeout callback as it it were done here now it would have no effect because of the e.preventDefault();
		setTimeout($.proxy(function(){
			if (checked > 0){
				$(this)
					.prop('checked', false)
					.prop('indeterminate', false);
			}else{
				$(this)
					.prop('checked', true)
					.prop('indeterminate', false);
			}
		}, this), 4);
	});


	// Set the 'data-checkbox-group' toggle checkbox based on how many checkboxes have been checked
	var setCheckboxGroupState = function(target){
		var	checked = 0,
			total = 0;

		$('[data-checkbox="'+target+'"]').each(function(){
			total++;
			if ($(this).prop('checked') ){
				checked++;
			}
		});

		if (checked > 0){
			if (checked < total){
				$('[data-checkbox-group="'+target+'"]').prop('indeterminate', true);
			}else{
				$('[data-checkbox-group="'+target+'"]')
					.prop('indeterminate', false)
					.prop('checked', true);
			}
		}else{
			$('[data-checkbox-group="'+target+'"]')
				.prop('indeterminate', false)
				.prop('checked', false);
		}
	};

	$(document).on('click', '[data-checkbox]', function(){
		var $this = $(this);
		setCheckboxGroupState( $this.attr('data-checkbox') );
		$this.trigger('change');
	});


	$(document).ready(function(){
		$('[data-checkbox-group]').each(function(){
			setCheckboxGroupState( $(this).attr('data-checkbox-group') );
		});
	});
})(window.jQuery);