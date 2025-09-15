import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';

export class DataTableFilters extends CustomElementBase {
    static tagName = 'data-table-filters';

    static events = {
        click: 'click'
    }
    
    static observedEvents = [
        DataTableFilters.events.click
    ]
    
    constructor() {
        super();
    }
    
    eventHandlers = {
        [DataTableFilters.events.click]: (event) =>{
            let domElement = event.target;
            if (domElement.dataset && domElement.dataset.bsDismiss) {
                const dropdowns = this.querySelectorAll('.dropdown-toggle');
                dropdowns.forEach(dropdown => {
                    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                    if (bsDropdown) {
                        bsDropdown.hide();
                    }
                    this.triggerCustomEvent(TableConfig.events.filterChange);
                });

            }
        }
    }
}

customElements.define(DataTableFilters.tagName, DataTableFilters);