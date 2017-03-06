var ORDERBOARD = {
    currentOrders: null,
    defaultPageSize: 20,
    totalPages: null,
    currentPage: null,

    loadPage: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/orders?status=ACTIVE",
            dataType: "json",
            data: {
                page: 1,
                size: ORDERBOARD.defaultPageSize
            },
            success: function (data) {
                if (data.content) {
                    ORDERBOARD.currentOrders = data.content.content;
                    ORDERBOARD.currentPage = 1;
                    ORDERBOARD.initOrders();
                    ORDERBOARD.totalPages = data.content.totalPages;
                }
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    bindEvent: function () {
        $("#assistant-list tr td").find("div").hide(10);
        $("#assistant-list").click(function (event) {
            event.stopPropagation();

            var $target = $(event.target);
            $('.assistant-tr').removeClass('assistant-tr');
            $target.closest("tr").addClass('assistant-tr');
            $('tr.expand').find("div").hide(10);
             $target.closest("tr").next().addClass('assistant-tr').find("div").slideToggle(10);
        });

        $("#assistant-list").children('tbody').children('tr').click(function (event) {
            $(this).parent('tbody').children('tr').not(".expand").removeClass('assistant-tr');
            $(this).addClass('assistant-tr');
        });

        $('.assistant-product-note').popover();
        $('.assistant-product-info').popover();
    },

    hideOrder: function (orderId) {
        swal({
            title: '不显示此订单',
            text: '确认？',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    type: 'PUT',
                    url: PARAM.host + "/order/" + orderId + "/done",
                    success: function (data) {
                        ORDERBOARD.loadPage();
                    },
                    error: function (err) {
                        MESSAGEBOX.generalSystemError(err);
                    }
                });
            }
        });
    },

    navigateToPage: function (pageNumber) {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/orders?status=ACTIVE",
            dataType: "json",
            data: {
                page: pageNumber,
                size: ORDERBOARD.defaultPageSize
            },
            success: function (data) {
                if (data.content) {
                    ORDERBOARD.currentOrders = data.content.content;
                    ORDERBOARD.currentPage = pageNumber;
                    ORDERBOARD.initOrders();
                }
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    initOrders: function () {
        var data = {};
        data.isSalesman = USER.isSALESMAN();
        data.orders = [];

        $.each(ORDERBOARD.currentOrders, function (index, value) {
            var newOrder = {};
            newOrder.orderCustomerName = value.orderCustomerName;
            newOrder.orderCreatedDate = moment(value.dateCreated).format("YYYY-MM-DD");
            newOrder.orderComment = value.comment;
            newOrder.orderId = value.id;
            newOrder.items = [];

            $.each(value.items, function (index, value) {
                var newItem = {};
                if (USER.isPRODUCER() && value.producerComment) {
                    newItem.productSpecialComment = value.producerComment;
                } else if (USER.isQA() && value.qaComment) {
                    newItem.productSpecialComment = value.qaComment;
                }
                newItem.productName = value.productName;
                newItem.producibleProductName = value.producibleProductName;
                newItem.productNumber = value.productNumber;
                newItem.productUnit = value.productUnit;
                newItem.productDeliveryDate = moment(value.deliveryDate).format("YYYY-MM-DD");
                newItem.productComment = value.comment;
                newItem.productPackageSize = value.packageSize;

                newOrder.items.push(newItem);
            });
            data.orders.push(newOrder);
        });

        $.get("pages/orderboard/template/orderboard.html", function (template) {
            $("#panel-body").html(Mustache.render(template, data));
            PAGINATION.setPagination($("#pagination-bar"), ORDERBOARD.totalPages, ORDERBOARD.currentPage, ORDERBOARD.navigateToPage);
            ORDERBOARD.bindEvent();
        });
    }
}