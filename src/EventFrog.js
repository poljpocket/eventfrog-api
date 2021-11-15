const EventFrogService = require('./service/EventFrogService');

const $ = require('jquery');

/**
 * Loads an array of events by custom (more human-readable) options, maps locations and groups to events
 *
 * Known limitations:
 * * You cannot filter by group and have pagination at the same time because EventFrog does not allow
 *   filtering by group ID at this time. This filter has to be applied after the events are loaded and thus paginated.
 * * You cannot get all locations of an event (multiple are possible by the API). Only the first one is fetched.
 * * The Rubrics part of the API is not yet implemented
 *
 * Known issues:
 * * When not filtering events down to a small number, the amount of groups and locations being queried to
 *   later be matched to events for more detailed display can easily overwhelm the EventFrog APIs. They handle this case
 *   correctly but this script does not!
 *   If you do not need groups and locations being matched to events, use the more granular methods of
 *   {@link EventFrogService}.
 *
 * @see EventFrogService.getEvents
 *
 * @author Julian Pollak <poljpocket@gmail.com>
 *
 * @param customOptions
 * @param {string} [customOptions.apiKey] the EventFrog API key to use
 * @param {int} [customOptions.amount] the amount of events to load. This parameter is ignored when perPage and page are given.
 * @param {int} [customOptions.perPage] the amount of events to load per page
 * @param {int} [customOptions.page] the page of events to load, paginated by perPage
 * @param {string} [customOptions.search] the string to search by
 * @param {string} [customOptions.group] the group ID to filter by. This only applies when no pagination is given.
 * @param {string} [customOptions.organization] the organization ID to filter by
 *
 * @return {Promise<EventFrogEvent[]>}
 */
module.exports = async function (customOptions) {
    let options = $.extend({
        apiKey: '',
        amount: 0,
        perPage: 0,
        page: 1,
        search: '',
        group: '',
        organization: '',
    }, customOptions);

    let queryArgs = {};

    if (options.search.length > 0) queryArgs = $.extend({q: options.search}, queryArgs);
    if (options.perPage > 0 && options.amount === 0) queryArgs = $.extend({perPage: options.perPage}, queryArgs);
    if (options.page > 0) queryArgs = $.extend({page: options.page}, queryArgs);
    if (options.organization.length) queryArgs = $.extend({orgId: options.organization}, queryArgs);

    const eventFrogLoader = new EventFrogService(options.apiKey);

    let events = await eventFrogLoader.loadEvents(queryArgs);
    if (options.perPage === 0 && options.amount > 0) {
        events = events.filter(event => options.group.length ? event.group.id === options.group : true);
        events = events.slice(0, options.amount);
    }

    return events;
};
