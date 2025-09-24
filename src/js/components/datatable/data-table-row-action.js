import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from "./data-table-config.js";
import {matchesBreakpoint, newGuid} from "./data-table-utillities.js";

export class DataTableRowAction extends CustomElementBase {
    static tagName = 'data-table-row-action';
    
    static attributes = {
        mode: 'mode',
        action: 'action',
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
        this.resolvedMode = '';
        this.action = this.getAttribute(DataTableRowAction.attributes.action) ?? '';
        
        this.updateResponsiveMode();
        window.addEventListener('resize', this.updateResponsiveMode.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.updateResponsiveMode.bind(this));
    }

    eventHandlers = {
        [DataTableRowAction.events.click]: (event) =>{
            
            switch (this.getAttribute(DataTableRowAction.attributes.action)) {
                case 'details':
                    this.triggerCustomEvent(TableConfig.events.rowActionDetails, { rowId: this.dataTableRow.id, mode: this.resolvedMode });
                    break;
                case 'edit':
                    this.triggerCustomEvent(TableConfig.events.rowActionEdit, { rowId: this.dataTableRow.id, mode: this.resolvedMode });
                    break;
                case 'delete':
                    this.triggerCustomEvent(TableConfig.events.rowActionDelete, { rowId: this.dataTableRow.id, mode: 'confirm', type: 'modal' });
                    break;
                case 'add':
                    this.triggerCustomEvent(TableConfig.events.rowActionAdd, { rowId: newGuid(), mode: this.resolvedMode });
                    break;
            }
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