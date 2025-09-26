import {CustomElementBase} from '../custom-element-base.js';
import './data-table-row-action.js';
import TableConfig from './data-table-config.js';

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
        DataTableRow.events.bsModalClose,
        DataTableRow.events.bsOffcanvasClose
    ];

    constructor() {
        super();
        this.isOpen = false;
        this.item = null;
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
    
    disconnectedCallback() {
        this.dataTable.removeEventListener(DataTableRow.events.bsModalClose, () =>{
            this.isOpen = false;
        });
        this.dataTable.removeEventListener(DataTableRow.events.bsOffcanvasClose, () =>{
            this.isOpen = false;
        });
    }

    eventHandlers = {
        [TableConfig.events.rowAction]: (objEvent) => {
            if(objEvent.detail.method.toLocaleLowerCase() === 'delete' && !confirm('Are you sure you want to delete this item?')){
                return;
            }

            const isSameTarget = this.item?.rowId === objEvent.detail.rowId
                && this.item?.presentation === objEvent.detail.presentation;

            if (!isSameTarget && this.isOpen) {
                this.hideElement({ detail: this.item });
                this.isOpen = false;
            }
            
            this.item = objEvent.detail;
            
            if (!this.isOpen) {
                this.handleRowAction(objEvent);
            } else if (isSameTarget) {
                this.hideElement(objEvent);
                this.isOpen = false;
            }
        }
    };
    
    hideElement(objEvent){
        switch (objEvent.detail.presentation) {
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
    }
    
    showElement(objEvent, data){
        switch (objEvent.detail.presentation) {
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
    }


    async handleRowAction(objEvent) {
        this.dataTable.setAttribute('loading', 'true');

        const data = await fetch(
            `https://my-json-server.typicode.com/MrLesion/data-table${objEvent.detail.endpoint}/${objEvent.detail.rowId}`,
            {
                method: objEvent.detail.method,
                body: objEvent.detail.method.toLocaleLowerCase() === 'post' ? new FormData(this.dataTable.form) : null,
            }
        ).then(response => response.json());

        this.showElement(objEvent, data);
        this.dataTable.setAttribute('loading', 'false');
        this.isOpen = true;
    }
}

customElements.define(DataTableRow.tagName, DataTableRow);
