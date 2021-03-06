const EventfrogUtil = require("../util/EventfrogUtil");

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventfrogGroup {
    /**
     * @param data
     * @param {string} data.id
     * @param {string} data.title - TODO #2 - this is wrong by API docs but actually, there is no array here
     * @param {string} data.url - on eventfrog.ch
     * @param {string[]} data.descriptionAsHTML - localized strings in array ('de', ...), unlimited max length, contains encoded HTML
     * @param {{url: string, width: int, height: int}[]} data.imgs - location images if available
     * @param {string} data.modifyDate - ISO 8601
     */
    constructor(data) {
        /** @type {string} */
        this.id = data.id;

        /**
         * @type {string}
         * @private
         */
        this._title = data.title;

        /** @type {string} */
        this.link = 'https://eventfrog.ch' + data.url;

        /**
         * @type {string[]}
         * @private
         */
        this._html = data.descriptionAsHTML;

        /**
         * group images
         * @type {{url: string, width: int, height: int}[]}
         */
        this.image = data.imgs;

        /** @type {Date} */
        this.dateModified = new Date(Date.parse(data.modifyDate));
    }

    /**
     * @returns {string|null}
     */
    get title() {
        // TODO #2 - the API does not work like the docs here
        // return EventfrogUtil.getLocalizedString(this._title);
        return this._title;
    }

    /**
     * @returns {string|null}
     */
    get html() {
        return EventfrogUtil.getLocalizedString(this._html);
    }
}

/**
 * @type {string}
 */
EventfrogGroup.apiEdge = '/eventgroups.json';

module.exports = EventfrogGroup;
