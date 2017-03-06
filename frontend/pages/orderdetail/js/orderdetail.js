var OrderDetail = {
    currentOrderId: null,
    currentInvoices: null,
    currentOrder: null,

    loadPage: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + /order/ + OrderDetail.currentOrderId,
            dataType: "json",
            success: function (data) {
                OrderDetail.currentOrder = data.content;
                $.ajax({
                    type: 'GET',
                    url: PARAM.host + "/order/" + OrderDetail.currentOrderId + "/invoices",
                    dataType: 'json',
                    success: function (data) {
                        OrderDetail.currentInvoices = data.content;
                        OrderDetail.refreshOrderDetail();
                    },
                    error: function (err) {
                        MESSAGEBOX.generalSystemError(err);
                    }
                })
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    deleteInvoice: function (invoiceId) {
        swal({
            title: '删除此发货单？',
            text: '无法恢复！',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    type: 'DELETE',
                    url: PARAM.host + '/invoice/' + invoiceId,
                    success: function (data) {
                        OrderDetail.loadPage();
                    },
                    error: function (err) {
                        MESSAGEBOX.generalSystemError(err);
                    }
                });
            }
        });
    },

    deleteOrder: function () {
        swal({
            title: '删除此订单？',
            text: '无法恢复！',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    type: 'DELETE',
                    url: PARAM.host + '/order/' + OrderDetail.currentOrderId,
                    success: function (data) {
                        ORDER.loadPage();
                    },
                    error: function (err) {
                        MESSAGEBOX.generalSystemError(err);
                    }
                });
            }
        });
    },

    refreshOrderDetail: function () {
        var order = {};
        order.orderCustomerName = OrderDetail.currentOrder.orderCustomerName;
        order.orderId = OrderDetail.currentOrderId;
        order.orderCreatedDate = moment(OrderDetail.currentOrder.dateCreated).format("YYYY-MM-DD");
        order.comment = OrderDetail.currentOrder.comment;
        order.isAdmin = USER.isADMIN();
        order.items = [];

        $.each(OrderDetail.currentOrder.items, function (index, currentOrderItem) {
            var newOrderItem = {};
            newOrderItem.productName = currentOrderItem.productName;
            newOrderItem.productUnit = currentOrderItem.productUnit;
            newOrderItem.productNumber = currentOrderItem.productNumber;
            newOrderItem.productPackageSize = currentOrderItem.packageSize;
            newOrderItem.productPackageNumber = currentOrderItem.packageNumber;
            newOrderItem.productDeliveryDate = moment(currentOrderItem.deliveryDate).format("YYYY-MM-DD");
            newOrderItem.comment = currentOrderItem.comment;

            order.items.push(newOrderItem);
        })

        order.invoices = [];

        $.each(OrderDetail.currentInvoices, function (index, value) {
            var newInvoice = {};
            newInvoice.invoiceId = value.id;
            newInvoice.invoiceDisplayId = value.invoiceDisplayId;
            newInvoice.loadingId = value.loadingId;
            newInvoice.receiptId = value.receiptId;
            newInvoice.invoiceCreatedDate = moment(value.dateCreated).format("YYYY-MM-DD");
            if (value.status === 'CANCELLED')
                newInvoice.isDiscard = true;
            newInvoice.items = [];

            $.each(value.items, function (index, value) {
                var newInvoiceItem = {};
                newInvoiceItem.productName = value.productName;
                newInvoiceItem.productUnit = value.productUnit;
                newInvoiceItem.productPackageSize = value.packageSize;
                newInvoiceItem.productPackageNumber = value.packageNumber;
                newInvoiceItem.productUnitPrice = value.productUnitPrice;
                newInvoiceItem.comment = value.comment;
                newInvoice.items.push(newInvoiceItem);
            })

            order.invoices.push(newInvoice);
        })
        $.get('pages/orderdetail/template/orderdetail.html', function (template) {
            $("#panel-body").html(Mustache.render(template, order));
            if (USER.isADMIN()) {
                $("#panel-body").find('a[name="displayid"]').editable({
                    url: PARAM.host + "/invoice/_updateInvoice"
                });
                $("#panel-body").find('a[name="orderCreatedDate"]').editable({
                    url: PARAM.host + "/order/_modifyOrderByAdmin"
                });
                $("#panel-body").find('a[name="invoiceCreatedDate"]').editable({
                    url: PARAM.host + "/invoice/_updateInvoice"
                });
            }
            OrderDetail.bindEvent();
        });
    },

    bindEvent: function () {
        $("#OD_div_invoices").find("#BTN_newinvoice").off().on("click", function (event) {
            NEWINVOICE.showDialog();
        });
        $("#OD_div_invoices").find("button[name='discardInvoice']").off().on("click", function (event) {
            var invoiceId = $(event.currentTarget).val();

            if (invoiceId) {
                OrderDetail.cancelInvoice(invoiceId);
            }
        });

        $("#OD_div_invoices").find("button[name='printInvoice']").off().on("click", function (event) {
            var invoiceId = $(event.currentTarget).val();

            if (invoiceId) {
                OrderDetail.printInvoice(invoiceId);
            }
        });

        $("#OD_div_invoices").find("button[name='onLoading']").off().on("click", function (event) {
            var invoiceId = $(event.currentTarget).val();

            if (invoiceId) {
                OrderDetail.onLoading(invoiceId, $(event.currentTarget)[0]);
            }
        })

        $("#OD_div_invoices").find("button[name='generateReceipt']").off().on("click", function (event) {
            var invoiceId = $(event.currentTarget).val();

            if (invoiceId) {
                OrderDetail.generateReceipt(invoiceId);
            }
        })
    },

    generateReceipt: function (invoiceId) {
        $('input[name="saveFileDialog"]').off().on('change', function (event) {
            $("#modal_receiptNumber").find('button[name="confirm"]').off().on("click", function (event) {
                $.ajax({
                    type: 'POST',
                    url: PARAM.host + '/invoice/' + invoiceId + "/_setReceiptId/" + $("#modal_receiptNumber").find('input[name="receiptNumber"]').val(),
                    success: function (data) {
                        $("#modal_receiptNumber").modal("hide").one("hidden.bs.modal", function (event) {
                            OrderDetail.loadPage();
                        });
                    },
                    error: function (err) {
                        MESSAGEBOX.generalSystemError(err);
                    }
                });
            });
            $("#modal_receiptNumber").modal("show");

            var filename = $(event.currentTarget).val();
            var fs = require('fs');
            var http = require('http');

            var file = fs.createWriteStream(filename);
            var cookietoken = "";
            require("nw.gui").Window.get().cookies.getAll({}, function (cookies) {
                $.each(cookies, function (index, cookie) {
                    if (cookie.name === PARAM.cookieName) {
                        cookietoken = cookie.value;
                    };
                });

                var options = {
                    hostname: window.location.hostname,
                    port: window.location.port,
                    path: '/rest/invoice/' + invoiceId + '/receipt/_downloadxml',
                    method: 'GET',
                    headers: {
                        'Cookie': PARAM.cookieName + '=' + cookietoken
                    }
                };

                http.get(options, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close(file);
                    });
                }).on('error', function (err) {
                    MESSAGEBOX.generalSystemError("下载失败");
                    fs.unlink(file);
                });

                $(event.currentTarget).val("");
            });
        });

        $('input[name="saveFileDialog"]').attr('nwsaveas', OrderDetail.currentOrder.orderCustomerName + " " + moment().format("YYYY-MM-DD-HH-mm-ss") + ".xml").click();
    },

    printInvoice: function (invoiceId) {
        nw.Window.open('http://' + window.location.host + '/print/invoice/print.html?invoiceid=' + invoiceId, {
            show: false
        });
    },

    cancelInvoice: function (invoiceId) {
        swal({
            title: '作废此发货单',
            text: '确认？',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    type: 'PUT',
                    url: PARAM.host + '/invoice/' + invoiceId + '/cancel',
                    success: function (data) {
                        OrderDetail.loadPage();
                    },
                    error: function (err) {
                        MESSAGEBOX.generalSystemError(err);
                    }
                });
            }
        });
    },

    onLoading: function (invoiceId, button) {
        var d1 = dialog({
            width: 230,
            id: "d-od-onLoading",
            title: '上车',
            okValue: '完成',
            align: 'right',
            cancelValue: '取消',
            cancel: function () {
                this.close().remove();
            },
            ok: function () {
                var selectedLoadingId = $('input[name=onloadingSelectedRadio]:checked', '#onloadingSelectedRadioForm').val();

                if (selectedLoadingId === "-1") {
                    $.ajax({
                        type: 'PUT',
                        url: PARAM.host + "/invoice/" + invoiceId + "/loading/null",
                        success: function () {
                            OrderDetail.loadPage();
                        },
                        error: function (err) {
                            MESSAGEBOX.generalSystemError(err);
                        }
                    });
                } else {
                    $.ajax({
                        type: 'PUT',
                        url: PARAM.host + "/invoice/" + invoiceId + "/loading/" + selectedLoadingId,
                        success: function () {
                            OrderDetail.loadPage();
                        },
                        error: function (err) {
                            MESSAGEBOX.generalSystemError(err);
                        }
                    });
                }
            }
        });


        $.ajax({
            type: 'GET',
            url: PARAM.host + '/loading/search',
            data: {
                sendDate: moment().format("YYYY-MM-DD")
            },
            success: function (data) {
                var template = '<input type="radio" name="onloadingSelectedRadio" value="{loadingId}">{loadingDirection}<br />'

                var selectOnLoadingDialogContent = "<form id=\"onloadingSelectedRadioForm\">";

                var tmp = template.replace("{loadingId}", "-1")
                    .replace("{loadingDirection}", "无");
                selectOnLoadingDialogContent = selectOnLoadingDialogContent + tmp;

                $.each(data.content, function (index, value) {
                    var tmp = template.replace("{loadingId}", value.id)
                        .replace("{loadingDirection}", value.direction);
                    selectOnLoadingDialogContent = selectOnLoadingDialogContent + tmp;
                });

                selectOnLoadingDialogContent = selectOnLoadingDialogContent + "</form>"

                dialog.get("d-od-onLoading").content(selectOnLoadingDialogContent);
                dialog.get("d-od-onLoading").show(button);
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        })
    }
}