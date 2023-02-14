import {EventfrogApiRequest} from "../../types/api";

export class EventfrogRequest<T extends EventfrogApiRequest.Request> {
    public options: EventfrogApiRequest.Request;

    constructor(options: T) {
        this.options = {
            page: 1,
            perPage: 100,
        };

        Object.assign(this.options, {...options});
    }

    /**
     * Update request to return the next page when passing to a Service again.
     */
    nextPage() {
        this.options.page += 1;
    }

    /**
     * Decides if next page is available based on a given total amount.
     *
     * @param {int} totalAmount
     * @return {boolean}
     */
    hasNextPage(totalAmount) {
        return totalAmount > this.options.perPage * this.options.page;
    }
}

export class EventfrogEventRequest extends EventfrogRequest<EventfrogApiRequest.Events> {}
export class EventfrogLocationRequest extends EventfrogRequest<EventfrogApiRequest.Locations> {}
export class EventfrogGroupRequest extends EventfrogRequest<EventfrogApiRequest.Groups> {}
