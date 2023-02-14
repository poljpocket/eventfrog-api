import {EventfrogApiModel} from "../api";
import {EventfrogUtil} from "../util/EventfrogUtil";
import {EventfrogModel} from "./EventfrogModel";

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */

export class EventfrogGroup implements EventfrogModel {
    static apiEdge: string = '/eventgroups.json';
    public id: string;
    public _title: string;
    public link: string;
    private _html: string[];
    public image: EventfrogApiModel.Image[];
    public dateModified: Date;

    constructor(data: EventfrogApiModel.Group) {
        this.id = data.id;
        this._title = data.title;
        this.link = 'https://eventfrog.ch' + data.url;
        this._html = data.descriptionAsHTML;
        this.image = data.imgs;
        this.dateModified = new Date(Date.parse(data.modifyDate));
    }

    /**
     * @returns {string|null}
     */
    get title() {
        // TODO #2 - the API does not work like the docs here
        // return EventfrogUtil.getLocalizedString(this._title);
        return this._title;
    }

    /**
     * @returns {string|null}
     */
    get html() {
        return EventfrogUtil.getLocalizedString(this._html);
    }
}
