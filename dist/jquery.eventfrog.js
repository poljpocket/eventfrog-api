(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
const EventFrogService = require('./service/EventFrogService');

const $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

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

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./service/EventFrogService":6}],2:[function(require,module,exports){
const I18nUtils = require('../util/EventFrogUtil');

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogEvent {
    /**
     * @param data
     * @param {string} data.id
     * @param {string|null} data.extSrcId - external source id if the event was imported from another source an the extSourceId was set, otherwise null
     * @param {string|null} data.extId - external id if the event was imported from another source
     * @param {string} data.groupId - 0 or null if event is not in a group
     * @param {int} data.rubricId
     * @param {string[]} data.title - localized strings in array ('de', ...), max 255 characters
     * @param {string} data.url
     * @param {string} data.organizerId
     * @param {string} data.organizerName
     * @param {string} data.websiteUrl
     * @param {string} data.facebookUrl
     * @param {string} data.twitterUrl
     * @param {string} data.presaleLink - url for ticketing
     * @param {string} data.presaleText
     * @param {{url: string, width: int, height: int}|null} data.emblemToShow - event image if available, otherwise null
     * @param {string} data.begin - ISO 8601
     * @param {string} data.end - ISO 8601
     * @param {boolean} data.cancelled
     * @param {boolean} data.visible
     * @param {boolean} data.published
     * @param {boolean} data.agendaEntryOnly
     * @param {string[]} data.locationIds
     * @param {string} data.modifyDate - ISO 8601
     * @param {string[]} data.shortDescription - localized strings in array ('de', ...), max 255 characters
     * @param {string[]} data.descriptionAsHTML - localized strings in array ('de', ...), unlimited max length, contains encoded HTML
     */
    constructor(data) {
        /** @type {string} */
        this.id = data.id;

        /**
         * external source id if the event was imported from another source an the extSourceId was set, otherwise null
         * @type {string|null}
         */
        this.externalSourceId = data.extSrcId;

        /** @type {string} */
        this.externalId = data.extId;

        /** @type {string} */
        this.groupId = data.groupId;

        /** @type {int} */
        this.topic = data.rubricId;

        /**
         * @type {string[]}
         * @private
         */
        this._title = data.title;

        /** @type {string} */
        this.link = data.url;

        /**
         * organizer information
         * @type {{website: string, twitter: string, facebook: string, name: string, id: string}}
         */
        this.organizer = {
            id: data.organizerId,
            name: data.organizerName,
            website: data.websiteUrl,
            facebook: data.facebookUrl,
            twitter: data.twitterUrl,
        };

        /**
         * presale information, if available
         * @type {{link: string, text: string}}
         */
        this.presale = {
            link: data.presaleLink,
            text: data.presaleText,
        }

        /**
         * event image, if available
         * @type {{url: string, width: int, height: int}|null}
         */
        this.image = data.emblemToShow;

        /** @type {Date} */
        this.startDate = new Date(Date.parse(data.begin));

        /** @type {Date} */
        this.endDate = new Date(Date.parse(data.end));

        /**
         * event cancellation status
         * @type {boolean}
         */
        this.cancelled = data.cancelled;

        /**
         * event visibility
         * @type {boolean}
         */
        this.visible = data.visible;

        /**
         * event publish status
         * @type {boolean}
         */
        this.published = data.published;

        /**
         * agenda only event identifier, agenda only events do not have tickets
         * @type {boolean}
         */
        this.agendaOnly = data.agendaEntryOnly;

        /**
         * first location id
         *
         * TODO extend api implementation to allow multiple locations
         *
         * @type {string|null}
         */
        this.locationId = data.locationIds.length ? data.locationIds[0] : null;

        /** @type {Date} */
        this.dateModified = new Date(Date.parse(data.modifyDate));

        /**
         * @type {string[]}
         * @private
         */
        this._summary = data.shortDescription;

        /**
         * @type {string[]}
         * @private
         */
        this._html = data.descriptionAsHTML;

        /**
         * @type {EventFrogLocation|null}
         */
        this.location = null;

        /**
         * @type {EventFrogGroup|null}
         */
        this.group = null;
    }

    /**
     * @returns {string|null}
     */
    get title() {
        return I18nUtils.getLocalizedString(this._title);
    }

    /**
     * @returns {string|null}
     */
    get summary() {
        return I18nUtils.getLocalizedString(this._summary);
    }

    /**
     * @returns {string|null}
     */
    get html() {
        return I18nUtils.getLocalizedString(this._html);
    }
}

/**
 * @type {string}
 */
EventFrogEvent.apiEdge = '/events.json';

module.exports = EventFrogEvent;

},{"../util/EventFrogUtil":7}],3:[function(require,module,exports){
const I18nUtils = require("../util/EventFrogUtil");

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogGroup {
    /**
     * @param data
     * @param {string} data.id
     * @param {string} data.title - TODO this is wrong by API docs but actually, there is no array here
     * @param {string} data.url - on eventfrog.ch
     * @param {string[]} data.descriptionAsHTML - localized strings in array ('de', ...), unlimited max length, contains encoded HTML
     * @param {{url: string, width: int, height: int}[]} data.imgs - location images if available
     * @param {string} data.modifyDate - ISO 8601
     */
    constructor(data) {
        /** @type {string} */
        this.id = data.id;

        /**
         * @type {string}
         * @private
         */
        this._title = data.title;

        /** @type {string} */
        this.link = 'https://eventfrog.ch' + data.url;

        /**
         * @type {string[]}
         * @private
         */
        this._html = data.descriptionAsHTML;

        /**
         * group images
         * @type {{url: string, width: int, height: int}[]}
         */
        this.image = data.imgs;

        /** @type {Date} */
        this.dateModified = new Date(Date.parse(data.modifyDate));
    }

    /**
     * @returns {string|null}
     */
    get title() {
        // TODO the API does not work like the docs here
        // return I18nUtils.getLocalizedString(this._title);
        return this._title;
    }

    /**
     * @returns {string|null}
     */
    get html() {
        return I18nUtils.getLocalizedString(this._html);
    }
}

/**
 * @type {string}
 */
EventFrogGroup.apiEdge = '/eventgroups.json';

module.exports = EventFrogGroup;

},{"../util/EventFrogUtil":7}],4:[function(require,module,exports){
const I18nUtils = require('../util/EventFrogUtil');

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogLocation {
    /**
     * @param data
     * @param {string} data.id
     * @param {string[]} data.title
     * @param {string} data.url - on eventfrog.ch
     * @param {string[]} data.descriptionAsHTML - localized strings in array ('de', ...), unlimited max length, contains encoded HTML
     * @param {{url: string, width: int, height: int}|null} data.img - location image if available, otherwise null
     * @param {string} data.addressLine
     * @param {string} data.zip
     * @param {string} data.city
     * @param {float} data.lat
     * @param {float} data.lng
     * @param {string} data.websiteUrl
     * @param {string} data.facebookUrl
     * @param {string} data.twitterUrl
     * @param {string} data.modifyDate - ISO 8601
     */
    constructor(data) {
        /** @type {string} */
        this.id = data.id;

        /**
         * @type {string[]}
         * @private
         */
        this._title = data.title;

        /** @type {string} */
        this.link = data.url;

        /**
         * @type {string[]}
         * @private
         */
        this._html = data.descriptionAsHTML;

        /**
         * location image, if available
         * @type {{url: string, width: int, height: int}|null}
         */
        this.image = data.img;

        /** @type {string} */
        this.address = data.addressLine;

        /** @type {string} */
        this.zip = data.zip;

        /** @type {string} */
        this.city = data.city;

        /**
         * @type {float}
         */
        this.latitude = data.lat;

        /**
         * @type {float}
         */
        this.longitude = data.lng;

        /**
         * location information
         * @type {{website: string, twitter: string, facebook: string}}
         */
        this.organizer = {
            website: data.websiteUrl,
            facebook: data.facebookUrl,
            twitter: data.twitterUrl,
        };

        /** @type {Date} */
        this.dateModified = new Date(Date.parse(data.modifyDate));
    }

    /**
     * @returns {string|null}
     */
    get title() {
        return I18nUtils.getLocalizedString(this._title);
    }

    /**
     * @returns {string|null}
     */
    get html() {
        return I18nUtils.getLocalizedString(this._html);
    }
}

/**
 * @type {string}
 */
EventFrogLocation.apiEdge = '/locations.json';

module.exports = EventFrogLocation;

},{"../util/EventFrogUtil":7}],5:[function(require,module,exports){
const EventFrog = require('./EventFrog');

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
        efapi: jQueryEventFrogPromise
    });
})(jQuery);

},{"./EventFrog":1}],6:[function(require,module,exports){
(function (global){(function (){
const EventFrogEvent = require('../entity/EventFrogEvent.js');
const EventFrogGroup = require('../entity/EventFrogGroup.js');
const EventFrogLocation = require('../entity/EventFrogLocation.js');

const $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogService {
    /**
     * @param {string} apiKey
     */
    constructor(apiKey) {
        /**
         * @type {string}
         * @private
         */
        this._key = apiKey;
    }

    /**
     * Loads a list of events with given options
     * EventFrogGroup and EventFrogLocation matches are searched for afterwards and matched to the events for more detailed display
     *
     * @see getEvents
     * @see mapLocations
     * @see mapGroups
     *
     * @param options
     * @param {string} [options.q] - Der Suchbegriff
     * @param {string|string[]} [options.id] - Event-Id, nur Events mit dieser/n Id/s werden gefunden
     * @param {boolean} [options.excludeLocs] - Die bei locId angegebenen Locations sollen ausgeschlossen werden
     * @param {boolean} [options.excludeOrgs] - Die bei orgId angegebenen Organizers sollen ausgeschlossen werden
     * @param {boolean} [options.excludeRubrics] - Die bei rubId angegebenen Organizers sollen ausgeschlossen werden
     * @param {boolean} [options.excludeExtSrcIds] - Die bei extSourceId angegebenen externen Source-Ids sollen ausgeschlossen werden
     * @param {string|string[]} [options.locId] - locationIds
     * @param {string|string[]} [options.orgId] - organizerIds
     * @param {string|string[]} [options.rubId] - rubricids
     * @param {string|string[]} [options.extSrcId] - extSourceIds
     * @param {string|string[]} [options.zip] - PLZ, nur Events mit dieser/n PLZs werden gefunden
     * @param {float} [options.lat] - Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
     * @param {float} [options.lng] - Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lng und r verwendbar)
     * @param {string} [options.from] - dd.MM.YYYY, nur Events die ab diesem Datum stattfinden sollen zurückgegeben werden
     * @param {string} [options.to] - dd.MM.YYYY, nur Events die bis zu diesem Datum stattfinden sollen zurückgegeben werden
     * @param {string} [options.modifiedSince] - dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
     * @param {int} [options.perPage] - default 100, gibt an, wieviele Events zurückgegeben werden sollen
     * @param {int} [options.page] - Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage)
     * @param {boolean} [options.stream] - true = nur nach Live-Streamingevents suchen; false = nur nach Events suchen, die kein Live-Streaming haben
     * @param {boolean} [options.withOwnHiddens] - true = Es wird auch in den eigenen versteckten Events gesucht (Erfasser der Events = Besitzer des APIKeys)
     */
    async loadEvents(options) {
        let events = await this.getEvents(options);
        await this.mapLocations(events);
        await this.mapGroups(events);
        return events;
    }

    /**
     * Maps corresponding locations to events
     *
     * @param {EventFrogEvent[]} events - the list of events to modify
     */
    async mapLocations(events) {
        const locationIds = new Set(events.map(e => e.locationId));
        const locations = await this.getLocationsByIds([...locationIds]);
        const locationMap = new Map(locations.map(i => [i.id, i]));
        events.forEach(event => {
            event.location = locationMap.get(event.locationId);
        });
    }

    /**
     * Maps corresponding groups to events
     *
     * @param {EventFrogEvent[]} events - the list of events to modify
     */
    async mapGroups(events) {
        const groupIds = new Set(events.map(e => e.groupId));
        const groupData = await this.getGroupsByIds([...groupIds]);
        const groupMap = new Map(groupData.map(i => [i.id, i]));
        events.forEach(event => {
            event.group = groupMap.get(event.groupId);
        });
    }

    /**
     * Returns a list of events with given options
     *
     * @param options
     * @param {string} [options.q] - Der Suchbegriff
     * @param {string|string[]} [options.id] - Event-Id, nur Events mit dieser/n Id/s werden gefunden
     * @param {boolean} [options.excludeLocs] - Die bei locId angegebenen Locations sollen ausgeschlossen werden
     * @param {boolean} [options.excludeOrgs] - Die bei orgId angegebenen Organizers sollen ausgeschlossen werden
     * @param {boolean} [options.excludeRubrics] - Die bei rubId angegebenen Organizers sollen ausgeschlossen werden
     * @param {boolean} [options.excludeExtSrcIds] - Die bei extSourceId angegebenen externen Source-Ids sollen ausgeschlossen werden
     * @param {string|string[]} [options.locId] - locationIds
     * @param {string|string[]} [options.orgId] - organizerIds
     * @param {string|string[]} [options.rubId] - rubricids
     * @param {string|string[]} [options.extSrcId] - extSourceIds
     * @param {string|string[]} [options.zip] - PLZ, nur Events mit dieser/n PLZs werden gefunden
     * @param {float} [options.lat] - Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
     * @param {float} [options.lng] - Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lng und r verwendbar)
     * @param {string} [options.from] - dd.MM.YYYY, nur Events die ab diesem Datum stattfinden sollen zurückgegeben werden
     * @param {string} [options.to] - dd.MM.YYYY, nur Events die bis zu diesem Datum stattfinden sollen zurückgegeben werden
     * @param {string} [options.modifiedSince] - dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
     * @param {int} [options.perPage] - default 100, gibt an, wieviele Events zurückgegeben werden sollen
     * @param {int} [options.page] - Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage)
     * @param {boolean} [options.stream] - true = nur nach Live-Streamingevents suchen; false = nur nach Events suchen, die kein Live-Streaming haben
     * @param {boolean} [options.withOwnHiddens] - true = Es wird auch in den eigenen versteckten Events gesucht (Erfasser der Events = Besitzer des APIKeys)
     *
     * @return {Promise<EventFrogEvent[]>}
     */
    async getEvents(options) {
        /** @type {{totalNumberOfResources: int, events: Array}} */
        const eventData = await this._get(EventFrogEvent.apiEdge, options);
        return eventData.events.map(i => new EventFrogEvent(i));
    }

    /**
     * @param options
     * @param {string|string[]} [options.id] - location-Ids
     * @param {float} [options.lat] - Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
     * @param {float} [options.lng] - Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lng und r verwendbar)
     * @param {string|string[]} [options.zip] - PLZ, nur Events mit dieser/n PLZs werden gefunden
     * @param {string} [options.modifiedSince] - dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
     * @param {int} [options.perPage] - default 100, gibt an, wieviele Events zurückgegeben werden sollen
     * @param {int} [options.page] - Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage)
     *
     * @return {Promise<EventFrogLocation[]>}
     */
    async getLocations(options) {
        /** @type {{totalNumberOfResources: int, locations: Array}} */
        const locationsData = await this._get(EventFrogLocation.apiEdge, options);
        return locationsData.locations.map(element => new EventFrogLocation(element));
    }

    /**
     * @param {string|string[]} [ids] - location-Ids
     *
     * @return {Promise<EventFrogLocation[]>}
     */
    async getLocationsByIds(ids) {
        return this.getLocations({id: ids});
    }

    /**
     * @param options
     * @param {string|string[]} [options.groupId] - eventgroup-Ids
     * @param {float} [options.lat] - Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
     * @param {float} [options.lng] - Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lng und r verwendbar)
     * @param {string|string[]} [options.zip] - PLZ, nur Events mit dieser/n PLZs werden gefunden
     * @param {string} [options.modifiedSince] - dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
     * @param {int} [options.perPage] - default 100, gibt an, wieviele Events zurückgegeben werden sollen
     * @param {int} [options.page] - Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage)
     *
     * @return {Promise<EventFrogGroup[]>}
     */
    async getGroups(options) {
        /** @type {{totalNumberOfResources: int, eventgroups: Array}} */
        const groupData = await this._get(EventFrogGroup.apiEdge, options);
        return groupData.eventgroups.map(i => new EventFrogGroup(i));
    }

    /**
     * @param {string[]} ids - list of integers the ID(s) of groups to load
     *
     * @return {Promise<EventFrogGroup[]>}
     */
    async getGroupsByIds(ids) {
        return this.getGroups({groupId: ids});
    }

    /**
     * Performs an API query with given options.
     *
     * @private
     *
     * @param {string} edge - the API edge to use
     * @param options - the options to pass in the AJAX query
     *
     * @return {Promise}
     */
    _get(edge, options) {
        options.apiKey = this._key;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: EventFrogService._base + edge,
                method: 'GET',
                data: options,
                success: resolve,
                error: reject,
                traditional: true,
            });
        });
    }
}

/**
 * @type {string}
 */
EventFrogService._base = '//api.eventfrog.net/api/v1';

module.exports = EventFrogService;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../entity/EventFrogEvent.js":2,"../entity/EventFrogGroup.js":3,"../entity/EventFrogLocation.js":4}],7:[function(require,module,exports){
/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogUtil {
    /**
     * Returns the localized version of a dictionary of locale-value pairs
     * returns the first found locale if preferred is not available
     * returns null if no locales provided
     *
     * @param {string[]} versions the dictionary of
     * @param {string} preferredLocale short language string of the preferred locale
     *
     * @return {string|null} the value in the preferred locale, or the first found. null if no locales provided.
     */
    static getLocalizedString(versions, preferredLocale = 'de') {
        if (Object.keys(versions).length) {
            if (preferredLocale in versions) return versions[preferredLocale];
            return versions[Object.keys(versions)[0]];
        }
        return null;
    }
}

module.exports = EventFrogUtil;

},{}]},{},[5]);
