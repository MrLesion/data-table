import CustomElementBase from '../custom-element-base.js';
import TableConfig from './data-table-config.js';

export class DataTableFilters extends CustomElementBase {
    static tagName = 'data-table-filters';

    static events = {
        filterChange: TableConfig.events.filterChange
    }
    constructor() {
        super();
    }
}

customElements.define(DataTableFilters.tagName, DataTableFilters);