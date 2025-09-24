import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';

export class DataTableHeader extends CustomElementBase {
    static tagName = 'data-table-footer';

    static selectors = {}

    static events = {}

    static observedEvents = []
    constructor() {
        super();
    }

    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
    }

    eventHandlers = {}

}

customElements.define(DataTableHeader.tagName, DataTableHeader);