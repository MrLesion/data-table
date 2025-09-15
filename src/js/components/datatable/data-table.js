import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
import {matchesBreakpoint} from "./data-table-utillities.js";
import './data-table-row.js';
import './data-table-filters.js';
import './data-table-header.js';
import './data-table-pagination.js';
import './data-table-row-detail.js';
import './data-table-search.js';
import './data-table-modal.js';
import './data-table-offcanvas.js';


export class DataTable extends CustomElementBase {
    static tagName = 'data-table';

    static attributes = {
        editMode: 'edit-mode',
        detailsMode: 'details-mode',
    }

    static events = {
        update: TableConfig.events.update,
        empty: TableConfig.events.empty,
    }

    static observedEvents = [
        TableConfig.events.searchChange,
        TableConfig.events.filterChange,
        TableConfig.events.sortChange,
        TableConfig.events.rowSelect,
        TableConfig.events.pageChange
    ]

    constructor() {
        super();

        this.configuration = {
            editMode: this.getAttribute(DataTable.attributes.editMode) ?? 'inline',
            detailsMode: this.getAttribute(DataTable.attributes.detailsMode) ?? 'inline'
        };

        this.domParser = new DOMParser();
    }

    connectedCallback() {
        this.classList.add(TableConfig.modifiers.isLoading);
        this.form = this.querySelector('.js-data-table-form');

        this.updateResponsiveMode();
        window.addEventListener('resize', this.updateResponsiveMode.bind(this));

        //SSR
        this.updateList();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.updateResponsiveMode.bind(this));
    }

    eventHandlers = {
        [TableConfig.events.searchChange]: (objEvent) => {
            console.log('DataTable: searchChange event handler called with', objEvent);
            console.log('TODO: triggers API update or local filtering. // query');
            this.update(TableConfig.endpoints.search, TableConfig.templates.table);
        },
        [TableConfig.events.filterChange]: () => {
            this.updateList();
        },
        [TableConfig.events.sortChange]: (objEvent) => {
            this.form.querySelector('[name="sortBy"]').value = objEvent.detail.sortBy;
            this.form.querySelector('[name="sortOrder"]').value = objEvent.detail.sortOrder;
            this.update(TableConfig.endpoints.list);
        },
        [TableConfig.events.rowSelect]: (objEvent) => {
            console.log('DataTable: rowSelect event handler called with', objEvent);
            console.log('TODO: keeps global selectedRows state // rowId, selected');
            this.update();
        },
        [TableConfig.events.pageChange]: (objEvent) => {
            console.log('DataTable: pageChange event handler called with', objEvent);
            console.log('TODO: reloads content for that page. // page, pageSize');
            this.update();
        }
    }

    async update(strEndpoint, strTemplate = null, data = {}) {
        if (!strEndpoint) {
            throw new Error('DataTable: update failed. Endpoint is required.');
        }
        try {
            const urlParams = new URLSearchParams(new FormData(this.form));
            const response = await fetch(`${strEndpoint}?${urlParams.toString()}`, {
                method: data?.method ?? 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-core-template': strTemplate ?? '',
                },
                body: JSON.stringify(data?.body) ?? null,
            });

            const json = await response.json();
            this.triggerCustomEvent(TableConfig.events.updated, {json});
            return json;

        } catch (err) {
            console.error('DataTable update failed:', err);
            this.triggerCustomEvent(TableConfig.events.updateError, {error: err});
        } finally {
            this.classList.remove(TableConfig.modifiers.isLoading);
        }
    }
    
    async updateList(){
        this.update(
            `${TableConfig.endpoints.list}`).then((data) => {
            const tableBody = this.querySelector('.js-data-table-body');
            tableBody.innerHTML = '';
            data.items.forEach(row => {
                const rowNode = this.domParser.parseFromString(row.html, 'text/html').body.firstElementChild;
                tableBody.append(rowNode);
            });
        });
    }

    updateResponsiveMode() {
        Object.keys(DataTable.attributes).forEach((attrKey) => {
            const attr = this.getAttribute(DataTable.attributes[attrKey]);

            if (!attr) {
                return;
            }

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

            this.configuration[attrKey] = mode;
            this.setAttribute(`resolved-${DataTable.attributes[attrKey]}`, mode);
        })
    }

    getConfiguration() {
        return this.configuration;
    }
}

customElements.define(DataTable.tagName, DataTable);