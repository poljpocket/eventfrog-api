const EventFrog = require('./EventFrog');
const EventFrogService = require('./service/EventFrogService');

/**
 * EventFrogLoader jQuery plugin
 *
 * @see EventFrogLoader
 *
 * @author Julian Pollak <poljpocket@gmail.com>
 *
 */
(function($) {
    /**
     * @param opts
     * @param {string} [opts.apiKey] the EventFrog API key to use
     * @param {int} [opts.amount] the amount of events to load. This parameter is ignored when perPage and page are given.
     * @param {int} [opts.perPage] the amount of events to load per page. page
     * @param {int} [opts.page] the page of events to load, paginated by perPage
     * @param {string} [opts.search] the string to search by
     * @param {string} [opts.group] the group ID to filter by. This only applies when no pagination is given.
     * @param {string} [opts.organization] the organization ID to filter by
     */
    const jQueryEventFrog = async function(opts) {
        return EventFrog(opts);
    }

    /**
     * @param {string} key
     * @return {EventFrogService}
     */
    const jQueryEventFrogService = function(key) {
        return new EventFrogService(key);
    }

    /**
     * @deprecated
     *
     * @param opts
     * @param {string} [opts.apiKey] the EventFrog API key to use
     * @param {int} [opts.amount] the amount of events to load. This parameter is ignored when perPage and page are given.
     * @param {int} [opts.perPage] the amount of events to load per page. page
     * @param {int} [opts.page] the page of events to load, paginated by perPage
     * @param {string} [opts.search] the string to search by
     * @param {string} [opts.group] the group ID to filter by. This only applies when no pagination is given.
     * @param {string} [opts.organization] the organization ID to filter by
     * @param {function(EventFrogEvent[])} success
     * @param {function(string)} [error]
     */
    const jQueryEventFrogPromise = function(opts, success, error) {
        jQueryEventFrog(opts).then(success).catch(error);
    }

    $.extend({
        eventfrog: jQueryEventFrog,
        eventfrogService: jQueryEventFrogService,
        efapi: jQueryEventFrogPromise
    });
})(jQuery);
