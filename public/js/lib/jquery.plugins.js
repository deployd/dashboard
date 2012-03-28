/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);


/*!
 * JSizes - JQuery plugin v0.33
 *
 * Licensed under the revised BSD License.
 * Copyright 2008-2010 Bram Stein
 * All rights reserved.
 */
/*global jQuery*/
(function ($) {
    var num = function (value) {
            return parseInt(value, 10) || 0;
        };

    /**
     * Sets or gets the values for min-width, min-height, max-width
     * and max-height.
     */
    $.each(['min', 'max'], function (i, name) {
        $.fn[name + 'Size'] = function (value) {
            var width, height;
            if (value) {
                if (value.width !== undefined) {
                    this.css(name + '-width', value.width);
                }
                if (value.height !== undefined) {
                    this.css(name + '-height', value.height);
                }
                return this;
            }
            else {
                width = this.css(name + '-width');
                height = this.css(name + '-height');
                // Apparently:
                //  * Opera returns -1px instead of none
                //  * IE6 returns undefined instead of none
                return {'width': (name === 'max' && (width === undefined || width === 'none' || num(width) === -1) && Number.MAX_VALUE) || num(width), 
                        'height': (name === 'max' && (height === undefined || height === 'none' || num(height) === -1) && Number.MAX_VALUE) || num(height)};
            }
        };
    });

    /**
     * Returns whether or not an element is visible.
     */
    $.fn.isVisible = function () {
        return this.is(':visible');
    };

    /**
     * Sets or gets the values for border, margin and padding.
     */
    $.each(['border', 'margin', 'padding'], function (i, name) {
        $.fn[name] = function (value) {
            if (value) {
                if (value.top !== undefined) {
                    this.css(name + '-top' + (name === 'border' ? '-width' : ''), value.top);
                }
                if (value.bottom !== undefined) {
                    this.css(name + '-bottom' + (name === 'border' ? '-width' : ''), value.bottom);
                }
                if (value.left !== undefined) {
                    this.css(name + '-left' + (name === 'border' ? '-width' : ''), value.left);
                }
                if (value.right !== undefined) {
                    this.css(name + '-right' + (name === 'border' ? '-width' : ''), value.right);
                }
                return this;
            }
            else {
                return {top: num(this.css(name + '-top' + (name === 'border' ? '-width' : ''))),
                        bottom: num(this.css(name + '-bottom' + (name === 'border' ? '-width' : ''))),
                        left: num(this.css(name + '-left' + (name === 'border' ? '-width' : ''))),
                        right: num(this.css(name + '-right' + (name === 'border' ? '-width' : '')))};
            }
        };
    });
})(jQuery);

//Set outer dimension
(function ($) {

    if ($) {
        // get references to original functions
        var outerWidth = $.fn.outerWidth;
        var outerHeight = $.fn.outerHeight;

        var workerFunc = function (height, value) {
            var border = this.border();
            var padding = this.padding();
            var actualSize;
            if (height) {
                actualSize = value - border.top - padding.top - padding.bottom - border.bottom;
                return this.height(actualSize);
            } else {
                actualSize = value - border.left - padding.left - padding.right - border.right;
                return this.width(actualSize);
            }
        };

        $.fn.extend({
            outerWidth: function (value) {
                if (typeof (value) != "undefined" && value === value * 1.0) {
                    return workerFunc.apply(this, [false, value]);
                } else {
                    // pass onto original function
                    return outerWidth.apply(this, arguments);
                }
            },

            outerHeight: function (value) {
                if (typeof (value) != "undefined" && value === value * 1.0) {
                    return workerFunc.apply(this, [true, value]);
                } else {
                    // pass onto original function
                    return outerHeight.apply(this, arguments);
                }
            }
        });
    }

})(jQuery);