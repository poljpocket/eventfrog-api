module.exports = class EventfrogRequest {
    constructor(options) {
        /**
         * @type {Object}
         */
        this.options = {
            /** @type {int} - Gibt an welche Seite der Resultate zurückgegeben werden soll (in Zusammenhang mit perPage) */
            page: 1,

            /** @type {int} - default 100, gibt an, wieviele Events zurückgegeben werden sollen */
            perPage: 100,
        };

        Object.assign(this.options, {...options});
    }
}
