import {EventfrogApiModel, EventfrogApiResult} from "../../types/api";
import {EventfrogResult} from "./EventfrogResult";
import {EventfrogGroup} from "../model/EventfrogGroup";

export class EventfrogGroupResult extends EventfrogResult<EventfrogGroup> {
    constructor(data: EventfrogApiResult.Result<EventfrogApiModel.Group>) {
        super(data.totalNumberOfResources, data.eventgroups.map(i => new EventfrogGroup(i)));
    }
}
