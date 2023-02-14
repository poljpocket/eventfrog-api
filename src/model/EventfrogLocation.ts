import {EventfrogApiModel} from "../../types/api";
import {EventfrogUtil} from "../util/EventfrogUtil";
import {EventfrogModel} from "./EventfrogModel";

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */

export interface LocationOrganizer {
    website: string;
    facebook: string;
    twitter: string;
}

export class EventfrogLocation implements EventfrogModel {
    static apiEdge: string = '/locations.json';
    public id: string;
    private _title: string[];
    public link: string;
    private _html: string[];
    public image: EventfrogApiModel.Image;
    public address: string;
    public zip: string;
    public city: string;
    public latitude: number;
    public longitude: number;
    public organizer: LocationOrganizer;
    public dateModified: Date;

    constructor(data: EventfrogApiModel.Location) {
        this.id = data.id;
        this._title = data.title;
        this.link = data.url;
        this._html = data.descriptionAsHTML;
        this.image = data.img;
        this.address = data.addressLine;
        this.zip = data.zip;
        this.city = data.city;
        this.latitude = data.lat;
        this.longitude = data.lng;
        this.organizer = {
            website: data.websiteUrl,
            facebook: data.facebookUrl,
            twitter: data.twitterUrl,
        };
        this.dateModified = new Date(Date.parse(data.modifyDate));
    }

    get title() {
        return EventfrogUtil.getLocalizedString(this._title);
    }

    get html() {
        return EventfrogUtil.getLocalizedString(this._html);
    }
}
