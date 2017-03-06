urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};

var invoiceId = urlParam("invoiceid");

generateInvoicePrintData = function (invoice) {
    var index = 2;
    var printData = {
        data: {
            titleTop: invoice.invoiceHeader,
            customerName: invoice.invoiceCustomerName,
            dateCreated: moment(invoice.dateCreated).format("YYYY-MM-DD"),
            InvoiceDisplayId: invoice.invoiceDisplayId,
            items: []
        },
        idx: function () {
            return index++;
        }
    };

    var totalItem = 6;

    printData.data.totalSum = 0;

    $.each(invoice.items, function (index, value) {
        var newDataItem = {
            productName: value.productName,
            productUnit: value.productUnit,
            productNumber: value.productNumber,
            productPackageSize: value.packageSize,
            productPackageNumber: value.packageNumber,
            productUnitPrice: value.productUnitPrice,
            productTotal: value.productNumber * value.productUnitPrice,
            productComment: value.comment
        };

        printData.data.totalSum = printData.data.totalSum + newDataItem.productTotal;
        printData.data.items.push(newDataItem);
        totalItem--;
    });

    while (totalItem--) {
        printData.data.items.push({});
    }

    return printData;
};

printInvoice = function (invoiceId) {
    var currentInvoice;
    var generateDisplayId = $.ajax({
        type: "POST",
        dataType: "json",
        url: "/rest" + "/invoice/" + invoiceId + "/_generateDisplayId",
        error: function (err) {
            MESSAGEBOX.generalSystemError(err);
        }
    });

    var getInvoice = generateDisplayId.then(function (data) {
        return $.ajax({
            type: "GET",
            dataType: "json",
            url: "/rest" + "/invoice/" + invoiceId,
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    });

    var getTemplate = getInvoice.then(function (data) {
        currentInvoice = data.content;
        return $.ajax({
            type: "GET",
            url: '/print/invoice/template/invoice.html',
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    });

    getTemplate.done(function (template) {
        var invoicePrintData = generateInvoicePrintData(currentInvoice);
        $("body").html(Mustache.render(template, invoicePrintData));
        nw.Window.get().print({});
        nw.Window.get().close();
    });
};

printInvoice(invoiceId);