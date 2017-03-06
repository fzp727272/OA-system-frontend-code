var ORDER = {
    customList: null,
    orderList: null,
    currentCustomerId: null,
    currentCustomerName: null,
    defaultPageSize: 20,

    loadPage: function () {
        $("#page-body").find('.panel-body').eq(0).html('').load("pages/order/html/order.html",
            function () {
                CUSTOMERSELECT.setSelect($("#order_customer_picker"), ORDER.onCustomerSelectHidden);
                ORDER.bindEvent();
                NEWORDERWIZARD.loadWizard();
            });
    },

    navigateToPage: function (pageNumber) {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/customer/" + ORDER.currentCustomerId + "/orders",
            data: {
                page: pageNumber,
                size: ORDER.defaultPageSize
            },
            dataType: "json",
            success: function (data) {
                ORDER.orderList = data.content.content;
                ORDER.initOrderList();
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    initOrderList: function () {
        var template = '<tr>\
                                    <td>{orderFrom}</td>\
                                    <td>{orderCreatedTime}</td>\
                                    <td>{contentType}</td>\
                                    <td>{extraInfo}</td>\
                                    <td class="button-place">\
                                        <button type="button" style="margin-right:5px;" class="btn btn-default form-operate" data-toggle="modal" data-target="#order-detail" value="{orderId}">\
                                            <i class="fa fa-eye"></i>\
                                            详情\
                                        </button>\
                                    </td>\
                                </tr>';
        var result = "";
        $.each(ORDER.orderList, function (index, value) {
            var tmp = template.replace("{orderFrom}", value.orderCustomerName)
                .replace("{orderCreatedTime}", moment(value.dateCreated).format("YYYY-MM-DD"))
                .replace("{contentType}", ORDER.getProductListOfOneOrder(value.items))
                .replace("{extraInfo}", value.comment)
                .replace("{orderId}", value.id);
            result = result + tmp;
        });

        $("#orderList").html(result);

        $(function () {
            $(".form-operate").click(function (event) {
                OrderDetail.currentOrderId = $(event.currentTarget).val();
                OrderDetail.loadPage();
            });
        })
    },

    getProductListOfOneOrder: function (items) {
        var result = [];
        $.each(items, function (index, value) {
            result.push(value.productName);
        })
        return result;
    },

    onCustomerSelectHidden: function (event) {
        ORDER.currentCustomerId = $("#order_customer_picker").find('option:selected').val();
        ORDER.currentCustomerName = $("#order_customer_picker").find('option:selected').text();

        $.ajax({
            type: 'GET',
            url: PARAM.host + "/customer/" + ORDER.currentCustomerId + "/orders",
            data: {
                page: 1,
                size: ORDER.defaultPageSize
            },
            dataType: "json",
            success: function (data) {
                if (data.content) {
                    ORDER.orderList = data.content.content;
                    PAGINATION.setPagination($("#pagination-bar"), data.content.totalPages, 1, ORDER.navigateToPage);
                    ORDER.initOrderList();
                }
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    bindEvent: function () {
        $("#makeneworderbutton").off().on("click", function () {
            NEWORDERWIZARD.showWizard();
        });
    },
};