;(function($){
	'use strict';

	var ClearInput = function($element){
		this.$element = $element;
	};

	ClearInput.prototype = {
		toggleClearButton: function(){
			 if (this.$element.val() === ''){
				this.$element.parent().find('.field-clear__icon').addClass('hide');
			}else{
				this.$element.parent().find('.field-clear__icon').removeClass('hide');
			}
		}
	};

	$.fn.clearInput = function(){
		if (navigator.appVersion.indexOf('MSIE 10') == -1){
			return this.each(function(){
				var $this = $(this),
					instance = $this.data('mb.ClearInput');
				if (!instance){
					$this.data('mb.ClearInput', instance = new ClearInput($this));
				}

				$this
					.addClass('input-clear')
					.wrap('<span class="field-clear" />')
					.parent().append('<i class="icon-clear  field-clear__icon" aria-hidden="true"></i>');

				instance.toggleClearButton();


				instance.$element.parent().find('.icon-clear').on('click', function(){
					var $this = $(this).parent().find('input'),
						instance = $this.data('mb.ClearInput');

					$this
						.val('')
						.trigger('mb-clear');

					instance.toggleClearButton();
				});

				instance.$element.on('change keyup', function(){
					var instance = $(this).data('mb.ClearInput');
					instance.toggleClearButton();
				});
			});
		}else{
			return this;
		}
	};
})(window.jQuery);