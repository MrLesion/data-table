import CustomElementBase from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableSearch extends CustomElementBase {
    static tagName = 'data-table-search';
    
    static events = {
        searchChange: TableConfig.events.searchChange
    }
    constructor() {
        super();
    }
}

customElements.define(DataTableSearch.tagName, DataTableSearch);