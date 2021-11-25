const EventfrogEvent = require('../model/EventfrogEvent');
const EventfrogGroup = require('../model/EventfrogGroup');
const EventfrogLocation = require('../model/EventfrogLocation');
const EventfrogTopic = require('../model/EventfrogTopic');
const EventfrogUtil = require('../util/EventfrogUtil');

const EventfrogEventResult = require('../result/EventfrogEventResult');
const EventfrogLocationResult = require("../result/EventfrogLocationResult");
const EventfrogGroupResult = require("../result/EventfrogGroupResult");
const EventfrogEventRequest = require("../request/EventfrogEventRequest");
const EventfrogGroupRequest = require("../request/EventfrogGroupRequest");
const EventfrogLocationRequest = require("../request/EventfrogLocationRequest");

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
     * Loads a list of events with given request
     * EventfrogGroup and EventfrogLocation matches are searched for afterwards and matched to the events for more detailed display
     *
     * @see getEvents
     * @see mapLocations
     * @see mapGroups
     *
     * @param {EventfrogEventRequest} request
     *
     * @return {Promise<EventfrogEventResult>}
     */
    async loadEvents(request) {
        let eventResult = await this.getEvents(request);
        await this.mapLocations(eventResult.datasets);
        await this.mapGroups(eventResult.datasets);
        return eventResult;
    }

    /**
     * Maps corresponding locations to events
     *
     * @param {EventfrogEvent[]} events - the list of events to modify
     *
     * TODO load locations in batches if limits are exceeded
     */
    async mapLocations(events) {
        const locationIds = new Set(events.map(e => e.locationId));
        const locations = await this.getLocations(new EventfrogLocationRequest({id: [...locationIds]}));
        const locationMap = new Map(locations.datasets.map(i => [i.id, i]));
        events.forEach(event => {
            event.location = locationMap.get(event.locationId);
        });
    }

    /**
     * Maps corresponding groups to events
     *
     * @param {EventfrogEvent[]} events - the list of events to modify
     *
     * TODO load groups in batches if limits are exceeded
     */
    async mapGroups(events) {
        const groupIds = new Set(events.map(e => e.groupId));
        const groupResult = await this.getGroups(new EventfrogGroupRequest({groupId: [...groupIds]}));
        const groupMap = new Map(groupResult.datasets.map(i => [i.id, i]));
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
     * Returns a list of events with given request
     *
     * @param {EventfrogEventRequest} request
     *
     * @return {Promise<EventfrogEventResult>}
     */
    async getEvents(request) {
        const eventData = await this._get(EventfrogEvent.apiEdge, request);
        return new EventfrogEventResult(request, eventData);
    }

    /**
     * @param {EventfrogLocationRequest} request
     *
     * @return {Promise<EventfrogLocationResult>}
     */
    async getLocations(request) {
        const locationsData = await this._get(EventfrogLocation.apiEdge, request);
        return new EventfrogLocationResult(request, locationsData);
    }

    /**
     * @param {EventfrogGroupRequest} request
     *
     * @return {Promise<EventfrogGroupResult>}
     */
    async getGroups(request) {
        const groupData = await this._get(EventfrogGroup.apiEdge, request);
        return new EventfrogGroupResult(request, groupData);
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
     * Performs an API query with given request.
     *
     * @private
     *
     * @param {string} edge - the API edge to use
     * @param {EventfrogRequest} request - the request to pass in the AJAX query
     *
     * @return {Promise}
     */
    async _get(edge, request) {
        const params = EventfrogUtil.getSearchParams(request.options);
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
