import {
    EventfrogEventRequest,
    EventfrogGroupRequest,
    EventfrogLocationRequest,
    EventfrogRequest
} from "../request/EventfrogRequest";
import {EventfrogApiModel, EventfrogApiResult} from "../api";
import {EventfrogEvent} from "../model/EventfrogEvent";
import {EventfrogUtil} from "../util/EventfrogUtil";
import {EventfrogTopic} from "../model/EventfrogTopic";
import {EventfrogGroup} from "../model/EventfrogGroup";
import {EventfrogGroupResult} from "../result/EventfrogGroupResult";
import {EventfrogLocationResult} from "../result/EventfrogLocationResult";
import {EventfrogLocation} from "../model/EventfrogLocation";
import {EventfrogEventResult} from "../result/EventfrogEventResult";

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */

export class EventfrogService {
    private static _base: string = '//api.eventfrog.net/api/v1';

    private _key: string;

    constructor(apiKey: string) {
        console.log('eventfrog-api version 2.1b1');
        this._key = apiKey;
    }

    /**
     * Loads a list of events with given request
     * EventfrogGroup and EventfrogLocation matches are searched for afterwards and matched to the events for more detailed display
     *
     * @see getEvents
     * @see mapLocations
     * @see mapGroups
     */
    async loadEvents(request: EventfrogRequest<EventfrogApiModel.Event>): Promise<EventfrogEvent[]> {
        let eventResult = await this.getEvents(request);
        await this.mapLocations(eventResult.datasets);
        await this.mapGroups(eventResult.datasets);
        return eventResult.datasets;
    }

    /**
     * Maps corresponding locations to events
     *
     * @param events - the list of events to modify
     *
     * TODO load locations in batches if limits are exceeded
     */
    async mapLocations(events: EventfrogEvent[]) {
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
     * @param  events - the list of events to modify
     *
     * TODO load groups in batches if limits are exceeded
     */
    async mapGroups(events: EventfrogEvent[]) {
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
     * @param events - the list of events to modify
     */
    async mapTopics(events: EventfrogEvent[]) {
        const topics = await this.loadTopics();
        const topicsMap = new Map(topics.map(i => [i.id, i]));
        events.forEach(event => {
            event.topic = topicsMap.get(event.topicId);
        });
    }

    async getEvents(request: EventfrogEventRequest) {
        const eventData = await this._get(EventfrogEvent.apiEdge, request);
        return new EventfrogEventResult(eventData);
    }

    async getLocations(request: EventfrogLocationRequest) {
        const locationsData = await this._get(EventfrogLocation.apiEdge, request);
        return new EventfrogLocationResult(locationsData);
    }

    async getGroups(request: EventfrogGroupRequest) {
        const groupData = await this._get(EventfrogGroup.apiEdge, request);
        return new EventfrogGroupResult(groupData);
    }

    /**
     * Loads the list of topics
     * EventfrogTopic parents are mapped to topics if applicable
     *
     * @see getTopics
     * @see mapTopicParents
     */
    async loadTopics() {
        let topics = await this.getTopics();
        this.mapTopicParents(topics);
        return topics;
    }

    async getTopics() {
        const topicData = await this._get(EventfrogTopic.apiEdge, new EventfrogRequest({}));
        return topicData.rubrics.map(i => new EventfrogTopic(i));
    }

    /**
     * Maps corresponding parent topics to topics
     *
     * @param topics - the list of topics to modify
     */
    mapTopicParents(topics: EventfrogTopic[]) {
        const topicMap = new Map(topics.map(i => [i.id, i]));
        topics.forEach(topic => {
            topic.parent = topicMap.get(topic.parentId);
        });
    }

    /**
     * Performs an API query with given request.
     *
     * @param edge - the API edge to use
     * @param request - the request to pass in the AJAX query
     */
    private async _get(edge: string, request: EventfrogRequest<any>): Promise<EventfrogApiResult.Result<any>> {
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
