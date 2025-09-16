import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableEmpty extends CustomElementBase {
    static tagName = 'data-table-empty';
    constructor() {
        super();
    }
    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.dataTable.addEventListener(TableConfig.events.listUpdated, this);
    }
    
    eventHandlers = {
        [TableConfig.events.listUpdated]: (event) =>{
            const data = event.detail.data ?? {};
            this.update(data);
        }
    }
    
    update(data){
        if(data.items.length === 0){
            this.classList.remove('d-none');
        } else{
            this.classList.add('d-none');
        }
    }
}

customElements.define(DataTableEmpty.tagName, DataTableEmpty);