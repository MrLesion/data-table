import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableFiltersSearch extends CustomElementBase {
    static tagName = 'data-table-filters-search';
    
    static events = {
        searchChange: TableConfig.events.searchChange
    }
    constructor() {
        super();
    }
}

customElements.define(DataTableFiltersSearch.tagName, DataTableFiltersSearch);