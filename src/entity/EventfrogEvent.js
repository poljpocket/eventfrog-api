const EventfrogUtil = require('../util/EventfrogUtil');

/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventfrogEvent {
    /**
     * @param data
     * @param {string} data.id
     * @param {string|null} data.extSrcId - external source id if the event was imported from another source an the extSourceId was set, otherwise null
     * @param {string|null} data.extId - external id if the event was imported from another source
     * @param {string} data.groupId - 0 or null if event is not in a group
     * @param {int} data.rubricId
     * @param {string[]} data.title - localized strings in array ('de', ...), max 255 characters
     * @param {string} data.url
     * @param {string} data.organizerId
     * @param {string} data.organizerName
     * @param {string} data.websiteUrl
     * @param {string} data.facebookUrl
     * @param {string} data.twitterUrl
     * @param {string} data.presaleLink - url for ticketing
     * @param {string} data.presaleText
     * @param {{url: string, width: int, height: int}|null} data.emblemToShow - event image if available, otherwise null
     * @param {string} data.begin - ISO 8601
     * @param {string} data.end - ISO 8601
     * @param {boolean} data.cancelled
     * @param {boolean} data.visible
     * @param {boolean} data.published
     * @param {boolean} data.agendaEntryOnly
     * @param {string[]} data.locationIds
     * @param {string} data.modifyDate - ISO 8601
     * @param {string[]} data.shortDescription - localized strings in array ('de', ...), max 255 characters
     * @param {string[]} data.descriptionAsHTML - localized strings in array ('de', ...), unlimited max length, contains encoded HTML
     */
    constructor(data) {
        /** @type {string} */
        this.id = data.id;

        /**
         * external source id if the event was imported from another source an the extSourceId was set, otherwise null
         * @type {string|null}
         */
        this.externalSourceId = data.extSrcId;

        /** @type {string} */
        this.externalId = data.extId;

        /** @type {string} */
        this.groupId = data.groupId;

        /** @type {int} */
        this.topicId = data.rubricId;

        /**
         * @type {string[]}
         * @private
         */
        this._title = data.title;

        /** @type {string} */
        this.link = data.url;

        /**
         * organizer information
         * @type {{website: string, twitter: string, facebook: string, name: string, id: string}}
         */
        this.organizer = {
            id: data.organizerId,
            name: data.organizerName,
            website: data.websiteUrl,
            facebook: data.facebookUrl,
            twitter: data.twitterUrl,
        };

        /**
         * presale information, if available
         * @type {{link: string, text: string}}
         */
        this.presale = {
            link: data.presaleLink,
            text: data.presaleText,
        }

        /**
         * event image, if available
         * @type {{url: string, width: int, height: int}|null}
         */
        this.image = data.emblemToShow;

        /** @type {Date} */
        this.startDate = new Date(Date.parse(data.begin));

        /** @type {Date} */
        this.endDate = new Date(Date.parse(data.end));

        /**
         * event cancellation status
         * @type {boolean}
         */
        this.cancelled = data.cancelled;

        /**
         * event visibility
         * @type {boolean}
         */
        this.visible = data.visible;

        /**
         * event publish status
         * @type {boolean}
         */
        this.published = data.published;

        /**
         * agenda only event identifier, agenda only events do not have tickets
         * @type {boolean}
         */
        this.agendaOnly = data.agendaEntryOnly;

        /**
         * first location id
         *
         * TODO #1 - extend api implementation to allow multiple locations
         *
         * @type {string|null}
         */
        this.locationId = data.locationIds.length ? data.locationIds[0] : null;

        /** @type {Date} */
        this.dateModified = new Date(Date.parse(data.modifyDate));

        /**
         * @type {string[]}
         * @private
         */
        this._summary = data.shortDescription;

        /**
         * @type {string[]}
         * @private
         */
        this._html = data.descriptionAsHTML;

        /**
         * @type {EventfrogLocation|null}
         */
        this.location = null;

        /**
         * @type {EventfrogGroup|null}
         */
        this.group = null;

        /**
         * @type {EventfrogTopic|null}
         */
        this.topic = null;
    }

    /**
     * @returns {string|null}
     */
    get title() {
        return EventfrogUtil.getLocalizedString(this._title);
    }

    /**
     * @returns {string|null}
     */
    get summary() {
        return EventfrogUtil.getLocalizedString(this._summary);
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
EventfrogEvent.apiEdge = '/events.json';

module.exports = EventfrogEvent;
