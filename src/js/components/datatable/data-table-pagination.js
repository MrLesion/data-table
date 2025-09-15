import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTablePagination extends CustomElementBase {
    static tagName = 'data-table-pagination';

    static events = {
        pageChange: TableConfig.events.pageChange
    }
    
    static attributes = {
        currentPage: 'current-page',
        totalPages: 'total-pages',
    }
    
    static observedAttributes = [
        DataTablePagination.attributes.currentPage,
        DataTablePagination.attributes.totalPages,
    ]
    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === DataTablePagination.attributes.currentPage) {
            this.currentPage = Number(newValue);
        }
        if (name === DataTablePagination.attributes.totalPages) {
            this.totalPages = Number(newValue);
        }
    }

    changePage(page){
        if (page < 1) {
            page = 1;
        }
        if (page > this.totalPages) {
            page = this.totalPages;
        }
        this.currentPage = page;
        this.setAttribute(DataTablePagination.attributes.currentPage, page);
        this.dispatchEvent(new CustomEvent(TableConfig.events.pageChange, {
            detail: { page },
        }));
    }
    
    connectedCallback() {
        this.currentPage = 1;
        this.totalPages = 1;
    }
}

customElements.define(DataTablePagination.tagName, DataTablePagination);