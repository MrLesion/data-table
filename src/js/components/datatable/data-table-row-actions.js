import CustomElementBase from '../custom-element-base.js';
import TableConfig from "./data-table-config.js";

export class DataTableRowActions extends CustomElementBase {
    static tagName = 'data-table-row-actions';

    static selectors = {
        detailsBtn: '.js-data-table-row-action-details-btn',
        editBtn: '.js-data-table-row-action-edit-btn',
        deleteBtn: '.js-data-table-row-action-delete-btn',
    }

    static events = {
        click: 'click'
    }

    static observedEvents = [
        DataTableRowActions.events.click
    ]
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.dataTableRow = this.closest(TableConfig.selectors.dataTableRow);
    }
    
    eventHandlers = {
        [DataTableRowActions.events.click]: (event) =>{
            if( event.target.matches(DataTableRowActions.selectors.detailsBtn)){
                this.triggerCustomEvent(TableConfig.events.rowActionDetails, { rowId: this.dataTableRow.id });
            }
            if( event.target.matches(DataTableRowActions.selectors.editBtn)){
                this.triggerCustomEvent(TableConfig.events.rowActionEdit, { rowId: this.dataTableRow.id });
            }
            if( event.target.matches(DataTableRowActions.selectors.deleteBtn)){
                this.triggerCustomEvent(TableConfig.events.rowActionDelete, { rowId: this.dataTableRow.id });
            }
        }
    }
}

customElements.define(DataTableRowActions.tagName, DataTableRowActions);