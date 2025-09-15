import CustomElementBase from '../custom-element-base.js';
import TableConfig from './data-table-config.js';

export class DataTableHeader extends CustomElementBase {
    static tagName = 'data-table-header';

    static events = {
        change: 'change',
        click: 'click'   
    }

    static observedEvents = [
        DataTableHeader.events.change,
        DataTableHeader.events.click,
    ]
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
    }

    eventHandlers = {
        [DataTableHeader.events.change]: (event) => {
            const rows = this.dataTable.querySelectorAll(TableConfig.selectors.dataTableRow);
            rows.forEach(row => row.querySelector(TableConfig.selectors.dataTableRowSelect).checked = event.target.checked);
        },
        [DataTableHeader.events.click]: (event) =>{
            let domElement = event.target;
            
            while (domElement && domElement !== event.currentTarget) {
                if (domElement.dataset && domElement.dataset.sortBy) {
                   this.setSort(domElement);
                    break;
                }
                domElement = domElement.parentElement;
            }
        }
    }
    setSort(domElement){
        const sortBy = domElement.dataset.sortBy;
        const sortOrder = domElement.dataset.sortOrder ?? 'asc';
        domElement.dataset.sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        this.triggerCustomEvent(TableConfig.events.sortChange, { sortBy, sortOrder });
    }
}

customElements.define(DataTableHeader.tagName, DataTableHeader);