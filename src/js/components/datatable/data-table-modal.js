import CustomElementBase from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableModal extends CustomElementBase {
    static tagName = 'data-table-modal';

    static events = {
        shown: 'shown.bs.modal',
        hidden: 'hidden.bs.modal',
    }

    static observedEvents = []
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.dataTable.addEventListener(TableConfig.events.showModal, this);
        this.dataTable.addEventListener(TableConfig.events.hideModal, this);
        const modalElement = this.querySelector('.modal');
        this.modalBody = modalElement.querySelector('.modal-body');
        this.bsModal = bootstrap.Modal.getOrCreateInstance(modalElement, {
            toggle: false
        })
    }

    eventHandlers = {
        [TableConfig.events.showModal]: (objEvent) => {
            if(objEvent.detail.data){
                this.modalBody.innerHTML = objEvent.detail.data.html;
            }
            this.bsModal.show();
        },
        [TableConfig.events.hideModal]: () => {
            this.bsModal.hide();
        }
    }
}

customElements.define(DataTableModal.tagName, DataTableModal);