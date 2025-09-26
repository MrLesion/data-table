import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from "./data-table-config.js";
import {matchesBreakpoint, newGuid} from "./data-table-utillities.js";

export class DataTableRowAction extends CustomElementBase {
    static tagName = 'data-table-row-action';
    
    static properties = {
        presentation: 'presentation',
        method: 'method',
        endpoint: 'endpoint',
        resolvedPresentation: 'resolved-presentation'
    }

    static events = {
        click: 'click',
        resize: 'resize'
    }

    static observedEvents = [
        DataTableRowAction.events.click
    ]
    
    static observedProperties = [
        this.properties.presentation,
        this.properties.method,
        this.properties.endpoint
    ]
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.dataTableRow = this.closest(TableConfig.selectors.dataTableRow);
        this.updatePresentation();
        window.addEventListener(DataTableRowAction.events.resize, this);
        console.log(this);
    }

    disconnectedCallback() {
        window.removeEventListener(DataTableRowAction.events.resize, this);
    }

    eventHandlers = {
        [DataTableRowAction.events.click]: (event) =>{
            this.triggerCustomEvent(TableConfig.events.rowAction, {
                rowId: this.dataTableRow.id,
                method: this.method,
                presentation: this.resolvedPresentation,
                endpoint:this.endpoint
            })
        },
        [DataTableRowAction.events.resize]: (event) => {
            this.updatePresentation();
        }
    }
    updatePresentation() {
        const attr = this.presentation;

        if (!attr) {
            return;
        }

        const parts = attr.split(/\s+/);
        let basePresentation = null;
        let responsive = [];

        parts.forEach(part => {
            if (part.includes(':')) {
                const [breakpoint, presentation] = part.split(':');
                responsive.push({breakpoint, presentation});
            } else {
                basePresentation = part;
            }
        });

        let presentation = basePresentation;

        responsive.forEach(({breakpoint, presentation: breakpointPresentation}) => {
            if (matchesBreakpoint(breakpoint)) {
                presentation = breakpointPresentation;
            }
        });

        this.resolvedPresentation = presentation;
        this.setAttribute(DataTableRowAction.properties.resolvedPresentation, presentation);
    }
}

customElements.define(DataTableRowAction.tagName, DataTableRowAction);