import CustomElementBase from '../custom-element-base.js';
import './data-table-row-actions.js';
import TableConfig from './data-table-config.js';

export class DataTableRow extends CustomElementBase {
    static tagName = 'data-table-row';

    static events = {
        change: 'change'
    };

    static observedEvents = [
        TableConfig.events.rowActionDetails,
        TableConfig.events.rowActionEdit,
        TableConfig.events.rowActionDelete
    ];

    constructor() {
        super();
        this.isOpen = false;
        this.state = '';
    }

    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.rowDetail = this.querySelector(TableConfig.selectors.dataTableRowDetail);

        if (this.rowDetail) {
            this.bsCollapse = bootstrap.Collapse.getOrCreateInstance(this.rowDetail, {
                toggle: false
            });
        }
    }

    eventHandlers = {
        [TableConfig.events.rowActionDetails]: (objEvent) => {
            
            this.handleAction('details', 'detailsMode', objEvent, TableConfig.templates.tableRowDetails)
        },
        
        [TableConfig.events.rowActionEdit]: (objEvent) => {
            this.handleAction('edit', 'editMode', objEvent, TableConfig.templates.tableRowEdit)
        },

        [TableConfig.events.rowActionDelete]: (objEvent) => {
            if (confirm('Are you sure you want to delete this record?')) {
                this.dataTable.update(TableConfig.endpoints.details, null, {
                    method: 'DELETE',
                    body: { rowId: objEvent.detail.rowId }
                });
            }
        }
    };

    async handleAction(action, strMethod, objEvent, template) {
        const rowId = objEvent.detail.rowId;
        const config = this.dataTable?.getConfiguration();
        const method = config[strMethod];
        
        if ((method === TableConfig.methods.modal || method === TableConfig.methods.offcanvas) && this.isOpen) {
            this.isOpen = false;
            this.state = '';
        }

        if (this.state !== action) {
            this.state = action;
            this.classList.add(TableConfig.modifiers.isLoading);

            try {
                const data = await this.dataTable.update(
                    `${TableConfig.endpoints[action]}/${rowId}`,
                    template
                );

                if (method === TableConfig.methods.inline && this.rowDetail) {
                    this.rowDetail.innerHTML = data.html;
                    this.bsCollapse?.show();
                } else if (method === TableConfig.methods.modal) {
                    this.triggerCustomEvent(TableConfig.events.showModal, { data });
                } else if (method === TableConfig.methods.offcanvas) {
                    this.triggerCustomEvent(TableConfig.events.showOffcanvas, { data });
                }
            } catch (err) {
                console.error('DataTableRow handleAction error:', err);
            } finally {
                this.classList.remove(TableConfig.modifiers.isLoading);
            }

            this.isOpen = true;
            return;
        }

        // Toggle existing state
        if (method === TableConfig.methods.inline) {
            this.isOpen ? this.bsCollapse?.hide() : this.bsCollapse?.show();
        } else if (method === TableConfig.methods.modal) {
            this.triggerCustomEvent(
                this.isOpen ? TableConfig.events.hideModal : TableConfig.events.showModal
            );
        } else if (method === TableConfig.methods.offcanvas) {
            this.triggerCustomEvent(
                this.isOpen ? TableConfig.events.hideOffcanvas : TableConfig.events.showOffcanvas
            );
        }

        this.isOpen = !this.isOpen;
    }
}

customElements.define(DataTableRow.tagName, DataTableRow);
