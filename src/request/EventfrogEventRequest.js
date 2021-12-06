const EventfrogRequest = require('./EventfrogRequest');

/**
 * @typedef {Object} EventfrogEventRequestOptions
 * @property {string} [q] - Der Suchbegriff
 * @property {string|string[]} [id] - Event-Id, nur Events mit dieser/n Id/s werden gefunden
 * @property {boolean} [excludeLocs] - Die bei locId angegebenen Locations sollen ausgeschlossen werden
 * @property {boolean} [excludeOrgs] - Die bei orgId angegebenen Organizers sollen ausgeschlossen werden
 * @property {boolean} [excludeRubrics] - Die bei rubId angegebenen Organizers sollen ausgeschlossen werden
 * @property {boolean} [excludeExtSrcIds] - Die bei extSourceId angegebenen externen Source-Ids sollen ausgeschlossen werden
 * @property {string|string[]} [locId] - locationIds
 * @property {string|string[]} [orgId] - organizerIds
 * @property {int|int[]} [rubId] - rubricids
 * @property {string|string[]} [groupId] - event group id(s)
 * @property {string|string[]} [extSrcId] - extSourceIds
 * @property {string|string[]} [zip] - PLZ, nur Events mit dieser/n PLZs werden gefunden
 * @property {number} [lat] - Latitude für Umkreissuche (nur zusammen mit lng und r verwendbar)
 * @property {number} [lng] - Longitude für Umkreissuche (nur zusammen mit lat und r verwendbar)
 * @property {number} [r] - Gibt den Radius in km für die Umkreissuche an. (nur zusammen mit lat und lng verwendbar)
 * @property {string} [from] - dd.MM.YYYY, nur Events die ab diesem Datum stattfinden sollen zurückgegeben werden
 * @property {string} [to] - dd.MM.YYYY, nur Events die bis zu diesem Datum stattfinden sollen zurückgegeben werden
 * @property {string} [modifiedSince] - dd.MM.YYYY[+HH:mm:ss], Es werden nur Events zurückgegeben die ab diesem Datum (MEZ) geändert wurden (angegebenes Datum inklusive).
 * @property {int} [perPage] - default 100, gibt an, wieviele Events zurückgegeben werden sollen
 * @property {int} [page] - Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage)
 * @property {boolean} [stream] - true = nur nach Live-Streamingevents suchen; false = nur nach Events suchen, die kein Live-Streaming haben
 * @property {boolean} [withOwnHiddens] - true = Es wird auch in den eigenen versteckten Events gesucht (Erfasser der Events = Besitzer des APIKeys)
 */

module.exports = class EventfrogEventRequest extends EventfrogRequest {
    /**
     * @param {EventfrogEventRequestOptions} options
     */
    constructor(options) {
        super(options);
    }
}
