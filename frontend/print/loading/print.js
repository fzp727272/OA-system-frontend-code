urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};

var loadingId = urlParam("loadingid");

printLoading = function (currentLoading) {
    var tableItems = [];

    $.each(currentLoading.invoices, function (index, invoice) {
        $.each(invoice.items, function (index, item) {
            tableItems.push({
                customerName: invoice.invoiceCustomerName,
                productName: item.productName,
                batchNumber: item.batchNumber,
                packageSize: item.packageSize,
                packageNumber: item.packageNumber,
                weight: item.totalWeight
            });
        });
    });

    var loadingPrintData = {
        pages: []
    }

    var trNumber = 20;

    for (var i = 0; i < tableItems.length; i += trNumber) {
        loadingPrintData.pages.push({
            items: tableItems.slice(i, i + trNumber),
        })
    }

    $.each(loadingPrintData.pages, function (index, page) {
        page.index = index + 1;
        page.totalPages = loadingPrintData.pages.length;
        page.displayId = currentLoading.loadingDisplayId;
        page.direction = currentLoading.direction;
        page.sendDate = moment(currentLoading.sendDate).format("YYYY-MM-DD");
        page.driverName = currentLoading.driverName;
    });

    $.get('/print/loading/template/loading.html', function (template) {
        $("body").html(Mustache.render(template, loadingPrintData));
        nw.Window.get().print({});
        nw.Window.get().close();
    });
};


$.ajax({
    type: "GET",
    dataType: "json",
    url: "/rest" + "/loading/" + loadingId
}).done(function (data) {
    printLoading(data.content);
});