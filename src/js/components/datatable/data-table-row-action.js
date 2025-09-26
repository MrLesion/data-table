import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from "./data-table-config.js";
import {matchesBreakpoint, newGuid} from "./data-table-utillities.js";

export class DataTableRowAction extends CustomElementBase {
    static tagName = 'data-table-row-action';
    
    static attributes = {
        mode: 'mode',
        method: 'method',
        endpoint: 'endpoint',
    }

    static events = {
        click: 'click'
    }

    static observedEvents = [
        DataTableRowAction.events.click
    ]
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.dataTableRow = this.closest(TableConfig.selectors.dataTableRow);
        this.mode = this.getAttribute(DataTableRowAction.attributes.mode) ?? '';
        this.endpoint = this.getAttribute(DataTableRowAction.attributes.endpoint) ?? '';
        this.method = this.getAttribute(DataTableRowAction.attributes.method) ?? '';
        this.resolvedMode = '';
        
        
        this.updateResponsiveMode();
        window.addEventListener('resize', this.updateResponsiveMode.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.updateResponsiveMode.bind(this));
    }

    eventHandlers = {
        [DataTableRowAction.events.click]: (event) =>{
            this.triggerCustomEvent(TableConfig.events.rowAction, {
                rowId: this.dataTableRow.id,
                method: this.method,
                mode: this.resolvedMode,
                endpoint:this.endpoint
            })
        }
    }
    updateResponsiveMode() {
        const attr = this.getAttribute(DataTableRowAction.attributes.mode);

        if (!attr) return;

        const parts = attr.split(/\s+/);
        let baseMode = null;
        let responsive = [];

        parts.forEach(part => {
            if (part.includes(':')) {
                const [breakpoint, mode] = part.split(':');
                responsive.push({breakpoint, mode});
            } else {
                baseMode = part;
            }
        });

        let mode = baseMode;

        responsive.forEach(({breakpoint, mode: breakpointMode}) => {
            if (matchesBreakpoint(breakpoint)) {
                mode = breakpointMode;
            }
        });

        this.resolvedMode = mode;
        this.setAttribute('resolved-mode', mode);
    }
}

customElements.define(DataTableRowAction.tagName, DataTableRowAction);