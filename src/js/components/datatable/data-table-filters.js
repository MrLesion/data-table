import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
import './data-table-filters-search.js';

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
    
    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.dataTable.addEventListener(TableConfig.events.updated, this);
        this.filters = this.querySelectorAll(".js-data-table-filters-dropdown");

        this.filters.forEach((dropdown) => {
            const textElement = dropdown.querySelector(".dropdown-toggle");
            dropdown.setAttribute("data-default-text", textElement.textContent.trim());
        });
    }
    
    eventHandlers = {
        [DataTableFilters.events.click]: (event) =>{
            let domElement = event.target;
            if (domElement.classList.contains('js-data-table-submit-filters')) {
                const dropdowns = this.querySelectorAll('.dropdown-toggle');
                if(dropdowns.length > 0){
                    dropdowns.forEach(dropdown => {
                        const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
                        if (bsDropdown) {
                            bsDropdown.hide();
                        }
                    });
                }
                
                this.triggerCustomEvent(TableConfig.events.filterChange);
            }
        },
        [TableConfig.events.updated]: () => {
            this.update();
        }   
    }
    
    update(){
        this.filters.forEach((dropdown) => {
            const textElement = dropdown.querySelector(".dropdown-toggle");
            const checkboxes = dropdown.querySelectorAll(".dropdown-menu input[type=checkbox]");
            const defaultText = dropdown.dataset.defaultText;

            const selected = Array.from(checkboxes)
                .filter(x => x.checked)
                .map(x => x.value);

            textElement.textContent = selected.length > 0 ? `${defaultText}: ${selected.join(", ")}` : defaultText;
        })
    }
}

customElements.define(DataTableFilters.tagName, DataTableFilters);