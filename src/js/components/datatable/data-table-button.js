import CustomElementBase from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableButton extends CustomElementBase {
    static tagName = 'data-table-button';

    static events = {
        click: 'click'
    }
    
    static observedEvents = [
        DataTableButton.events.click
    ]
    constructor() {
        super();
    }
    
    eventHandlers = {
        [DataTableButton.events.click]: () => {
            
        }
    }
}

customElements.define(DataTableButton.tagName, DataTableButton);