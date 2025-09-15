import CustomElementBase from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableRowDetail extends CustomElementBase {
    static tagName = 'data-table-row-detail';

    static events = {}

    static observedEvents = []
    constructor() {
        super();
    }
    
    eventHandlers = {}
}

customElements.define(DataTableRowDetail.tagName, DataTableRowDetail);