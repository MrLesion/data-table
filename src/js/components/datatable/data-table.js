import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';

import '../bootstrap-wrapper.js';

import './data-table-row.js';
import './data-table-empty.js';

import './data-table-header.js';
import './data-table-footer.js';
import './data-table-filters.js';
import './data-table-pagination.js';

import './data-table-collapse.js';
import './data-table-modal.js';
import './data-table-offcanvas.js';
import './data-table-feedback.js';



export class DataTable extends CustomElementBase {
    static tagName = 'data-table';

    static attributes = {}

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

        this.domParser = new DOMParser();
    }

    connectedCallback() {
        this.form = this.querySelector('.js-data-table-form');

        //SSR
        this.updateList();
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
            this.form.querySelector(TableConfig.inputs.sortBy).value = objEvent.detail.sortBy;
            this.form.querySelector(TableConfig.inputs.sortOrder).value = objEvent.detail.sortOrder;
            this.updateList();
        },
        [TableConfig.events.rowSelect]: (objEvent) => {
            console.log('DataTable: rowSelect event handler called with', objEvent);
            console.log('TODO: keeps global selectedRows state // rowId, selected');
            this.update();
        },
        [TableConfig.events.pageChange]: (objEvent) => {
            console.log(objEvent);
            this.form.querySelector(TableConfig.inputs.pageNum).value = objEvent.detail.pageNum;
            this.updateList();
        }
    }

    async update(strEndpoint, strTemplate = null, data = {}) {
        this.setAttribute('loading', 'true');
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
            this.setAttribute('loading', 'false');
        }
    }
    
    async updateList(){
        this.setAttribute('loading', 'true');
        const urlParams = new URLSearchParams(new FormData(this.form));
        const response = await fetch(`${TableConfig.endpoints._list}?${urlParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-core-template': '',
            }
        });
        const listJson = await response.json();
        
        this.update(
            `${TableConfig.endpoints.list}`).then((data) => {
            listJson.items = data;
            const tableBody = this.querySelector('.js-data-table-body');
            tableBody.innerHTML = '';
            listJson.items.forEach(row => {
                const rowNode = this.domParser.parseFromString(row.html, 'text/html').body.firstElementChild;
                tableBody.append(rowNode);
            });
            this.triggerCustomEvent(TableConfig.events.listUpdated, {data: listJson});
        });
    }
}

customElements.define(DataTable.tagName, DataTable);