/**
 * jQuery Spotlight
 *
 * Project Page: http://github.com/
 * Original Plugin code by Gilbert Pellegrom (2009)
 * Licensed under the GPL license (http://www.gnu.org/licenses/gpl-3.0.html)
 * Version 2.0.1 (2014)
 */
 
 (function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var currentOverlay;

    $.fn.spotlight = function (options) {
        var method = 'create';

        // Default settings
        settings = $.extend({}, {
            opacity: .5,
            speed: 400,
            color: '#333',
            animate: true,
            easing: '',
            exitEvent: 'click',
            onShow: function () {
                // do nothing
            },
            onHide: function () {
                // do nothing
            },
            spotlightZIndex: 9999,
            spotlightElementClass: 'spotlight-background',
            parentSelector: 'html',
            paddingX: 0,
            paddingY: 0
        }, options);

        function closeOverlay () {
            if (!currentOverlay) {
                return;
            }

            if (settings.animate) {
                currentOverlay.animate({opacity: 0}, settings.speed, settings.easing, function () {
                    currentOverlay.remove();
                    currentOverlay = null;

                    // Trigger the onHide callback
                    settings.onHide.call(this);
                });
            } else {
                currentOverlay.remove();
                currentOverlay = null;

                // Trigger the onHide callback
                settings.onHide.call(this);
            }
        }

        if (typeof options === 'string') {
            method = options;
            options = arguments[1];
        }

        switch (method) {
            case 'close':
            case 'destroy':
                closeOverlay();
                return;
        }

        var elements = $(this),
            overlay,
            parent,
            context;

        /**
         * Colour in the overlay and clear all element masks
         */
        function fillOverlay () {
            context.fillStyle = settings.color;
            context.fillRect(0, 0, parent.innerWidth(), parent.innerHeight());

            // loop through elements and clear their position
            elements.each(function (i, e) {
                e = $(e);

                var currentPos = e.position();
                context.clearRect(
                    currentPos.left - settings.paddingX,
                    currentPos.top - settings.paddingY,
                    e.outerWidth() + (settings.paddingX * 2),
                    e.outerHeight() + (settings.paddingY * 2)
                );
            });
        }

        /**
         * Handle resizing the window
         *
         * @param e
         */
        function handleResize (e) {
            overlay.attr('width', parent.innerWidth());
            overlay.attr('height', parent.innerHeight());

            if (typeof context !== 'undefined') {
                fillOverlay();
            }
        }

        closeOverlay();

        // Add the overlay element
        overlay = $('<canvas></canvas>');
        overlay.addClass(settings.spotlightElementClass);

        currentOverlay = overlay;

        parent = $(settings.parentSelector);
        parent.append(overlay);

        // Get our elements
        var element = $(this);

        // Set the CSS styles
        var cssConfig = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: settings.spotlightZIndex
        };

        if (settings.parentSelector == 'html') {
            parent.css('height', '100%');
        }

        overlay.css(cssConfig);
        handleResize();
        $(window).resize(handleResize);

        context = overlay[0].getContext('2d');

        fillOverlay();

        // Fade in the spotlight
        if (settings.animate) {
            overlay.animate({opacity: settings.opacity}, settings.speed, settings.easing, function () {
                // Trigger the onShow callback
                settings.onShow.call(this);
            });
        } else {
            overlay.css('opacity', settings.opacity);

            // Trigger the onShow callback
            settings.onShow.call(this);
        }

        // Set up click to close
        $(document).on(settings.exitEvent, overlay, closeOverlay);

        // Returns the jQuery object to allow for chainability.
        return this;
    };

}));
