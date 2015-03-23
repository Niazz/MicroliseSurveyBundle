; (function ($, undefined) {
    'use strict';

    // Create a dummy prototype to prevent JS errors if the browser doesn't require the widget.
    var prototype = {
        resize: function () {
        }
    };

    if ($.browser.msie && $.browser.version < 8) {
        prototype = {
            _create: function () {
                var that = this;

                var width = that.element.width();
                var scrollWidth = that.element[0].scrollWidth;
                var height = that.element.height();
                var scrollHeight = that.element[0].scrollHeight;

                if (width < scrollWidth && height === scrollHeight) {
                    that.element.css({
                        'padding-bottom': that.options.scrollbarHeight + 'px',
                        'overflow-y': 'hidden'
                    });
                }

                $.microboot.fixOverflow.instances.push(that.element);

                return that;
            },
            _destroy: function () {
                var that = this;

                that.element.css({
                    'padding-bottom': 0,
                    'overflow-y': 'auto'
                });

                var position = $.inArray(that.element, $.microboot.fixOverflow.instances);

                if (position > -1) {
                    $.microboot.fixOverflow.instances.splice(position, 1);
                }

                return that;
            },
            options: {
                delay: $.fx.interval,
                scrollbarHeight: 17
            }
        };
    }

    $.widget('microboot.fixOverflow', prototype);

    $.extend($.microboot.fixOverflow, {
        instances: []
    });
})(window.jQuery);