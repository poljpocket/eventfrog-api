const EventfrogRequest = require('./EventfrogRequest');

/**
 * @typedef {Object} EventfrogGroupRequestOptions
 * @property {string|string[]} [groupId] - eventgroup-Ids
 * @property {float} [lat] - Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
 * @property {float} [lng] - Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
 * @property {float} [r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
 * @property {string|string[]} [zip] - PLZ, nur Events mit dieser/n PLZs werden gefunden
 * @property {string} [modifiedSince] - dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
 * @property {int} [perPage] - default 100, gibt an, wieviele Events zurückgegeben werden sollen
 * @property {int} [page] - Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage)
 */

module.exports = class EventfrogGroupRequest extends EventfrogRequest {
    /**
     * @param {EventfrogGroupRequestOptions} options
     */
    constructor(options) {
        super(options);
    }
}
