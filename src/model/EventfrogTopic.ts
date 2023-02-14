/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
import {EventfrogModel} from "./EventfrogModel";
import {EventfrogApiModel} from "../api";

export class EventfrogTopic implements EventfrogModel {
    static apiEdge: string = '/rubrics.json';
    public id: string;
    public parentId: string;
    private _title: string;
    public parent: EventfrogTopic | null;

    constructor(data: EventfrogApiModel.Topic) {
        this.id = data.id;
        this.parentId = data.parentId;
        this._title = data.title;
        this.parent = null;
    }

    get title() {
        // TODO #2 - the API does not work like the docs here
        // return EventfrogUtil.getLocalizedString(this._title);
        return this._title;
    }
}
