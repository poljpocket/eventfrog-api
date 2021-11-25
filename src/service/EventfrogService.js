const EventfrogEvent = require('../entity/EventfrogEvent');
const EventfrogGroup = require('../entity/EventfrogGroup');
const EventfrogLocation = require('../entity/EventfrogLocation');
const EventfrogTopic = require('../entity/EventfrogTopic');
const EventfrogUtil = require('../util/EventfrogUtil');

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventfrogService {
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
     * EventfrogGroup and EventfrogLocation matches are searched for afterwards and matched to the events for more detailed display
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
     * @param {int|int[]} [options.rubId] - rubricids
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
     * @param {EventfrogEvent[]} events - the list of events to modify
     */
    async mapLocations(events) {
        const locationIds = new Set(events.map(e => e.locationId));
        const locations = await this.getLocations({id: [...locationIds]});
        const locationMap = new Map(locations.map(i => [i.id, i]));
        events.forEach(event => {
            event.location = locationMap.get(event.locationId);
        });
    }

    /**
     * Maps corresponding groups to events
     *
     * @param {EventfrogEvent[]} events - the list of events to modify
     */
    async mapGroups(events) {
        const groupIds = new Set(events.map(e => e.groupId));
        const groupData = await this.getGroups({groupId: [...groupIds]});
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
     * @param {EventfrogEvent[]} events - the list of events to modify
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
     * @param {int|int[]} [options.rubId] - rubricids
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
     * @return {Promise<EventfrogEvent[]>}
     */
    async getEvents(options) {
        /** @type {{totalNumberOfResources: int, events: Array}} */
        const eventData = await this._get(EventfrogEvent.apiEdge, options);
        return eventData.events.map(i => new EventfrogEvent(i));
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
     * @return {Promise<EventfrogLocation[]>}
     */
    async getLocations(options) {
        /** @type {{totalNumberOfResources: int, locations: Array}} */
        const locationsData = await this._get(EventfrogLocation.apiEdge, options);
        return locationsData.locations.map(element => new EventfrogLocation(element));
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
     * @return {Promise<EventfrogGroup[]>}
     */
    async getGroups(options) {
        /** @type {{totalNumberOfResources: int, eventgroups: Array}} */
        const groupData = await this._get(EventfrogGroup.apiEdge, options);
        return groupData.eventgroups.map(i => new EventfrogGroup(i));
    }

    /**
     * Loads the list of topics
     * EventfrogTopic parents are mapped to topics if applicable
     *
     * @see getTopics
     * @see mapTopicParents
     *
     * @return {Promise<EventfrogTopic[]>}
     */
    async loadTopics() {
        let topics = await this.getTopics();
        this.mapTopicParents(topics);
        return topics;
    }

    /**
     * @return {Promise<EventfrogTopic[]>}
     */
    async getTopics() {
        /** @type {{totalNumberOfResources: int, rubrics: Array}} */
        const topicData = await this._get(EventfrogTopic.apiEdge, {});
        return topicData.rubrics.map(i => new EventfrogTopic(i));
    }

    /**
     * Maps corresponding parent topics to topics
     *
     * @param {EventfrogTopic[]} topics - the list of topics to modify
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
    async _get(edge, options) {
        const params = EventfrogUtil.getSearchParams(options);
        params.append('apiKey', this._key);
        const url = `${EventfrogService._base}${edge}?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
        });
        if (!response.ok) return Promise.reject('Request returned ' + response.status);
        const data = await response.json();
        return Promise.resolve(data);
    }
}

/**
 * @type {string}
 */
EventfrogService._base = '//api.eventfrog.net/api/v1';

module.exports = EventfrogService;
