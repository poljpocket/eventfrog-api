const EventfrogService = require('./service/EventfrogService');

/**
 * EventfrogLoader jQuery plugin
 *
 * @see EventfrogService
 *
 * @author Julian Pollak <poljpocket@gmail.com>
 *
 */
(function($) {
    /**
     * @param {string} key
     * @return {EventfrogService}
     */
    const jQueryEventfrogService = function(key) {
        return new EventfrogService(key);
    }

    $.extend({
        EventfrogService: jQueryEventfrogService
    });
})(jQuery);
