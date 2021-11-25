const EventfrogResult = require("./EventfrogResult");
const EventfrogLocation = require("../model/EventfrogLocation");
const EventfrogLocationRequest = require("../request/EventfrogLocationRequest");

module.exports = class EventfrogLocationResult extends EventfrogResult {
    /**
     * @param {EventfrogLocationRequest} request
     * @param data
     * @param {int} data.totalNumberOfResources
     * @param {Array} data.locations
     */
    constructor(request, data) {
        super(data.totalNumberOfResources, data.locations.map(i => new EventfrogLocation(i)));

        /**
         * @type {EventfrogLocationRequest}
         */
        this.request = request;
    }

    /**
     * @return {EventfrogLocation[]}
     */
    get datasets() {
        return this._datasets;
    }
}
