import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTablePagination extends CustomElementBase {
    static tagName = 'data-table-pagination';

    static events = {
        click: 'click'
    }
    
    static observedEvents = [
        TableConfig.events.listUpdated,
        DataTablePagination.events.click,
    ]
    
    static attributes = {
        currentPage: 'current-page',
        totalPages: 'total-pages',
        pageSize: 'page-size'
    }
    
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.currentPage = Number(this.getAttribute(DataTablePagination.attributes.currentPage)) ?? 1;
        this.totalPages = Number(this.getAttribute(DataTablePagination.attributes.totalPages)) ?? 1;
        this.pageSize = Number(this.getAttribute(DataTablePagination.attributes.pageSize)) ?? 2;
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.dataTable.addEventListener(TableConfig.events.listUpdated, this);
        
    }
    
    eventHandlers = {
        [TableConfig.events.listUpdated]: (event) =>{
            const data = event.detail.data ?? {};
            this.setAttribute(DataTablePagination.attributes.currentPage, data.pageNum);
            this.setAttribute(DataTablePagination.attributes.totalPages, data.totalItems);
            this.update(data);
        },
        [DataTablePagination.events.click]: (event) =>{
            event.preventDefault();
            const page = event.target.dataset.page;
            let pageNum = Number(page);
            if(isNaN(pageNum)){
                if(page === 'prev'){
                    pageNum = this.currentPage--
                } else if(page === 'next'){
                    pageNum = this.currentPage++
                }
            }
            this.changePage(pageNum);
        }
    }

    update(data) {
        this.innerHTML = data?.paginationHtml ?? '';
    }

    changePage(pageNum){
        if (pageNum < 1) {
            pageNum = 1;
        }
        if (pageNum > this.totalPages) {
            pageNum = this.totalPages;
        }
        this.currentPage = pageNum;
        this.setAttribute(DataTablePagination.attributes.currentPage, pageNum);
        this.triggerCustomEvent(TableConfig.events.pageChange, { pageNum });
    }
}

customElements.define(DataTablePagination.tagName, DataTablePagination);