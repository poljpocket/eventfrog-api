import {EventfrogModel} from "../model/EventfrogModel";

export class EventfrogResult<T extends EventfrogModel> {
    public totalAmount: number;
    public datasets: Array<T>;

    constructor(totalAmount: number, datasets: Array<T>) {
        this.totalAmount = totalAmount;
        this.datasets = datasets;
    }
}
