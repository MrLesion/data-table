const TableConfig = {
    events: {
        update: 'data-table:update',
        updated: 'data-table:updated',
        listUpdated: 'data-table:list:updated',
        updateError: 'data-table:update:error',
        empty: 'data-table:empty',
        filterChange: 'data-table:filter-change',
        sortChange: 'data-table:sort-change',
        pageChange: 'data-table:page-change',
        rowSelect: 'data-table:row-select',
        rowActionDetails: 'data-table:row-action:details',
        rowActionEdit: 'data-table:row-action:edit',
        rowActionDelete: 'data-table:row-action:delete',
        rowActionAdd: 'data-table:row-action:add',
        searchChange: 'data-table:search-change',
        loadingStart: 'data-table:loading-start',
        loadingEnd: 'data-table:loading-end',
        showModal: 'data-table:show-modal',
        hideModal: 'data-table:hide-modal',
        toggleModal: 'data-table:toggle-modal',
        showOffcanvas: 'data-table:show-offcanvas',
        hideOffcanvas: 'data-table:hide-offcanvas',
        toggleOffcanvas: 'data-table:toggle-offcanvas',
        showCollapse: 'data-table:show-collapse',
        hideCollapse: 'data-table:hide-collapse',
        toggleCollapse: 'data-table:toggle-collapse',
        feedback: 'data-table:feedback',
        rowAction: 'data-table:row:action',
        
    },
    endpoints: {
        list: 'https://my-json-server.typicode.com/MrLesion/data-table/items',
        _list: 'https://my-json-server.typicode.com/MrLesion/data-table/list',
        details: 'https://my-json-server.typicode.com/MrLesion/data-table/details',
        edit: 'https://my-json-server.typicode.com/MrLesion/data-table/edit',
        add: 'https://my-json-server.typicode.com/MrLesion/data-table/list',
    },
    templates: {
        tableRowDetails: '/template/path/to/table-row-details.cshtml',
        tableRowEdit: '/template/path/to/table-row-edit.cshtml',
        tableRowAdd: '/template/path/to/table-row-add.cshtml'
    },
    selectors: {
        dataTable: 'data-table',
        dataTableRow: 'data-table-row',
        dataTableRowSelect: '.row-select',
        dataTableCollapse: 'data-table-collapse',
        dataTableRowActions: 'data-table-row-actions',
        dataTableHeader: 'data-table-header',
        dataTableFilters: 'data-table-filters',
        dataTableSearch: 'data-table-search',
        dataTablePagination: 'data-table-pagination',
        dataTableEmpty: 'data-table-empty',
        dataTableLoader: 'data-table-loader',
        dataTableActions: 'data-table-actions',
    },
    inputs: {
        pageNum: 'input[name="_page"]',
        sortBy: 'input[name="_sort"]',
        sortOrder: 'input[name="_order"]',
    },
    modifiers: {},
    methods: {
        inline: 'inline',
        modal: 'modal',
        offcanvas: 'offcanvas'
    }
}

export default TableConfig;