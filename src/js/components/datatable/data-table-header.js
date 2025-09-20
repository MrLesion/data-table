import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
import {Events} from "../events.js";

export class DataTableHeader extends CustomElementBase {
    static tagName = 'data-table-header';
    
    static selectors = {
        sortHeader: '.js-data-table-header-sort'
    }

    static events = {
        change: 'change',
        click: 'click'   
    }

    static observedEvents = [
        DataTableHeader.events.change
    ]
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);

        Events.on(DataTableHeader.events.click, DataTableHeader.selectors.sortHeader, (event) =>{
            this.setSort(event.target);
        });
    }

    eventHandlers = {
        [DataTableHeader.events.change]: (event) => {const rows = this.dataTable.querySelectorAll(TableConfig.selectors.dataTableRow);
            rows.forEach(row => row.querySelector(TableConfig.selectors.dataTableRowSelect).checked = event.target.checked);
        }
    }
    setSort(domElement){
        const sortBy = domElement.dataset.sortBy;
        const sortOrder = domElement.dataset.sortOrder ?? 'asc';
        this.querySelectorAll(DataTableHeader.selectors.sortHeader).forEach(sh => sh.dataset.sortOrder = '');
        domElement.dataset.sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        this.triggerCustomEvent(TableConfig.events.sortChange, { sortBy, sortOrder });
    }
}

customElements.define(DataTableHeader.tagName, DataTableHeader);