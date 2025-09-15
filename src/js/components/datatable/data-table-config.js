const TableConfig = {
    events:{
        update: 'data-table:update',
        updated: 'data-table:updated',
        updateError: 'data-table:update:error',
        empty: 'data-table:empty',
        filterChange: 'data-table:filter-change',
        sortChange: 'data-table:sort-change',
        pageChange: 'data-table:page-change',
        rowSelect: 'data-table:row-select',
        rowActionDetails: 'data-table:row-action:details',
        rowActionEdit: 'data-table:row-action:edit',
        rowActionDelete: 'data-table:row-action:delete',
        searchChange: 'data-table:search-change',
        loadingStart: 'data-table:loading-start',
        loadingEnd: 'data-table:loading-end',
        showModal: 'data-table:show-modal',
        hideModal: 'data-table:hide-modal',
        showOffcanvas: 'data-table:show-offcanvas',
        hideOffcanvas: 'data-table:hide-offcanvas',
        showCollapse: 'data-table:show-collapse',
        hideCollapse: 'data-table:hide-collapse',
    },
    endpoints: {
        list: 'https://my-json-server.typicode.com/MrLesion/demo/list',
        details: 'https://my-json-server.typicode.com/MrLesion/demo/details',
        edit: 'https://my-json-server.typicode.com/MrLesion/demo/edit',
    },
    templates: {
        tableRowDetails: '/template/path/to/table-row-details.cshtml',
        tableRowEdit: '/template/path/to/table-row-edit.cshtml',
        table: '/template/path/to/table.cshtml',
    },
    selectors: {
        dataTable: 'data-table',
        dataTableRow: 'data-table-row',
        dataTableRowSelect: '.row-select',
        dataTableRowDetail: 'data-table-row-detail',
        dataTableRowActions: 'data-table-row-actions',
        dataTableHeader: 'data-table-header',
        dataTableFilters: 'data-table-filters',
        dataTableSearch: 'data-table-search',
        dataTablePagination: 'data-table-pagination',
        dataTableEmpty: 'data-table-empty',
        dataTableLoader: 'data-table-loader',
        dataTableActions: 'data-table-actions',
    },
    modifiers: {
        isLoading: 'is-loading',
    },
    methods: {
        inline: 'inline',
        modal: 'modal',
        offcanvas: 'offcanvas'
    }
}

export default TableConfig;