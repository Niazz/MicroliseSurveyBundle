; (function () {
	$.fn.generatedContent = function () {
		var $this = this;

		// Grid layout.
		$this.find('.row').before('<div class="row-before"></div>');
		$this.find('[class*="span"]:first-child').addClass('span-first-child');

		// Colons.
		$this.find('.control-label').append(' :');
		$this.find('.control-label-inline').append(' :');
		$this.find('.dl-horizontal dt').append(' :');

		// <dd> padding.
		$this.find('.dl-horizontal dd').wrapInner('<span class="ie7-dd-wrap" />');
	}
})();