import {CustomElementBase} from '../custom-element-base.js';
import './data-table-row-action.js';
import TableConfig from './data-table-config.js';
import {newGuid} from "./data-table-utillities.js";

export class DataTableRow extends CustomElementBase {
    static tagName = 'data-table-row';

    static events = {
        change: 'change',
        bsModalClose: 'hide.bs.modal',
        bsCollapseClose: 'hide.bs.collapse',
        bsOffcanvasClose: 'hide.bs.offcanvas',
    };

    static observedEvents = [
        TableConfig.events.rowActionDetails,
        TableConfig.events.rowActionEdit,
        TableConfig.events.rowActionDelete,
        TableConfig.events.rowActionAdd,
        DataTableRow.events.bsModalClose
    ];

    constructor() {
        super();
        this.isOpen = false;
        this.action = '';
        this.method = '';
        this.rowId = '';
    }

    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.rowDetail = this.querySelector(TableConfig.selectors.dataTableRowDetail);

        this.dataTable.addEventListener(DataTableRow.events.bsModalClose, () =>{
            this.isOpen = false;
        });
        this.dataTable.addEventListener(DataTableRow.events.bsOffcanvasClose, () =>{
            this.isOpen = false;
        });

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

        [TableConfig.events.rowActionAdd]: (objEvent) => {
            const guid = newGuid();
            this.handleAction('add', guid, objEvent, TableConfig.templates.tableRowAdd)
        },

        [TableConfig.events.rowActionDelete]: (objEvent) => {
            this.triggerCustomEvent(TableConfig.events.feedback, {
                mode: objEvent.detail.mode,
                type: objEvent.detail.type,
                callback: () => {
                    this.dataTable.update(TableConfig.endpoints.details, null, {
                        method: 'DELETE',
                        body: { rowId: objEvent.detail.rowId }
                    });
                }
            })
            /*
            if (confirm('Are you sure you want to delete this record?')) {
                this.dataTable.update(TableConfig.endpoints.details, null, {
                    method: 'DELETE',
                    body: { rowId: objEvent.detail.rowId }
                });
            }
            
             */
        },
    };

    async handleAction(action, strMethod, objEvent, template) {
        const rowId = objEvent.detail?.rowId ?? '';
        const method = objEvent.detail?.mode ?? '';
        const isSameRow = this.rowId === rowId;

        // If the same row is clicked and is open, just close it
        if (isSameRow && this.isOpen) {
            const closeHandlers = {
                [TableConfig.methods.inline]: () => this.triggerCustomEvent(TableConfig.events.hideCollapse, { rowId }),
                [TableConfig.methods.modal]: () => this.triggerCustomEvent(TableConfig.events.hideModal),
                [TableConfig.methods.offcanvas]: () => this.triggerCustomEvent(TableConfig.events.hideOffcanvas),
            };
            closeHandlers[method]?.();
            this.isOpen = false;
            return;
        }

        // If a different row is clicked, close the previous row if open
        if (this.isOpen && !isSameRow) {
            const closeHandlers = {
                [TableConfig.methods.inline]: () => this.triggerCustomEvent(TableConfig.events.hideCollapse, { rowId: this.rowId }),
                [TableConfig.methods.modal]: () => this.triggerCustomEvent(TableConfig.events.hideModal),
                [TableConfig.methods.offcanvas]: () => this.triggerCustomEvent(TableConfig.events.hideOffcanvas),
            };
            closeHandlers[this.method]?.();
            this.isOpen = false;
        }

        // If the row is closed or a different row is clicked, load new data
        if (!isSameRow || !this.isOpen) {
            this.action = action;
            this.method = method;
            this.rowId = rowId;
            this.classList.add(TableConfig.modifiers.isLoading);
            try {
                const data = await this.dataTable.update(
                    `${TableConfig.endpoints[action]}/${rowId}`,
                    template
                );
                const showHandlers = {
                    [TableConfig.methods.inline]: (data) => this.triggerCustomEvent(TableConfig.events.showCollapse, { rowId, data }),
                    [TableConfig.methods.modal]: (data) => this.triggerCustomEvent(TableConfig.events.showModal, { rowId, data }),
                    [TableConfig.methods.offcanvas]: (data) => this.triggerCustomEvent(TableConfig.events.showOffcanvas, { rowId, data }),
                };
                showHandlers[method]?.(data);
                this.isOpen = true;
            } catch (err) {
                console.error('DataTableRow handleAction error:', err);
            } finally {
                this.classList.remove(TableConfig.modifiers.isLoading);
            }
        }
    }





}

customElements.define(DataTableRow.tagName, DataTableRow);
