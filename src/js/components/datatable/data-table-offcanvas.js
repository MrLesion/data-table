import CustomElementBase from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableOffcanvas extends CustomElementBase {
    static tagName = 'data-table-offcanvas';

    static events = {
        shown: 'shown.bs.offcanvas',
        hidden: 'hidden.bs.offcanvas',
    }

    static observedEvents = []
    constructor() {
        super();
    }

    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.dataTable.addEventListener(TableConfig.events.showOffcanvas, this);
        this.dataTable.addEventListener(TableConfig.events.hideOffcanvas, this);
        const offcanvasElement = this.querySelector('.offcanvas');
        this.offcanvasBody = offcanvasElement.querySelector('.offcanvas-body');
        this.bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement, {
            toggle: false
        })
    }

    eventHandlers = {
        [TableConfig.events.showOffcanvas]: (objEvent) => {
            if(objEvent.detail.data){
                this.offcanvasBody.innerHTML = objEvent.detail.data.html;
            }
            this.bsOffcanvas.show();
        },
        [TableConfig.events.hideOffcanvas]: () => {
            this.bsOffcanvas.hide();
        }
    }
}

customElements.define(DataTableOffcanvas.tagName, DataTableOffcanvas);