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

    /**
     * Update request to return the next page when passing to a Service again.
     */
    nextPage() {
        this.options.page += 1;
    }

    /**
     * Decides if next page is available based on a given total amount.
     *
     * @param {int} totalAmount
     * @return {boolean}
     */
    hasNextPage(totalAmount) {
        return totalAmount > this.options.perPage * this.options.page;
    }
}
