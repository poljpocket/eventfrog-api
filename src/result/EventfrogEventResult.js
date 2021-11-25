const EventfrogResult = require("./EventfrogResult");
const EventfrogEvent = require("../model/EventfrogEvent");
const EventfrogEventRequest = require("../request/EventfrogEventRequest");

module.exports = class EventfrogEventResult extends EventfrogResult {
    /**
     * @param {EventfrogEventRequest} request
     * @param data
     * @param {int} data.totalNumberOfResources
     * @param {Array} data.events
     */
    constructor(request, data) {
        super(data.totalNumberOfResources, data.events.map(i => new EventfrogEvent(i)));

        /**
         * @type {EventfrogEventRequest}
         */
        this.request = request;
    }

    /**
     * @return {EventfrogEvent[]}
     */
    get datasets() {
        return this._datasets;
    }
}
