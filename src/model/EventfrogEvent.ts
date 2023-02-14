import {EventfrogApiModel} from "../../types/api";
import {EventfrogUtil} from "../util/EventfrogUtil";
import {EventfrogLocation} from "./EventfrogLocation";
import {EventfrogGroup} from "./EventfrogGroup";
import {EventfrogTopic} from "./EventfrogTopic";
import {EventfrogModel} from "./EventfrogModel";

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */

export interface EventOrganizer {
    id: string;
    name: string;
    website: string;
    facebook: string;
    twitter: string;
}

export interface EventPresale {
    link: string;
    text: string;
}

export class EventfrogEvent implements EventfrogModel {
    static apiEdge: string = '/events.json';

    public id: string;

    /*
     * external source id if the event was imported from another source an the extSourceId was set, otherwise null
     */
    public externalSourceId: string | null;
    public externalId: string;
    public groupId: string;
    public topicId: string;
    private _title: string[];
    public link: string;

    /*
     * organizer information
     */
    public organizer: EventOrganizer;

    /*
     * presale information, if available
     */
    public presale: EventPresale;

    /*
     * event image, if available
     */
    public image: EventfrogApiModel.Image | null;
    public startDate: Date;
    public endDate: Date;

    /*
     * event cancellation status
     */
    public cancelled: boolean;

    /*
     * event visibility
     */
    public visible: boolean;

    /*
     * event publish status
     */
    public published: boolean;

    /*
     * agenda only event identifier, agenda only events do not have tickets
     */
    public agendaOnly: boolean;

    /*
     * first location id
     *
     * TODO #1 - extend api implementation to allow multiple locations
     */
    public locationId: string | null;
    public dateModified: Date;
    private _summary: string[];
    public _html: string[];
    public location: EventfrogLocation | null = null;
    public group: EventfrogGroup | null = null;
    public topic: EventfrogTopic | null = null;

    constructor(data: EventfrogApiModel.Event) {
        this.id = data.id;
        this.externalSourceId = data.extSrcId;
        this.externalId = data.extId;
        this.groupId = data.groupId;
        this.topicId = data.rubricId;
        this._title = data.title;
        this.link = data.url;
        this.organizer = {
            id: data.organizerId,
            name: data.organizerName,
            website: data.websiteUrl,
            facebook: data.facebookUrl,
            twitter: data.twitterUrl,
        };
        this.presale = {
            link: data.presaleLink,
            text: data.presaleText,
        }
        this.image = data.emblemToShow;
        this.startDate = new Date(Date.parse(data.begin));
        this.endDate = new Date(Date.parse(data.end));
        this.cancelled = data.cancelled;
        this.visible = data.visible;
        this.published = data.published;
        this.agendaOnly = data.agendaEntryOnly;
        this.locationId = data.locationIds.length ? data.locationIds[0] : null;
        this.dateModified = new Date(Date.parse(data.modifyDate));
        this._summary = data.shortDescription;
        this._html = data.descriptionAsHTML;
    }

    /**
     * @returns {string|null}
     */
    get title() {
        return EventfrogUtil.getLocalizedString(this._title);
    }

    /**
     * @returns {string|null}
     */
    get summary() {
        return EventfrogUtil.getLocalizedString(this._summary);
    }

    /**
     * @returns {string|null}
     */
    get html() {
        return EventfrogUtil.getLocalizedString(this._html);
    }
}
