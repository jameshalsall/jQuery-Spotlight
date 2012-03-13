/**
 * jQuery Spotlight
 *
 * Project Page: http://github.com/
 * Original Plugin code by Gilbert Pellegrom (2009)
 * Licensed under the GPL license (http://www.gnu.org/licenses/gpl-3.0.html)
 * Version 1.1 (2011)
 */
(function($) {

	$.fn.spotlight = function(options) {
            // Default settings
            settings = $.extend({}, {
                    opacity: .5,
                    speed: 400,
                    color: '#333',
                    animate: true,
                    easing: '',
                    exitEvent: 'click',
                    onShow: function(){},
                    onHide: function(){}
            }, options);

            // Add the overlay div
            $('body').append('<div id="spotlight"></div>');

            // Get our elements
            var element = $(this);
            var spotlight = $('#spotlight');

            // Set the CSS styles
            var cssConfig = {
                'position':'absolute', 
                'background':settings.color, 
                'top':'0px', 
                'left':'0px', 
                'height': $(document).height() + 'px',
                'width': $(document).height() + 'px',
                'z-index':'9998'
            };

            if(jQuery.support.opacity) {
                cssConfig['opacity'] = '0';
            } else {
                cssConfig['filter'] = 'alpha(opacity=0)';
            }

            spotlight.css(cssConfig);

            // Set element CSS
            var currentPos = element.css('position');
            if(currentPos == 'static'){
                //fix for IE cell positioning
                if(jQuery.browser.msie && ($(this).is('tr') || $(this).is('td'))) {
                    $(this).children('td').each(function() {
                        $(this).css({'position':'relative', 'width' : $(this).width(), 'z-index':'9999'});
                    });
                    element.css({'position':'absolute', 'width' : $(this).width(), 'z-index':'9999'});
                } else {
                    element.css({'position':'relative', 'z-index':'9999'});
                }
            } else {
                element.css('z-index', '9999');
            }

            // Fade in the spotlight
            if(settings.animate && jQuery.support.opacity){
                spotlight.animate({opacity: settings.opacity}, settings.speed, settings.easing, function(){
                    // Trigger the onShow callback
                    settings.onShow.call(this);
                });
            } else {
                if(jQuery.support.opacity) {
                    spotlight.css('opacity', settings.opacity);
                } else {
                    spotlight.css('filter', 'alpha(opacity=' + settings.opacity * 100 + ')');
                }
                // Trigger the onShow callback
                settings.onShow.call(this);
            }

            // Set up click to close
            spotlight.live(settings.exitEvent, function(){
                    if(settings.animate){
                        spotlight.animate({opacity: 0}, settings.speed, settings.easing, function(){
                                if(currentPos == 'static') element.css('position', 'static');
                                element.css('z-index', '1');
                                $(this).remove();
                                // Trigger the onHide callback
                                settings.onHide.call(this);
                        });
                    } else {
                        spotlight.css('opacity', '0');
                        if(currentPos == 'static') element.css('position', 'static');
                        element.css('z-index', '1');
                        $(this).remove();
                        // Trigger the onHide callback
                        settings.onHide.call(this);
                    }
            });

            // Returns the jQuery object to allow for chainability.  
            return this;
	};

})(jQuery);
