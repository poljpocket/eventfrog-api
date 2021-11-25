const EventfrogResult = require("./EventfrogResult");
const EventfrogGroup = require("../model/EventfrogGroup");
const EventfrogGroupRequest = require("../request/EventfrogGroupRequest");

module.exports = class EventfrogGroupResult extends EventfrogResult {
    /**
     * @param {EventfrogGroupRequest} request
     * @param data
     * @param {int} data.totalNumberOfResources
     * @param {Array} data.eventgroups
     */
    constructor(request, data) {
        super(data.totalNumberOfResources, data.eventgroups.map(i => new EventfrogGroup(i)));

        /**
         * @type {EventfrogGroupRequest}
         */
        this.request = request;
    }

    /**
     * @return {EventfrogGroup[]}
     */
    get datasets() {
        return this._datasets;
    }
}
