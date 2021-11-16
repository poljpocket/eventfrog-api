const EventFrogEvent = require('../entity/EventFrogEvent');
const EventFrogGroup = require('../entity/EventFrogGroup');
const EventFrogLocation = require('../entity/EventFrogLocation');
const EventFrogTopic = require('../entity/EventFrogTopic');

const $ = require('jquery');

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
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
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
     * Maps corresponding topics to events
     * This first loads all topics and maps their parents accordingly
     *
     * @see loadTopics
     *
     * @param {EventFrogEvent[]} events - the list of events to modify
     */
    async mapTopics(events) {
        const topics = await this.loadTopics();
        const topicsMap = new Map(topics.map(i => [i.id, i]));
        events.forEach(event => {
            event.topic = topicsMap.get(event.topicId);
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
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
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
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
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
     * @param {float} [options.r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
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
     * Loads the list of topics
     * EventFrogTopic parents are mapped to topics if applicable
     *
     * @see getTopics
     * @see mapTopicParents
     *
     * @return {Promise<EventFrogTopic[]>}
     */
    async loadTopics() {
        let topics = await this.getTopics();
        this.mapTopicParents(topics);
        return topics;
    }

    /**
     * @return {Promise<EventFrogTopic[]>}
     */
    async getTopics() {
        /** @type {{totalNumberOfResources: int, rubrics: Array}} */
        const topicData = await this._get(EventFrogTopic.apiEdge, {});
        return topicData.rubrics.map(i => new EventFrogTopic(i));
    }

    /**
     * Maps corresponding parent topics to topics
     *
     * @param {EventFrogTopic[]} topics - the list of topics to modify
     */
    mapTopicParents(topics) {
        const topicMap = new Map(topics.map(i => [i.id, i]));
        topics.forEach(topic => {
            topic.parent = topicMap.get(topic.parentId);
        });
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
