/**
 * products contains all the products under current customer.
 */
var CUSTOMER = {
    currentCustomerId: "",
    currentCustomerName: "",
    products: [],
    productTemplate: {
        name: null,
        producibleProductId: null,
        producerComment: null,
    },
    producibleProductArray: [],
    $rootDiv: null,
    $addProductModal: null,

    loadPage: function () {
        $.get("pages/customer/html/customer.html", function (template) {
            var data = {};
            if (USER.isPRODUCER()) {
                $.ajax({
                    type: 'GET',
                    url: PARAM.host + "/producibleproduct/all",
                    dataType: "json",
                    success: function (data) {
                        if (data.content.content) {
                            CUSTOMER.producibleProductArray = [];
                            $.each(data.content.content, function (index, value) {
                                CUSTOMER.producibleProductArray.push({
                                    'value': value.id,
                                    'text': value.name
                                });
                            });
                            data.producibleProducts = CUSTOMER.producibleProductArray;
                            $("#page-body").find('.panel-body').eq(0).html(Mustache.render(template, data));
                            CUSTOMER.$rootDiv = $('div[name="page_customer"]');
                            CUSTOMERSELECT.setSelect($("#CU_customer_select"), CUSTOMER.onCustomerSelected);
                            CUSTOMER.prepareAddNewProductModal();
                        }
                    }
                });
            } else {
                $("#page-body").find('.panel-body').eq(0).html(Mustache.render(template, data));
                CUSTOMER.$rootDiv = $('div[name="page_customer"]');
                CUSTOMERSELECT.setSelect($("#CU_customer_select"), CUSTOMER.onCustomerSelected);
            }
        });
    },

    onCustomerSelected: function (event) {
        CUSTOMER.currentCustomerId = $("#CU_customer_select").find('option:selected').val();
        CUSTOMER.currentCustomerName = $("#CU_customer_select").find('option:selected').text();
        CUSTOMER.fetchProductByCustomer();
    },

    fetchProductByCustomer: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/customer/" + CUSTOMER.currentCustomerId + "/products",

            success: function (data) {
                CUSTOMER.products = data.content;
                CUSTOMER.showProducts();
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    showProducts: function () {
        if (USER.isPRODUCER()) {
            CUSTOMER.producerShowProducts();
        } else if (USER.isSALESMAN()) {
            CUSTOMER.salesmanShowProducts();
        } else if (USER.isQA()) {
            CUSTOMER.qaShowProducts();
        } else if (USER.isADMIN()) {}
    },

    bindEvent: function () {
        if (USER.isPRODUCER()) {
            $("a[name='producerComment']").editable({
                url: PARAM.host + "/product/_modifyByProducer"
            });
            $("a[name='producibleProductId']").editable({
                url: PARAM.host + "/product/_modifyByProducer",
                source: CUSTOMER.producibleProductArray,
                select2: {
                    multiple: false,
                    placeholder: "选择生产型号"
                }
            });
        } else if (USER.isSALESMAN()) {
            $('a[name="customerIssueReceiptName"]').editable({
                url: PARAM.host + "/customer/_modify"
            });

            $('a[name="address"]').editable({
                url: PARAM.host + "/customer/_modify"
            });

            $('a[name="taxId"]').editable({
                url: PARAM.host + "/customer/_modify"
            });

            $('a[name="bankName"]').editable({
                url: PARAM.host + "/customer/_modify"
            });

            $("a[name='unitName']").editable({
                url: PARAM.host + "/product/_modifyBySalesman"
            });
            $("a[name='unitPrice']").editable({
                url: PARAM.host + "/product/_modifyBySalesman"
            });
            $("a[name='packageSize']").editable({
                url: PARAM.host + "/product/_modifyBySalesman"
            });
            $("a[name='packageWeight']").editable({
                url: PARAM.host + "/product/_modifyBySalesman"
            });
            $("a[name='salesmanComment']").editable({
                url: PARAM.host + "/product/_modifyBySalesman"
            });
            $("a[name='issueReceiptName']").editable({
                url: PARAM.host + "/product/_modifyBySalesman"
            });
        } else if (USER.isQA()) {
            $("a[name='qaComment']").editable({
                url: PARAM.host + "/product/_modifyByQa"
            });
        }
    },

    showAddNewProductModal: function () {
        CUSTOMER.$addProductModal.modal("show");
    },

    prepareAddNewProductModal: function () {
        CUSTOMER.$addProductModal = CUSTOMER.$rootDiv.find('div[name="modal_addproduct"]');
        $productCategorySelect = CUSTOMER.$addProductModal.find('select[name="producibleProductSelect"]');
        $productCategorySelect.selectpicker('render');
    },

    addNewProduct: function () {
        var productName = CUSTOMER.$addProductModal.find("#productname").val();
        for (var i in CUSTOMER.products) {
            if (CUSTOMER.products[i].productName === productName) {
                MESSAGEBOX.validationError("产品名不能重复");
                return;
            }
        }
        var product = {};
        product.name = productName;
        product.producibleProductId = CUSTOMER.$addProductModal.find('select[name="producibleProductSelect"]').find('option:checked').val();
        product.producerComment = CUSTOMER.$addProductModal.find('textarea[name="producercomment"]').val();
        $.ajax({
            type: 'POST',
            url: PARAM.host + "/customer/" + CUSTOMER.currentCustomerId + "/product",
            data: JSON.stringify(product),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                CUSTOMER.$addProductModal.modal('hide').one('hidden.bs.modal', function () {
                    CUSTOMER.fetchProductByCustomer();
                });
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    qaShowProducts: function () {
        var data = {
            customerName: CUSTOMER.currentCustomerName,
            products: CUSTOMER.products
        };

        $.get("pages/customer/template/qa.html", function (template) {
            $("#CU_panel_body").html(Mustache.render(template, data));
            CUSTOMER.bindEvent();
        });
    },

    producerShowProducts: function () {
        var data = {
            customerName: CUSTOMER.currentCustomerName,
            products: CUSTOMER.products,
            producibleProducts: CUSTOMER.producibleProductArray
        };

        $.get("pages/customer/template/producer.html", function (template) {
            $("#CU_panel_body").html(Mustache.render(template, data));
            CUSTOMER.bindEvent();
        });
    },

    salesmanShowProducts: function () {
        $.each(CUSTOMER.products, function (index, product) {
            $.each(product.productPriceChanges, function (index, history) {
                history.dateDisplay = moment(history.insertTime).format("YYYY-MM-DD");
            });
        });

        $.get(PARAM.host + "/customer/" + CUSTOMER.currentCustomerId, function (data) {
            var customer = data.content;
            var data = {
                customerId: CUSTOMER.currentCustomerId,
                customerName: CUSTOMER.currentCustomerName,
                products: CUSTOMER.products,
                salesmanName: customer.salesmanName,
                customerIssueReceiptName: customer.issueReceiptName,
                address: customer.address,
                taxId: customer.taxId,
                bankName: customer.bankName,
                issueReceiptComment: customer.issueReceiptComment
            };

            $.get("pages/customer/template/salesman.html", function (template) {
                $("#CU_panel_body").html(Mustache.render(template, data));
                CUSTOMER.bindEvent();
                $("#CU_panel_body").find('span[name=price_history]').popover();
            });
        });
    }
};