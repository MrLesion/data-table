import {CustomElementBase} from '../custom-element-base.js';
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
        this.action = '';
        this.method = '';
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
        const prevAction = this.action;
        const prevMethod = this.method;
        
        if (prevMethod && prevMethod !== method) {
            const closeHandlers = {
                [TableConfig.methods.inline]: () => {
                    this.triggerCustomEvent(TableConfig.events.hideCollapse, { rowId });
                },
                [TableConfig.methods.modal]: () => {
                    this.triggerCustomEvent(TableConfig.events.hideModal);
                },
                [TableConfig.methods.offcanvas]: () => {
                    this.triggerCustomEvent(TableConfig.events.hideOffcanvas);
                }
            };

            closeHandlers[prevMethod]?.();
            this.isOpen = false;
        }

        this.action = action;
        this.method = method;

        const showHandlers = {
            [TableConfig.methods.inline]: (data) => {
                this.triggerCustomEvent(TableConfig.events.showCollapse, { rowId, data });
            },
            [TableConfig.methods.modal]: (data) => {
                this.triggerCustomEvent(TableConfig.events.showModal, { rowId, data });
            },
            [TableConfig.methods.offcanvas]: (data) => {
                this.triggerCustomEvent(TableConfig.events.showOffcanvas, { rowId, data });
            }
        };

        const toggleHandlers = {
            [TableConfig.methods.inline]: () => {
                this.triggerCustomEvent(
                    !this.isOpen ? TableConfig.events.showCollapse : TableConfig.events.hideCollapse, {rowId}
                );
            },
            [TableConfig.methods.modal]: () => {
                this.triggerCustomEvent(
                    !this.isOpen ? TableConfig.events.showModal : TableConfig.events.hideModal
                );
            },
            [TableConfig.methods.offcanvas]: () => {
                this.triggerCustomEvent(
                    !this.isOpen ? TableConfig.events.showOffcanvas : TableConfig.events.hideOffcanvas
                );
            }
        };

        if (prevAction !== action || prevMethod !== method) {
            this.classList.add(TableConfig.modifiers.isLoading);

            try {
                const data = await this.dataTable.update(
                    `${TableConfig.endpoints[action]}/${rowId}`,
                    template
                );

                showHandlers[method]?.(data);
                this.isOpen = true;
            } catch (err) {
                console.error('DataTableRow handleAction error:', err);
            } finally {
                this.classList.remove(TableConfig.modifiers.isLoading);
            }

            return;
        }

        toggleHandlers[method]?.();
        this.isOpen = !this.isOpen;
    }

}

customElements.define(DataTableRow.tagName, DataTableRow);
