import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableCollapse extends CustomElementBase {
    static tagName = 'data-table-collapse';

    static events = {}

    static observedEvents = []
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.dataTableRow = this.closest(TableConfig.selectors.dataTableRow);
        this.dataTableRow.addEventListener(TableConfig.events.showCollapse, this);
        this.dataTableRow.addEventListener(TableConfig.events.hideCollapse, this);
        
        this.bsCollapse = bootstrap.Collapse.getOrCreateInstance(this, {
            toggle: false
        });
    }

    eventHandlers = {
        [TableConfig.events.showCollapse]: (objEvent) => {
            if(objEvent.detail.rowId !== this.dataTableRow.id){
                return;
            }
            if(objEvent.detail.html){
                this.innerHTML = objEvent.detail.html;
            }
            this.bsCollapse.show();
        },
        [TableConfig.events.hideCollapse]: (objEvent) => {
            if(objEvent.detail.rowId !== this.dataTableRow.id){
                return;
            }
            this.bsCollapse.hide();
        }
    }
}

customElements.define(DataTableCollapse.tagName, DataTableCollapse);