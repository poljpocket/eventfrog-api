// const EventFrogUtil = require("../util/EventFrogUtil");

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogTopic {
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
         * @type {EventFrogTopic|null}
         */
        this.parent = null;
    }

    /**
     * @returns {string|null}
     */
    get title() {
        // TODO #2 - the API does not work like the docs here
        // return EventFrogUtil.getLocalizedString(this._title);
        return this._title;
    }
}

/**
 * @type {string}
 */
EventFrogTopic.apiEdge = '/rubrics.json';

module.exports = EventFrogTopic;
