; (function ($, modernizr, window, document) {
	'use strict';

	if ($.fn.collapse) {
		if ($.fn.collapse.Constructor) {
			$.fn.collapse.Constructor.prototype.dimension = function () {
				var hasWidth = this.$element.hasClass('collapse--horizontal');

				return hasWidth ? 'width' : 'height';
			};

			// Override to support IE 7 animatations.
			//$.fn.collapse.Constructor.prototype.show = function () {
			//	var that = this,
			//	    options = {},
			//	    dimension,
			//	    scroll,
			//	    actives,
			//	    hasData;

			//	if (that.transitioning) {
			//		return;
			//	}

			//	dimension = that.dimension();
			//	scroll = $.camelCase(['scroll', dimension].join('-'));
			//	actives = that.$parent && that.$parent.find('> .accordion-group > .in');

			//	if (actives && actives.length) {
			//		hasData = actives.data('collapse');

			//		if (hasData && hasData.transitioning) {
			//			return;
			//		}

			//		actives.collapse('hide');
			//		hasData || actives.data('collapse', null);
			//	}

			//	that.$element[dimension](0);
			//	that.transition('addClass', $.Event('show'), 'shown');

			//	// New code...
			//	if ($.support.transition) {
			//		that.$element[dimension](that.$element[0][scroll]);
			//	}
			//	else {
			//		options = {};
			//		options[dimension] = 'toggle';

			//		that.$element.animate(options, '350', function () {
			//			that.$element.addClass('in');
			//		});
			//	}
			//}

			// Override to support IE 7 animatations.
			//$.fn.collapse.Constructor.prototype.hide = function () {
			//	var options = {},
			//		dimension;

			//	if (this.transitioning) {
			//		return;
			//	}

			//	dimension = this.dimension();
			//	this.reset(this.$element[dimension]());
			//	this.transition('removeClass', $.Event('hide'), 'hidden');

			//	// New code...
			//	if ($.support.transition) {
			//		this.$element[dimension](0);
			//	}
			//	else {
			//		options[dimension] = 'toggle';

			//		this.$element.removeClass('in')
			//			.animate(options, '350');
			//	}
			//}

			// Override to support IE 7 animatations.
			//$.fn.collapse.Constructor.prototype.transition = function (method, startEvent, completeEvent) {
			//	var that = this,
			//		complete = function () {
			//			if (startEvent.type == 'show') {
			//				that.reset();
			//			}

			//			that.transitioning = 0;
			//			that.$element.trigger(completeEvent);
			//		};

			//	that.$element.trigger(startEvent);

			//	if (startEvent.isDefaultPrevented()) {
			//		return;
			//	}

			//	this.transitioning = 1;

			//	if ($.support.transition) {
			//		that.$element[method]('in');
			//	}

			//	$.support.transition && that.$element.hasClass('collapse') ?
			//		that.$element.one($.support.transition.end, complete) :
			//		complete();
			//};
		}

		// Override the click event to toggle collapse/expand icons.
		$(document).off('.collapse.data-api', '[data-toggle=collapse]'); // Unbind the Bootstrap event, otherwise the first trigger won't work.
		$(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
			var $this = $(this),
				href,
				$target = $($this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')), // Strip for IE7.
				$icon = $this.find('.panel__toggle-icon, .mb-well--window__icon, .well--window__icon'), // TODO: Drop .well--window__icon in version 2
				toggleIcon = function () {
					var isVisible = $target.hasClass('in');

					//$target.off('hidden')
					//.off('shown');
					$target.off('hidden.ie7-icon')
					.off('shown.ie7-icon');

					if ($icon.hasClass('icon-up') || $icon.hasClass('icon-down')) {
						// if (modernizr && !modernizr.generatedcontent) {
						// 	$icon.html(isVisible ? microboot.icon('up') : microboot.icon('down'));
						// }

						$icon[isVisible ? 'addClass' : 'removeClass']('icon-up')[!isVisible ? 'addClass' : 'removeClass']('icon-down');
					}
					else if ($icon.hasClass('icon-left') || $icon.hasClass('icon-right')) {
						// if (modernizr && !modernizr.generatedcontent) {
						// 	$icon.html($target.hasClass('in') ? microboot.icon('back') : microboot.icon('forward'));
						// }

						$icon[isVisible ? 'addClass' : 'removeClass']('icon-left')[!isVisible ? 'addClass' : 'removeClass']('icon-right');
					}
				},
				option = $target.data('collapse') ? 'toggle' : $this.data();

			$target.one('hidden.ie7-icon', toggleIcon)
			.one('shown.ie7-icon', toggleIcon); // .ie7-icon added here too

			$this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
			$target.collapse(option);
		});
	}
})(window.jQuery, window.Modernizr, window, document);


(function($, undefined) {
	'use strict';

	var message = {
		loading: '<div class="loading"><i class="icon icon-loading icon--large icon--spin" aria-hidden="true"></i> Loading</div>',
		error: '<p>I\'m afraid there has been an error.</p>'
	};

	var NewTab = function($ul) {
		this.alpha = 0;
		this.inter = null;
		this.storedSelector = null;
		this.oldIE = false;
		this.$ul = $ul;
		if (this.$ul.attr('data-tabs-clear') === 'true'){
			this.clear = true;
		}else{
			this.clear = false;
		}
	};

	NewTab.prototype = {
		loadAJAX: function(a) {
			this.storedSelector = a.getAttribute('href');
			var pos = this.storedSelector.lastIndexOf('#');
			this.storedSelector = this.storedSelector.substring(pos);

			if (navigator.browser === 'IE6' || navigator.browser === 'IE7' || navigator.browser === 'IE8'){
				this.oldIE = true;
			}
			if (this.oldIE === false){
				this.setAlpha();
				this.inter = setInterval($.proxy(function() {
					this.setAlpha();
				}, this), 10);
			}

			$(this.storedSelector)
				.height(60)
				.html(message.loading);

			var that = this;
			$.ajax({
				url: a.getAttribute('data-url'),
				success: function(html) {
					$(that.storedSelector).css('height', 'auto');
					if (that.oldIE === false){
						that.clearSetAlpha();
					}

					$(that.storedSelector)
						.html(html)
						.microboot();
				},
				error: function(xhr, ajaxOptions, thrownError) {
					if (that.oldIE === false){
						that.clearSetAlpha();
					}
					$(that.storedSelector).html(message.error);
				}
			});
		},

		setAlpha: function(){
			$(this.storedSelector).css('opacity', this.alpha);
			this.alpha += 0.01;
			if (this.alpha >= 1){
				this.alpha = 1;
			}
		},

		clearSetAlpha: function(){
			clearInterval(this.inter);
			this.alpha = 0;
			$(this.storedSelector).css('opacity', 1);
		}
	};

	if ($.fn.tab) {
		$.fn.loadTabs = function(forceReload){
			//forceReload should have been set to true to override but we're using undefined instead not to break amber code which only takes one argument, ie $.fn.loadTabs($(this)); not $.fn.loadTabs($(this), true);
			//forceReload == false || forceReload === undefined - false is false and undefined for true
			return this.each(function () {
				var $this = $(this),
					data = $this.data('newTab');

				if (!data){
					$this.data('newTab', (data = new NewTab( $this.parent().parent() )));
				}

				if (this.getAttribute('data-url') !== null) {
					if (this.getAttribute('data-cache') === null) {
						//cache because no definition is set
						data.loadAJAX(this);
						this.setAttribute('data-cache', 'true');
					}else{
						if (this.getAttribute('data-cache') === 'false' || forceReload === undefined) {
							//reload because cache set to false or no override set
							data.loadAJAX(this);
						}
					}
				}

				//maybe should be parent not parents
				if (!$this.parents('.disabled').length) {
					$this
						.tab('show')
						.trigger('tabs.change');
				}

				// Clear inactive panes if the data-tabs-clear is present
				if (data.clear === true){
					data.$ul.find('a').each(function(){
						var $this = $(this);
						if ($this.parent().hasClass('active') === false){
							var selector = $this.attr('href');
							$(selector).empty();
						}
					});
				}
			});
		};

		$.fn.setPaneActive = function() {
			//searches for all the active tabs on the page and sets their corresponding panes to be active
			var id;
			$(this).find('.nav-tabs li.active a').filter('[data-toggle="tab"], [data-toggle="pill"]').each(function() {
				id = this.getAttribute('href');
				var pos = id.lastIndexOf('#');
				id = id.substring(pos);

				$(id).addClass('active');
			});
		};

		$.setTabsMessage = function(action, imessage) {
			action = action.toLowerCase();

			if (action === 'loading'){
				if (imessage === undefined) {
					//default to English message
					imessage = 'Loading';
				}
				message.loading = '<div class="loading"><i class="icon icon-loading icon--large icon--spin" aria-hidden="true"></i> '+imessage+'</div>';
			}

			if (action === 'error'){
				if (imessage !== undefined) {
					if (!$(imessage).is('p')) {
						imessage = '<p>'+imessage+'</p>';
					}
				} else {
					//default to English message
					imessage = '<p>I\'m afraid there has been an error.</p>';
				}
				message.error = imessage;
			}
		};

		// Override the click event to prevent the user from being able to click on disabled tabs/pills.
		$(document).off('.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]');

		$(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
			e.preventDefault();
			e.cancelBubble = true; // IE8
			$(this).loadTabs(false);
		});
	}
})(this.jQuery);



(function ($, undefined) {
	'use strict';

	var gutter = 20,
		$window = $(window),
		placement = function (tip, element) {
			var $element = $(element),
				elementHeight = $element.outerHeight(),
				elementWidth = $element.outerWidth(),
				elementOffset = $element.offset(),
				elementTop = elementOffset.top - $(window).scrollTop(),
				elementLeft = elementOffset.left - $(window).scrollLeft(),
				$tip = $(tip),
				$tempTip = $tip.clone().css('display', 'none').removeClass('top').insertAfter($element),
				tipHeight = $tempTip.outerHeight(),
				tipWidth = $tempTip.outerWidth();

			$tempTip.remove();

			if (elementTop + (elementHeight / 2) - (tipHeight / 2) > 0 && elementTop + (elementHeight / 2) + (tipHeight / 2) < $window.height()) {
				if (elementLeft + (elementWidth / 2) + (tipWidth / 2) > $window.width() - gutter) {
					return 'left';
				}

				if (elementLeft + (elementWidth / 2) - (tipWidth / 2) < gutter) {
					return 'right';
				}
			}

			if (elementTop - tipHeight < gutter) {
				return 'bottom';
			}

			return 'top';
		};

	if ($.fn.popover) {
		$.fn.popover.Constructor.DEFAULTS.placement = placement;
		$.fn.popover.Constructor.DEFAULTS.container = 'body';
	}

	if ($.fn.tooltip) {
		$.fn.tooltip.Constructor.DEFAULTS.placement = placement;
		$.fn.popover.Constructor.DEFAULTS.container = 'body';
	}
})(this.jQuery);


(function($){
	'use strict';

	if ($.fn.popover) {
		// Checks for clicks on the page and iterates through each popover and hides it unless that was the element that was clicked on
		$(document).on('click.popover.data-api', function (e) {
			var etarget = e.target,
				popoverClicked = false;

			$('.popover').each(function(){
				if (this === etarget || $.contains(this, etarget) === true){
					popoverClicked = true;
				}
			});

			if (popoverClicked === false){
				$('[rel=popover]').each(function(){
					if (this === etarget || $.contains(this, etarget) === true){
						e.preventDefault();
					}else{
						$(this).popover('hide');
					}
				});
			}
		});

		$.fn.popover.Constructor.prototype.hide = function () {
			var that = this
			var $tip = this.tip()
			var e    = $.Event('hide.bs.' + this.type)

			function complete() {
				if (that.hoverState != 'in') $tip.detach()
				$tip.remove(); // this is the only new line
			}

			this.$element.trigger(e)

			if (e.isDefaultPrevented()) return

			$tip.removeClass('in')

			$.support.transition && this.$tip.hasClass('fade') ?
				$tip
					.one($.support.transition.end, complete)
					.emulateTransitionEnd(150) :
				complete()

			this.$element.trigger('hidden.bs.' + this.type)

			return this
		}
	}
})(this.jQuery);