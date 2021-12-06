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

    hasNextPage() {
        return this.request.hasNextPage(this.totalAmount);
    }
}
