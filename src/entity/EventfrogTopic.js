// const EventfrogUtil = require("../util/EventfrogUtil");

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventfrogTopic {
    /**
     * @param data
     * @param {int} data.id
     * @param {int} data.parentId - parent rubric id or 0 if no parent rubric exists
     * @param {string} data.title - TODO #2 - this is wrong by API docs but actually, there is no array here
     */
    constructor(data) {
        /** @type {int} */
        this.id = data.id;

        /** @type {int} */
        this.parentId = data.parentId;

        /**
         * @type {string}
         * @private
         */
        this._title = data.title;

        /**
         * @type {EventfrogTopic|null}
         */
        this.parent = null;
    }

    /**
     * @returns {string|null}
     */
    get title() {
        // TODO #2 - the API does not work like the docs here
        // return EventfrogUtil.getLocalizedString(this._title);
        return this._title;
    }
}

/**
 * @type {string}
 */
EventfrogTopic.apiEdge = '/rubrics.json';

module.exports = EventfrogTopic;
