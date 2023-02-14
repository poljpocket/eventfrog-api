import {EventfrogApiModel, EventfrogApiResult} from "../api.js";
import {EventfrogResult} from "./EventfrogResult";
import {EventfrogEvent} from "../model/EventfrogEvent";

export class EventfrogEventResult extends EventfrogResult<EventfrogEvent> {
    constructor(data: EventfrogApiResult.Result<EventfrogApiModel.Event>) {
        super(data.totalNumberOfResources, data.events.map(i => new EventfrogEvent(i)));
    }
}
