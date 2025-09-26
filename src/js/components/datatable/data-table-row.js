import {CustomElementBase} from '../custom-element-base.js';
import './data-table-row-action.js';
import TableConfig from './data-table-config.js';
import {newGuid} from "./data-table-utillities.js";

export class DataTableRow extends CustomElementBase {
    static tagName = 'data-table-row';

    static events = {
        change: 'change',
        bsModalClose: 'hide.bs.modal',
        bsCollapseClose: 'hide.bs.collapse',
        bsOffcanvasClose: 'hide.bs.offcanvas',
    };

    static observedEvents = [
        TableConfig.events.rowAction,
        DataTableRow.events.bsModalClose
    ];

    constructor() {
        super();
        this.isOpen = false;
    }

    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);

        this.dataTable.addEventListener(DataTableRow.events.bsModalClose, () =>{
            this.isOpen = false;
        });
        this.dataTable.addEventListener(DataTableRow.events.bsOffcanvasClose, () =>{
            this.isOpen = false;
        });
    }

    eventHandlers = {
        [TableConfig.events.rowAction]: (objEvent) => {
            if(objEvent.detail.method === 'DELETE' && !confirm('Are you sure you want to delete this item?')){
                return;
            }
            this.handleRowAction(objEvent);
        }
    };
    
    
    async handleRowAction(objEvent){
        if(this.isOpen){
            switch (objEvent.detail.mode) {
                case 'inline':
                    this.triggerCustomEvent(TableConfig.events.hideCollapse, { rowId: objEvent.detail.rowId });
                    break;
                case 'modal':
                    this.triggerCustomEvent(TableConfig.events.hideModal, { rowId: objEvent.detail.rowId });
                    break;
                case 'offcanvas':
                    this.triggerCustomEvent(TableConfig.events.hideOffcanvas, { rowId: objEvent.detail.rowId });
                    break;
            }
        } else{
            this.dataTable.setAttribute('loading', 'true');
            const data = await fetch(`https://my-json-server.typicode.com/MrLesion/data-table${objEvent.detail.endpoint}/${objEvent.detail.rowId}`, {
                method: objEvent.detail.method,
                body: objEvent.detail.method === 'POST' ? new FormData(this.dataTable.form) : null 
            }).then(response => response.json());
            
            switch (objEvent.detail.mode) {
                case 'inline':
                    this.triggerCustomEvent(TableConfig.events.showCollapse, { rowId: objEvent.detail.rowId, html: data.html });
                    break;
                case 'modal':
                    this.triggerCustomEvent(TableConfig.events.showModal, { rowId: objEvent.detail.rowId, html: data.html });
                    break;
                case 'offcanvas':
                    this.triggerCustomEvent(TableConfig.events.showOffcanvas, { rowId: objEvent.detail.rowId, html: data.html });
                    break;
            }
            this.dataTable.setAttribute('loading', 'false');
        }
        this.isOpen = !this.isOpen;
    }
}

customElements.define(DataTableRow.tagName, DataTableRow);
