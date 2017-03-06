var NEWCUSTOMER = {
    $rootDiv: null,
    $addNewCustomerModal: null,
    groups: null,
    salesman: null,

    loadPage: function () {
        $.ajax({
            type: 'GET',
            url: USER.isADMIN() ? PARAM.host + "/groups" : PARAM.host + "/groups/_show",
            dataType: 'json',
            success: function (data) {
                NEWCUSTOMER.groups = data.content;
                $.ajax({
                    type: 'GET',
                    url: PARAM.host + "/salesmans",
                    dataType: 'json',
                    success: function (data) {
                        NEWCUSTOMER.salesman = data.content;
                        $.ajax({
                            type: 'GET',
                            url: PARAM.host + "/customer/_inactiveonly",
                            dataType: 'json',
                            success: function (data) {
                                var newcustomerdata = {};
                                newcustomerdata.customers = data.content;
                                newcustomerdata.groups = NEWCUSTOMER.groups;
                                newcustomerdata.salesman = NEWCUSTOMER.salesman;
                                newcustomerdata.isSalesman = USER.isSALESMAN();
                                newcustomerdata.isAdmin = USER.isADMIN();

                                $.get("pages/newcustomer/template/newcustomer.html", function (template) {
                                    $("#panel-body").html(Mustache.render(template, newcustomerdata));
                                    NEWCUSTOMER.$rootDiv = $("#newcustomer_page");
                                    NEWCUSTOMER.bindEvent();
                                    NEWCUSTOMER.enableEditable();
                                    NEWCUSTOMER.$rootDiv.find(".selectpicker").selectpicker("refresh");
                                });
                            }
                        });
                    }
                })
            }
        });
    },

    newCustomer: function () {
        var newcustomer = {};

        newcustomer.name = NEWCUSTOMER.$addNewCustomerModal.find('input[name="name"]').val();
        newcustomer.groupId = NEWCUSTOMER.$addNewCustomerModal.find('select[name="group"]').find('option:checked').val();
        newcustomer.salesmanId = NEWCUSTOMER.$addNewCustomerModal.find('select[name="salesman"]').find('option:checked').val();
        newcustomer.issueReceiptName = NEWCUSTOMER.$addNewCustomerModal.find('input[name="issuereceiptname"]').val();
        newcustomer.address = NEWCUSTOMER.$addNewCustomerModal.find('input[name="address"]').val();
        newcustomer.bankName = NEWCUSTOMER.$addNewCustomerModal.find('input[name="bankName"]').val();
        newcustomer.taxId = NEWCUSTOMER.$addNewCustomerModal.find('input[name="taxid"]').val();
        newcustomer.issueReceiptComment = NEWCUSTOMER.$addNewCustomerModal.find('input[name="issueReceiptComment"]').val();

        $.ajax({
            type: 'POST',
            url: PARAM.host + "/customer",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(newcustomer),
            success: function (data) {
                NEWCUSTOMER.$addNewCustomerModal.modal("hide").one("hidden.bs.modal", function () {
                    NEWCUSTOMER.loadPage();
                });
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    bindEvent: function () {
        NEWCUSTOMER.$addNewCustomerModal = NEWCUSTOMER.$rootDiv.find('div[name="new_customer"]');
        NEWCUSTOMER.$rootDiv.find('button[name="btn-newSalesman"]').off().on("click", function (event) {
            NEWCUSTOMER.$addNewCustomerModal.modal("show");
        })
    },

    enableEditable: function () {
        var sourceGroup = [];
        $.each(NEWCUSTOMER.groups, function (index, value) {
            sourceGroup.push({
                'text': value.name,
                'value': value.id
            });
        });

        var sourceSalesman = [];
        $.each(NEWCUSTOMER.salesman, function (index, value) {
            sourceSalesman.push({
                'text': value.name,
                'value': value.id
            });
        });

        NEWCUSTOMER.$rootDiv.find('a[name="name"]').editable({
            url: PARAM.host + "/customer/_modify"
        });
        NEWCUSTOMER.$rootDiv.find('a[name="groupName"]').editable({
            url: PARAM.host + "/customer/_modify",
            source: sourceGroup,
            success: function (response, newValue) {
                NEWCUSTOMER.loadPage();
            }
        });

        NEWCUSTOMER.$rootDiv.find('a[name="salesmanName"]').editable({
            url: PARAM.host + "/customer/_modify",
            source: sourceSalesman
        });

        NEWCUSTOMER.$rootDiv.find('a[name="issueReceiptName"]').editable({
            url: PARAM.host + "/customer/_modify"
        });

        NEWCUSTOMER.$rootDiv.find('a[name="address"]').editable({
            url: PARAM.host + "/customer/_modify"
        });

        NEWCUSTOMER.$rootDiv.find('a[name="taxId"]').editable({
            url: PARAM.host + "/customer/_modify"
        });

        NEWCUSTOMER.$rootDiv.find('a[name="bankName"]').editable({
            url: PARAM.host + "/customer/_modify"
        });
    },

    activeNewCustomer: function (customerId) {
        $.ajax({
            type: 'POST',
            url: PARAM.host + "/customer/" + customerId + "/_active",
            data: 'JSON',
            success: function (data) {
                NEWCUSTOMER.loadPage();
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        })
    }
}