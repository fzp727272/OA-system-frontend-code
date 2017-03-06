var PAGINATION = {
    setPagination: function (bar, totalPages, startPage, onClick) {
        bar.twbsPagination('destroy');
        if (totalPages > 0) {
            bar.twbsPagination({
                first: "首页",
                prev: "前一页",
                next: "后一页",
                last: "末页",
                startPage: startPage,
                totalPages: totalPages,
                visiblePages: 20,
                initiateStartPageClick: false,
                onPageClick: function (event, page) {
                    onClick(page);
                }
            });
        }
    }
}