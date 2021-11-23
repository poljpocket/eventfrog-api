const Eventfrog = require('./Eventfrog');
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
     * @deprecated v1.2.0
     *
     * @see jQueryEventfrogService
     *
     * @param opts
     * @param {string} [opts.apiKey] the Eventfrog API key to use
     * @param {int} [opts.amount] the amount of events to load. This parameter is ignored when perPage and page are given.
     * @param {int} [opts.perPage] the amount of events to load per page. page
     * @param {int} [opts.page] the page of events to load, paginated by perPage
     * @param {string} [opts.search] the string to search by
     * @param {string} [opts.group] the group ID to filter by. This only applies when no pagination is given.
     * @param {string} [opts.organization] the organization ID to filter by
     */
    const jQueryEventfrog = async function(opts) {
        return Eventfrog(opts);
    }

    /**
     * @param {string} key
     * @return {EventfrogService}
     */
    const jQueryEventfrogService = function(key) {
        return new EventfrogService(key);
    }

    /**
     * @deprecated v1.1.0
     *
     * @param opts
     * @param {string} [opts.apiKey] the Eventfrog API key to use
     * @param {int} [opts.amount] the amount of events to load. This parameter is ignored when perPage and page are given.
     * @param {int} [opts.perPage] the amount of events to load per page. page
     * @param {int} [opts.page] the page of events to load, paginated by perPage
     * @param {string} [opts.search] the string to search by
     * @param {string} [opts.group] the group ID to filter by. This only applies when no pagination is given.
     * @param {string} [opts.organization] the organization ID to filter by
     * @param {function(EventfrogEvent[])} success
     * @param {function(string)} [error]
     */
    const jQueryEventfrogPromise = function(opts, success, error) {
        jQueryEventfrog(opts).then(success).catch(error);
    }

    $.extend({
        eventfrog: jQueryEventfrog,
        eventfrogService: jQueryEventfrogService,
        efapi: jQueryEventfrogPromise
    });
})(jQuery);
