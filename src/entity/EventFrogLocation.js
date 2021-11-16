const EventFrogUtil = require('../util/EventFrogUtil');

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogLocation {
    /**
     * @param data
     * @param {string} data.id
     * @param {string[]} data.title
     * @param {string} data.url - on eventfrog.ch
     * @param {string[]} data.descriptionAsHTML - localized strings in array ('de', ...), unlimited max length, contains encoded HTML
     * @param {{url: string, width: int, height: int}|null} data.img - location image if available, otherwise null
     * @param {string} data.addressLine
     * @param {string} data.zip
     * @param {string} data.city
     * @param {float} data.lat
     * @param {float} data.lng
     * @param {string} data.websiteUrl
     * @param {string} data.facebookUrl
     * @param {string} data.twitterUrl
     * @param {string} data.modifyDate - ISO 8601
     */
    constructor(data) {
        /** @type {string} */
        this.id = data.id;

        /**
         * @type {string[]}
         * @private
         */
        this._title = data.title;

        /** @type {string} */
        this.link = data.url;

        /**
         * @type {string[]}
         * @private
         */
        this._html = data.descriptionAsHTML;

        /**
         * location image, if available
         * @type {{url: string, width: int, height: int}|null}
         */
        this.image = data.img;

        /** @type {string} */
        this.address = data.addressLine;

        /** @type {string} */
        this.zip = data.zip;

        /** @type {string} */
        this.city = data.city;

        /**
         * @type {float}
         */
        this.latitude = data.lat;

        /**
         * @type {float}
         */
        this.longitude = data.lng;

        /**
         * location information
         * @type {{website: string, twitter: string, facebook: string}}
         */
        this.organizer = {
            website: data.websiteUrl,
            facebook: data.facebookUrl,
            twitter: data.twitterUrl,
        };

        /** @type {Date} */
        this.dateModified = new Date(Date.parse(data.modifyDate));
    }

    /**
     * @returns {string|null}
     */
    get title() {
        return EventFrogUtil.getLocalizedString(this._title);
    }

    /**
     * @returns {string|null}
     */
    get html() {
        return EventFrogUtil.getLocalizedString(this._html);
    }
}

/**
 * @type {string}
 */
EventFrogLocation.apiEdge = '/locations.json';

module.exports = EventFrogLocation;
