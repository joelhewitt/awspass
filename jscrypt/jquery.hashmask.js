/**
 * HashMask - a new approach to password masking security
 *
 * REQUIRES:
 * jquery.sparkline.js
 * a one way hashing method, currently sha1, provided by jquery.sha1.js
 *
 * @author    Chris Dary <umbrae@gmail.com>
 * @copyright Copyright (c) 2009 {@link http://arc90.com Arc90 Inc.}
 * @license   http://www.opensource.org/licenses/bsd-license.php
**/

(function($) {
    $.hashmask = {
        settings: {
            hashFunction:     $.sha1,
            useColorAsHint:   true,
            sparkInterval:    500,
            sparklineOptions: {
                width:          '100px',
                height:         'auto',
                lineColor:      '#69C',
                spotColor:      false,
                minSpotColor:   false,
                maxSpotColor:   false               
            }
        }
    };

    $.fn.hashmask = function(settings) {
        /**
         * @var object Contains an associative array of all settings for hashmask.
        **/
        settings = $.extend({}, $.hashmask.settings, settings);

        /**
         * Add hashmask hint to an input. The input must be of type password.
         *
         * @param selector string A jquery capable selector, as defined here: http://docs.jquery.com/Selectors
         * @return void
        **/
        return this.each(function() {
            var $sparkline, sparkTimeout, i;
            var $this = $(this);
            
            if(!$this.is('input[type="password"]'))
            {
                throw new Error('HashMask may only be used on inputs of type password.');
            }

            $sparkline = $('<div id="' + this.id + '-jquery-hashmask-sparkline"></div>');
            $sparkline.css({
                position:    'absolute',
                top:         $this.offset().top + parseInt($this.css('borderTopWidth'), 10),
                left:        $this.offset().left + $this.outerWidth() - parseInt($this.css('borderRightWidth'), 10) - parseInt(settings.sparklineOptions.width, 10),
                width:       settings.sparklineOptions.width,
                height:      $this.outerHeight()
            });
            $sparkline.click(function() { $this.focus(); });

            $this.parents('form').append($sparkline);

            $this.keyup(function(e) {
                window.clearTimeout(sparkTimeout);

                var inputVal = $this.val();
                if(inputVal === "")
                {
                    $sparkline.html("");
                    return;
                }

                var inputHash      = settings.hashFunction($this.val()).substr(0,20);
                var inputHexArr    = inputHash.split('');
                var inputDecArr    = [];

                /* Convert our hex string array into decimal numbers for sparkline consumption */
                for(i=0; i < inputHexArr.length; i++)
                {
                    inputDecArr.push(parseInt(inputHexArr[i], 16));
                }

                var fillColor;
                if(settings.useColorAsHint)
                {
                    fillColor = '#' + inputHash.substr(0,6);
                }
                else
                {
                    fillColor = settings.sparklineOptions.fillColor
                }
                
                sparkTimeout = window.setTimeout(function() {
                    $sparkline.sparkline(inputDecArr, $.extend( settings.sparklineOptions, {
                        height: (settings.sparklineOptions.height == 'auto' ? $this.outerHeight() - parseInt($this.css('borderBottomWidth'), 10) - parseInt($this.css('borderTopWidth'), 10): settings.sparklineOptions.height),
                        fillColor: fillColor
                    }));
                }, settings.sparkInterval);

            });

        });
    };
    
})(jQuery);
