const EventfrogService = require('./service/EventfrogService');
const EventfrogEventRequest = require("./request/EventfrogEventRequest");
const EventfrogLocationRequest = require("./request/EventfrogLocationRequest");
const EventfrogGroupRequest = require("./request/EventfrogGroupRequest");

const $ = require('jquery');

/**
 * @param {string} key
 * @return {EventfrogService}
 */
const jQueryEventfrogService = function (key) {
    return new EventfrogService(key);
}

/**
 * @param {EventfrogEventRequestOptions} options
 * @return {EventfrogEventRequest}
 */
const jQueryEventfrogEventRequest = function (options) {
    return new EventfrogEventRequest(options);
}

/**
 * @param {EventfrogLocationRequestOptions} options
 * @return {EventfrogLocationRequest}
 */
const jQueryEventfrogLocationRequest = function (options) {
    return new EventfrogLocationRequest(options);
}

/**
 * @param {EventfrogGroupRequestOptions} options
 * @return {EventfrogGroupRequest}
 */
const jQueryEventfrogGroupRequest = function (options) {
    return new EventfrogGroupRequest(options);
}

$.extend({
    EventfrogService: jQueryEventfrogService,
    EventfrogEventRequest: jQueryEventfrogEventRequest,
    EventfrogGroupRequest: jQueryEventfrogGroupRequest,
    EventfrogLocationRequest: jQueryEventfrogLocationRequest,
});
