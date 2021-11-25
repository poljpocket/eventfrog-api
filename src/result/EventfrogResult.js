module.exports = class EventfrogResult {
    /**
     * @param {int} totalAmount
     * @param {Array} datasets
     */
    constructor(totalAmount, datasets) {
        this.totalAmount = totalAmount;
        this._datasets = datasets;

        /**
         * @type {EventfrogRequest|null}
         */
        this.request = null;
    }

    hasNewPage() {
        return this.totalAmount > this.request.options.perPage * this.request.options.page;
    }
}
