import {EventfrogApiModel, EventfrogApiResult} from "../../types/api";
import {EventfrogResult} from "./EventfrogResult";
import {EventfrogLocation} from "../model/EventfrogLocation";

export class EventfrogLocationResult extends EventfrogResult<EventfrogLocation> {
    constructor(data: EventfrogApiResult.Result<EventfrogApiModel.Location>) {
        super(data.totalNumberOfResources, data.locations.map(i => new EventfrogLocation(i)));
    }
}
